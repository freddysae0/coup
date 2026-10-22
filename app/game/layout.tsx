import { Metadata } from "next";

import { getDictionary } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();

  return { title: t.lobby.title, robots: { index: false } };
}

/** The game always fits the screen: no page scroll on mobile or desktop. */
export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      {children}
    </div>
  );
}
