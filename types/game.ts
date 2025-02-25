export type Action =
  | "Income" // Take 1 coin from the Treasury
  | "Foreign aid" // Take 2 coins from the Treasury (Can be blocked by Duke)
  | "Coup" // Pay 7 coins and launch a Coup
  | "Tax" // Duke Action: Take 3 coins from the Treasury
  | "Assassinate" // Assassin Action: Pay 3 coins to assassinate another player
  | "Steal" // Captain Action: Take 2 coins from another player (or 1 if they have only 1)
  | "Exchange" // Ambassador Action: Exchange cards with the Court
  | "Lose card" // Ambassador Action: Exchange cards with the Court
  | "None"; // None Action (only Contessa have it)

export type CounterAction =
  | "Foreign Aid" // Duke blocks Foreign Aid
  | "Assassinate" // Contessa blocks Assassinate
  | "Steal"; // Ambassador or Captain blocks Steal

export type CardStructure = {
  id: number;
  name: "Duke" | "Assassin" | "Captain" | "Ambassador" | "Contessa"; // Fixed names for characters
  action: Action; // Action associated with the card
  counteraction: CounterAction | null; // Counteraction capability, null if none
};
export type Card = Partial<CardStructure>;
export type Player = {
  id: string;
  name: string;
  cards: Card[];
  coins: number;
  isHost: boolean;
  isBeingChallenged: boolean; // Track if the action is being challenged
};

export type State = {
  deck: Card[];
  throws: Card[];
  players: Player[];
  isGameStarted: boolean;
  turn: Player; // Player whose turn it is
};

export type ChallengeOutcome =
  | "Wins challenge"
  | "Loses challenge"
  | "Lose a card"
  | "ResolveCoup"
  | "DenyForeign aid"
  | "ChallengeDenyForeign aid";

export type Discussion = {
  id: string;
  player: Player;
  action: Action;
  target?: Player;
  playersVotingToSkip: Player[];
  step: number;
  playerWhomBeBlessed: Player;
  playerWhomBeCoursed: Player;
};

export type DiscussionMeta = {
  [key: string]: Array<{
    title: (playerName: string) => string;
    notification?: (discussion: Discussion | null) => string;

    description: string;
    okButton: string;
    cancelButton?: string;
  }>;
};
