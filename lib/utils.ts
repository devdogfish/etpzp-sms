import { DBContact } from "./../types/contact";
import parsePhoneNumber, {
  CountryCode,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  DBRecipient,
  NewRecipient,
  RecipientWithContact,
} from "@/types/recipient";
import { DBMessage } from "@/types";
import { ActionResponse } from "@/types/action";
import { toast } from "sonner";
import { enUS, pt, de } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

export function validatePhoneNumber(phone: string): NewRecipient {
  const countryCode: CountryCode = "PT";

  const phoneNumber = parsePhoneNumber(phone, countryCode);

  let properties: {
    isValid: boolean;
    formattedPhone?: string;
    error?: {
      type: "error" | "warning";
      message: string;
    };
  } = {
    isValid: false,
    formattedPhone: phoneNumber?.formatInternational(),
  };

  if (phoneNumber?.isValid()) {
    if (phoneNumber.country === countryCode) {
      properties = {
        isValid: true,
      };
    } else {
      properties.isValid = true;
      properties.error = {
        type: "warning",
        message:
          "tooltip-not_portuguese_number",
      };
    }
  } else {
    properties.isValid = false;
    properties.error = {
      type: "error",
      message: "tooltip-invalid_phone_number",
    };
  }
  return { ...properties, phone };
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
  const validatedRecipient = validatePhoneNumber(phone);
  return {
    ...validatedRecipient,
    contact: {
      id,
      name,
      phone,
      description,
    },
  };
}

export function toastActionResult(
  result: ActionResponse<any>,
  translate?: (translationKey: string) => string
) {
  if (!Array.isArray(result.message) || !result.message)
    throw new Error("Toast message must be an array of strings.");
  if (!result.message.length)
    return console.log("FAILED TOAST_ACTION_RESULT: message array is empty");

  // thankfully, this doesn't throw an error
  if (translate) {
    if (result.success) {
      toast.success(translate(result.message[0]), {
        description: translate(result.message[1]),
      });
    } else {
      toast.error(translate(result.message[0]), {
        description: translate(result.message[1]),
      });
    }
  } else {
    if (result.success) {
      toast.success(result.message[0], { description: result.message[1] });
    } else {
      toast.error(result.message[0], { description: result.message[1] });
    }
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

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getDateFnsLocale(i18nLocale: string) {
  let dateFnsLocale;
  switch (i18nLocale) {
    case "pt":
      dateFnsLocale = pt;
      break;
    case "en":
      dateFnsLocale = enUS;
      break;
    case "de":
      dateFnsLocale = de;
      break;
    default:
      dateFnsLocale = pt;
  }
  if (!dateFnsLocale) throw new Error("Invalid locale passed in");
  return dateFnsLocale;
}

export function matchContactsToRecipients(
  rawRecipients: DBRecipient[],
  contacts: DBContact[]
) {
  // Return recipients if no data to filter
  if (!rawRecipients.length || !contacts.length)
    return rawRecipients as RecipientWithContact[];

  return rawRecipients.map((recipient) => ({
    ...recipient,
    contact: contacts.find((contact) => contact.phone === recipient.phone),
  })) as RecipientWithContact[];
}

export function rankRecipients(
  data: (RecipientWithContact & { last_used: Date })[]
) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const processedData = data.reduce((acc, item) => {
    if (!acc[item.phone]) {
      acc[item.phone] = {
        id: item.id,
        phone: item.phone,
        usage_count: 0,
      };
    }

    if (new Date(item.last_used) >= oneWeekAgo) {
      acc[item.phone].usage_count++;
    }

    return acc;
  }, {} as Record<string, RecipientWithContact & { usage_count: number }>);

  return Object.values(processedData).sort((a, b) => {
    // Sort by usage count (descending)
    if (b.usage_count !== a.usage_count) {
      return b.usage_count - a.usage_count;
    }
    // Sort by whether they have contact info
    if (!!b.contact !== !!a.contact) {
      return b.contact ? 1 : -1;
    }
    // Sort alphabetically by contact name or phone
    return (a.contact?.id || a.phone).localeCompare(b.contact?.id || b.phone);
  });
}

// Shuffle the array using Fisher-Yates algorithm
export function shuffleArray(arr: any[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
  }
}
