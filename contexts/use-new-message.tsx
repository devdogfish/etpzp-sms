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
import useIsMounted from "@/hooks/use-mounted";

type MessageContextValues = {
  // Message state
  message: Message;
  setMessage: React.Dispatch<React.SetStateAction<Message>>;

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

  // Current message id (saved as draft until it is sent)
  draftId: string | undefined;
  setDraftId: React.Dispatch<React.SetStateAction<string | undefined>>;

  revalidateRecipients: () => void;
};

const NewMessageContext = createContext<MessageContextValues | null>(null);

type ContextProps = {
  children: React.ReactNode;
  fetchedContacts: DBContact[];
  fetchedRecipients: DBRecipient[];
  initialMessage: Message;
};

export function NewMessageProvider({
  fetchedContacts,
  fetchedRecipients,
  children,
  initialMessage,
}: ContextProps) {
  // Message state
  const [message, setMessage] = useState<Message>(initialMessage);
  // draft id saved here, so that it is persisted on revalidation.
  const [draftId, setDraftId] = useState<string>();
  const recipients =
    // Associate contacts with matching phone numbers  to recipients
    matchContactsToRecipients(fetchedRecipients, fetchedContacts) || [];

  // UI state
  const [moreInfoOn, setMoreInfoOn] = useState<NewRecipient | null>(null);
  const [selectedPhone, setSelectedPhone] = useState<string | undefined>();
  const [suggestedRecipients, setSuggestedRecipients] = useState(recipients);

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
      return matchContactsToRecipients(topRecipients, fetchedContacts);
    } else {
      // If not look for unused contacts to fill the gap
      const extraContacts = fetchedContacts
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

      return matchContactsToRecipients(
        [...topRecipients, ...extraContacts],
        fetchedContacts
      ) as RecipientWithContact[];
    }
    // TODO: These re-rendering conditions need to be checked
  }, [fetchedContacts]);

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
    console.log("RevalidateRecipients called");
    console.log(
      `Checking ${message.recipients.length} recipients for contacts`
    );

    setMessage((prevMessage) => ({
      // For some reason this inner part gets run twice while the outer function only gets run once
      ...prevMessage,
      recipients: prevMessage.recipients.map((recipient, index) => {
        const foundContact = fetchedContacts.find(
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
  const addRecipient = useCallback(
    (phone: string, contacts: DBContact[]) => {
      if (message.recipients.some((item) => item.phone === phone)) {
        toast.error("Duplicate recipients", {
          description: "You cannot add the same recipient multiple times",
        });
        return;
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
    },
    [message.recipients, getValidatedRecipient, suggestedRecipients, getUniques]
  );

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

    if (searchTerm.length && suggestedRecipients.length) {
      const filteredRecipients = getUniques(
        suggestedRecipients.filter(
          (recipient) =>
            (recipient.contact?.name?.toLowerCase().includes(searchTerm) ||
              recipient.phone.toLowerCase().includes(searchTerm)) &&
            !message.recipients.some((r) => r.phone === recipient.phone)
        )
      );
      setSuggestedRecipients(filteredRecipients);
      setSelectedPhone(filteredRecipients[0]?.phone);
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
    console.log(`FETCHED CONTACTS CHANGED`, fetchedContacts);
    revalidateRecipients();
  }, [fetchedContacts]);

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
        draftId,
        setDraftId,
        revalidateRecipients,
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
