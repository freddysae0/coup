"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 } from "uuid";

import { ClientMessage, GameView, ServerMessage } from "@/types/game";

export type ConnectionStatus = "connecting" | "open" | "reconnecting" | "left";

const PLAYER_ID_KEY = "coup-player-id";
const PLAYER_NAME_KEY = "coup-player-name";

/** Per-tab identity, so several tabs on one machine are different players. */
export function getPlayerId() {
  let id = sessionStorage.getItem(PLAYER_ID_KEY);

  if (!id) {
    id = v4();
    sessionStorage.setItem(PLAYER_ID_KEY, id);
  }

  return id;
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

/**
 * Keeps one WebSocket per game page. Reconnects with backoff and re-joins the
 * room automatically, so a refresh or a network hiccup never loses the seat.
 */
export function useCoupSocket(
  room: string | null,
  onError?: (message: string) => void,
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
            playerId: getPlayerId(),
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
        } else if (msg.type === "error") onErrorRef.current?.(msg.message);
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
    onErrorRef.current?.("Not connected to the server, retrying…");

    return false;
  }, []);

  return { state, status, send };
}
