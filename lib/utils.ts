import { DBContact } from "./../types/contact";
import parsePhoneNumber, {
  CountryCode,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import { clsx, type ClassValue } from "clsx";
import { i18n } from "i18next";
import { twMerge } from "tailwind-merge";
import { NewRecipient } from "@/types/recipient";
import { DBMessage } from "@/types";
import { ActionResponse } from "@/types/action";
import { toast } from "sonner";

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

export function validatePhoneNumber(input: string): {
  type: "error" | "warning" | undefined;
  message: string | undefined;
  formattedPhone: string | undefined;
} {
  const countryCode: CountryCode = "PT";

  const phoneNumber = parsePhoneNumber(input, countryCode);
  const formattedPhone = phoneNumber?.formatInternational();

  let type: "error" | "warning";
  let message: string;
  if (phoneNumber?.isValid()) {
    if (phoneNumber.country === countryCode) {
      return { type: undefined, message: undefined, formattedPhone: undefined };
    } else {
      type = "warning";
      message =
        "Warning: The phone number is valid but not from the specified country.";
    }
  } else {
    type = "error";
    message = "The phone number is invalid.";
  }
  return {
    type,
    message,
    formattedPhone,
  };
}

export function searchMessages(
  messages: DBMessage[],
  searchTerm: string,
  currentPage?: number
) {
  // Convert searchTerm to lowercase for case-insensitive comparison
  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  // Filter messages based on userId and search term
  const filteredMessages = messages.filter(
    (message) =>
      message.subject?.toLowerCase().includes(lowerCaseSearchTerm) ||
      message.body.toLowerCase().includes(lowerCaseSearchTerm) ||
      message.status.toLowerCase() === lowerCaseSearchTerm // Assuming status is also part of the search
  );

  return filteredMessages;
}

export function searchContacts(
  contacts: DBContact[],
  searchTerm: string | null,
  currentPage?: number
) {
  if (!searchTerm) return contacts;
  // Convert searchTerm to lowercase for case-insensitive comparison
  const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();

  // Filter contacts based on userId and search term
  const filteredContacts = contacts.filter(
    (contact) =>
      (contact.name &&
        contact.name.toLowerCase().includes(lowerCaseSearchTerm)) ||
      contact.phone.toLowerCase().includes(lowerCaseSearchTerm)
  );

  return filteredContacts;
}

export function formatPhone(phone: string): string | undefined {
  const parsedPhone = parsePhoneNumberFromString(phone);
  if (parsedPhone && parsedPhone.isValid()) {
    return parsedPhone.number;
  } else {
    return undefined;
  }
}

export function getNameInitials(fullName: string | null | undefined) {
  // Split the full name into parts
  if (!fullName) return "";

  const nameParts = fullName.trim().split(/\s+/);

  // Get the first letter of the first name
  const firstInitial = nameParts[0][0].toUpperCase();

  // If there's only one name, return just that initial
  if (nameParts.length === 1) {
    return firstInitial;
  }

  // Get the first letter of the last name
  const lastInitial = nameParts[nameParts.length - 1][0].toUpperCase();

  // Return the initials
  return firstInitial + lastInitial;
}

// Convert contact -> recipient, because `addRecipient` function expects a recipient type of NewRecipient not of contact type.
export function convertToRecipient(contact: DBContact): NewRecipient {
  const { id, name, phone, description } = contact;
  return {
    phone,
    contactId: id,
    contactName: name,
    contactDescription: description,
  };
}

export function toastActionResult(result: ActionResponse<any>) {
  if (!Array.isArray(result.message) || !result.message)
    throw new Error("Toast message must be an array of strings.");

  // thankfully, this doesn't throw an error
  if (result.success) {
    toast.success(result.message[0], { description: result.message[1] });
  } else {
    toast.error(result.message[0], { description: result.message[1] });
  }
}

export function getComplexObjectFromCookie(cookieName: string) {
  const nameEQ = `${cookieName}=`;
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(nameEQ)) {
      const cookieValue = cookie.substring(nameEQ.length);
      try {
        // Decode and parse the JSON string into an object
        return JSON.parse(decodeURIComponent(cookieValue));
      } catch (error) {
        console.error("Error parsing cookie:", error);
        return null;
      }
    }
  }
  return null;
}
