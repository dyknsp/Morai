"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Переключить цветовую тему"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {ready && theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  );
}
