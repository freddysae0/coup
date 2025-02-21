"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { createContext } from "react";
import { ToastProvider } from "@heroui/toast";
export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

/* Websockets context provider */

type WebSocketContextType = {
  socket: WebSocket | null;
};
const ws = new WebSocket("ws://backend-coup.freddyjs.es:8000/");
const WebSocketContext = createContext<WebSocketContextType | undefined>({
  socket: ws,
});

export const useWebSocket = () => {
  const context = React.useContext(WebSocketContext);

  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }

  return context;
};

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <WebSocketContext.Provider value={{ socket: ws }}>
      <ToastProvider />
      <HeroUIProvider navigate={router.push}>
        <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      </HeroUIProvider>
    </WebSocketContext.Provider>
  );
}
