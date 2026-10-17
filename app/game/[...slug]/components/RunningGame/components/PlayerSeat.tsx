import { Chip, Image } from "@heroui/react";
import clsx from "clsx";

import { cardsImg, icons } from "../RunningGame.utils";

import { Player } from "@/types/game";

type PlayerSeatProps = {
  player: Player;
  isTurn: boolean;
  isWaitingOn: boolean;
  isTarget: boolean;
};

export default function PlayerSeat({
  player,
  isTurn,
  isWaitingOn,
  isTarget,
}: PlayerSeatProps) {
  return (
    <div
      className={clsx(
        "flex flex-col gap-2 rounded-xl border-2 p-3 transition-colors",
        isTurn ? "border-primary" : "border-default-200",
        isTarget && "border-danger",
        !player.alive && "opacity-50",
      )}
      data-testid={`seat-${player.name}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold truncate">{player.name}</span>
        <span className="flex items-center gap-1 text-sm">
          {player.coins}
          <Image alt="coins" height={16} radius="none" src={icons.coins} />
        </span>
      </div>
      <div className="flex gap-1">
        {player.cards.map((card, i) => (
          <Image
            key={i}
            alt={card.revealed ? `${card.role} (lost)` : "hidden card"}
            className={clsx(card.revealed && "grayscale")}
            height={64}
            radius="sm"
            src={card.role ? cardsImg[card.role] : cardsImg.Backcard}
            title={card.revealed ? `${card.role} (lost)` : "Hidden card"}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-1 min-h-[24px]">
        {!player.alive && (
          <Chip size="sm" variant="flat">
            Out
          </Chip>
        )}
        {isTurn && player.alive && (
          <Chip color="primary" size="sm" variant="flat">
            Turn
          </Chip>
        )}
        {isWaitingOn && !isTurn && (
          <Chip color="warning" size="sm" variant="dot">
            Deciding…
          </Chip>
        )}
        {!player.connected && player.alive && (
          <Chip color="danger" size="sm" variant="flat">
            Offline
          </Chip>
        )}
      </div>
    </div>
  );
}
