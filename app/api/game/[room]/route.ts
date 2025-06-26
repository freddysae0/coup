import type { Card, Discussion, Player, State } from "@/types/game";

import { NextResponse } from "next/server";

const rooms = new Map<string, State & { openDiscussions: Discussion[] }>();

export function GET(
  _request: Request,
  { params }: { params: { room: string } },
) {
  const state = rooms.get(params.room);

  if (!state) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  return NextResponse.json(state);
}

export async function POST(
  request: Request,
  { params }: { params: { room: string } },
) {
  const body = await request.json();
  const room = params.room;
  let state = rooms.get(room);

  switch (body.type) {
    case "createRoom": {
      if (!state) {
        state = {
          deck: body.game.deck as Card[],
          throws: body.game.throws as Card[],
          players: body.game.players as Player[],
          isGameStarted: false,
          turn: body.game.players[0] as Player,
          openDiscussions: [],
        };
        rooms.set(room, state);
      }
      break;
    }
    case "updatePlayerName": {
      if (!state) break;
      const idx = state.players.findIndex((p) => p.id === body.player.id);

      if (idx === -1) {
        state.players.push(body.player as Player);
      } else {
        state.players[idx] = { ...state.players[idx], ...body.player };
      }
      break;
    }
    case "startGame": {
      if (!state) break;
      state.isGameStarted = true;
      state.players.forEach((p) => {
        p.coins = state.players.length === 2 ? 1 : 2;
        p.cards = state.deck.splice(0, 2);
      });
      break;
    }
    case "playTurn": {
      if (!state) break;
      const player = state.players.find((p) => p.id === body.player.id);

      if (!player) break;
      // Very basic actions implementation
      switch (body.action) {
        case "Income":
          player.coins += 1;
          break;
        case "Foreign aid":
          player.coins += 2;
          break;
        case "Tax":
          player.coins += 3;
          break;
        case "Coup": {
          const target = state.players.find(
            (p: Player) => p.id === body.target?.id,
          );

          if (player.coins >= 7 && target && target.cards.length > 0) {
            player.coins -= 7;
            target.cards.pop();
          }
          break;
        }
        case "Assassinate": {
          const target = state.players.find(
            (p: Player) => p.id === body.target?.id,
          );

          if (player.coins >= 3 && target && target.cards.length > 0) {
            player.coins -= 3;
            target.cards.pop();
          }
          break;
        }
        case "Steal": {
          const target = state.players.find(
            (p: Player) => p.id === body.target?.id,
          );

          if (target) {
            const stolen = Math.min(2, target.coins);

            target.coins -= stolen;
            player.coins += stolen;
          }
          break;
        }
        case "Exchange": {
          const newCards = state.deck.splice(0, 2);

          state.deck.push(...player.cards.splice(0, player.cards.length));
          player.cards.push(...newCards.slice(0, 2));
          break;
        }
        case "Lose card": {
          if (typeof body.cardToThrow === "number") {
            player.cards.splice(body.cardToThrow, 1);
            state.throws.push({});
          }
          break;
        }
      }
      // advance turn
      const currentIndex = state.players.findIndex((p) => p.id === player.id);

      state.turn = state.players[(currentIndex + 1) % state.players.length];
      break;
    }
  }

  if (state) rooms.set(room, state);

  return NextResponse.json(state ?? {});
}
