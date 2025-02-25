"use client";
import { card } from "@heroui/theme";
import {
  Card as CardUI,
  CardBody,
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  RadioGroup,
  Radio,
  cn,
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import { Button } from "@heroui/button";

import GameOver from "./components/GameOver";

import { useWebSocket } from "@/app/providers";
import { Action, Card, Discussion, Player } from "@/types/game";
import { subtitle } from "@/shared/primitives";
import { cardsImg, discussionMeta, icons } from "./RunningGame.utils";
import CounterActionModal from "./components/CounteractionModal/CounterActionModal";

interface RunningGameProps {
  room: string;
  player: Player;
  players: Player[];
  deck: Card[];
  turn: Player;
  discussions: Discussion[];
}

export const StyledRadioButton = (props: any) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          "inline-flex m-0  items-center justify-between",
          "flex-row-reverse max-w-[500px] cursor-pointer rounded-lg gap-4 p-2 border-2 border-transparent"
        ),
      }}
      color="danger"
    >
      {children}
    </Radio>
  );
};

const RunningGame: React.FC<RunningGameProps> = ({
  room,
  player,
  deck,
  players,
  turn,
  discussions,
}) => {
  const {
    isOpen: isOpenActionMenu,
    onOpen: onOpenActionMenu,
    onClose: onCloseActionMenu,
  } = useDisclosure();
  const {
    isOpen: isOpenCounterActionMenu,
    onOpen: onOpenCounterActionMenu,
    onClose: onCloseCounterActionMenu,
  } = useDisclosure();
  const [selectedTargetId, setSelectedTargetId] = useState<string>("");
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [selectedCardNumber, setSelectedCardNumber] = useState<number>(0);
  const [activeDiscussion, setActiveDiscussion] = useState<Discussion | null>(
    null
  );
  const [globalActiveDiscussion, setGlobalActiveDiscussion] =
    useState<Discussion | null>(null);
  const { socket } = useWebSocket();
  const handleActionsModal = () => {
    onOpenActionMenu();
  };

  /* 
        action(req.room, req.player, req.action, req.target, game);
     */
  const playerHaveAction = (action: Action) => {
    if (action == "Income" || action == "Coup" || action == "Foreign aid") {
      return true;
    }

    return player.cards.some((card) => card.action == action);
  };
  const HaveActionText = (action: Action) => {
    return (
      <span className="text-success">
        {playerHaveAction(action) ? "CARDS" : ""}
      </span>
    );
  };

  const getSelectedTarget = () => {
    return players.find((p) => p.id == selectedTargetId);
  };

  const sendAction = (action: Action, extraData: any = {}) => {
    let currentStep = globalActiveDiscussion?.step || 0;
    const payload = {
      type: "playTurn",
      room,
      action,
      step: currentStep,
      player,
      playerWhomBeBlessed:
        currentStep == 0 ? player : globalActiveDiscussion?.playerWhomBeBlessed,
      playerWhomBeCoursed:
        currentStep == 0
          ? extraData.target
          : globalActiveDiscussion?.playerWhomBeCoursed,

      ...extraData,
    };

    socket?.send(JSON.stringify(payload));
  };
  const sendSelectedAction = (
    expicit_action: Action = "None",
    resolve: boolean = false
  ) => {
    const actionMap: Record<string, { action: Action; extra?: any }> = {
      Coup: { action: "Coup", extra: { target: getSelectedTarget() } },
      "Foreign aid": {
        action: "Foreign aid",
        extra: {
          target:
            globalActiveDiscussion?.step == 0 ||
            globalActiveDiscussion == undefined
              ? { name: "all" }
              : globalActiveDiscussion.player,
          resolve: resolve,
        },
      },
      "Lose card": {
        action: "Lose card",
        extra: {
          cardToThrow: selectedCardNumber,
        },
      },
    };

    if (expicit_action != "None") {
      setSelectedAction(expicit_action);
    }

    const { action, extra } = actionMap[
      expicit_action != "None" ? expicit_action : selectedAction
    ] || {
      action: expicit_action != "None" ? expicit_action : selectedAction,
      extra: {},
    };

    sendAction(action, extra);

    onCloseActionMenu();
  };

  useEffect(() => {
    if (!discussions || discussions.length == 0) {
      setGlobalActiveDiscussion(null);
      onCloseCounterActionMenu();

      return;
    }

    const discussion = discussions[discussions.length - 1];
    let foundDiscussion = false;

    // Coup, Assasin, Steal case
    setGlobalActiveDiscussion(discussion);

    if (
      discussion.target?.id == player.id ||
      (discussion.target?.name == "all" && discussion.player.id != player.id)
    ) {
      foundDiscussion = true;
      setActiveDiscussion(discussion);
      onOpenCounterActionMenu();
    }

    if (foundDiscussion) {
      return;
    }
  }, [discussions]);

  return (
    <div className="flex flex-col text-left min-w-full gap-3 min-h-[70vh]">
      {player.cards.length == 0 && <GameOver win={false} />}
      {players.filter((p) => p.cards.length > 0).length == 1 &&
      players.filter((p) => p.cards.length > 0)[0].id == player.id ? (
        <GameOver win={true} />
      ) : (
        <div className="w-full flex flex-col">
          <h6 className="text-2xl">
            Hello {player.name}
            {turn.id == player.id && (
              <span className="text-primary">, It&apos;s your yourn</span>
            )}
          </h6>
          {discussionMeta[
            globalActiveDiscussion?.action
              ? globalActiveDiscussion.action
              : "Default"
          ][globalActiveDiscussion?.step ? globalActiveDiscussion.step - 1 : 0]
            .notification &&
            globalActiveDiscussion && (
              <p className={subtitle(discussionMeta)}>
                {discussionMeta[
                  globalActiveDiscussion?.action
                    ? globalActiveDiscussion.action
                    : "Default"
                ][
                  globalActiveDiscussion?.step
                    ? globalActiveDiscussion.step - 0
                    : 1
                ].notification?.(globalActiveDiscussion)}
              </p>
            )}
          <div>
            <div />
            <div className="flex justify-around">
              {player.cards.map((card, index) => {
                if (!card.name) {
                  return;
                }

                return (
                  <Image
                    key={index}
                    isBlurred
                    alt={card.name}
                    className="hover:-translate-y-2"
                    src={cardsImg[card.name]}
                    width={220}
                  />
                );
              })}
            </div>
          </div>
          <Button
            color="secondary"
            isDisabled={turn.id != player.id || player.coins >= 10}
            variant="ghost"
            onPress={() => {
              setSelectedAction("");
              handleActionsModal();
            }}
          >
            Character Actions
          </Button>
          <Button
            color="default"
            isDisabled={turn.id != player.id || player.coins >= 10}
            variant="ghost"
            onPress={() => sendAction("Income")}
          >
            Income 💵
          </Button>
          <Button
            color="default"
            isDisabled={turn.id != player.id || player.coins >= 10}
            variant="ghost"
            onPress={() => {
              sendSelectedAction("Foreign aid");
            }}
          >
            Foreign Aid 🌍
          </Button>{" "}
          <Button
            color="default"
            isDisabled={turn.id != player.id || player.coins < 7}
            variant="ghost"
            onPress={() => {
              setSelectedAction("Coup");
              handleActionsModal();
            }}
          >
            Coup 💥
          </Button>
          <CardUI>
            <CardBody>
              <div className="flex gap-4">
                <ul className="flex flex-col gap-1">
                  {players.map((p) => (
                    <li
                      key={p.id}
                      className={
                        "h-[25px]" + (p.id == turn.id ? " text-primary" : "")
                      }
                    >
                      {p.name}
                    </li>
                  ))}
                </ul>
                <ul className="flex flex-col gap-1">
                  {players.map((player) => (
                    <li key={player.id} className="flex gap-1">
                      {player.cards.map((card, cardindex) => (
                        <Image
                          key={cardindex}
                          alt="backcard"
                          className="hover:-translate-y-1"
                          height={28}
                          src={cardsImg.Backcard}
                        />
                      ))}
                    </li>
                  ))}
                </ul>
                <ul className="flex flex-col gap-1">
                  {players.map((player) => (
                    <li key={player.id} className="flex gap-1">
                      {player.coins}
                      <Image
                        alt={card.name}
                        className="hover:-translate-y-1"
                        height={28}
                        src={icons.coins}
                      />
                    </li>
                  ))}
                </ul>
                <div className="flex gap-3 ">
                  <p>{deck.length}</p>
                  <Image
                    alt={card.name}
                    className="hover:-translate-y-1"
                    height={28}
                    src={cardsImg.Backcard}
                  />
                </div>
              </div>
            </CardBody>
          </CardUI>
          {/* Actions --------------------> */}
          <Modal
            isOpen={isOpenActionMenu}
            size={"md"}
            onClose={onCloseActionMenu}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Character Actions
                  </ModalHeader>
                  <ModalBody className="max-h-[80vh] overflow-auto ">
                    {selectedAction != "Coup" && (
                      <RadioGroup
                        label="Choose an action"
                        value={selectedAction}
                        onChange={(e) => setSelectedAction(e.target.value)}
                      >
                        <StyledRadioButton
                          description="Take 3 coins from the Treasury."
                          value="tax"
                        >
                          Tax 🏛️ {HaveActionText("Tax")}
                        </StyledRadioButton>
                        <StyledRadioButton
                          description="Pay 3 coins to the Treasury and launch an assassination against another player. If successful, that player immediately loses an influence. (Can be blocked by the Contessa)"
                          value="assassinate"
                        >
                          Assassinate 🔪 {HaveActionText("Assassinate")}
                        </StyledRadioButton>
                        <StyledRadioButton
                          description="Take 2 coins from another player. If they only have one coin, take only one. (Can be blocked by the Ambassador or the Captain)"
                          value="steal"
                        >
                          Steal 💰 {HaveActionText("Steal")}
                        </StyledRadioButton>
                        <StyledRadioButton
                          description="Exchange cards with the Court. First take 2 random cards from the Court deck. Choose which, if any, to exchange with your face-down cards. Then return two cards to the Court deck."
                          value="exchange"
                        >
                          Exchange 🔁 {HaveActionText("Exchange")}
                        </StyledRadioButton>
                      </RadioGroup>
                    )}

                    {(selectedAction == "assassinate" ||
                      selectedAction == "steal" ||
                      selectedAction == "tax" ||
                      selectedAction == "Coup") && (
                      <RadioGroup
                        label={
                          "Which player you want to " + selectedAction + "?"
                        }
                        value={selectedTargetId}
                        onChange={(e) => {
                          setSelectedTargetId(e.target.value);
                        }}
                      >
                        {players.map((p) => {
                          return p.id != player.id ? (
                            <StyledRadioButton
                              key={p.id}
                              description={`Have ${p.cards.length} cards and ${p.coins} coins`}
                              value={p.id}
                            >
                              {p.name}
                            </StyledRadioButton>
                          ) : null;
                        })}
                      </RadioGroup>
                    )}

                    {selectedAction == "exchange" && <>Exchange</>}
                  </ModalBody>
                  <ModalFooter>
                    <Button color="default" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button
                      color="primary"
                      onPress={() => sendSelectedAction()}
                    >
                      Action
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
          {/* Cunteractions --------------------> */}
          <CounterActionModal
            activeDiscussion={activeDiscussion}
            onCloseCounterActionMenu={onCloseCounterActionMenu}
            player={player}
            selectedCardNumber={selectedCardNumber}
            setSelectedCardNumber={setSelectedCardNumber}
            sendSelectedAction={sendSelectedAction}
          />
        </div>
      )}
    </div>
  );
};

export default RunningGame;
