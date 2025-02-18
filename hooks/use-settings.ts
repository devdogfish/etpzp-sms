"use client";
import { useThemeContext } from "@/contexts/theme-data-provider";
import { i18nConfig } from "@/i18n.config";
import { fetchUserSettings } from "@/lib/db/general";
import { usePathname, useRouter } from "next/navigation";
import { useTheme as useNextTheme } from "next-themes";

type SettingsContext = {
  updateLanguageCookie: (newLocale: string) => void;
  normalizePath: (path: string) => string;
  hasLanguageCookie: () => boolean;
  syncWithDB: () => Promise<void>;
  resetLocalSettings: () => void;
};

// Helper functions for updating, reading, or deleting settings stored in cookies or localstorage.
export default function useSettings(currentLocale: string): SettingsContext {
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
      } = settings;
      // Profile
      localStorage.setItem("profile_color_id", profile_color_id.toString());
      localStorage.setItem("display_name", display_name);

      // Appearance
      setTheme(dark_mode === true ? "dark" : "light"); // theme is stored as strings because we are using next-themes
      setThemeColor(primary_color_id);

      // Language - this comes last because it will refresh the page, which might cause issues
      updateLanguageCookie(lang);

      // dispatch event so that components which use settings data get updated
      window.dispatchEvent(new Event("settingsUpdated"));
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

  return {
    updateLanguageCookie,
    normalizePath,
    hasLanguageCookie,
    syncWithDB,
    resetLocalSettings,
  };
}
