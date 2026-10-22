import clsx from "clsx";

import ActionIcon from "@/shared/icons/ActionIcon";
import { ActionType } from "@/types/game";

/** An action icon on a mint plate, like the ribbon at the foot of every card. */
export default function ActionBadge({
  action,
  compact = false,
}: {
  action: ActionType;
  /** Slightly smaller on phones, where the action dock is tight. */
  compact?: boolean;
}) {
  return (
    <span
      className={clsx(
        "inline-flex shrink-0 items-center justify-center rounded-md bg-mint text-[#1F4F49] [--icon-bg:theme(colors.mint)] sm:h-9 sm:w-9",
        compact ? "h-7 w-7" : "h-8 w-8",
      )}
    >
      <ActionIcon action={action} className="h-[78%] w-[78%]" />
    </span>
  );
}
