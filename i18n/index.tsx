"use client";
import { createContext, useCallback, useContext, useState } from "react";

import en, { Dictionary } from "./en";
import es from "./es";
import { Locale, LOCALE_COOKIE } from "./config";

const dictionaries: Record<Locale, Dictionary> = { en, es };

type I18nContextValue = {
  locale: Locale;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = next;
  }, []);

  return (
    <I18nContext.Provider
      value={{ locale, t: dictionaries[locale], setLocale }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);

  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");

  return ctx;
}

export { dictionaries };
