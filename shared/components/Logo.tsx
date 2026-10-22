import clsx from "clsx";

/**
 * A court seal with a crown, cut through by a diagonal stroke: the coup.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={clsx("shrink-0", className)}
      fill="none"
      viewBox="0 0 40 40"
    >
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2.5" />
      <circle
        cx="20"
        cy="20"
        r="13.5"
        stroke="currentColor"
        strokeDasharray="1.5 2.5"
        strokeWidth="1.2"
      />
      <path
        d="M11.5 25.5 10 15l5.5 4.5L20 12l4.5 7.5L30 15l-1.5 10.5h-17Z"
        fill="currentColor"
      />
      <path
        d="M8 31 32 9"
        stroke="#E0306F"
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  );
}

export default function Logo({ className }: { className?: string }) {
  return (
    <span className={clsx("inline-flex items-center gap-2", className)}>
      <LogoMark className="h-8 w-8" />
      <span className="display text-2xl tracking-wide">Coup</span>
    </span>
  );
}
