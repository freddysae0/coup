"use client";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";

import Logo, { LogoMark } from "@/shared/components/Logo";
import LanguageSwitch from "@/shared/components/LanguageSwitch";
import { ThemeSwitch } from "@/shared/theme-switch";
import { useI18n } from "@/i18n";
import { ClientMessage, GameView } from "@/types/game";

type TopBarProps = {
  state: GameView | null;
  send?: (msg: ClientMessage) => boolean;
};

export default function TopBar({ state, send }: TopBarProps) {
  const { t } = useI18n();
  const leave = useDisclosure();
  const inGame = state && state.phase !== "lobby" && state.phase !== "gameOver";
  const me = state?.players.find((p) => p.id === state.you);

  return (
    <header className="relative z-30 shrink-0 border-b border-divider bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-12 max-w-6xl items-center gap-3 px-3 sm:px-5">
        <NextLink aria-label={t.nav.home} href="/">
          <LogoMark className="h-7 w-7 sm:hidden" />
          <Logo className="hidden sm:inline-flex" />
        </NextLink>
        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitch />
          <ThemeSwitch />
          {inGame && me?.alive && send && (
            <Button
              className="font-semibold"
              color="danger"
              size="sm"
              variant="light"
              onPress={leave.onOpen}
            >
              {t.game.leave}
            </Button>
          )}
        </div>
      </div>
      <DeadlineBar
        deadline={state?.deadline ?? null}
        total={state?.responseTimeoutMs}
      />
      <Modal isOpen={leave.isOpen} size="sm" onOpenChange={leave.onOpenChange}>
        <ModalContent>
          {(close) => (
            <>
              <ModalHeader>{t.game.leave}</ModalHeader>
              <ModalBody>{t.game.leaveConfirm}</ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={close}>
                  {t.game.cancel}
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    send?.({ type: "leave" });
                    close();
                  }}
                >
                  {t.game.leave}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </header>
  );
}

/** Thin line under the bar that drains while players can still respond. */
function DeadlineBar({
  deadline,
  total = 30_000,
}: {
  deadline: number | null;
  total?: number;
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!deadline) return;
    const id = setInterval(() => setNow(Date.now()), 200);

    return () => clearInterval(id);
  }, [deadline]);

  if (!deadline) return null;
  const left = Math.max(0, deadline - now);
  const ratio = Math.min(1, left / total);

  return (
    <div aria-hidden="true" className="absolute inset-x-0 -bottom-px h-0.5">
      <div
        className={
          left < 8000
            ? "h-full bg-danger transition-[width] duration-200 ease-linear"
            : "h-full bg-warning transition-[width] duration-200 ease-linear"
        }
        style={{ width: `${ratio * 100}%` }}
      />
    </div>
  );
}
