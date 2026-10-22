import { cookies, headers } from "next/headers";

import { LOCALE_COOKIE, resolveLocale } from "./config";
import en from "./en";
import es from "./es";

export async function getLocale() {
  const [cookieStore, headerList] = await Promise.all([cookies(), headers()]);

  return resolveLocale(
    cookieStore.get(LOCALE_COOKIE)?.value,
    headerList.get("accept-language"),
  );
}

export async function getDictionary() {
  return (await getLocale()) === "es" ? es : en;
}
