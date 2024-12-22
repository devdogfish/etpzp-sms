import parsePhoneNumber, { CountryCode } from "libphonenumber-js";
import { clsx, type ClassValue } from "clsx";
import { i18n } from "i18next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to normalize paths
export function normalizePath(path: string, i18nData: i18n) {
  const currentLocale = i18nData.language;
  const defaultLocale = i18nData.options.fallbackLng as string;

  // Remove leading slash and split into segments
  const segments = path.replace(/^\//, "").split("/");

  // If the first segment is a locale and it's not the default, remove it
  if (segments[0] === currentLocale && currentLocale !== defaultLocale) {
    segments.shift();
  }

  return "/" + segments.join("/");
}

function getTime() {
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hourCycle: "h23",
    timeZone: "UTC",
  };

  const date = new Date();
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

export function isNumericString(str: string): boolean {
  const num = parseInt(str, 10);
  return !isNaN(num) && num.toString() === str;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateUniqueId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function validatePhoneNumber(input: string): { type: "error" | "warning"; message: string } | undefined {
  const countryCode: CountryCode = "PT";

  try {
    const phoneNumber = parsePhoneNumber(input, countryCode);

    if (phoneNumber?.isValid()) {
      if (phoneNumber.country === countryCode) {
        return;
      } else {
        return {
          type: "warning",
          message:
            "Warning: The phone number is valid but not from the specified country.",
        };
      }
    } else {
      return {
        type: "error",
        message: "The phone number is invalid.",
      };
    }
  } catch (error) {
    return {
      type: "error",
      message: "The phone number is invalid.",
    };
  }
}
