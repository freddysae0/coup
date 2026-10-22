import { describe, it, expect } from "vitest";

import { describePhase, logText } from "./RunningGame.utils";

import en from "@/i18n/en";
import es from "@/i18n/es";
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
  it("explains phases from the viewer's perspective, in both languages", () => {
    expect(describePhase(base, en)).toBe("Your turn: choose an action.");
    expect(describePhase({ ...base, turnId: "b" }, es)).toBe(
      "Beto está eligiendo una acción.",
    );
    const steal: GameView = {
      ...base,
      phase: "challengeAction",
      pending: { type: "Steal", actorId: "b", targetId: "a", claim: "Captain" },
    };

    expect(describePhase(steal, en)).toBe(
      "Beto wants to steal from you, claiming Captain.",
    );
    expect(describePhase(steal, es)).toBe(
      "Beto quiere robarte y dice ser Capitán.",
    );
    expect(
      describePhase(
        {
          ...base,
          phase: "loseInfluence",
          loss: { playerId: "b", reason: "couped" },
        },
        es,
      ),
    ).toBe(
      "Beto sufrió un golpe de Estado y está eligiendo qué carta revelar.",
    );
    expect(
      describePhase({ ...base, phase: "gameOver", winnerId: "a" }, en),
    ).toBe(en.game.winTitle);
  });
});

describe("logText", () => {
  it("translates structured events and falls back to the server text", () => {
    const entry = {
      id: 1,
      text: "Ana lost a challenge and loses a Duke",
      event: { k: "lose", name: "Ana", reason: "lostChallenge", role: "Duke" },
    };

    expect(logText(entry, en)).toBe("Ana lost a challenge and reveals a Duke");
    expect(logText(entry, es)).toBe("Ana perdió un desafío y revela Duque");
    expect(logText({ id: 2, text: "Legacy line" } as never, es)).toBe(
      "Legacy line",
    );
  });
});
