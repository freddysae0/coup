"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Spinner } from "@heroui/react";
import { addToast } from "@heroui/toast";

import Lobby from "./components/Lobby";
import RunningGame from "./components/RunningGame";

import { useCoupSocket } from "@/shared/useCoupSocket";
import { title, subtitle } from "@/shared/primitives";

export default function Game() {
  const params = useParams<{ slug: string[] }>();
  const slug = params?.slug ?? [];
  const room = slug.length ? slug[slug.length - 1] : null;
  const [fatalError, setFatalError] = useState<string | null>(null);

  const { state, status, send } = useCoupSocket(room, (message) => {
    // Being refused at the door (game already started, room full) is final.
    if (/already started|room is full|Invalid room/.test(message)) {
      setFatalError(message);
    } else {
      addToast({ title: message, color: "danger", timeout: 3500 });
    }
  });

  useEffect(() => {
    if (state) setFatalError(null);
  }, [state]);

  if (status === "left") {
    return (
      <div className="flex flex-col gap-3">
        <h1 className={title()}>You left the game</h1>
        <Link href="/">Back to home</Link>
      </div>
    );
  }

  if (fatalError && !state) {
    return (
      <div className="flex flex-col gap-3">
        <h1 className={title({ size: "sm" })}>Can&apos;t join this room</h1>
        <p className={subtitle()}>{fatalError}</p>
        <Button as={Link} color="primary" href="/" variant="flat">
          Start a new game
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3">
      {status !== "open" && (
        <div className="flex items-center justify-center gap-2 rounded-lg bg-warning-50 p-2 text-sm text-warning-700">
          <Spinner color="warning" size="sm" />
          {status === "connecting"
            ? "Connecting to the server…"
            : "Connection lost, reconnecting…"}
        </div>
      )}
      {!state ? (
        <div className="flex justify-center py-10">
          <Spinner label="Joining room…" />
        </div>
      ) : state.phase === "lobby" ? (
        <Lobby send={send} state={state} />
      ) : (
        <RunningGame send={send} state={state} />
      )}
    </div>
  );
}
