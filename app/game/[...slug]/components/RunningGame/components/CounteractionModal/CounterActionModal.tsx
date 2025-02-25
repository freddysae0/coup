import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
  RadioGroup,
} from "@heroui/react";
import React from "react";
import { discussionMeta } from "../../RunningGame.utils";
import { Action, Card, Discussion, Player } from "@/types/game";
import { StyledRadioButton } from "../../RunningGame";

interface CounterActionModalProps extends Omit<ModalProps, "children"> {
  activeDiscussion: Discussion | null;
  selectedCardNumber: number;
  setSelectedCardNumber: React.Dispatch<React.SetStateAction<number>>;
  sendSelectedAction: (action: Action, resolve?: boolean) => void;
  onCloseCounterActionMenu: () => void;
  player: Player;
}

const CounterActionModal: React.FC<CounterActionModalProps> = ({
  isOpen,
  activeDiscussion,
  player,
  selectedCardNumber,
  sendSelectedAction,
  onCloseCounterActionMenu,
  setSelectedCardNumber: setSelectedCard,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <Modal
      hideCloseButton={true}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      isOpen={isOpen}
      size={"md"}
      onClose={onClose}
    >
      {activeDiscussion && (
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {discussionMeta[
                  activeDiscussion.action ? activeDiscussion.action : "Default"
                ][activeDiscussion.step ? activeDiscussion.step - 1 : 0].title(
                  activeDiscussion.player.name
                )}{" "}
              </ModalHeader>
              <ModalBody className="max-h-[80vh] overflow-auto ">
                <RadioGroup
                  label={
                    discussionMeta[
                      activeDiscussion.action
                        ? activeDiscussion.action
                        : "Default"
                    ][activeDiscussion.step ? activeDiscussion.step - 1 : 0]
                      .description
                  }
                  value={selectedCardNumber.toString()}
                  onChange={(e) => setSelectedCard(parseInt(e.target.value))}
                >
                  {activeDiscussion.action == "Lose card" &&
                    player.cards.map((card, index) => (
                      <StyledRadioButton
                        key={index}
                        description={`Action: ${card.action}, Counteraction: ${card.counteraction}`}
                        value={index.toString()}
                      >
                        {card.name}
                      </StyledRadioButton>
                    ))}
                </RadioGroup>
              </ModalBody>
              <ModalFooter>
                {discussionMeta[
                  activeDiscussion.action ? activeDiscussion.action : "Default"
                ][activeDiscussion.step ? activeDiscussion.step - 1 : 0]
                  .cancelButton && (
                  <Button
                    color="default"
                    variant="light"
                    onPress={() => {
                      sendSelectedAction(activeDiscussion.action, true);
                      onCloseCounterActionMenu();
                    }}
                  >
                    {
                      discussionMeta[
                        activeDiscussion.action
                          ? activeDiscussion.action
                          : "Default"
                      ][activeDiscussion.step ? activeDiscussion.step - 1 : 1]
                        .cancelButton
                    }
                  </Button>
                )}
                <Button
                  color="primary"
                  onPress={() => {
                    sendSelectedAction(activeDiscussion.action);
                    onCloseCounterActionMenu();
                  }}
                >
                  {
                    discussionMeta[
                      activeDiscussion.action
                        ? activeDiscussion.action
                        : "Default"
                    ][activeDiscussion.step ? activeDiscussion.step - 1 : 0]
                      .okButton
                  }
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      )}
    </Modal>
  );
};

export default CounterActionModal;
