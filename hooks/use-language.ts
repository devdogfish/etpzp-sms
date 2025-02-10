"use client";

import { i18nConfig } from "@/i18nConfig";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

type UseLanguageHelpers = {
  updateLanguageCookie: (newLocale: string) => void;
  normalizePath: (path: string) => string;
  hasLanguageCookie: () => boolean;
};

// You can pass in any value or a function and the time in milliseconds that you want it to updated/debounced after
export default function useLanguage(): UseLanguageHelpers {
  const { i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  // Helper function to normalize paths
  function normalizePath(path: string) {
    const currentLocale = i18n.language;
    const defaultLocale = i18n.options.fallbackLng as string;

    // Remove leading slash and split into segments
    const segments = path.replace(/^\//, "").split("/");

    // If the first segment is a locale and it's not the default, remove it
    if (segments[0] === currentLocale && currentLocale !== defaultLocale) {
      segments.shift();
    }

    return "/" + segments.join("/");
  }

  const updateLanguageCookie = (newLocale: string) => {
    console.log("updateLanguageCookie called");

    const currentLocale = i18n.language;
    // Set cookie for next-i18n-router
    const days = 30;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = date.toUTCString();
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

    if (
      currentLocale === i18nConfig.defaultLocale &&
      !i18nConfig.prefixDefault
    ) {
      router.push("/" + newLocale + pathname);
    } else {
      router.push(pathname.replace(`/${currentLocale}`, `/${newLocale}`));
    }
    router.refresh();
  };

  const hasLanguageCookie = () => {
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
    return cookies.some((cookie) =>
      cookie.startsWith("NEXT_LOCALE=")
    ) as boolean;
  };

  return { updateLanguageCookie, normalizePath, hasLanguageCookie };
}
