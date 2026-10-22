import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { fontDisplay, fontSans } from "@/config/fonts";
import { getDictionary, getLocale } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();

  return {
    title: { default: t.meta.title, template: "%s — Coup" },
    description: t.meta.description,
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#EEF2EF" },
    { media: "(prefers-color-scheme: dark)", color: "#16252C" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html suppressHydrationWarning lang={locale}>
      <head />
      <body
        className={clsx(
          "min-h-dvh bg-background text-foreground font-sans antialiased",
          fontSans.variable,
          fontDisplay.variable,
        )}
      >
        <Providers
          locale={locale}
          themeProps={{ attribute: "class", defaultTheme: "dark" }}
        >
          {children}
        </Providers>
      </body>
    </html>
  );
}
