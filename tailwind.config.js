import { heroui } from "@heroui/theme";

// Palette lifted from the card art: the slate and cyan swirls of the card
// back, the mint banners, the Contessa's magenta script and gold coins.
const palette = {
  slate: "#16252C",
  slateRaised: "#1E323B",
  court: "#45A9DD",
  mint: "#A9DCCB",
  magenta: "#E0306F",
  ducat: "#E9B23C",
  paper: "#EEF2EF",
  ink: "#16252C",
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
      },
      colors: {
        court: palette.court,
        mint: palette.mint,
        magenta: palette.magenta,
        ducat: palette.ducat,
        paper: palette.paper,
        ink: palette.ink,
      },
      keyframes: {
        "pulse-ring": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(69,169,221,0.55)" },
          "50%": { boxShadow: "0 0 0 6px rgba(69,169,221,0)" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 1.8s ease-in-out infinite",
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      layout: {
        radius: { small: "6px", medium: "10px", large: "16px" },
      },
      themes: {
        dark: {
          colors: {
            background: palette.slate,
            foreground: palette.paper,
            content1: palette.slateRaised,
            content2: "#253C46",
            content3: "#2E4752",
            divider: "rgba(238,242,239,0.12)",
            focus: palette.court,
            primary: { DEFAULT: palette.court, foreground: "#0B1A21" },
            secondary: { DEFAULT: palette.mint, foreground: "#0B1A21" },
            danger: { DEFAULT: palette.magenta, foreground: "#FFFFFF" },
            warning: { DEFAULT: palette.ducat, foreground: "#1D1400" },
            success: { DEFAULT: "#5CC9A0", foreground: "#0B1A21" },
          },
        },
        light: {
          colors: {
            background: palette.paper,
            foreground: palette.ink,
            content1: "#FFFFFF",
            content2: "#E3EAE6",
            content3: "#D5DFDA",
            divider: "rgba(22,37,44,0.14)",
            focus: "#1D77A8",
            primary: { DEFAULT: "#1D77A8", foreground: "#FFFFFF" },
            secondary: { DEFAULT: "#2F8C73", foreground: "#FFFFFF" },
            danger: { DEFAULT: "#C41E5B", foreground: "#FFFFFF" },
            warning: { DEFAULT: "#B9840F", foreground: "#FFFFFF" },
            success: { DEFAULT: "#22895F", foreground: "#FFFFFF" },
          },
        },
      },
    }),
  ],
};
