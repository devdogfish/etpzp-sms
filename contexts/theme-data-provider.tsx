"use client";

import setGlobalColorTheme from "@/lib/theme.colors";
import { ThemeColors, ThemeColorStateParams } from "@/types/theme";
import { ThemeProviderProps, useTheme } from "next-themes";
import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext<ThemeColorStateParams>(
  {} as ThemeColorStateParams
);

export default function ThemeDataProvider({ children }: ThemeProviderProps) {
  const getSavedThemeColor = () => {
    return (localStorage.getItem("primary_color_id") as ThemeColors) || "Zinc";
  };

  const [themeColor, setThemeColor] = useState<ThemeColors>(
    getSavedThemeColor() as ThemeColors
  );
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const { theme } = useTheme();
  useEffect(() => {
    localStorage.setItem("primary_color_id", themeColor.toString());
    setGlobalColorTheme(theme as "light" | "dark", themeColor);

    if (!isMounted) {
      setIsMounted(true);
    }
  }, [themeColor, theme, isMounted]);
  if (!isMounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ themeColor, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
