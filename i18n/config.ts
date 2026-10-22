export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];
export const LOCALE_COOKIE = "coup-locale";

/** Cookie wins; otherwise the first supported language the browser asks for. */
export function resolveLocale(
  cookie: string | undefined,
  acceptLanguage: string | null,
): Locale {
  if (cookie && (LOCALES as readonly string[]).includes(cookie)) {
    return cookie as Locale;
  }
  const preferred = (acceptLanguage ?? "")
    .split(",")
    .map((part) => part.split(";")[0].trim().slice(0, 2).toLowerCase());

  return (preferred.find((l) => (LOCALES as readonly string[]).includes(l)) ??
    "en") as Locale;
}
