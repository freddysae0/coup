import { ActionType, Role } from "@/types/game";

/** Mirrors coup-backend/src/game/types.ts (ACTIONS). */
export const ACTION_META: Record<
  ActionType,
  { cost: number; role?: Role; targeted: boolean; blockedBy: Role[] }
> = {
  Income: { cost: 0, targeted: false, blockedBy: [] },
  "Foreign aid": { cost: 0, targeted: false, blockedBy: ["Duke"] },
  Coup: { cost: 7, targeted: true, blockedBy: [] },
  Tax: { cost: 0, role: "Duke", targeted: false, blockedBy: [] },
  Assassinate: {
    cost: 3,
    role: "Assassin",
    targeted: true,
    blockedBy: ["Contessa"],
  },
  Steal: {
    cost: 0,
    role: "Captain",
    targeted: true,
    blockedBy: ["Captain", "Ambassador"],
  },
  Exchange: { cost: 0, role: "Ambassador", targeted: false, blockedBy: [] },
};

export const ACTION_ORDER: ActionType[] = [
  "Income",
  "Foreign aid",
  "Coup",
  "Tax",
  "Assassinate",
  "Steal",
  "Exchange",
];

export const ROLES: Role[] = [
  "Duke",
  "Assassin",
  "Captain",
  "Ambassador",
  "Contessa",
];
