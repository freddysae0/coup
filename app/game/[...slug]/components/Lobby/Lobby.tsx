"use client";
import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Snippet } from "@heroui/snippet";

import PlayersComponent from "../AllPlayers";

import { ClientMessage, GameView } from "@/types/game";
import { title, subtitle } from "@/shared/primitives";
import { getPlayerName, savePlayerName } from "@/shared/useCoupSocket";

type LobbyProps = {
  state: GameView;
  send: (msg: ClientMessage) => boolean;
};

export default function Lobby({ state, send }: LobbyProps) {
  const me = state.players.find((p) => p.id === state.you);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    setName(getPlayerName() || me?.name || "");
    setUrl(window.location.href);
  }, []);

  const rename = () => {
    const clean = name.trim();

    if (!clean) return;
    savePlayerName(clean);
    send({ type: "rename", name: clean });
  };

  const host = state.players.find((p) => p.isHost);

  return (
    <div className="flex flex-col gap-3">
      <h1 className={title()}>Coup room</h1>
      <p className={subtitle()}>
        Invite your friends to this link and play together (2–10 players).
      </p>
      <Snippet hideSymbol className="w-full" size="sm">
        {url}
      </Snippet>

      <h2 className="text-left">Your nickname:</h2>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          rename();
        }}
      >
        <Input
          aria-label="Nickname"
          maxLength={24}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button color="primary" type="submit" variant="flat">
          Update
        </Button>
      </form>

      <h2 className="text-left">
        Players in the room ({state.players.length}):
      </h2>
      <PlayersComponent playerId={state.you} players={state.players} />

      {state.options.canStart ? (
        <Button
          color="danger"
          size="lg"
          variant="shadow"
          onPress={() => send({ type: "start" })}
        >
          Start Game
        </Button>
      ) : (
        <p className="text-default-500 text-sm">
          {state.players.length < 2
            ? "Waiting for at least one more player…"
            : `Waiting for ${host?.name ?? "the host"} to start the game…`}
        </p>
      )}
    </div>
  );
}
