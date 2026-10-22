"use client";
import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { addToast } from "@heroui/toast";

import PlayersComponent from "../AllPlayers";

import { ClientMessage, GameView } from "@/types/game";
import { getPlayerName, savePlayerName } from "@/shared/useCoupSocket";
import { useI18n } from "@/i18n";

type LobbyProps = {
  state: GameView;
  send: (msg: ClientMessage) => boolean;
};

export default function Lobby({ state, send }: LobbyProps) {
  const { t } = useI18n();
  const me = state.players.find((p) => p.id === state.you);
  const host = state.players.find((p) => p.isHost);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    setName(getPlayerName() || me?.name || "");
    setUrl(window.location.href);
  }, []);

  const rename = () => {
    const clean = name.trim();

    if (!clean) return;
    savePlayerName(clean);
    send({ type: "rename", name: clean });
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      addToast({ title: t.lobby.copied, color: "success", timeout: 2000 });
    } catch {
      // Clipboard blocked (non-secure origin): the link stays selectable.
    }
  };

  return (
    <div className="mx-auto grid h-full max-w-5xl grid-rows-[auto_minmax(0,1fr)_auto] gap-4 px-4 py-4 md:grid-cols-[1fr_1fr] md:grid-rows-[1fr_auto] md:gap-x-10 md:py-10">
      <section className="flex flex-col gap-4 md:row-span-1">
        <h1 className="display text-[clamp(2.6rem,7vw,4.5rem)] uppercase">
          {t.lobby.title}
        </h1>
        <p className="text-foreground/75">{t.lobby.invite}</p>
        <div className="flex gap-2">
          <input
            readOnly
            aria-label={t.lobby.copy}
            className="min-w-0 flex-1 truncate rounded-lg border border-divider bg-content1 px-3 py-2 text-sm"
            value={url}
            onFocus={(e) => e.currentTarget.select()}
          />
          <Button color="primary" variant="flat" onPress={copy}>
            {t.lobby.copy}
          </Button>
        </div>
        <form
          className="flex flex-col gap-1.5"
          onSubmit={(e) => {
            e.preventDefault();
            rename();
          }}
        >
          <label className="text-sm text-foreground/70" htmlFor="nickname">
            {t.lobby.nickname}
          </label>
          <div className="flex gap-2">
            <input
              className="min-w-0 flex-1 rounded-lg border border-divider bg-content1 px-3 py-2 outline-none focus:border-primary"
              id="nickname"
              maxLength={24}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button type="submit" variant="bordered">
              {t.lobby.save}
            </Button>
          </div>
        </form>
      </section>

      <section className="flex min-h-0 flex-col gap-2 md:row-span-2">
        <h2 className="text-sm font-semibold text-foreground/70">
          {t.lobby.players(state.players.length)}
        </h2>
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <PlayersComponent
            labels={t.lobby}
            playerId={state.you}
            players={state.players}
          />
        </div>
      </section>

      <div className="flex flex-col gap-2 md:self-end">
        {state.options.canStart ? (
          <Button
            className="h-14 text-lg font-bold"
            color="primary"
            size="lg"
            onPress={() => send({ type: "start" })}
          >
            {t.lobby.start}
          </Button>
        ) : (
          <p className="rounded-lg border border-dashed border-divider px-4 py-3 text-center text-sm text-foreground/70">
            {state.players.length < 2
              ? t.lobby.needMore
              : t.lobby.waitingHost(host?.name ?? "")}
          </p>
        )}
      </div>
    </div>
  );
}
