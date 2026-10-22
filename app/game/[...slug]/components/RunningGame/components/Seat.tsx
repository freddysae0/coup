import { motion } from "framer-motion";
import clsx from "clsx";

import Coins from "./Coins";

import GameCard from "@/shared/components/GameCard";
import { Player } from "@/types/game";
import { useI18n } from "@/i18n";

type SeatProps = {
  player: Player;
  isTurn: boolean;
  isWaitingOn: boolean;
  isTarget: boolean;
  /** Choosing a target: the seat becomes a button. */
  onSelect?: () => void;
};

export default function Seat({
  player,
  isTurn,
  isWaitingOn,
  isTarget,
  onSelect,
}: SeatProps) {
  const { t } = useI18n();
  const Tag = onSelect ? "button" : "div";

  return (
    <Tag
      className={clsx(
        "relative flex min-w-0 flex-col gap-1.5 rounded-xl border bg-content1 p-2 text-left transition-colors",
        isTarget ? "border-danger" : "border-divider",
        !player.alive && "opacity-45",
        onSelect &&
          "animate-pulse-ring cursor-pointer border-primary hover:bg-primary/10",
      )}
      data-testid={`seat-${player.name}`}
      type={onSelect ? "button" : undefined}
      onClick={onSelect}
    >
      {isTurn && player.alive && (
        // Slides from seat to seat as the turn moves around the table.
        <motion.span
          className="pointer-events-none absolute -inset-px rounded-xl border-2 border-primary"
          layoutId="turn-marker"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <div className="flex items-center gap-1.5">
        <span
          className={clsx(
            "truncate text-sm font-semibold",
            !player.connected && "line-through decoration-foreground/40",
          )}
        >
          {player.name}
        </span>
        {isWaitingOn && player.alive && (
          <span
            aria-label={t.game.deciding}
            className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-warning"
            title={t.game.deciding}
          />
        )}
        <Coins
          className="ml-auto text-sm font-semibold"
          label={t.coins(player.coins)}
          size={14}
          value={player.coins}
        />
      </div>
      <div className="flex gap-1">
        {player.cards.map((card, i) => (
          <GameCard
            key={i}
            alt={card.revealed && card.role ? t.roles[card.role] : ""}
            character={card.revealed ? card.role : null}
            className="h-[clamp(36px,7dvh,64px)] w-auto"
            revealed={card.revealed}
            sizes="48px"
          />
        ))}
        <span className="ml-auto self-end text-[11px] font-semibold text-foreground/60">
          {!player.alive
            ? t.game.out
            : !player.connected
              ? t.game.offline
              : isTurn
                ? t.game.turn
                : ""}
        </span>
      </div>
    </Tag>
  );
}
