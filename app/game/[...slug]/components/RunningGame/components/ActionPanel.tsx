import { useState } from "react";
import { Button, Chip } from "@heroui/react";

import { actionInfo } from "../RunningGame.utils";

import { ActionOption, ActionType, GameView } from "@/types/game";

type ActionPanelProps = {
  state: GameView;
  onAction: (action: ActionType, targetId?: string) => void;
};

export default function ActionPanel({ state, onAction }: ActionPanelProps) {
  const [selected, setSelected] = useState<ActionOption | null>(null);
  const me = state.players.find((p) => p.id === state.you)!;
  const myRoles = me.cards.filter((c) => !c.revealed).map((c) => c.role);
  const nameOf = (id: string) =>
    state.players.find((p) => p.id === id)?.name ?? id;

  if (selected) {
    return (
      <div className="flex flex-col gap-2">
        <p className="font-semibold">
          {actionInfo[selected.type].emoji} {selected.type}: choose a target
        </p>
        <div className="flex flex-wrap gap-2">
          {selected.targets.map((id) => (
            <Button
              key={id}
              color="danger"
              data-testid={`target-${nameOf(id)}`}
              variant="flat"
              onPress={() => {
                onAction(selected.type, id);
                setSelected(null);
              }}
            >
              {nameOf(id)}
            </Button>
          ))}
          <Button variant="light" onPress={() => setSelected(null)}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {state.options.actions.map((option) => {
        const info = actionInfo[option.type];
        const truthful = !info.role || myRoles.includes(info.role);

        return (
          <Button
            key={option.type}
            className="h-auto min-h-[64px] justify-start py-2 text-left whitespace-normal"
            color={option.type === "Coup" ? "danger" : "default"}
            data-testid={`action-${option.type}`}
            isDisabled={!option.enabled}
            title={option.reason ?? info.description}
            variant={option.type === "Coup" ? "flat" : "ghost"}
            onPress={() =>
              option.targets.length
                ? setSelected(option)
                : onAction(option.type)
            }
          >
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold flex items-center gap-2">
                {info.emoji} {option.type}
                {info.role && (
                  <Chip
                    color={truthful ? "success" : "warning"}
                    size="sm"
                    variant="flat"
                  >
                    {truthful ? info.role : `bluff ${info.role}`}
                  </Chip>
                )}
              </span>
              <span className="text-xs text-default-500">
                {option.reason ?? info.description}
              </span>
            </div>
          </Button>
        );
      })}
    </div>
  );
}
