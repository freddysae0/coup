import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AllPlayers from "./AllPlayers";
import { Player } from "@/types/game";
import { v4 } from "uuid";
const playerid = v4();

const mock_players: Player[] = [
  {
    cards: [],
    coins: 5,
    id: playerid,
    isHost: false,
    name: "Player1",
    isBeingChallenged: false,
  },
  {
    cards: [],
    coins: 5,
    id: v4(),
    isHost: true,
    name: "Player2",
    isBeingChallenged: false,
  },
];
describe("All players components", () => {
  it("Renders", () => {
    render(AllPlayers({ players: mock_players, playerId: playerid }));
    expect(screen.getByText("Player1")).toBeInTheDocument();
    expect(screen.getByText("Player2")).toBeInTheDocument();
  });
});
