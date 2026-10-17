"use client";
import React from "react";
import { Alert, Chip } from "@heroui/react";

import { Player } from "@/types/game";

export default function PlayersComponent({
  players,
  playerId,
}: {
  players: Player[];
  playerId: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      {players.map((player) => (
        <Alert
          key={player.id}
          className="text-left"
          color={player.id == playerId ? "primary" : "default"}
          endContent={
            <div className="flex gap-1">
              {player.isHost && (
                <Chip color="warning" size="sm" variant="flat">
                  Host
                </Chip>
              )}
              {player.id == playerId && (
                <Chip color="primary" size="sm" variant="flat">
                  You
                </Chip>
              )}
              {!player.connected && (
                <Chip size="sm" variant="flat">
                  Offline
                </Chip>
              )}
            </div>
          }
          icon={<UserIcon />}
          title={player.name}
          variant="flat"
        />
      ))}
    </div>
  );
}

const UserIcon = ({ fill = "currentColor", ...props }) => {
  return (
    <svg
      data-name="Iconly/Curved/Profile"
      height={24}
      viewBox="0 0 24 24"
      width={24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g
        fill="none"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      >
        <path
          d="M11.845 21.662C8.153 21.662 5 21.088 5 18.787s3.133-4.425 6.845-4.425c3.692 0 6.845 2.1 6.845 4.4s-3.134 2.9-6.845 2.9z"
          data-name="Stroke 1"
        />
        <path
          d="M11.837 11.174a4.372 4.372 0 10-.031 0z"
          data-name="Stroke 3"
        />
      </g>
    </svg>
  );
};
