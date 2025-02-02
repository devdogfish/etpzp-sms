"use client";

import type React from "react";
import {
  createContext,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { toast } from "sonner";
import type { Message } from "@/types";
import type { DBContact } from "@/types/contact";
import type { DBContactRecipient, NewRecipient } from "@/types/recipient";
import {
  convertToRecipient,
  generateUniqueId,
  validatePhoneNumber,
} from "@/lib/utils";

type MessageContextValues = {
  // Message state
  message: Message;
  setMessage: React.Dispatch<React.SetStateAction<Message>>;

  // Recipient management
  recipients: NewRecipient[];
  addRecipient: (phone: string, contacts: DBContact[]) => void;
  removeRecipient: (recipient: NewRecipient) => void;
  getValidatedRecipient: (recipient: NewRecipient) => NewRecipient;

  // Recipient search and suggestions
  searchedRecipients: DBContactRecipient[];
  searchRecipients: (searchTerm: string) => void;

  // UI state
  moreInfoOn: NewRecipient | null;
  setMoreInfoOn: React.Dispatch<React.SetStateAction<NewRecipient | null>>;
  selectedPhone: string | undefined;
  updateSelectedPhone: (direction: "ArrowDown" | "ArrowUp") => void;
};

const NewMessageContext = createContext<MessageContextValues | null>(null);

type ProviderProps = {
  suggestedRecipients: {
    all: DBContactRecipient[];
    alphabetical: DBContactRecipient[];
    mostUsed: DBContactRecipient[];
  };
  allContacts: DBContact[];
  children: React.ReactNode;
};

export function NewMessageProvider({
  suggestedRecipients,
  allContacts,
  children,
}: ProviderProps) {
  // Message state
  const [message, setMessage] = useState<Message>({
    id: generateUniqueId(),
    sender: "ETPZP",
    recipients: [],
    subject: "",
    body: "",
    sendDelay: 0,
  });

  // UI state
  const [moreInfoOn, setMoreInfoOn] = useState<NewRecipient | null>(null);
  const [selectedPhone, setSelectedPhone] = useState<string | undefined>();
  const [searchedRecipients, setSearchedRecipients] = useState<
    DBContactRecipient[]
  >([]);

  // Memoized values
  const recommendedRecipients: DBContactRecipient[] = useMemo(() => {
    // adjust this to your liking
    const amount = 5;
    const topRecipients = suggestedRecipients.mostUsed.slice(0, amount);
    const remainingCount = amount - topRecipients.length;

    if (remainingCount <= 0) return topRecipients;

    const additionalRecipients = allContacts
      .filter(
        (contact) => !topRecipients.some((top) => top.contact_id === contact.id)
      )
      .slice(0, remainingCount)
      .map(({ id, phone, name, description }) => ({
        id,
        phone,
        contact_id: id,
        contact_name: name,
        contact_description: description || null,
      }));

    return [...topRecipients, ...additionalRecipients];
  }, [suggestedRecipients.mostUsed, allContacts]);

  // Helper functions
  const getUniques = useCallback(
    (newRecipients: DBContactRecipient[]): DBContactRecipient[] => {
      return newRecipients.filter(
        (recipient) =>
          !message.recipients.some((r) => r.phone === recipient.phone)
      );
    },
    [message.recipients]
  );

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

      // Immediately update searchedRecipients
      setSearchedRecipients((prevSearched) =>
        getUniques(prevSearched.filter((r) => r.phone !== phone))
      );

      // Update selectedPhone to the next available recipient
      setSelectedPhone((prevSelected) => {
        if (prevSelected === phone) {
          const nextRecipient = searchedRecipients.find(
            (r) => r.phone !== phone
          );
          return nextRecipient ? nextRecipient.phone : undefined;
        }
        return prevSelected;
      });
    },
    [message.recipients, getValidatedRecipient, searchedRecipients, getUniques]
  );

  const removeRecipient = useCallback((recipient: NewRecipient) => {
    setMessage((prev) => ({
      ...prev,
      recipients: prev.recipients.filter((r) => r !== recipient),
    }));
    searchRecipients("");
  }, []);

  // Search and suggestion functions
  const searchRecipients = (rawSearchTerm: string) => {
    const searchTerm = rawSearchTerm.trim().toLowerCase();

    if (searchTerm.length && suggestedRecipients.all.length) {
      const filteredRecipients = getUniques(
        suggestedRecipients.all.filter(
          (recipient) =>
            (recipient.contact_name?.toLowerCase().includes(searchTerm) ||
              recipient.phone.toLowerCase().includes(searchTerm)) &&
            !message.recipients.some((r) => r.phone === recipient.phone)
        )
      );
      setSearchedRecipients(filteredRecipients);
      setSelectedPhone(filteredRecipients[0]?.phone);
    } else {
      setSearchedRecipients(getUniques(recommendedRecipients));
      setSelectedPhone(recommendedRecipients[0]?.phone);
    }
  };

  // UI update functions
  const updateSelectedPhone = useCallback(
    (input: "ArrowDown" | "ArrowUp") => {
      setSelectedPhone((prevPhone) => {
        const currentIndex = searchedRecipients.findIndex(
          (item) => item.phone === prevPhone
        );
        const length = searchedRecipients.length;
        const newIndex =
          input === "ArrowUp"
            ? (currentIndex - 1 + length) % length
            : (currentIndex + 1) % length;
        return searchedRecipients[newIndex]?.phone;
      });
    },
    [searchedRecipients]
  );

  // Context value
  const contextValue = useMemo(
    () => ({
      message,
      setMessage,
      recipients: message.recipients,
      addRecipient,
      removeRecipient,
      searchedRecipients,
      searchRecipients,
      getValidatedRecipient,
      moreInfoOn,
      setMoreInfoOn,
      selectedPhone,
      updateSelectedPhone,
    }),
    [
      message,
      addRecipient,
      removeRecipient,
      searchedRecipients,
      searchRecipients,
      getValidatedRecipient,
      moreInfoOn,
      selectedPhone,
      updateSelectedPhone,
    ]
  );
  return (
    <NewMessageContext.Provider value={contextValue}>
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
