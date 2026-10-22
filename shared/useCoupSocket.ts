"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 } from "uuid";

import { ClientMessage, GameView, ServerMessage } from "@/types/game";

export type ConnectionStatus = "connecting" | "open" | "reconnecting" | "left";

const PLAYER_ID_KEY = "coup-player-id";
const PLAYER_NAME_KEY = "coup-player-name";
const SEATS_KEY = "coup-seats";
const SEAT_LOCK_PREFIX = "coup-seat:";
const MAX_REMEMBERED_ROOMS = 30;

type Seats = Record<string, { ids: string[]; at: number }>;
type Seat = { id: string; release: () => void };

function readSeats(): Seats {
  try {
    return JSON.parse(localStorage.getItem(SEATS_KEY) || "{}") as Seats;
  } catch {
    return {};
  }
}

function rememberSeat(room: string, id: string) {
  const seats = readSeats();
  const known = seats[room]?.ids ?? [];

  seats[room] = {
    ids: known.includes(id) ? known : [...known, id],
    at: Date.now(),
  };
  const recent = Object.entries(seats)
    .sort(([, a], [, b]) => b.at - a.at)
    .slice(0, MAX_REMEMBERED_ROOMS);

  localStorage.setItem(SEATS_KEY, JSON.stringify(Object.fromEntries(recent)));
}

/**
 * Takes the seat's Web Lock if no other tab of this browser holds it, and
 * keeps it until `release` or until the tab closes. Unlike a heartbeat, a lock
 * survives a background tab whose timers are throttled or frozen.
 */
function tryHoldSeat(id: string): Promise<(() => void) | null> {
  return new Promise((resolve) => {
    navigator.locks
      .request(SEAT_LOCK_PREFIX + id, { ifAvailable: true }, (lock) => {
        if (!lock) return resolve(null);

        return new Promise<void>((release) => resolve(() => release()));
      })
      .catch(() => resolve(null));
  });
}

/**
 * Identity of this tab in `room`. The browser remembers every seat it took per
 * room, so closing the tab and opening the link again gets the same seat back,
 * while two tabs open at once are still two different players.
 */
export async function claimSeat(room: string): Promise<Seat> {
  const tabKey = `${PLAYER_ID_KEY}:${room}`;
  // This tab's own seat first (a refresh), then the per-tab id older versions
  // used for every room, then seats this browser left behind in the room.
  const own = [
    sessionStorage.getItem(tabKey),
    sessionStorage.getItem(PLAYER_ID_KEY),
  ];
  let seat: Seat | null = null;

  if (typeof navigator !== "undefined" && "locks" in navigator) {
    const candidates = [...own, ...(readSeats()[room]?.ids ?? [])].filter(
      (c, i, all): c is string => !!c && all.indexOf(c) === i,
    );

    for (const id of candidates) {
      const release = await tryHoldSeat(id);

      if (release) {
        seat = { id, release };
        break;
      }
    }
    if (!seat) {
      const id = v4();

      seat = { id, release: (await tryHoldSeat(id)) ?? (() => {}) };
    }
  } else {
    // Without Web Locks a closed tab cannot be told from an open one, so
    // only this tab's own id is reused.
    seat = { id: own.find((c) => !!c) ?? v4(), release: () => {} };
  }

  rememberSeat(room, seat.id);
  sessionStorage.setItem(tabKey, seat.id);

  return seat;
}

export function getPlayerName() {
  return localStorage.getItem(PLAYER_NAME_KEY) || "";
}

export function savePlayerName(name: string) {
  localStorage.setItem(PLAYER_NAME_KEY, name);
}

export function getWsUrl() {
  if (process.env.NEXT_PUBLIC_WS_URL) return process.env.NEXT_PUBLIC_WS_URL;
  const { protocol, host, hostname } = window.location;

  // Behind HTTPS a reverse proxy forwards /ws to the backend. On plain HTTP
  // (localhost, LAN, bare server IP) the backend listens on port 8000.
  return protocol === "https:" ? `wss://${host}/ws` : `ws://${hostname}:8000`;
}

/** Same server over HTTP: ws(s)://host[:port][/ws] -> http(s)://host[:port]/health */
export function getHealthUrl(wsUrl = getWsUrl()) {
  const url = new URL(wsUrl);

  url.protocol = url.protocol === "wss:" ? "https:" : "http:";
  url.pathname =
    url.pathname.replace(/\/ws\/?$/, "").replace(/\/$/, "") + "/health";

  return url.toString();
}

/** Fire-and-forget ping so a sleeping free-tier server starts booting. */
export function wakeServer() {
  try {
    fetch(getHealthUrl(), { mode: "cors" }).catch(() => {});
  } catch {
    // Invalid URL in config: the socket itself will report the problem.
  }
}

export type SocketError = {
  code?: string;
  message: string;
  params?: Record<string, string | number>;
};

/**
 * Keeps one WebSocket per game page. Reconnects with backoff and re-joins the
 * room automatically, so a refresh or a network hiccup never loses the seat.
 */
export function useCoupSocket(
  room: string | null,
  onError?: (error: SocketError) => void,
) {
  const [state, setState] = useState<GameView | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const wsRef = useRef<WebSocket | null>(null);
  const onErrorRef = useRef(onError);

  onErrorRef.current = onError;

  useEffect(() => {
    if (!room) return;
    let stopped = false;
    let attempt = 0;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let seat: Seat | null = null;

    const connect = (playerId: string) => {
      const ws = new WebSocket(getWsUrl());

      wsRef.current = ws;

      ws.onopen = () => {
        attempt = 0;
        setStatus("open");
        ws.send(
          JSON.stringify({
            type: "join",
            room,
            playerId,
            name: getPlayerName(),
          } satisfies ClientMessage),
        );
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data) as ServerMessage;

        if (msg.type === "state") {
          const { state: next, serverTime, responseTimeoutMs } = msg;

          // Convert the server deadline to this machine's clock.
          setState({
            ...next,
            responseTimeoutMs,
            deadline: next.deadline
              ? next.deadline - serverTime + Date.now()
              : null,
          });
        } else if (msg.type === "error") onErrorRef.current?.(msg);
        else if (msg.type === "left") {
          stopped = true;
          setStatus("left");
          ws.close();
        }
      };

      ws.onclose = () => {
        if (wsRef.current === ws) wsRef.current = null;
        if (stopped) return;
        setStatus("reconnecting");
        const delay = Math.min(10_000, 500 * 2 ** attempt++);

        retryTimer = setTimeout(() => connect(playerId), delay);
      };
    };

    setStatus("connecting");
    claimSeat(room).then((claimed) => {
      // The page may have moved on while the seat was being claimed.
      if (stopped) return claimed.release();
      seat = claimed;
      connect(claimed.id);
    });

    return () => {
      stopped = true;
      clearTimeout(retryTimer);
      seat?.release();
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [room]);

  const send = useCallback((msg: ClientMessage) => {
    const ws = wsRef.current;

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(msg));

      return true;
    }
    onErrorRef.current?.({ code: "offline", message: "Not connected" });

    return false;
  }, []);

  return { state, status, send };
}
