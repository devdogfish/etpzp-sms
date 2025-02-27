"use client";

import type React from "react";
import {
  createContext,
  useState,
  useContext,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { toast } from "sonner";
import type { Message } from "@/types";
import type { DBContact } from "@/types/contact";
import type {
  DBRecipient,
  NewRecipient,
  RecipientWithContact,
} from "@/types/recipient";
import {
  convertToRecipient,
  matchContactsToRecipients,
  rankRecipients,
  validatePhoneNumber,
} from "@/lib/utils";
import { EMPTY_MESSAGE } from "@/app/[locale]/(root)/(other)/new-message/page";
import { useContacts } from "./use-contacts";
import { useTranslation } from "react-i18next";

// This is our biggest state where we store all data related to the active message, that should be persisted during draft saving re-renders
// MessageState is only used here & for EMPTY_MESSAGE
export type MessageState = Message & {
  // This is only for the front end composing of the message and will not be used on the server
  recipientInput: { value: string; isFocused: boolean; error?: string };
  serverStateErrors?: { [K in keyof Message]?: string[] };
};

type MessageContextValues = {
  // Message state
  message: MessageState;
  setMessage: React.Dispatch<React.SetStateAction<MessageState>>;

  // Recipient management
  recipients: NewRecipient[];
  addRecipient: (phone: string, contacts: DBContact[]) => void;
  removeRecipient: (
    recipient: NewRecipient,
    replaceWithRecipient?: NewRecipient
  ) => void;
  getValidatedRecipient: (recipient: NewRecipient) => NewRecipient;

  // Recipient search and suggestions
  searchRecipients: (searchTerm: string) => void;
  suggestedRecipients: RecipientWithContact[];

  // UI state
  moreInfoOn: NewRecipient | null;
  setMoreInfoOn: React.Dispatch<React.SetStateAction<NewRecipient | null>>;
  selectedPhone: string | undefined;
  updateSelectedPhone: (direction: "ArrowDown" | "ArrowUp") => void;

  revalidateRecipients: () => void;
  focusedInput: string | null;
  setFocusedInput: React.Dispatch<React.SetStateAction<string | null>>;
};
type ContextProps = {
  children: React.ReactNode;
  fetchedRecipients: DBRecipient[];
  initialMessage: MessageState;
};

const NewMessageContext = createContext<MessageContextValues | null>(null);

export function NewMessageProvider({
  fetchedRecipients,
  children,
  initialMessage,
}: ContextProps) {
  // Message state
  const [message, setMessage] = useState<MessageState>(
    initialMessage || EMPTY_MESSAGE
  );
  const { contacts } = useContacts();
  const { t } = useTranslation(["new-messages-page"]);
  // draft id saved here, so that it is persisted on revalidation.
  const recipients =
    // Associate contacts with matching phone numbers  to recipients
    matchContactsToRecipients(fetchedRecipients, contacts) || [];

  // UI state
  const [moreInfoOn, setMoreInfoOn] = useState<NewRecipient | null>(null);
  const [selectedPhone, setSelectedPhone] = useState<string | undefined>();
  const [suggestedRecipients, setSuggestedRecipients] = useState(recipients);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const usageRankedRecipients = rankRecipients(
    recipients as (RecipientWithContact & { last_used: Date })[]
  );
  // Memoized values
  const recommendedRecipients: RecipientWithContact[] = useMemo(() => {
    // adjust this to your liking
    const AMOUNT = 5;
    const topRecipients = usageRankedRecipients.slice(0, AMOUNT);

    if (topRecipients.length === AMOUNT) {
      // Check if there are enough topRecipients
      return matchContactsToRecipients(topRecipients, contacts);
    } else {
      // If not look for unused contacts to fill the gap
      const extraContacts = contacts
        // 1. Filter out the ones that already exist in the top recipients
        .filter(
          (contact) => !topRecipients.some((top) => top.phone === contact.phone)
        )
        // 2. Get only the extra ones we need to fill the gap
        .slice(0, AMOUNT - topRecipients.length)
        // 3. Adjust the contacts to match the other recipients in the array
        .map(({ id, phone, name, description }) => ({
          id,
          phone,
          contact: {
            id,
            name,
            phone,
            description,
          },
        }));

      console.log(`Recommended recipients in suggested:`);
      console.log([...topRecipients, ...extraContacts]);

      console.log("Recommended recipients");
      console.log(
        matchContactsToRecipients(
          [...topRecipients, ...extraContacts],
          contacts
        )
      );

      return matchContactsToRecipients(
        [...topRecipients, ...extraContacts],
        contacts
      ) as RecipientWithContact[];
    }
    // TODO: These re-rendering conditions need to be checked
  }, [contacts]);

  // Helper functions
  const getUniques = useCallback(
    (newRecipients: RecipientWithContact[]): RecipientWithContact[] => {
      return newRecipients.filter(
        (recipient) =>
          !message.recipients.some((r) => r.phone === recipient.phone)
      );
    },
    [message.recipients]
  );

  const revalidateRecipients = () => {
    setMessage((prevMessage) => ({
      // For some reason this inner part gets run twice while the outer function only gets run once
      ...prevMessage,
      recipients: prevMessage.recipients.map((recipient, index) => {
        const foundContact = contacts.find(
          (contact) => contact.phone === recipient.phone
        );

        if (foundContact) {
          return { ...recipient, contact: foundContact };
        } else return recipient;
      }),
    }));
  };

  const getValidatedRecipient = useCallback(
    (recipient: NewRecipient): NewRecipient => {
      const { type, message, formattedPhone } = validatePhoneNumber(
        recipient.phone
      );
      if (!type) return recipient;
      return { ...recipient, error: { type, message }, formattedPhone };
    },
    []
  );

  // Recipient management functions
  const addRecipient = (phone: string) => {
    console.log("trying to add new phone:", phone);

    if (message.recipients.some((item) => item.phone === phone)) {
      // I know this is not on the server, but I wanted to keep the same format
      return toast.error(t("server-duplicate_recipients_error"), {
        description: t("server-duplicate_recipients_error_caption"),
      });
    }

    setMessage((prev) => {
      const contactDetails = contacts.find(
        (contact) => contact.phone === phone
      );
      const newRecipient = contactDetails
        ? convertToRecipient(contactDetails)
        : { phone };
      return {
        ...prev,
        recipients: [...prev.recipients, getValidatedRecipient(newRecipient)],
      };
    });

    // Immediately update suggestedRecipients
    setSuggestedRecipients((prevSearched) =>
      getUniques(prevSearched.filter((r) => r.phone !== phone))
    );

    // Update selectedPhone to the next available recipient
    setSelectedPhone((prevSelected) => {
      if (prevSelected === phone) {
        const nextRecipient = suggestedRecipients.find(
          (r) => r.phone !== phone
        );
        return nextRecipient ? nextRecipient.phone : undefined;
      }
      return prevSelected;
    });
  };

  const removeRecipient = useCallback(
    (recipient: NewRecipient, replaceWithRecipient?: NewRecipient) => {
      setMessage((prev) => ({
        ...prev,
        recipients: prev.recipients
          .map((r) => (r === recipient ? replaceWithRecipient : r))
          .filter((r) => r !== undefined), // Filter out undefined values
      }));
      searchRecipients("");
    },
    []
  );

  // Search and suggestion functions
  const searchRecipients = (rawSearchTerm: string) => {
    const searchTerm = rawSearchTerm.trim().toLowerCase();
    console.log("searched recipients");
    if (!suggestedRecipients.length && !recommendedRecipients.length) {
      // Searched suggested- and recommended recipients are empty -
      // All recipients from the suggested list have already been added!
      return setSelectedPhone(undefined);
    }

    // There are still suggested recipients that haven't been added yet, so do additional checks
    if (searchTerm.length) {
      const filteredRecipients = getUniques(
        suggestedRecipients.filter(
          (recipient) =>
            (recipient.contact?.name?.toLowerCase().includes(searchTerm) ||
              recipient.phone.toLowerCase().includes(searchTerm)) &&
            !message.recipients.some((r) => r.phone === recipient.phone)
        )
      );
      setSuggestedRecipients(filteredRecipients);

      if (!filteredRecipients.length) {
        // No recipients found (the suggested panel will be hidden) - deselect the previous phone
        console.log(
          "Deselecting SelectedPhone because no filtered recipients were found"
        );

        setSelectedPhone(undefined);
      } else {
        setSelectedPhone(filteredRecipients[0]?.phone);
      }
    } else {
      setSuggestedRecipients(getUniques(recommendedRecipients));
      setSelectedPhone(recommendedRecipients[0]?.phone);
    }
  };

  // UI update functions
  const updateSelectedPhone = useCallback(
    (input: "ArrowDown" | "ArrowUp") => {
      setSelectedPhone((prevPhone) => {
        const currentIndex = suggestedRecipients.findIndex(
          (item) => item.phone === prevPhone
        );
        const length = suggestedRecipients.length;
        const newIndex =
          input === "ArrowUp"
            ? (currentIndex - 1 + length) % length
            : (currentIndex + 1) % length;
        return suggestedRecipients[newIndex]?.phone;
      });
    },
    [suggestedRecipients]
  );

  useEffect(() => {
    console.log(
      `Contacts got re-fetched, revalidating recipients with new contacts`
    );
    revalidateRecipients();
  }, [contacts]);

  return (
    <NewMessageContext.Provider
      value={{
        message,
        setMessage,
        recipients: message.recipients,
        addRecipient,
        removeRecipient,
        suggestedRecipients,
        searchRecipients,
        getValidatedRecipient,
        moreInfoOn,
        setMoreInfoOn,
        selectedPhone,
        updateSelectedPhone,
        revalidateRecipients,
        focusedInput,
        setFocusedInput,
      }}
    >
      {children}
    </NewMessageContext.Provider>
  );
}

export function useNewMessage() {
  const context = useContext(NewMessageContext);
  if (!context) {
    throw new Error("useNewMessage must be used within a NewMessageProvider");
  }
  return context;
}
