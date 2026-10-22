"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 } from "uuid";

import { ClientMessage, GameView, ServerMessage } from "@/types/game";

export type ConnectionStatus = "connecting" | "open" | "reconnecting" | "left";

const PLAYER_ID_KEY = "coup-player-id";
const PLAYER_NAME_KEY = "coup-player-name";
const SEATS_KEY = "coup-seats";
const LOCK_PREFIX = "coup-seat-lock:";
const LOCK_BEAT_MS = 4_000;
const LOCK_STALE_MS = 12_000;
const MAX_REMEMBERED_ROOMS = 30;

type Seats = Record<string, { ids: string[]; at: number }>;

function readSeats(): Seats {
  try {
    return JSON.parse(localStorage.getItem(SEATS_KEY) || "{}") as Seats;
  } catch {
    return {};
  }
}

function writeSeats(seats: Seats) {
  const recent = Object.entries(seats)
    .sort(([, a], [, b]) => b.at - a.at)
    .slice(0, MAX_REMEMBERED_ROOMS);

  localStorage.setItem(SEATS_KEY, JSON.stringify(Object.fromEntries(recent)));
}

/** Another open tab of this browser is sitting in that seat right now. */
function isSeatHeld(id: string) {
  const beat = Number(localStorage.getItem(LOCK_PREFIX + id));

  return Date.now() - beat < LOCK_STALE_MS;
}

/**
 * Identity of this tab in `room`. The tab keeps it in sessionStorage, and the
 * browser remembers every seat it took per room in localStorage, so closing
 * the tab and opening the link again gets the same seat back. Seats held by
 * another open tab are skipped: two tabs are still two different players.
 */
export function getPlayerId(room: string) {
  const tabKey = `${PLAYER_ID_KEY}:${room}`;
  let id = sessionStorage.getItem(tabKey);

  if (!id) {
    const seats = readSeats();
    const known = seats[room]?.ids ?? [];

    id = known.find((seat) => !isSeatHeld(seat)) ?? v4();
    seats[room] = {
      ids: known.includes(id) ? known : [...known, id],
      at: Date.now(),
    };
    writeSeats(seats);
    sessionStorage.setItem(tabKey, id);
  }

  return id;
}

/** Marks the seat as taken by this tab until the tab goes away. */
function holdSeat(id: string) {
  const beat = () => localStorage.setItem(LOCK_PREFIX + id, String(Date.now()));
  const release = () => localStorage.removeItem(LOCK_PREFIX + id);

  beat();
  const timer = setInterval(beat, LOCK_BEAT_MS);

  window.addEventListener("pagehide", release);

  return () => {
    clearInterval(timer);
    window.removeEventListener("pagehide", release);
    release();
  };
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
    const playerId = getPlayerId(room);
    const releaseSeat = holdSeat(playerId);

    const connect = () => {
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

        retryTimer = setTimeout(connect, delay);
      };
    };

    setStatus("connecting");
    connect();

    return () => {
      stopped = true;
      clearTimeout(retryTimer);
      releaseSeat();
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
