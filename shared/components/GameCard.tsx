"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import clsx from "clsx";

import { Role } from "@/types/game";

export const cardsImg: Record<Role | "Backcard", string> = {
  Duke: "/cards/Duque.png",
  Captain: "/cards/Capitan.png",
  Assassin: "/cards/Assasin.png",
  Contessa: "/cards/Condesa.png",
  Ambassador: "/cards/Embajador.png",
  Backcard: "/cards/Backcard.png",
};

// Card art is 449 × 768.
export const CARD_RATIO = 449 / 768;

type GameCardProps = {
  /** null shows the card back. */
  character: Role | null;
  /** Lost influence: face up, desaturated. */
  revealed?: boolean;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/**
 * A character card. When `revealed` flips to true the card turns over with a
 * 3D flip, so everyone sees which influence was lost.
 */
export default function GameCard({
  character: role,
  revealed = false,
  alt,
  className,
  sizes = "200px",
  priority,
}: GameCardProps) {
  const src = role ? cardsImg[role] : cardsImg.Backcard;

  return (
    <motion.div
      key={`${role ?? "back"}-${revealed}`}
      animate={{ rotateY: 0, opacity: 1 }}
      className={clsx(
        "relative aspect-[449/768] overflow-hidden rounded-[7%] shadow-md shadow-black/30 [transform-style:preserve-3d]",
        revealed && "grayscale-[85%] opacity-70",
        className,
      )}
      initial={revealed ? { rotateY: 90, opacity: 0.4 } : false}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <Image
        fill
        alt={alt}
        className="object-cover"
        draggable={false}
        priority={priority}
        sizes={sizes}
        src={src}
      />
      {revealed && (
        // The same magenta slash as the logo: this influence has fallen.
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <path
            d="M8 92 92 8"
            stroke="#E0306F"
            strokeLinecap="round"
            strokeWidth="6"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}
    </motion.div>
  );
}
