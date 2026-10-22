"use client";

import { useI18n } from "@/i18n";

export default function Error({ reset }: { reset: () => void }) {
  const { t } = useI18n();

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col items-start justify-center gap-5 px-6">
      <h1 className="display text-5xl">{t.error.title}</h1>
      <button
        className="rounded-lg bg-primary px-5 py-3 font-bold text-primary-foreground"
        type="button"
        onClick={() => {
          reset();
          window.location.reload();
        }}
      >
        {t.error.retry}
      </button>
    </main>
  );
}
