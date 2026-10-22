import { useEffect, useRef } from "react";
import { Drawer, DrawerBody, DrawerContent, DrawerHeader } from "@heroui/react";

import { logText } from "../RunningGame.utils";

import { GameView } from "@/types/game";
import { useI18n } from "@/i18n";

export default function LogDrawer({
  log,
  isOpen,
  onOpenChange,
}: {
  log: GameView["log"];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useI18n();
  const endRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (isOpen) endRef.current?.scrollIntoView({ block: "end" });
  }, [isOpen, log.length]);

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      size="sm"
      onOpenChange={onOpenChange}
    >
      <DrawerContent>
        <DrawerHeader className="display text-3xl">{t.game.log}</DrawerHeader>
        <DrawerBody>
          <ol
            className="flex flex-col gap-2 pb-6 text-sm"
            data-testid="game-log"
          >
            {log.map((entry) => (
              <li
                key={entry.id}
                className="border-l-2 border-divider pl-3 text-foreground/80"
              >
                {logText(entry, t)}
              </li>
            ))}
            <li ref={endRef} aria-hidden="true" />
          </ol>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
