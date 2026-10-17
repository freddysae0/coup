import { ActionType, GameView, Role } from "@/types/game";

export const cardsImg: Record<Role | "Backcard", string> = {
  Duke: "/cards/Duque.png",
  Captain: "/cards/Capitan.png",
  Assassin: "/cards/Assasin.png",
  Contessa: "/cards/Condesa.png",
  Ambassador: "/cards/Embajador.png",
  Backcard: "/cards/Backcard.png",
};

export const icons = {
  coins: "/icons/coin.svg",
};

export const actionInfo: Record<
  ActionType,
  { emoji: string; description: string; role?: Role }
> = {
  Income: { emoji: "💵", description: "Take 1 coin." },
  "Foreign aid": {
    emoji: "🌍",
    description: "Take 2 coins. Any Duke can block it.",
  },
  Coup: {
    emoji: "💥",
    description: "Pay 7 coins: the target loses a card. Cannot be stopped.",
  },
  Tax: { emoji: "🏛️", description: "Take 3 coins.", role: "Duke" },
  Assassinate: {
    emoji: "🔪",
    description: "Pay 3 coins: the target loses a card. Contessa blocks it.",
    role: "Assassin",
  },
  Steal: {
    emoji: "💰",
    description: "Take 2 coins from a player. Captain or Ambassador block it.",
    role: "Captain",
  },
  Exchange: {
    emoji: "🔁",
    description: "Draw 2 cards from the deck and return 2.",
    role: "Ambassador",
  },
};

const nameOf = (state: GameView, id?: string | null) => {
  if (!id) return "Someone";
  if (id === state.you) return "You";

  return state.players.find((p) => p.id === id)?.name ?? "Someone";
};

/** One sentence that explains what the table is waiting for. */
export function describePhase(state: GameView): string {
  const pending = state.pending;
  const actor = nameOf(state, pending?.actorId);
  const target = nameOf(state, pending?.targetId);
  const action = pending
    ? `${pending.type}${pending.targetId ? ` on ${target}` : ""}`
    : "";

  switch (state.phase) {
    case "lobby":
      return "Waiting for the host to start the game.";
    case "action":
      return state.turnId === state.you
        ? "Your turn: choose an action."
        : `${nameOf(state, state.turnId)} is choosing an action.`;
    case "challengeAction":
      return `${actor} declared ${action}, claiming ${pending?.claim}. Anyone may challenge.`;
    case "blockAction":
      return pending?.targetId
        ? `${actor} declared ${action}. ${target} may block.`
        : `${actor} declared ${action}. Anyone may block.`;
    case "challengeBlock":
      return `${nameOf(state, pending?.block?.blockerId)} blocks ${pending?.type} with ${pending?.block?.role}. Anyone may challenge the block.`;
    case "loseInfluence":
      return state.loss?.playerId === state.you
        ? "You must choose a card to lose."
        : `${nameOf(state, state.loss?.playerId)} ${state.loss?.reason} and is choosing a card to lose.`;
    case "exchange":
      return `${actor} ${actor === "You" ? "are" : "is"} exchanging cards with the deck.`;
    case "gameOver":
      return state.winnerId === state.you
        ? "You won the game! 🎉"
        : `${nameOf(state, state.winnerId)} won the game.`;
    default:
      return "";
  }
}
