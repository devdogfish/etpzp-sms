"use client";

import setGlobalColorTheme from "@/lib/theme.colors";
import { ThemeProviderProps, useTheme as useNextTheme } from "next-themes";
import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeColorStateParams = {
  themeColor: number;
  setThemeColor: React.Dispatch<React.SetStateAction<number>>;
};
const ThemeContext = createContext<ThemeColorStateParams>(
  {} as ThemeColorStateParams
);

export default function ThemeDataProvider({ children }: ThemeProviderProps) {
  // if (typeof localStorage === "undefined") {
  //   return null;
  // }
  const getSavedThemeColor = (): number => {
    return Number(localStorage.getItem("primary_color_id")) || 1;
  };

  const { theme } = useNextTheme();
  const [themeColor, setThemeColor] = useState<number>(getSavedThemeColor());
  const [isMounted, setIsMounted] = useState<boolean>(false);

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
