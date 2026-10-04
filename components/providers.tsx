"use client";

import type { ReactNode } from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { StoreProvider } from "@/components/store/store-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NextThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <StoreProvider>{children}</StoreProvider>
    </NextThemeProvider>
  );
}
