// Mirrors the server view (coup-backend/src/game/view.ts).

export type Role = "Duke" | "Assassin" | "Captain" | "Ambassador" | "Contessa";

export type ActionType =
  | "Income" // Take 1 coin from the Treasury
  | "Foreign aid" // Take 2 coins from the Treasury (Can be blocked by Duke)
  | "Coup" // Pay 7 coins and launch a Coup
  | "Tax" // Duke Action: Take 3 coins from the Treasury
  | "Assassinate" // Assassin Action: Pay 3 coins to assassinate another player
  | "Steal" // Captain Action: Take 2 coins from another player (or 1 if they have only 1)
  | "Exchange"; // Ambassador Action: Exchange cards with the Court

export type PhaseKind =
  | "lobby"
  | "action"
  | "challengeAction"
  | "blockAction"
  | "challengeBlock"
  | "loseInfluence"
  | "exchange"
  | "gameOver";

export type CardView = { role: Role | null; revealed: boolean };

export type Player = {
  id: string;
  name: string;
  coins: number;
  isHost: boolean;
  connected: boolean;
  alive: boolean;
  cards: CardView[];
};

export type ActionOption = {
  type: ActionType;
  enabled: boolean;
  reason?: string;
  reasonCode?: "mustCoup" | "needsCoins";
  cost?: number;
  targets: string[];
};

export type Options = {
  actions: ActionOption[];
  canChallenge: boolean;
  canPass: boolean;
  blockRoles: Role[];
  loseInfluence: boolean;
  exchange: { cards: Role[]; keep: number } | null;
  canStart: boolean;
  canRestart: boolean;
};

export type GameView = {
  room: string;
  you: string;
  version: number;
  windowId: number;
  phase: PhaseKind;
  players: Player[];
  deckCount: number;
  turnId: string | null;
  pending: {
    type: ActionType;
    actorId: string;
    targetId?: string;
    claim?: Role;
    block?: { blockerId: string; role: Role };
  } | null;
  loss: { playerId: string; reason: string } | null;
  waitingOn: string[];
  winnerId: string | null;
  /** Local-clock timestamp when the response window auto-passes. */
  deadline: number | null;
  responseTimeoutMs?: number;
  log: {
    id: number;
    text: string;
    event?: { k: string } & Record<string, string | number>;
  }[];
  options: Options;
};

export type ClientMessage =
  | { type: "join"; room: string; playerId: string; name?: string }
  | { type: "rename"; name: string }
  | { type: "start" }
  | { type: "action"; action: ActionType; targetId?: string }
  | { type: "challenge"; windowId?: number }
  | { type: "pass"; windowId?: number }
  | { type: "block"; role: Role; windowId?: number }
  | { type: "loseCard"; index: number }
  | { type: "exchange"; keep: number[] }
  | { type: "leave" }
  | { type: "restart" };

export type ServerMessage =
  | {
      type: "state";
      state: GameView;
      serverTime: number;
      responseTimeoutMs: number;
    }
  | {
      type: "error";
      message: string;
      code?: string;
      params?: Record<string, string | number>;
    }
  | { type: "left" }
  | { type: "pong" };
