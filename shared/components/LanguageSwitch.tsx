"use client";
import clsx from "clsx";

import { useI18n } from "@/i18n";
import { LOCALES } from "@/i18n/config";

/** Two-way segmented switch: EN | ES. */
export default function LanguageSwitch({ className }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      aria-label={t.nav.language}
      className={clsx(
        "inline-flex rounded-full border border-divider p-0.5 text-xs font-semibold",
        className,
      )}
      role="group"
    >
      {LOCALES.map((l) => (
        <button
          key={l}
          aria-pressed={locale === l}
          className={clsx(
            "rounded-full px-2.5 py-1 uppercase transition-colors",
            locale === l
              ? "bg-foreground text-background"
              : "text-foreground/70 hover:text-foreground",
          )}
          lang={l}
          type="button"
          onClick={() => setLocale(l)}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
