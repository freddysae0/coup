import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { Tooltip } from "@heroui/react";

import ActionBadge from "@/shared/components/ActionBadge";
import { ACTION_META } from "@/shared/gameMeta";
import { useI18n } from "@/i18n";
import { ActionOption, ActionType, GameView, Role } from "@/types/game";

export type DockMode =
  | { kind: "actions" }
  | { kind: "target"; action: ActionOption }
  | { kind: "respond" }
  | { kind: "lose"; selected: number[] }
  | { kind: "exchange"; selected: number[]; keep: number }
  | { kind: "waiting" }
  | { kind: "spectating" };

type DockProps = {
  state: GameView;
  mode: DockMode;
  myRoles: (Role | null)[];
  onAction: (action: ActionOption) => void;
  onTarget: (targetId: string) => void;
  onCancelTarget: () => void;
  onChallenge: () => void;
  onBlock: (role: Role) => void;
  onPass: () => void;
  onConfirmSelection: () => void;
};

const btn =
  "rounded-lg px-3 font-semibold transition-[transform,background-color] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40";

/** The decision area. It is always on screen, so nobody scrolls to play. */
export default function Dock(props: DockProps) {
  const { mode } = props;

  return (
    <div className="shrink-0 border-t border-divider bg-content1/70 px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 backdrop-blur">
      <div className="mx-auto max-w-3xl">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={mode.kind}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            initial={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.16 }}
          >
            <DockContent {...props} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function DockContent({
  state,
  mode,
  myRoles,
  onAction,
  onTarget,
  onCancelTarget,
  onChallenge,
  onBlock,
  onPass,
  onConfirmSelection,
}: DockProps) {
  const { t } = useI18n();
  const nameOf = (id: string) =>
    state.players.find((p) => p.id === id)?.name ?? "?";

  switch (mode.kind) {
    case "actions":
      return (
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
          {state.options.actions.map((option) => (
            <ActionButton
              key={option.type}
              myRoles={myRoles}
              option={option}
              onPress={() => onAction(option)}
            />
          ))}
        </div>
      );

    case "target":
      return (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold">
            {t.game.chooseTarget(t.actions[mode.action.type])}
          </p>
          <div className="flex flex-wrap gap-2">
            {mode.action.targets.map((id) => (
              <button
                key={id}
                className={clsx(btn, "bg-danger py-2.5 text-danger-foreground")}
                data-testid={`target-${nameOf(id)}`}
                type="button"
                onClick={() => onTarget(id)}
              >
                {nameOf(id)}
              </button>
            ))}
            <button
              className={clsx(
                btn,
                "py-2.5 text-foreground/70 hover:bg-content2",
              )}
              type="button"
              onClick={onCancelTarget}
            >
              {t.game.cancel}
            </button>
          </div>
        </div>
      );

    case "respond": {
      const { options } = state;

      return (
        <div className="flex flex-col gap-2">
          <div className="flex justify-end">
            <SecondsLeft deadline={state.deadline} />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {options.canChallenge && (
              <button
                className={clsx(btn, "bg-danger py-3 text-danger-foreground")}
                data-testid="respond-challenge"
                type="button"
                onClick={onChallenge}
              >
                {t.game.challenge}
              </button>
            )}
            {options.blockRoles.map((role) => {
              const real = myRoles.includes(role);

              return (
                <button
                  key={role}
                  className={clsx(
                    btn,
                    "py-3",
                    real
                      ? "bg-success text-success-foreground"
                      : "bg-warning text-warning-foreground",
                  )}
                  data-testid={`block-${role}`}
                  type="button"
                  onClick={() => onBlock(role)}
                >
                  {t.game.blockAs(t.roles[role])}
                  <span className="block text-[11px] font-medium opacity-80">
                    {real ? t.game.real : t.game.bluff}
                  </span>
                </button>
              );
            })}
            <button
              className={clsx(
                btn,
                "border border-foreground/30 py-3 hover:bg-content2",
              )}
              data-testid="respond-pass"
              type="button"
              onClick={onPass}
            >
              {options.blockRoles.length ? t.game.allow : t.game.pass}
            </button>
          </div>
        </div>
      );
    }

    case "lose":
    case "exchange": {
      const isLose = mode.kind === "lose";
      const needed = isLose ? 1 : mode.keep;

      return (
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-semibold">
              {isLose ? t.game.loseTitle : t.game.exchangeTitle(mode.keep)}
            </p>
            <p className="text-sm text-foreground/70">
              {isLose ? t.game.loseHint : t.game.exchangeHint}
            </p>
          </div>
          <button
            className={clsx(btn, "bg-primary py-3 text-primary-foreground")}
            data-testid={isLose ? "lose-confirm" : "exchange-confirm"}
            disabled={mode.selected.length !== needed}
            type="button"
            onClick={onConfirmSelection}
          >
            {t.game.confirm}
          </button>
        </div>
      );
    }

    case "spectating":
      return (
        <p className="py-2 text-center text-sm text-foreground/70">
          {t.game.spectating}
        </p>
      );

    default:
      return (
        <p className="py-2 text-center text-sm text-foreground/70">
          {t.game.waiting}
        </p>
      );
  }
}

function ActionButton({
  option,
  myRoles,
  onPress,
}: {
  option: ActionOption;
  myRoles: (Role | null)[];
  onPress: () => void;
}) {
  const { t } = useI18n();
  const meta = ACTION_META[option.type as ActionType];
  const truthful = !meta.role || myRoles.includes(meta.role);
  const hint = !option.enabled
    ? option.reasonCode === "mustCoup"
      ? t.game.mustCoup
      : t.game.needsCoins(option.cost ?? meta.cost)
    : meta.role
      ? truthful
        ? t.roles[meta.role]
        : `${t.game.bluff}: ${t.roles[meta.role]}`
      : meta.cost
        ? `−${t.coins(meta.cost)}`
        : "";

  const type = option.type as ActionType;

  // HeroUI's framer-motion entrance resets for one frame as it finishes, which
  // makes the tooltip blink: it is turned off and the tooltip fades in with CSS.
  return (
    <Tooltip
      disableAnimation
      classNames={{ base: "animate-tooltip-in" }}
      closeDelay={0}
      content={<ActionTooltip action={type} />}
      delay={250}
      placement="top"
    >
      {/* The wrapper keeps the tooltip alive on disabled buttons. */}
      <div className="flex">
        <button
          className={clsx(
            btn,
            "flex min-h-[54px] w-full flex-col items-center justify-center gap-1 px-1.5 py-1.5 text-center sm:flex-row sm:justify-start sm:gap-2 sm:px-2.5 sm:text-left",
            type === "Coup"
              ? "bg-danger/90 text-danger-foreground"
              : "bg-content2 hover:bg-content3",
            meta.role &&
              !truthful &&
              option.enabled &&
              "ring-1 ring-warning/60",
          )}
          data-testid={`action-${option.type}`}
          disabled={!option.enabled}
          type="button"
          onClick={onPress}
        >
          <ActionBadge compact action={type} />
          <span className="flex min-w-0 flex-col">
            <span className="text-[13px] leading-tight sm:text-sm">
              {t.actions[type]}
            </span>
            <span
              className={clsx(
                "text-[10px] font-medium leading-tight sm:text-[11px]",
                type === "Coup"
                  ? "opacity-80"
                  : meta.role
                    ? truthful
                      ? "text-success"
                      : "text-warning"
                    : "text-foreground/60",
              )}
            >
              {hint}
            </span>
          </span>
        </button>
      </div>
    </Tooltip>
  );
}

function ActionTooltip({ action }: { action: ActionType }) {
  const { t } = useI18n();
  const meta = ACTION_META[action];
  const r = t.rules;

  return (
    <div className="flex max-w-[240px] flex-col gap-1.5 px-1 py-1.5 text-left">
      <p className="text-sm font-bold">{t.actions[action]}</p>
      <p className="text-xs">{r.effects[action]}</p>
      <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 text-[11px]">
        <dt className="text-foreground/60">{r.table.character}</dt>
        <dd>{meta.role ? t.roles[meta.role] : r.table.anyone}</dd>
        <dt className="text-foreground/60">{r.table.blockedBy}</dt>
        <dd>
          {meta.blockedBy.length
            ? meta.blockedBy.map((b) => t.roles[b]).join(", ")
            : r.table.none}
        </dd>
      </dl>
    </div>
  );
}

function SecondsLeft({ deadline }: { deadline: number | null }) {
  const { t } = useI18n();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!deadline) return;
    const id = setInterval(() => setNow(Date.now()), 250);

    return () => clearInterval(id);
  }, [deadline]);

  if (!deadline) return null;

  return (
    <span className="text-xs tabular-nums text-foreground/70">
      {t.game.autoPass(Math.max(0, Math.ceil((deadline - now) / 1000)))}
    </span>
  );
}
