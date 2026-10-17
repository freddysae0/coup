import { Button } from "@heroui/react";

import { GameView, Role } from "@/types/game";

type ResponsePanelProps = {
  state: GameView;
  onChallenge: () => void;
  onBlock: (role: Role) => void;
  onPass: () => void;
};

export default function ResponsePanel({
  state,
  onChallenge,
  onBlock,
  onPass,
}: ResponsePanelProps) {
  const { options, pending } = state;
  const me = state.players.find((p) => p.id === state.you)!;
  const myRoles = me.cards.filter((c) => !c.revealed).map((c) => c.role);
  const claimed =
    state.phase === "challengeBlock" ? pending?.block?.role : pending?.claim;

  return (
    <div className="flex flex-col gap-2 rounded-xl border-2 border-warning p-3">
      <p className="font-semibold">What do you do?</p>
      <div className="flex flex-wrap gap-2">
        {options.canChallenge && (
          <Button
            color="danger"
            data-testid="respond-challenge"
            variant="shadow"
            onPress={onChallenge}
          >
            Challenge{claimed ? ` (no ${claimed})` : ""}
          </Button>
        )}
        {options.blockRoles.map((role) => (
          <Button
            key={role}
            color={myRoles.includes(role) ? "success" : "warning"}
            data-testid={`block-${role}`}
            variant="flat"
            onPress={() => onBlock(role)}
          >
            Block as {role}
            {myRoles.includes(role) ? "" : " (bluff)"}
          </Button>
        ))}
        <Button data-testid="respond-pass" variant="bordered" onPress={onPass}>
          {options.blockRoles.length ? "Allow" : "Pass"}
        </Button>
      </div>
    </div>
  );
}
