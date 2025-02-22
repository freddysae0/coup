"use client";
import { v4 } from "uuid";
import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

import { createDeck, createThrows } from "../utils";

import PlayersComponent from "./components/PlayersComponent";
import RunningGame from "./components/RunningGame";

import { useWebSocket } from "@/app/providers";
import WebSocketComponent from "@/components/websocket";
import { Card, Discussion, Player } from "@/types/game";
import { title, subtitle } from "@/components/primitives";

export default function Game() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [, setPathUrl] = useState("");
  const [, setRouteUuid] = useState("");
  const [name, setName] = useState("");
  const [, setBaseUrl] = useState("");

  let newPlayer = {} as Player;
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [turn, setTurn] = useState<Player>(newPlayer);
  const [player, setPlayer] = useState<Player>(newPlayer);
  const [players, setPlayers] = useState<Player[]>([]);
  const [room, setRoom] = useState<string>("none");
  const [deck, setDeck] = useState<Card[]>([]);
  const [throws, setThrows] = useState<Card[]>([]);
  const { socket } = useWebSocket();

  const handleNamingButton = () => {
    if (!player) return;
    player.name = name;
    setPlayer(player);
    localStorage.setItem("player", JSON.stringify(player));
    socket?.send(
      JSON.stringify({ type: "updatePlayerName", player: player, room: room }),
    );
  };
  const gameStarts = () => {
    setIsGameStarted(true);
  };
  const sendStartGameSignal = () => {
    socket?.send(JSON.stringify({ type: "startGame", room: room }));
  };

  useEffect(() => {
    const ls_player = localStorage.getItem("player");

    if (ls_player) {
      newPlayer = JSON.parse(ls_player) as Player;
    } else {
      newPlayer = {
        id: v4(),
        name: "You",
        cards: [],
        isHost: false,
        coins: 0,
        isBeingChallenged: false,
      };
      localStorage.setItem("player", JSON.stringify(newPlayer));
    }

    setName(newPlayer.name);
    setPlayers([...players, newPlayer as Player]);
    setPlayer(newPlayer as Player);
    setDeck(createDeck());
    setThrows(createThrows());
    setBaseUrl(window.location.origin);
    setPathUrl(window.location.pathname);
    const parts = window.location.pathname.split("/");
    const routeUuid = parts[parts.length - 1];

    setRoom(routeUuid);
    setRouteUuid(routeUuid);
  }, []);

  if (room !== "none")
    return (
      <WebSocketComponent
        deck={deck}
        gameStarts={gameStarts}
        player={player as Player}
        players={players}
        room={room}
        setDeck={setDeck}
        setDiscussions={setDiscussions}
        setPlayer={setPlayer}
        setPlayers={setPlayers}
        setThrows={setThrows}
        setTurn={setTurn}
        throws={throws}
      >
        <div className="w-full">
          {player && !isGameStarted && (
            <div className="flex flex-col gap-3">
              <h1 className={title()}>Coup room</h1>
              <p className={subtitle()}>
                Invite your friends to this URL link and play together.
              </p>

              {players.length > 1 && player?.isHost && (
                <Button
                  color="danger"
                  variant="flat"
                  onPress={sendStartGameSignal}
                >
                  Start Game
                </Button>
              )}
              {/* 
              <h2 className={"text-left"}>Room Link:</h2>

              <Snippet color="secondary" symbol="">
                {"..." + room.split("-")[4]}
              </Snippet> */}

              <h2 className={"text-left"}>Insert your nickname:</h2>
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleNamingButton();
                }}
              >
                <Input
                  className="mb-3"
                  color="default"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Button
                  color="primary"
                  variant="flat"
                  onPress={handleNamingButton}
                >
                  Update
                </Button>
              </form>

              <h2 className={"text-left"}>Players in the room:</h2>
              <PlayersComponent playerId={player.id} players={players} />
            </div>
          )}
          {isGameStarted && (
            <RunningGame
              deck={deck}
              discussions={discussions}
              player={player}
              players={players}
              room={room}
              turn={turn}
            />
          )}
        </div>
      </WebSocketComponent>
    );
  else return null;
}
