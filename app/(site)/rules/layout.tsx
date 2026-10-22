import { Metadata } from "next";

import { getDictionary } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();

  return { title: t.nav.rules, description: t.rules.lead };
}

export default function RulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
