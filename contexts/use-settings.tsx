"use client";

import { useThemeContext } from "@/contexts/theme-data-provider";
import { i18nConfig } from "@/i18n.config";
import { fetchUserSettings } from "@/lib/db/general";
import { usePathname, useRouter } from "next/navigation";
import { useTheme as useNextTheme } from "next-themes";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { LayoutType } from "@/types/user";
import useIsMounted from "@/hooks/use-mounted";

type SettingsState = {
  displayName?: string;
  profileColorId?: number;
  layout: LayoutType | undefined;
};

type SettingsContext = {
  settings: SettingsState;
  setSettings: Dispatch<SetStateAction<SettingsState>>;
  updateLanguageCookie: (newLocale: string) => void;
  normalizePath: (path: string) => string;
  // hasLanguageCookie: () => boolean; not used outside as of now
  syncWithDB: () => Promise<void>;
  resetLocalSettings: () => void;
};

const SettingsContext = createContext<SettingsContext | null>(null);

export function SettingsProvider({
  children,
  currentLocale,
}: {
  children: Readonly<React.ReactNode>;
  currentLocale: string;
}) {
  const isMounted = useIsMounted();
  // Localstorage state without theme color (primary_color) and theme mode because those are handled internally by our packages
  const [settings, setSettings] = useState<SettingsState>({
    displayName: localStorage.getItem("display_name") || undefined,
    profileColorId:
      Number(localStorage.getItem("profile_color_id")) || undefined,
    layout:
      (localStorage.getItem("appearance_layout") as LayoutType) || undefined,
  });

  const router = useRouter();
  const currentPathname = usePathname();
  const { setThemeColor } = useThemeContext();
  const { setTheme } = useNextTheme();

  // Helper function to normalize paths
  function normalizePath(path: string) {
    const defaultLocale = i18nConfig.defaultLocale as string;

    // Remove leading slash and split into segments
    const segments = path.replace(/^\//, "").split("/");

    // If the first segment is a locale and it's not the default, remove it
    if (segments[0] === currentLocale && currentLocale !== defaultLocale) {
      segments.shift();
    }

    return "/" + segments.join("/");
  }

  const updateLanguageCookie = (newLocale: string) => {
    // set cookie for next-i18n-router
    const days = 30;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = date.toUTCString();
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

    // redirect to the new locale path
    if (
      currentLocale === i18nConfig.defaultLocale &&
      !i18nConfig.prefixDefault
    ) {
      router.push("/" + newLocale + currentPathname);
    } else {
      router.push(
        currentPathname.replace(`/${currentLocale}`, `/${newLocale}`)
      );
    }

    router.refresh();
  };

  const hasLanguageCookie = () => {
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
    return cookies.some((cookie) =>
      cookie.startsWith("NEXT_LOCALE=")
    ) as boolean;
  };

  const syncWithDB = async () => {
    console.log("Sync with DB got called - refetching settings");
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
        appearance_layout,
      } = settings;
      // Profile
      localStorage.setItem("profile_color_id", profile_color_id.toString());
      localStorage.setItem("display_name", display_name);

      // Appearance
      setTheme(dark_mode === true ? "dark" : "light"); // theme is stored as strings because we are using next-themes
      setThemeColor(primary_color_id);
      localStorage.setItem("appearance_layout", appearance_layout);

      // Language - this comes last because it will refresh the page, which might cause issues
      updateLanguageCookie(lang);

      // Update components when localstorage settings change
      setSettings({
        displayName: display_name,
        profileColorId: profile_color_id,
        layout: appearance_layout,
      });
    } else {
      console.log(
        "An error during the settings fetch from the database occurred."
      );
    }
  };

  const resetLocalSettings = () => {
    localStorage.clear();
    setTheme("light");
    setThemeColor(1);
    updateLanguageCookie(i18nConfig.defaultLocale);
  };

  // This will also get triggered on load
  useEffect(() => {
    const referenceHeaderHeight = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--simple-header-height"
      ),
      10 // base 10 integer
    );
    if (settings.layout === "MODERN") {
      document.documentElement.style.setProperty(
        "--header-height",
        `${referenceHeaderHeight * 2}px`
      );
    } else if (settings.layout === "SIMPLE") {
      document.documentElement.style.setProperty(
        "--header-height",
        `${referenceHeaderHeight}px`
      );
    }
  }, [settings.layout]);
  useEffect(() => {
    if (isMounted) {
      if (
        localStorage.getItem("profile_color_id") == null ||
        localStorage.getItem("display_name") == null ||
        localStorage.getItem("primary_color_id") == null ||
        localStorage.getItem("theme") == null ||
        hasLanguageCookie() === false
      ) {
        syncWithDB();
      }
    }
  }, [isMounted]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setSettings,
        updateLanguageCookie,
        normalizePath,
        // hasLanguageCookie,
        syncWithDB,
        resetLocalSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("SettingsContext must be within SettingsProvider");
  }
  return context;
}
