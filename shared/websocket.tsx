"use client";
import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useEffect,
} from "react";

import { useWebSocket } from "@/app/providers";
import { Card, Discussion, Player } from "@/types/game";

type WebSocketComponentProps = {
  room: string;
  children: ReactElement;
  deck: Card[];
  throws: Card[];
  player: Player;
  players: Player[];
  setDeck: Dispatch<SetStateAction<Card[]>>;
  setThrows: Dispatch<SetStateAction<Card[]>>;
  setPlayers: Dispatch<SetStateAction<Player[]>>;
  setPlayer: Dispatch<SetStateAction<Player>>;
  setTurn: Dispatch<SetStateAction<Player>>;
  setDiscussions: Dispatch<SetStateAction<Discussion[]>>;
  gameStarts: () => void;
};

const WebSocketComponent = ({
  room,
  children,
  deck,
  throws,
  player,
  players,
  setDiscussions,
  setDeck,
  setTurn,
  setPlayers,
  setPlayer,
  setThrows,
  gameStarts,
}: WebSocketComponentProps) => {
  const { socket } = useWebSocket();

  useEffect(() => {
    const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");

    if (!socket) return;

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "createRoom",
          room: room,
          game: { deck, throws, players },
        })
      );
    };

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      switch (msg.type) {
        case "status":
          setDeck(msg.data.deck);
          setThrows(msg.data.throws);
          setPlayers(msg.data.players);
          setPlayer(
            msg.data.players.find((p: Player) => p.id === player.id) as Player
          );
          setTurn(msg.data.turn as Player);
          setDiscussions(msg.data.openDiscussions as Discussion[]);
          msg.data.isGameStarted && gameStarts();
          break;
        case "startGame":
          gameStarts();
        default:
          break;
      }
    };

    return () => {
      //socket.close();
    };
  }, []);

  return <div className="w-full">{children}</div>;
};

export default WebSocketComponent;
