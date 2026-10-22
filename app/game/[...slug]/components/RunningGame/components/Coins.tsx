import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

/** Coin counter that pops when the amount changes. */
export default function Coins({
  value,
  size = 16,
  className,
  label,
}: {
  value: number;
  size?: number;
  className?: string;
  label: string;
}) {
  return (
    <span
      aria-label={label}
      className={clsx("inline-flex items-center gap-1 tabular-nums", className)}
    >
      <span className="relative inline-flex overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={value}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            initial={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </span>
      <Image alt="" height={size} src="/icons/coin.svg" width={size} />
    </span>
  );
}
