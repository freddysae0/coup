import { Card } from "@/types/game";
export const dukeCard: Card = {
  name: "Duke",
  action: "Tax",
  counteraction: "Foreign Aid",
};

export const assassinCard: Card = {
  name: "Assassin",
  action: "Assassinate",
  counteraction: "Assassinate",
};

export const captainCard: Card = {
  name: "Captain",
  action: "Steal",
  counteraction: "Steal",
};

export const ambassadorCard: Card = {
  name: "Ambassador",
  action: "Exchange",
  counteraction: "Steal",
};

export const contessaCard: Card = {
  name: "Contessa",
  action: "None", // Assuming this card is just for a basic action
  counteraction: "Assassinate",
};

export const availableRoles = [
  ambassadorCard,
  dukeCard,
  contessaCard,
  captainCard,
  assassinCard,
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
