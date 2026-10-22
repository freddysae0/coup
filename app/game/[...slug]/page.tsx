"use client";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import { useParams } from "next/navigation";
import { Spinner } from "@heroui/react";
import { addToast } from "@heroui/toast";

import Lobby from "./components/Lobby";
import RunningGame from "./components/RunningGame";
import TopBar from "./components/TopBar";

import { SocketError, useCoupSocket } from "@/shared/useCoupSocket";
import { useI18n } from "@/i18n";

// Being refused at the door is final: show a page instead of a toast.
const FATAL = new Set(["alreadyStarted", "roomFull", "invalidRoom"]);
// Servers that predate error codes only send the English message.
const FATAL_MESSAGE = /already started|room is full|Invalid room/;

export default function Game() {
  const { t } = useI18n();
  const params = useParams<{ slug: string[] }>();
  const slug = params?.slug ?? [];
  const room = slug.length ? slug[slug.length - 1] : null;
  const [fatal, setFatal] = useState<string | null>(null);

  const onError = (err: SocketError) => {
    const text = (err.code && t.game.errors[err.code]) || err.message;

    const isFatal = err.code
      ? FATAL.has(err.code)
      : FATAL_MESSAGE.test(err.message);

    if (isFatal) setFatal(text);
    else addToast({ title: text, color: "danger", timeout: 3500 });
  };
  const { state, status, send } = useCoupSocket(room, onError);

  useEffect(() => {
    if (state) setFatal(null);
  }, [state]);

  if (status === "left" || (fatal && !state)) {
    return (
      <>
        <TopBar state={null} />
        <div className="mx-auto flex max-w-lg flex-1 flex-col items-start justify-center gap-4 px-6">
          <h1 className="display text-5xl">
            {status === "left" ? t.game.leftTitle : t.game.cantJoin}
          </h1>
          {fatal && <p className="text-foreground/75">{fatal}</p>}
          <NextLink
            className="rounded-lg bg-primary px-5 py-3 font-bold text-primary-foreground"
            href="/"
          >
            {status === "left" ? t.game.backHome : t.game.newGame}
          </NextLink>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar send={send} state={state} />
      {status !== "open" && (
        <div
          className="flex items-center justify-center gap-2 bg-warning/15 px-3 py-1.5 text-sm text-warning"
          role="status"
        >
          <Spinner color="warning" size="sm" />
          {status === "connecting" ? t.game.connecting : t.game.reconnecting}
        </div>
      )}
      <div className="relative min-h-0 flex-1">
        {!state ? (
          <div className="flex h-full items-center justify-center">
            <Spinner label={t.game.joining} />
          </div>
        ) : state.phase === "lobby" ? (
          <Lobby send={send} state={state} />
        ) : (
          <RunningGame send={send} state={state} />
        )}
      </div>
    </>
  );
}
