"use client";
import NextLink from "next/link";

import GameCard from "@/shared/components/GameCard";
import { useI18n } from "@/i18n";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <main className="mx-auto flex min-h-dvh max-w-4xl flex-col items-start justify-center gap-8 px-6 md:flex-row md:items-center">
      <GameCard alt="" character={null} className="w-32 -rotate-6 md:w-44" />
      <div className="flex flex-col items-start gap-5">
        <p className="display text-7xl text-primary">404</p>
        <h1 className="display text-5xl">{t.notFound.title}</h1>
        <NextLink
          className="rounded-lg bg-primary px-5 py-3 font-bold text-primary-foreground"
          href="/"
        >
          {t.notFound.back}
        </NextLink>
      </div>
    </main>
  );
}
