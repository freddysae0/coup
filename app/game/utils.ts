import { Game } from "@/types";
import { Card } from "@/types/game";
const availableRoles = [
  Game.ambassadorCard,
  Game.dukeCard,
  Game.contessaCard,
  Game.captainCard,
  Game.assassinCard,
];

export const createDeck = () => {
  const deck: Card[] = Array(25);
  availableRoles.forEach((role, i) => {
    deck.fill(role, i * 5, i * 5 + 5);
  });

  // Fisher-Yates Shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
};

export const createThrows = () => Array<Card>();
