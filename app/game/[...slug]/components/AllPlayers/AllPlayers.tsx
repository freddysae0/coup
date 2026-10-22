import React from "react";
import clsx from "clsx";

import { Player } from "@/types/game";

type Labels = { host: string; you: string; offline: string };

const AVATAR_TONES = [
  "bg-court/20 text-court",
  "bg-mint/25 text-mint",
  "bg-magenta/20 text-magenta",
  "bg-ducat/20 text-ducat",
];

export default function PlayersComponent({
  players,
  playerId,
  labels,
}: {
  players: Player[];
  playerId: string;
  labels: Labels;
}) {
  return (
    <ul className="flex flex-col gap-2">
      {players.map((player, i) => (
        <li
          key={player.id}
          className={clsx(
            "flex items-center gap-3 rounded-lg border px-3 py-2.5",
            player.id === playerId
              ? "border-primary/60 bg-primary/10"
              : "border-divider bg-content1",
          )}
        >
          <span
            aria-hidden="true"
            className={clsx(
              "display flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg",
              AVATAR_TONES[i % AVATAR_TONES.length],
            )}
          >
            {player.name.slice(0, 1).toUpperCase()}
          </span>
          <span
            className={clsx(
              "truncate font-semibold",
              !player.connected && "opacity-60",
            )}
          >
            {player.name}
          </span>
          <span className="ml-auto flex shrink-0 gap-1 text-xs font-semibold">
            {player.isHost && (
              <span className="rounded-full bg-warning/20 px-2 py-0.5 text-warning">
                {labels.host}
              </span>
            )}
            {player.id === playerId && (
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-primary">
                {labels.you}
              </span>
            )}
            {!player.connected && (
              <span className="rounded-full bg-default-200 px-2 py-0.5">
                {labels.offline}
              </span>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}
