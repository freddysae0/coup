import { Discussion, DiscussionMeta } from "@/types/game";

export const discussionMeta: DiscussionMeta = {
  Default: [
    {
      title: (playerName: string) => `${playerName} is taking an action`,
      description: `Will you challenge?`,
      notification: (currentDiscussion: Discussion | null) =>
        `${currentDiscussion?.player.name} is taking an action to ${currentDiscussion?.target?.name}`,
      okButton: "Challenge",
      cancelButton: "Skip",
    },
  ],
  //'Income': {},
  "Foreign aid": [
    {
      title: (playerName: string) => `${playerName} is taking foreign aid`,
      description: `Will try to stop that?`,
      okButton: "Deny foreign aid",
      cancelButton: "Skip",
    },
    {
      title: (playerName: string) => `${playerName} denied your foreign aid`,
      description: `Do you think they might be a duke?`,
      okButton: "Challenge",
      cancelButton: "Skip",
    },
  ],
  Coup: [
    {
      title: (playerName: string) => `${playerName} is couping you`,
      notification: (currentDiscussion: Discussion | null) =>
        `${currentDiscussion?.player.name} is couping ${currentDiscussion?.target?.name}!!!`,

      description: `You have to throw one card`,
      okButton: "Throw card",
    },
    {
      title: (_playerName: string) => `You have lose one challenge.`,
      description: `You have to throw one card`,
      okButton: "Throw card",
    },
  ],

  "Lose card": [
    {
      title: (_playerName: string) => `You have lose`, //
      description: `You have to throw one card`,
      okButton: "Throw card",
    },
  ],
  "DenyForeign aid": [
    {
      title: (playerName: string) => `${playerName} is trying to deny yoy.`,
      description: `Do you want to challenge?`,
      okButton: "Challenge",
      cancelButton: "Skip",
    },
  ],
  /* 'Tax': {},
    'Assassinate': {},
    'Exchange': {},
    'Steal': {} */
};

export const cardsImg = {
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
