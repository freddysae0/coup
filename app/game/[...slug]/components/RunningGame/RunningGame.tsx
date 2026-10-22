"use client";
import React, { useEffect, useMemo, useState } from "react";
import NextLink from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useDisclosure } from "@heroui/react";
import clsx from "clsx";

import Seat from "./components/Seat";
import Dock, { DockMode } from "./components/Dock";
import Coins from "./components/Coins";
import LogDrawer from "./components/LogDrawer";
import RulesDrawer from "./components/RulesDrawer";
import { describePhase, logText } from "./RunningGame.utils";

import GameCard, { CARD_RATIO } from "@/shared/components/GameCard";
import { useI18n } from "@/i18n";
import { ActionOption, ClientMessage, GameView, Role } from "@/types/game";

interface RunningGameProps {
  state: GameView;
  send: (msg: ClientMessage) => boolean;
}

const RunningGame: React.FC<RunningGameProps> = ({ state, send }) => {
  const { t } = useI18n();
  const log = useDisclosure();
  const rules = useDisclosure();
  const me = state.players.find((p) => p.id === state.you);
  const { options } = state;
  const [targeting, setTargeting] = useState<ActionOption | null>(null);
  const [selected, setSelected] = useState<number[]>([]);

  // A new decision starts with a clean selection.
  const decisionKey = `${state.phase}:${state.windowId}:${state.loss?.playerId}:${options.exchange?.cards.join()}`;

  useEffect(() => setSelected([]), [decisionKey]);
  useEffect(() => {
    if (!options.actions.length) setTargeting(null);
  }, [options.actions.length]);

  const myRoles = useMemo<(Role | null)[]>(
    () => (me ? me.cards.filter((c) => !c.revealed).map((c) => c.role) : []),
    [me],
  );

  if (!me) return null;

  const mode: DockMode = options.loseInfluence
    ? { kind: "lose", selected }
    : options.exchange
      ? { kind: "exchange", selected, keep: options.exchange.keep }
      : options.canPass
        ? { kind: "respond" }
        : options.actions.length
          ? targeting
            ? { kind: "target", action: targeting }
            : { kind: "actions" }
          : me.alive
            ? { kind: "waiting" }
            : { kind: "spectating" };

  const respond = (msg: ClientMessage) =>
    send({ ...msg, windowId: state.windowId } as ClientMessage);
  const act = (option: ActionOption, targetId?: string) => {
    send({ type: "action", action: option.type, targetId });
    setTargeting(null);
  };

  // Cards shown in the hand area, and which of them can be picked.
  const handCards: {
    role: Role | null;
    revealed: boolean;
    pickable: boolean;
  }[] = options.exchange
    ? options.exchange.cards.map((role) => ({
        role,
        revealed: false,
        pickable: true,
      }))
    : me.cards.map((c) => ({
        ...c,
        pickable: options.loseInfluence && !c.revealed,
      }));
  const maxPick = options.exchange ? options.exchange.keep : 1;
  const togglePick = (index: number) =>
    setSelected((prev) => {
      if (prev.includes(index)) return prev.filter((i) => i !== index);
      if (maxPick === 1) return [index];

      return prev.length >= maxPick ? prev : [...prev, index];
    });

  const opponents = state.players.filter((p) => p.id !== state.you);
  const lastLog = state.log[state.log.length - 1];
  const pending = state.pending;
  const claim = pending?.block?.role ?? pending?.claim;
  const winner = state.players.find((p) => p.id === state.winnerId);

  return (
    <div className="mx-auto flex h-full max-w-6xl flex-col">
      {/* Opponents */}
      <section className="max-h-[38%] shrink-0 overflow-y-auto px-3 pt-3">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2">
          {opponents.map((p) => (
            <Seat
              key={p.id}
              isTarget={pending?.targetId === p.id}
              isTurn={state.turnId === p.id}
              isWaitingOn={state.waitingOn.includes(p.id)}
              player={p}
              onSelect={
                targeting?.targets.includes(p.id)
                  ? () => act(targeting, p.id)
                  : undefined
              }
            />
          ))}
        </div>
      </section>

      {/* Stage: what is happening right now */}
      <section className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-4 py-2 text-center">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={`${state.phase}-${state.windowId}-${state.turnId}-${state.loss?.playerId}`}
            animate={{ opacity: 1, scale: 1 }}
            className="flex max-w-xl flex-col items-center gap-3"
            exit={{ opacity: 0, scale: 0.98 }}
            initial={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            {claim && state.phase !== "action" && (
              <div className="flex items-center gap-2">
                <GameCard
                  alt={t.roles[claim]}
                  character={claim}
                  className="h-[clamp(40px,9dvh,84px)] w-auto"
                  sizes="60px"
                />
                <span className="rounded-full border border-divider px-2.5 py-1 text-xs font-semibold text-foreground/80">
                  {t.game.claims(t.roles[claim])}
                </span>
              </div>
            )}
            <p
              className="text-balance text-lg font-semibold leading-snug sm:text-xl"
              data-testid="phase"
            >
              {describePhase(state, t)}
            </p>
          </motion.div>
        </AnimatePresence>
        <div className="flex max-w-full items-center gap-3 text-xs text-foreground/60">
          <button
            className="min-w-0 truncate rounded-md px-2 py-1 hover:bg-content1 hover:text-foreground"
            type="button"
            onClick={log.onOpen}
          >
            <span className="font-semibold text-foreground/80">
              {t.game.log}:
            </span>{" "}
            {lastLog ? logText(lastLog, t) : ""}
          </button>
          <span className="shrink-0">
            {t.game.deck}: {state.deckCount}
          </span>
          <button
            className="flex shrink-0 items-center gap-1 rounded-full border border-divider px-2.5 py-1 font-semibold text-foreground/80 hover:bg-content1 hover:text-foreground"
            data-testid="open-rules"
            type="button"
            onClick={rules.onOpen}
          >
            <span
              aria-hidden="true"
              className="flex h-4 w-4 items-center justify-center rounded-full bg-mint text-[10px] font-black text-[#1F4F49]"
            >
              ?
            </span>
            {t.nav.rules}
          </button>
        </div>
      </section>

      {/* My hand */}
      <section
        aria-label={me.name}
        className={clsx(
          "relative mx-3 mb-2 flex shrink-0 flex-col gap-2 rounded-2xl border p-2 sm:p-3",
          state.turnId === me.id && me.alive
            ? "border-primary"
            : "border-transparent",
        )}
      >
        <div className="flex items-center gap-2 px-1 text-sm">
          <span className="font-semibold">
            {me.name}{" "}
            <span className="font-normal text-foreground/60">
              ({t.game.you})
            </span>
          </span>
          {state.turnId === me.id && me.alive && state.phase === "action" && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
              {t.game.yourTurn}
            </span>
          )}
          <Coins
            className="ml-auto text-base font-bold"
            label={t.coins(me.coins)}
            size={20}
            value={me.coins}
          />
        </div>
        <div
          className="flex h-[clamp(110px,25dvh,250px)] items-center justify-center gap-2 [container-type:size]"
          data-testid="my-hand"
        >
          {handCards.map((card, i) => {
            const n = handCards.length;
            const height = `min(100cqh, calc((100cqw - ${(n - 1) * 8}px) / ${n} / ${CARD_RATIO}))`;
            const isSelected = selected.includes(i);
            const pickClass = clsx(
              "relative shrink-0 rounded-[8%] transition-transform",
              card.pickable &&
                "cursor-pointer ring-offset-2 ring-offset-background hover:-translate-y-1",
              isSelected && "-translate-y-2 ring-4 ring-primary",
            );
            const face = (
              <GameCard
                alt={card.role ? t.roles[card.role] : ""}
                character={card.role}
                className="h-full w-auto"
                revealed={card.revealed}
                sizes="(max-width: 640px) 40vw, 160px"
              />
            );

            return card.pickable ? (
              <button
                key={i}
                aria-label={card.role ? t.roles[card.role] : undefined}
                aria-pressed={isSelected}
                className={pickClass}
                data-testid={`${options.exchange ? "exchange" : "lose"}-${i}`}
                style={{ height }}
                type="button"
                onClick={() => togglePick(i)}
              >
                {face}
              </button>
            ) : (
              <div key={i} className={pickClass} style={{ height }}>
                {face}
              </div>
            );
          })}
        </div>
      </section>

      <Dock
        mode={mode}
        myRoles={myRoles}
        state={state}
        onAction={(option) =>
          option.targets.length ? setTargeting(option) : act(option)
        }
        onBlock={(role) => respond({ type: "block", role })}
        onCancelTarget={() => setTargeting(null)}
        onChallenge={() => respond({ type: "challenge" })}
        onConfirmSelection={() =>
          options.exchange
            ? send({ type: "exchange", keep: selected })
            : send({ type: "loseCard", index: selected[0] })
        }
        onPass={() => respond({ type: "pass" })}
        onTarget={(id) => targeting && act(targeting, id)}
      />

      <LogDrawer
        isOpen={log.isOpen}
        log={state.log}
        onOpenChange={log.onOpenChange}
      />

      <RulesDrawer isOpen={rules.isOpen} onOpenChange={rules.onOpenChange} />

      {/* Game over */}
      <AnimatePresence>
        {state.phase === "gameOver" && (
          <motion.div
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-background/85 px-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
          >
            <motion.div
              animate={{ y: 0, opacity: 1 }}
              className="flex max-w-md flex-col items-start gap-5"
              initial={{ y: 24, opacity: 0 }}
              transition={{ delay: 0.15, type: "spring", damping: 20 }}
            >
              <h2
                className="display text-[clamp(3rem,11vw,5.5rem)] uppercase"
                data-testid="game-over"
              >
                {state.winnerId === state.you
                  ? t.game.winTitle
                  : t.game.loseTitleEnd(winner?.name ?? "?")}
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                {options.canRestart ? (
                  <button
                    className="rounded-lg bg-primary px-5 py-3 font-bold text-primary-foreground"
                    data-testid="restart"
                    type="button"
                    onClick={() => send({ type: "restart" })}
                  >
                    {t.game.rematch}
                  </button>
                ) : (
                  <p className="text-foreground/70">{t.game.waitingRematch}</p>
                )}
                <button
                  className="rounded-lg px-3 py-3 font-semibold hover:bg-content1"
                  type="button"
                  onClick={log.onOpen}
                >
                  {t.game.log}
                </button>
                <NextLink
                  className="rounded-lg px-3 py-3 font-semibold hover:bg-content1"
                  href="/"
                >
                  {t.game.backHome}
                </NextLink>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RunningGame;
