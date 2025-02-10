"use client";

import useLanguage from "@/hooks/use-language";
import { fetchUserSettings } from "@/lib/db/general";
import setGlobalColorTheme from "@/lib/theme.colors";
import { ThemeProviderProps, useTheme } from "next-themes";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type ThemeColorStateParams = {
  themeColor: number;
  setThemeColor: React.Dispatch<React.SetStateAction<number>>;
  syncWithDB: () => Promise<void>;
};
const ThemeContext = createContext<ThemeColorStateParams>(
  {} as ThemeColorStateParams
);

export default function ThemeDataProvider({ children }: ThemeProviderProps) {
  const getSavedThemeColor = (): number => {
    return Number(localStorage.getItem("primary_color_id")) || 1;
  };

  const { theme } = useTheme();
  const [themeColor, setThemeColor] = useState<number>(getSavedThemeColor());
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { i18n } = useTranslation();
  const { updateLanguageCookie, hasLanguageCookie } = useLanguage();

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

  const syncWithDB = async () => {
    console.log("Sync with DB got called");
    if (hasLanguageCookie() === false) {
      console.log("Syncing with DB because NEXT_LOCALE cookie doesn't exist");
    }
    const settings = await fetchUserSettings();

    if (settings) {
      const {
        profile_color_id,
        display_name,
        dark_mode,
        primary_color_id,
        lang,
      } = settings;
      // Profile
      localStorage.setItem("profile_color_id", profile_color_id.toString());
      localStorage.setItem("display_name", display_name);

      // Appearance
      localStorage.setItem("theme", dark_mode === true ? "dark" : "light"); // theme is stored as strings because we are using next-themes
      localStorage.setItem("primary_color_id", primary_color_id.toString());

      updateLanguageCookie(lang);

      // dispatch event so that components which use settings data get updated
      window.dispatchEvent(new Event("settingsUpdated"));
    } else {
      console.log(
        "An error during the settings fetch from the database occurred."
      );
    }
  };

  return (
    <ThemeContext.Provider value={{ themeColor, setThemeColor, syncWithDB }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
