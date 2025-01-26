"use client";

import type { Message } from "@/types";
import type {
  NewRecipient,
  ProcessedDBContactRecipient,
} from "@/types/recipient";
import React, { useContext, createContext, useState, useEffect } from "react";
import { generateUniqueId, validatePhoneNumber } from "@/lib/utils";
import { toast } from "sonner";
import { getTopRecipients } from "@/lib/recipients.filters";

type MessageContextValues = {
  message: Message;
  setMessage: React.Dispatch<React.SetStateAction<Message>>;

  recipients: NewRecipient[];
  addRecipient: (recipient: NewRecipient) => void;
  removeRecipient: (recipient: NewRecipient) => void;
  // getValidatedRecipient: (recipient: NewRecipient) => void;

  filteredSuggestedRecipients: ProcessedDBContactRecipient[];
  filterSuggestedRecipients: (searchTerm: string) => void;

  getValidatedRecipient: (recipient: NewRecipient) => NewRecipient;
};

const NewMessageContext = createContext<MessageContextValues | null>(null);

export function NewMessageProvider({
  allSuggestedRecipients,
  children,
}: {
  allSuggestedRecipients: ProcessedDBContactRecipient[];
  children: React.ReactNode;
}) {
  const [message, setMessage] = useState<Message>({
    id: generateUniqueId(),
    sender: "ETPZP",
    recipients: [],
    subject: "",
    body: "",
  }); // stored is guaranteed to be defined

  // TODO: return suggested recipients
  const recommendedRecipients = getTopRecipients(allSuggestedRecipients);
  console.log(recommendedRecipients);
  

  const [filteredSuggestedRecipients, setFilteredSuggestedRecipients] =
    useState(recommendedRecipients);

  const addRecipient = (recipient: NewRecipient) => {
    // Check if the recipient already exists in the array. The result is inverted because it returns the opposite from what we want.
    if (
      !message.recipients.find(
        (item) => item.id === recipient.contactId || item.id === recipient.id
      ) &&
      !message.recipients.find((item) => item.phone === recipient.phone)
    ) {
      setMessage((prev) => {
        const updated = {
          ...prev,
          recipients: [...prev.recipients, getValidatedRecipient(recipient)],
        };
        return updated;
      });
    } else {
      toast.error("Duplicate recipients", {
        description: "You cannot add the same recipient multiple times",
      });
    }
  };

  const removeRecipient = (recipient: NewRecipient) => {
    setMessage((prev) => {
      const updated = {
        ...prev,
        recipients: prev.recipients.filter((r) => r !== recipient),
      };
      return updated;
    });
  };

  const getValidatedRecipient = (recipient: NewRecipient): NewRecipient => {
    const error = validatePhoneNumber(recipient.phone);
    if (!error) {
      return recipient;
    }

    return {
      ...recipient,
      error,
    };
  };

  const filterSuggestedRecipients = (rawSearchTerm: string) => {
    const searchTerm = rawSearchTerm.trim().toLowerCase();

    if (searchTerm === "") {
      setFilteredSuggestedRecipients(recommendedRecipients);
    } else {
      setFilteredSuggestedRecipients(
        allSuggestedRecipients.filter((recipient) => {
          return (
            recipient.contact_name?.toLowerCase().includes(searchTerm) ||
            recipient.phone.toLowerCase().includes(searchTerm)
          );
        })
      );
    }
  };

  return (
    <NewMessageContext.Provider
      value={{
        message,
        setMessage,
        recipients: message.recipients,
        addRecipient,
        removeRecipient,
        filteredSuggestedRecipients,
        filterSuggestedRecipients,
        getValidatedRecipient,
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
