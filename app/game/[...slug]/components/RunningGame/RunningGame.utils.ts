import { Dictionary } from "@/i18n/en";
import { ActionType, GameView, Role } from "@/types/game";

type LogEntry = GameView["log"][number];

/** Translates role/action/reason params before they go into a sentence. */
function localizeParams(
  params: Record<string, string | number>,
  t: Dictionary,
): Record<string, string | number> {
  const out = { ...params };

  if (typeof out.role === "string" && out.role in t.roles) {
    out.role = t.roles[out.role as Role];
  }
  if (typeof out.action === "string" && out.action in t.actions) {
    out.action = t.actions[out.action as ActionType];
  }
  if (typeof out.reason === "string") {
    out.reason = t.game.reasons[out.reason] ?? out.reason;
  }

  return out;
}

/** A log line in the viewer's language (falls back to the server's text). */
export function logText(entry: LogEntry, t: Dictionary): string {
  const event = entry.event;
  const format = event && t.game.events[event.k];

  if (!format) return entry.text;
  const params: Record<string, string | number> = { ...event };

  delete params.k;

  return format(localizeParams(params, t));
}

/** One sentence that explains what the table is waiting for. */
export function describePhase(state: GameView, t: Dictionary): string {
  const nameOf = (id?: string | null) => {
    if (!id) return "?";
    if (id === state.you) return t.game.you;

    return state.players.find((p) => p.id === id)?.name ?? "?";
  };
  const pending = state.pending;
  const iAmActor = pending?.actorId === state.you;
  const iAmTarget = pending?.targetId === state.you;
  const base = {
    actor: nameOf(pending?.actorId),
    // "Beto quiere robarte" reads better than "robar a Tú".
    action: pending
      ? (iAmTarget ? t.game.verbsYou : t.game.verbs)[pending.type]
      : "",
    target: pending?.targetId && !iAmTarget ? nameOf(pending.targetId) : "",
    role: pending?.claim ? t.roles[pending.claim] : "",
    name: pending ? t.actions[pending.type] : "",
  };
  const blockRole = pending?.block ? t.roles[pending.block.role] : "";

  switch (state.phase) {
    case "lobby":
      return t.lobby.title;
    case "action":
      return t.game.phase.action(
        nameOf(state.turnId),
        state.turnId === state.you,
      );
    case "challengeAction":
      return iAmActor
        ? t.game.phase.challengeActionMine(base)
        : t.game.phase.challengeAction(base);
    case "blockAction":
      if (iAmActor) return t.game.phase.blockActionMine(base);

      return iAmTarget
        ? t.game.phase.blockActionYou(base)
        : t.game.phase.blockAction(base);
    case "challengeBlock":
      return pending?.block?.blockerId === state.you
        ? t.game.phase.challengeBlockMine({ role: blockRole })
        : t.game.phase.challengeBlock({
            blocker: nameOf(pending?.block?.blockerId),
            role: blockRole,
          });
    case "loseInfluence":
      return t.game.phase.loseInfluence({
        mine: state.loss?.playerId === state.you ? 1 : 0,
        name: nameOf(state.loss?.playerId),
        reason: t.game.reasons[state.loss?.reason ?? ""] ?? "",
      });
    case "exchange":
      return t.game.phase.exchange({
        mine: pending?.actorId === state.you ? 1 : 0,
        name: nameOf(pending?.actorId),
      });
    case "gameOver":
      return state.winnerId === state.you
        ? t.game.winTitle
        : t.game.loseTitleEnd(nameOf(state.winnerId));
    default:
      return "";
  }
}
