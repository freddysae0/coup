import { useEffect, useState } from "react";
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import clsx from "clsx";

import { cardsImg } from "../RunningGame.utils";

import { Role } from "@/types/game";

type CardPickerProps = {
  isOpen: boolean;
  title: string;
  description: string;
  /** Cards to choose from; null entries are shown but not selectable. */
  cards: (Role | null)[];
  /** How many cards must be selected. */
  count: number;
  confirmLabel: string;
  testIdPrefix: string;
  onConfirm: (indices: number[]) => void;
};

/** Non-dismissable modal used both to lose an influence and to exchange. */
export default function CardPicker({
  isOpen,
  title,
  description,
  cards,
  count,
  confirmLabel,
  testIdPrefix,
  onConfirm,
}: CardPickerProps) {
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => setSelected([]), [isOpen, cards.join()]);

  const toggle = (index: number) => {
    setSelected((prev) => {
      if (prev.includes(index)) return prev.filter((i) => i !== index);
      if (count === 1) return [index];
      if (prev.length >= count) return prev;

      return [...prev, index];
    });
  };

  return (
    <Modal
      hideCloseButton
      isKeyboardDismissDisabled
      isDismissable={false}
      isOpen={isOpen}
      size="lg"
    >
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          <p className="text-default-500 text-sm">{description}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {cards.map((role, index) =>
              role ? (
                <button
                  key={index}
                  aria-pressed={selected.includes(index)}
                  className={clsx(
                    "rounded-xl border-4 transition-transform hover:-translate-y-1",
                    selected.includes(index)
                      ? "border-primary"
                      : "border-transparent",
                  )}
                  data-testid={`${testIdPrefix}-${index}`}
                  type="button"
                  onClick={() => toggle(index)}
                >
                  <Image alt={role} src={cardsImg[role]} width={110} />
                  <span className="text-sm">{role}</span>
                </button>
              ) : null,
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            data-testid={`${testIdPrefix}-confirm`}
            isDisabled={selected.length !== count}
            onPress={() => onConfirm(selected)}
          >
            {confirmLabel}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
