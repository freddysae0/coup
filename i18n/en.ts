import type { ActionType, Role } from "@/types/game";

type P = Record<string, string | number>;

const roles: Record<Role, string> = {
  Duke: "Duke",
  Assassin: "Assassin",
  Captain: "Captain",
  Ambassador: "Ambassador",
  Contessa: "Contessa",
};

const actions: Record<ActionType, string> = {
  Income: "Income",
  "Foreign aid": "Foreign aid",
  Coup: "Coup",
  Tax: "Tax",
  Assassinate: "Assassinate",
  Steal: "Steal",
  Exchange: "Exchange",
};

const en = {
  locale: "en",
  meta: {
    title: "Coup — the bluffing card game, online",
    description:
      "Play Coup with friends in the browser. Bluff, steal and assassinate your way to power. 2–10 players, no sign-up.",
  },
  roles,
  actions,
  coins: (n: number) => (n === 1 ? "1 coin" : `${n} coins`),
  nav: {
    play: "Play",
    rules: "Rules",
    source: "Source code",
    language: "Language",
    lightMode: "Switch to light mode",
    darkMode: "Switch to dark mode",
    home: "Coup, home",
  },
  footer: {
    credit:
      "Coup was designed by Rikki Tahta and is published by Indie Boards & Cards. This is a fan-made online version.",
    builtBy: "Built by",
    code: "Code on GitHub",
  },
  landing: {
    title: "Lie your way to power.",
    lead: "A bluffing game for 2 to 10 players. Claim any character, take what you want, and call out the liars before they call you out. Plays in the browser, no sign-up.",
    create: "Create a room",
    joinLabel: "Got an invite? Paste the link or room code",
    joinPlaceholder: "Link or room code",
    join: "Join",
    joinInvalid: "That doesn't look like a room link or code.",
    readRules: "Read the rules",
    courtTitle: "Five characters. Nobody has to tell the truth.",
    courtLead:
      "Each player holds two face-down cards. You can claim to be any character — the cards in your hand only matter if someone calls your bluff.",
    action: "Action",
    blocks: "Blocks",
    nothingToBlock: "Nothing",
    court: {
      Duke: {
        action: "Tax: take 3 coins.",
        blocks: "Foreign aid",
      },
      Assassin: {
        action: "Pay 3 coins: a player loses a card.",
        blocks: "",
      },
      Captain: {
        action: "Steal 2 coins from a player.",
        blocks: "Stealing",
      },
      Ambassador: {
        action: "Draw 2 cards, keep the ones you want.",
        blocks: "Stealing",
      },
      Contessa: {
        action: "No action of her own.",
        blocks: "Assassination",
      },
    } as Record<Role, { action: string; blocks: string }>,
    turnTitle: "How a turn plays out",
    steps: [
      {
        title: "Declare",
        text: "Pick an action. If it needs a character, simply say you have it.",
      },
      {
        title: "Challenge",
        text: "Anyone who doubts you can call the bluff. Whoever is wrong loses a card.",
      },
      {
        title: "Block",
        text: "Some actions can be stopped by claiming the right character. Blocks can be challenged too.",
      },
      {
        title: "Resolve",
        text: "If nothing stops it, the action happens. Lose both cards and you are out.",
      },
    ],
    onlineTitle: "Made for playing with friends online",
    online: [
      {
        title: "Send a link, play in seconds",
        text: "Create a room, share the URL, start when everyone is in. No accounts.",
      },
      {
        title: "No peeking",
        text: "The server deals and checks every move. Your browser only ever receives your own cards.",
      },
      {
        title: "Closed the tab by accident?",
        text: "Open the link again and you are back in your seat with the same cards.",
      },
    ],
    finalTitle: "Gather the court.",
    finalText: "One link is all your friends need.",
  },
  rules: {
    title: "How to play Coup",
    lead: "Everything you need for your first game, and the fine print for the arguments that follow.",
    toc: "On this page",
    sections: {
      goal: "Goal",
      setup: "Setup",
      turn: "Your turn",
      actions: "Actions",
      challenges: "Challenges",
      blocks: "Blocks",
      losing: "Losing influence",
      special: "Special cases",
      online: "Playing online",
      characters: "The characters",
    },
    goal: "Be the last player with at least one card. Each face-down card is a piece of influence at court; lose both and you are exiled.",
    setup: [
      "Every player gets 2 cards, face down, and 2 coins.",
      "The deck has 3 copies of each character for 2–6 players, 4 for 7–8 and 5 for 9–10.",
      "In a two-player game the first player starts with only 1 coin.",
      "A random player goes first; play continues in the order players joined the room.",
    ],
    turn: [
      "On your turn you must take exactly one action. You cannot pass.",
      "Character actions only require that you claim the character. You may be lying.",
      "If you start your turn with 10 coins or more, you must launch a Coup.",
    ],
    table: {
      action: "Action",
      character: "Character",
      effect: "Effect",
      blockedBy: "Blocked by",
      anyone: "Anyone",
      none: "—",
    },
    effects: {
      Income: "Take 1 coin.",
      "Foreign aid": "Take 2 coins.",
      Coup: "Pay 7 coins. The target loses a card. Cannot be blocked or challenged.",
      Tax: "Take 3 coins.",
      Assassinate: "Pay 3 coins. The target loses a card.",
      Steal: "Take 2 coins from the target (or 1 if that is all they have).",
      Exchange: "Draw 2 cards, then return 2 cards of your choice to the deck.",
    } as Record<ActionType, string>,
    challenges: [
      "Any claimed character can be challenged by any other player, whether or not they are involved.",
      "If the challenged player has the card, they show it, shuffle it into the deck and draw a new one. The challenger loses a card.",
      "If they do not have it, they lose a card and their action or block fails.",
      "A failed action costs nothing: coins paid for an assassination are returned.",
    ],
    blocks: [
      "Foreign aid can be blocked by anyone claiming the Duke.",
      "Only the target of an assassination can block it, claiming the Contessa.",
      "Only the target of a steal can block it, claiming the Captain or the Ambassador.",
      "A blocked action fails, but coins already paid stay spent. Any player can challenge the block.",
    ],
    losing: [
      "When you lose influence you choose which of your cards to reveal. It stays face up for everyone to see.",
      "With only one card left there is nothing to choose: it is revealed automatically.",
      "When both of your cards are revealed you are out of the game.",
    ],
    special: [
      "Double loss: challenge an Assassin and lose, and you lose one card for the challenge and another for the assassination. Bluffing a Contessa that gets challenged ends the same way.",
      "If the target of an action is eliminated before it resolves, the action has no effect.",
      "During an exchange you keep as many cards as you had face down — one or two.",
    ],
    online: [
      "When an action or block can be answered, everyone who may respond gets 30 seconds. Whoever does not answer in time lets it through.",
      "Lost your connection? Open the room link again within 2 minutes to get your seat back. After that you forfeit.",
      "When the game ends, the host can start a rematch with everyone still in the room.",
    ],
  },
  lobby: {
    title: "Waiting room",
    invite:
      "Share this link with your friends. Everyone who opens it joins this room.",
    copy: "Copy link",
    copied: "Link copied",
    nickname: "Your name",
    save: "Save",
    players: (n: number) => `Players (${n}/10)`,
    host: "Host",
    you: "You",
    offline: "Offline",
    start: "Start the game",
    needMore: "Waiting for at least one more player.",
    waitingHost: (name: string) => `Waiting for ${name} to start the game.`,
  },
  game: {
    connecting: "Connecting to the server…",
    reconnecting: "Connection lost. Reconnecting…",
    joining: "Joining the room…",
    leftTitle: "You left the game",
    backHome: "Back to the home page",
    cantJoin: "You can't join this room",
    newGame: "Create a new room",
    yourTurn: "Your turn",
    deck: "Deck",
    log: "Game log",
    fullRules: "Open the full rules",
    leave: "Leave game",
    leaveConfirm: "Leave the game? You will lose your cards.",
    you: "You",
    out: "Out",
    offline: "Offline",
    deciding: "Deciding",
    turn: "Turn",
    autoPass: (s: number) => `Auto-pass in ${s}s`,
    chooseAction: "Choose an action",
    chooseTarget: (action: string) => `${action}: choose a target`,
    cancel: "Cancel",
    real: "You have it",
    bluff: "Bluff",
    needsCoins: (n: number) => `Needs ${n} coins`,
    mustCoup: "10+ coins: you must Coup",
    challenge: "Challenge",
    blockAs: (role: string) => `Block as ${role}`,
    allow: "Let it happen",
    pass: "Don't challenge",
    loseTitle: "Choose a card to reveal",
    loseHint: "It will be face up and you lose its influence.",
    exchangeTitle: (n: number) => `Keep ${n} ${n === 1 ? "card" : "cards"}`,
    exchangeHint: "The others go back to the deck.",
    confirm: "Confirm",
    waiting: "Waiting for the other players…",
    spectating: "You are out. Watch how it ends.",
    winTitle: "The court is yours.",
    loseTitleEnd: (name: string) => `${name} takes the court.`,
    rematch: "Play again in this room",
    waitingRematch: "Waiting for the host to start a rematch…",
    claims: (role: string) => `claims ${role}`,
    reasons: {
      lostChallenge: "lost a challenge",
      caughtBluffing: "was caught bluffing",
      couped: "was couped",
      assassinated: "was assassinated",
    } as Record<string, string>,
    phase: {
      action: (name: string, mine: boolean) =>
        mine
          ? "Your turn: choose an action."
          : `${name} is choosing an action.`,
      challengeAction: (p: P) =>
        `${p.actor} wants to ${p.action}${p.target ? ` ${p.target}` : ""}, claiming ${p.role}.`,
      blockAction: (p: P) =>
        p.target
          ? `${p.actor} wants to ${p.action} ${p.target}. ${p.target} may block.`
          : `${p.actor} wants to take foreign aid. Anyone may block with a Duke.`,
      challengeBlock: (p: P) =>
        `${p.blocker} blocks with ${p.role}. Challenge it?`,
      challengeActionMine: (p: P) =>
        `You claim ${p.role} to ${p.action}. Waiting for challenges.`,
      blockActionMine: (p: P) =>
        `Waiting to see if anyone blocks your ${p.name}.`,
      blockActionYou: (p: P) =>
        `${p.actor} wants to ${p.action}. You may block.`,
      challengeBlockMine: (p: P) =>
        `You block with ${p.role}. Waiting for challenges.`,
      loseInfluence: (p: P) =>
        p.mine
          ? "You must reveal a card."
          : `${p.name} ${p.reason} and is choosing a card to reveal.`,
      exchange: (p: P) =>
        p.mine
          ? "Choose which cards to keep."
          : `${p.name} is exchanging cards.`,
    },
    verbsYou: {
      Income: "take income",
      "Foreign aid": "take foreign aid",
      Coup: "launch a coup on you",
      Tax: "collect tax",
      Assassinate: "assassinate you",
      Steal: "steal from you",
      Exchange: "exchange cards",
    } as Record<ActionType, string>,
    verbs: {
      Income: "take income",
      "Foreign aid": "take foreign aid",
      Coup: "launch a coup on",
      Tax: "collect tax",
      Assassinate: "assassinate",
      Steal: "steal from",
      Exchange: "exchange cards",
    } as Record<ActionType, string>,
    events: {
      joined: (p: P) => `${p.name} joined the room`,
      renamed: (p: P) => `${p.from} is now ${p.to}`,
      started: (p: P) => `The game begins. ${p.name} goes first`,
      backToLobby: () => "Back to the waiting room",
      newHost: (p: P) => `${p.name} is now the host`,
      leftRoom: (p: P) => `${p.name} left the room`,
      forfeit: (p: P) => `${p.name} left the game`,
      cancelled: (p: P) => `${p.name}'s action is cancelled`,
      declare: (p: P) =>
        `${p.name}: ${p.action}${p.target ? ` → ${p.target}` : ""}${p.role ? ` (claims ${p.role})` : ""}`,
      blockStands: (p: P) => `${p.name}'s ${p.role} stops the ${p.action}`,
      challenge: (p: P) => `${p.name} challenges ${p.target}'s ${p.role}`,
      bluffing: (p: P) => `${p.name} was bluffing!`,
      isBlocked: (p: P) => `${p.action} is blocked`,
      blockBluff: (p: P) => `${p.name} was bluffing. The block fails`,
      blockDeclared: (p: P) =>
        `${p.name} blocks ${p.action} (claims ${p.role})`,
      reveal: (p: P) => `${p.name} shows a ${p.role} and draws a new card`,
      lose: (p: P) => `${p.name} ${p.reason} and reveals a ${p.role}`,
      out: (p: P) => `${p.name} is out of the game`,
      noEffect: (p: P) =>
        `${p.action} has no effect: the target is already out`,
      income: (p: P) => `${p.name} takes 1 coin`,
      foreignAid: (p: P) => `${p.name} takes 2 coins of foreign aid`,
      tax: (p: P) => `${p.name} collects 3 coins of tax`,
      steal: (p: P) => `${p.name} steals ${p.amount} from ${p.target}`,
      exchangeDraw: (p: P) => `${p.name} draws ${p.count} cards`,
      exchangeReturn: (p: P) =>
        `${p.name} returns ${p.count} cards to the deck`,
      win: (p: P) => `${p.name} wins the game!`,
      nobodyWins: () => "Nobody wins",
    } as Record<string, (p: P) => string>,
    errors: {
      notInRoom: "You are not in this room.",
      alreadyStarted: "This game has already started. Ask for a new link.",
      roomFull: "This room is full (10 players).",
      emptyName: "Your name can't be empty.",
      hostOnly: "Only the host can do that.",
      notEnoughPlayers: "You need at least 2 players.",
      notOver: "The game isn't over yet.",
      notNow: "That isn't possible right now.",
      notYourTurn: "It's not your turn.",
      unknownAction: "Unknown action.",
      mustCoup: "With 10 or more coins you must Coup.",
      needsCoins: "You don't have enough coins.",
      invalidTarget: "Choose a player who is still in the game.",
      nothingToRespond: "There is nothing to answer.",
      cannotRespond: "You can't answer this.",
      alreadyPassed: "You already answered.",
      blockOrPass: "You can only block or let it happen.",
      cannotBlock: "You can't block right now.",
      wrongBlocker: "That character can't block this action.",
      noLossPending: "You don't have to reveal a card.",
      chooseOwnCard: "Choose one of your face-down cards.",
      notExchanging: "You are not exchanging cards.",
      keepCount: "Choose the right number of cards to keep.",
      invalidRoom: "This room link isn't valid.",
      joinFirst: "Join a room first.",
      serverError: "The server had a problem. Try again.",
      offline: "Not connected to the server. Retrying…",
    } as Record<string, string>,
  },
  notFound: {
    title: "This room of the palace doesn't exist.",
    back: "Back to the home page",
  },
  error: {
    title: "Something broke.",
    retry: "Reload the page",
  },
};

export type Dictionary = typeof en;

export default en;
