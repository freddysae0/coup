import { IconSvgProps } from "@/types";
import { ActionType } from "@/types/game";

// Drawn in the same vocabulary as the ribbons on the cards: slotted coins,
// an open hand, a skull, an arrow and a pair of cards. Everything is
// currentColor so the icon follows the button it sits on.

/** A coin with the vertical slot the card coins have, cut out of the disc. */
const coin = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z` +
  `M${cx - r * 0.17} ${cy - r * 0.5}h${r * 0.34}v${r}h${-r * 0.34}Z`;

/** Open hand, palm up, cuff on the left. */
const HAND =
  "M3 31h6v12H3Z" +
  "M10 32.5c3-1.6 6.6-2.5 10-2.5h7.5a2.8 2.8 0 0 1 0 5.6H21" +
  "l.4 1h8.4l9.8-6.2a2.9 2.9 0 0 1 3.4 4.6L33 42.5c-1.4 1-3 1.5-4.7 1.5H10Z";

const SKULL =
  "M24 6a12 12 0 0 0-12 12c0 4.3 2 7.3 4.6 9.2V32a2 2 0 0 0 2 2h10.8a2 2 0 0 0 2-2v-4.8C34 25.3 36 22.3 36 18A12 12 0 0 0 24 6Z" +
  "M18.6 16.4a3.3 3.3 0 1 0 0 6.6a3.3 3.3 0 1 0 0-6.6Z" +
  "M29.4 16.4a3.3 3.3 0 1 0 0 6.6a3.3 3.3 0 1 0 0-6.6Z" +
  "M24 23.5l-2 3.6h4Z" +
  "M21 30.4h1.6V34H21ZM25.4 30.4H27V34h-1.6Z";

function Income() {
  return (
    <>
      <path d={HAND} />
      <path d={coin(27, 15, 6.5)} fillRule="evenodd" />
    </>
  );
}

function ForeignAid() {
  return (
    <>
      <path d={HAND} />
      <path d={coin(20, 18, 6)} fillRule="evenodd" />
      <path d={coin(33, 11, 6)} fillRule="evenodd" />
    </>
  );
}

function Tax() {
  return (
    <>
      <path d={HAND} />
      <path d={coin(16, 20, 5.3)} fillRule="evenodd" />
      <path d={coin(28, 15, 5.3)} fillRule="evenodd" />
      <path d={coin(22, 5.6, 5.3)} fillRule="evenodd" />
    </>
  );
}

/** Coins → skull, like the Assassin ribbon. */
function PayToKill({ big }: { big: boolean }) {
  return (
    <>
      {big ? (
        <>
          <circle cx="9" cy="24" r="8" />
          <text
            fill="var(--icon-bg, #fff)"
            fontFamily="system-ui, sans-serif"
            fontSize="12"
            fontWeight="800"
            textAnchor="middle"
            x="9"
            y="28.3"
          >
            7
          </text>
        </>
      ) : (
        <>
          <path d={coin(9, 15.5, 5.4)} fillRule="evenodd" />
          <path d={coin(5.6, 27, 5.4)} fillRule="evenodd" />
          <path d={coin(13.4, 33, 5.4)} fillRule="evenodd" />
        </>
      )}
      <path
        d="M18.5 24h7.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.4"
      />
      <path d="M29 24l-4.4-3.6v7.2Z" />
      <g transform="translate(19 8) scale(0.78)">
        <path d={SKULL} fillRule="evenodd" />
      </g>
    </>
  );
}

/** A hand swooping down on the coins, the Captain ribbon's grab. */
function Steal() {
  return (
    <>
      <path d="M17 2h16v6H17Z" />
      <path d="M14 10h22a2 2 0 0 1 2 2v6a6 6 0 0 1-2.5 4.9L38 29a2.4 2.4 0 0 1-4.4 1.8l-3-6H14a2 2 0 0 1-2-2V12a2 2 0 0 1 2-2Z" />
      <rect height="11" rx="2.4" width="4.8" x="12.4" y="20" />
      <rect height="13" rx="2.4" width="4.8" x="18.6" y="20" />
      <rect height="11.5" rx="2.4" width="4.8" x="24.8" y="20" />
      <path d={coin(14, 41, 5.6)} fillRule="evenodd" />
      <path d={coin(27, 41, 5.6)} fillRule="evenodd" />
    </>
  );
}

/** Two cards with an arrow in and an arrow out, like the Ambassador. */
function Exchange() {
  const arrow = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2.6,
  };

  return (
    <>
      <rect
        height="22"
        rx="3"
        transform="rotate(-12 17 25)"
        width="15"
        x="9.5"
        y="14"
      />
      <rect
        height="22"
        rx="3"
        stroke="var(--icon-bg, #fff)"
        strokeWidth="2.2"
        transform="rotate(10 31 25)"
        width="15"
        x="21.5"
        y="14"
      />
      <path {...arrow} d="M14 6.5h17M27 3l4 3.5-4 3.5" />
      <path {...arrow} d="M34 42H17M21 38.5L17 42l4 3.5" />
    </>
  );
}

const ICONS: Record<ActionType, () => JSX.Element> = {
  Income,
  "Foreign aid": ForeignAid,
  Coup: () => <PayToKill big />,
  Tax,
  Assassinate: () => <PayToKill big={false} />,
  Steal,
  Exchange,
};

export default function ActionIcon({
  action,
  size = 24,
  ...props
}: IconSvgProps & { action: ActionType }) {
  const Glyph = ICONS[action];

  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      focusable="false"
      height={size}
      viewBox="0 0 48 48"
      width={size}
      {...props}
    >
      <Glyph />
    </svg>
  );
}
