import { describe, it, expect } from "vitest";

import { describePhase } from "./RunningGame.utils";

import { GameView } from "@/types/game";

const base: GameView = {
  room: "r",
  you: "a",
  version: 1,
  windowId: 1,
  phase: "action",
  players: [
    {
      id: "a",
      name: "Ana",
      coins: 2,
      isHost: true,
      connected: true,
      alive: true,
      cards: [],
    },
    {
      id: "b",
      name: "Beto",
      coins: 2,
      isHost: false,
      connected: true,
      alive: true,
      cards: [],
    },
  ],
  deckCount: 11,
  turnId: "a",
  pending: null,
  loss: null,
  waitingOn: ["a"],
  winnerId: null,
  deadline: null,
  log: [],
  options: {
    actions: [],
    canChallenge: false,
    canPass: false,
    blockRoles: [],
    loseInfluence: false,
    exchange: null,
    canStart: false,
    canRestart: false,
  },
};

describe("describePhase", () => {
  it("explains every phase from the viewer's perspective", () => {
    expect(describePhase(base)).toBe("Your turn: choose an action.");
    expect(describePhase({ ...base, turnId: "b" })).toBe(
      "Beto is choosing an action.",
    );
    expect(
      describePhase({
        ...base,
        phase: "challengeAction",
        pending: {
          type: "Steal",
          actorId: "b",
          targetId: "a",
          claim: "Captain",
        },
      }),
    ).toBe(
      "Beto declared Steal on You, claiming Captain. Anyone may challenge.",
    );
    expect(
      describePhase({
        ...base,
        phase: "challengeBlock",
        pending: {
          type: "Foreign aid",
          actorId: "a",
          block: { blockerId: "b", role: "Duke" },
        },
      }),
    ).toContain("Beto blocks Foreign aid with Duke");
    expect(
      describePhase({
        ...base,
        phase: "loseInfluence",
        loss: { playerId: "a", reason: "was couped" },
      }),
    ).toBe("You must choose a card to lose.");
    expect(describePhase({ ...base, phase: "gameOver", winnerId: "b" })).toBe(
      "Beto won the game.",
    );
  });
});
