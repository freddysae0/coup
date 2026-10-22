import { Big_Shoulders_Display, Public_Sans } from "next/font/google";

// Condensed civic display face for headlines; Public Sans (the US government
// typeface) for everything you read. Coup is a game about seizing government.
export const fontDisplay = Big_Shoulders_Display({
  subsets: ["latin"],
  weight: ["600", "800", "900"],
  variable: "--font-display",
});

export const fontSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});
