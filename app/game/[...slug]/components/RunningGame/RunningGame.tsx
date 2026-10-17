"use client";
import React, { useEffect, useRef } from "react";
import { Button, Card, CardBody, Image } from "@heroui/react";
import clsx from "clsx";

import GameOver from "./components/GameOver";
import PlayerSeat from "./components/PlayerSeat";
import ActionPanel from "./components/ActionPanel";
import ResponsePanel from "./components/ResponsePanel";
import CardPicker from "./components/CardPicker";
import Countdown from "./components/Countdown";
import { cardsImg, describePhase, icons } from "./RunningGame.utils";

import { ClientMessage, GameView } from "@/types/game";
import { subtitle } from "@/shared/primitives";

interface RunningGameProps {
  state: GameView;
  send: (msg: ClientMessage) => boolean;
}

const RunningGame: React.FC<RunningGameProps> = ({ state, send }) => {
  const me = state.players.find((p) => p.id === state.you);
  const { options } = state;

  if (!me) return null;

  if (state.phase === "gameOver") {
    const winner = state.players.find((p) => p.id === state.winnerId);

    return (
      <div className="flex flex-col gap-3">
        <GameOver
          canRestart={options.canRestart}
          win={state.winnerId === state.you}
          winnerName={winner?.name ?? "Nobody"}
          onRestart={() => send({ type: "restart" })}
        />
        <GameLog log={state.log} />
      </div>
    );
  }

  const opponents = state.players.filter((p) => p.id !== state.you);
  const isMyTurn = state.turnId === state.you;
  const respond = (msg: ClientMessage) =>
    send({ ...msg, windowId: state.windowId } as ClientMessage);

  return (
    <div className="flex flex-col text-left min-w-full gap-4 min-h-[70vh]">
      <div className="flex flex-col gap-1">
        <h6 className="text-2xl">
          Hello {me.name}
          {isMyTurn && me.alive && (
            <span className="text-primary">, it&apos;s your turn</span>
          )}
        </h6>
        <p className={subtitle({ class: "mt-0" })} data-testid="phase">
          {describePhase(state)}
        </p>
        <Countdown deadline={state.deadline} total={state.responseTimeoutMs} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {opponents.map((p) => (
          <PlayerSeat
            key={p.id}
            isTarget={state.pending?.targetId === p.id}
            isTurn={state.turnId === p.id}
            isWaitingOn={state.waitingOn.includes(p.id)}
            player={p}
          />
        ))}
      </div>

      <Card className={clsx(isMyTurn && "border-2 border-primary")}>
        <CardBody className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold">
              Your cards {!me.alive && "— you are out"}
            </span>
            <span className="flex items-center gap-1" data-testid="my-coins">
              {me.coins}
              <Image alt="coins" height={20} radius="none" src={icons.coins} />
            </span>
          </div>
          <div className="flex justify-around gap-2">
            {me.cards.map((card, index) =>
              card.role ? (
                <div key={index} className="flex flex-col items-center gap-1">
                  <Image
                    alt={card.role}
                    className={clsx(
                      "hover:-translate-y-2",
                      card.revealed && "grayscale opacity-60",
                    )}
                    isBlurred={!card.revealed}
                    src={cardsImg[card.role]}
                    width={170}
                  />
                  <span
                    className={clsx(
                      "text-sm",
                      card.revealed && "line-through text-default-400",
                    )}
                  >
                    {card.role}
                  </span>
                </div>
              ) : null,
            )}
          </div>

          {options.actions.length > 0 && (
            <ActionPanel
              state={state}
              onAction={(action, targetId) =>
                send({ type: "action", action, targetId })
              }
            />
          )}
          {options.canPass && (
            <ResponsePanel
              state={state}
              onBlock={(role) => respond({ type: "block", role })}
              onChallenge={() => respond({ type: "challenge" })}
              onPass={() => respond({ type: "pass" })}
            />
          )}
          {me.alive &&
            !options.actions.length &&
            !options.canPass &&
            !options.loseInfluence &&
            !options.exchange && (
              <p className="text-sm text-default-500">
                Waiting for other players…
              </p>
            )}
        </CardBody>
      </Card>

      <div className="flex items-center justify-between text-sm text-default-500">
        <span className="flex items-center gap-1">
          Deck: {state.deckCount}
          <Image alt="deck" height={24} radius="none" src={cardsImg.Backcard} />
        </span>
        <Button
          color="danger"
          size="sm"
          variant="light"
          onPress={() => {
            if (window.confirm("Leave the game? You will forfeit.")) {
              send({ type: "leave" });
            }
          }}
        >
          Leave game
        </Button>
      </div>

      <GameLog log={state.log} />

      <CardPicker
        cards={me.cards.map((c) => (c.revealed ? null : c.role))}
        confirmLabel="Lose this card"
        count={1}
        description="This card will be revealed and you lose its influence."
        isOpen={options.loseInfluence}
        testIdPrefix="lose"
        title={`You ${state.loss?.reason ?? "lose"}: choose a card to lose`}
        onConfirm={([index]) => send({ type: "loseCard", index })}
      />
      <CardPicker
        cards={options.exchange?.cards ?? []}
        confirmLabel="Keep these"
        count={options.exchange?.keep ?? 0}
        description="The rest go back to the deck."
        isOpen={!!options.exchange}
        testIdPrefix="exchange"
        title={`Exchange: keep ${options.exchange?.keep ?? 0} card(s)`}
        onConfirm={(keep) => send({ type: "exchange", keep })}
      />
    </div>
  );
};

function GameLog({ log }: { log: GameView["log"] }) {
  const logRef = useRef<HTMLUListElement>(null);

  // Always show the latest events.
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [log.length ? log[log.length - 1].id : 0]);

  return (
    <Card>
      <CardBody>
        <p className="font-semibold mb-1">Game log</p>
        <ul
          ref={logRef}
          className="flex flex-col gap-0.5 max-h-48 overflow-auto text-sm text-default-600"
          data-testid="game-log"
        >
          {log.map((entry) => (
            <li key={entry.id}>{entry.text}</li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}

export default RunningGame;
