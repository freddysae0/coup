"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ToastProvider } from "@heroui/toast";
import { MotionConfig } from "framer-motion";

import { I18nProvider } from "@/i18n";
import { Locale } from "@/i18n/config";

export interface ProvidersProps {
  children: React.ReactNode;
  locale: Locale;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

// The WebSocket lives in the game page (see shared/useCoupSocket.ts), so it is
// only opened in the browser and only while a game is on screen.
export function Providers({ children, locale, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <I18nProvider initialLocale={locale}>
      <HeroUIProvider navigate={router.push}>
        <MotionConfig reducedMotion="user">
          <ToastProvider placement="top-center" />
          <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
        </MotionConfig>
      </HeroUIProvider>
    </I18nProvider>
  );
}
