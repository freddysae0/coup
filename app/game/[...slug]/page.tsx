"use client";
import { v4 } from "uuid";
import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

import { createDeck, createThrows } from "./page.utils";
import PlayersComponent from "./components/AllPlayers";
import RunningGame from "./components/RunningGame";

import { Card, Discussion, Player } from "@/types/game";
import { title, subtitle } from "@/shared/primitives";

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

  const apiCall = async (payload: any) => {
    if (room === "none") return;
    await fetch(`/api/game/${room}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };

  const handleNamingButton = async () => {
    if (!player) return;
    player.name = name;
    setPlayer(player);
    localStorage.setItem("player", JSON.stringify(player));
    await apiCall({ type: "updatePlayerName", player });
  };
  const gameStarts = () => {
    setIsGameStarted(true);
  };
  const sendStartGameSignal = async () => {
    await apiCall({ type: "startGame" });
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

    const createRoom = async () => {
      await fetch(`/api/game/${routeUuid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "createRoom",
          game: { deck, throws, players },
        }),
      });
    };

    createRoom();

    const fetchStatus = async () => {
      const res = await fetch(`/api/game/${routeUuid}`);

      if (!res.ok) return;
      const data = await res.json();

      setDeck(data.deck);
      setThrows(data.throws);
      setPlayers(data.players);
      setPlayer(
        data.players.find((p: Player) => p.id === newPlayer.id) as Player,
      );
      setTurn(data.turn);
      setDiscussions(data.openDiscussions || []);
      if (data.isGameStarted) gameStarts();
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  if (room !== "none")
    return (
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
    );
  else return null;
}
