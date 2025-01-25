"use client";
import { Contact, SuggestedRecipient, Message, Recipient } from "@/types";
import React, { useContext, createContext, useState, useEffect } from "react";
import { generateUniqueId, validatePhoneNumber } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/use-localstorage";
import { MessageSchema } from "@/lib/form.schemas";
import { z } from "zod";
import { toast } from "sonner";

type MessageContextValues = {
  message: Message;
  // setMessage: React.Dispatch<React.SetStateAction<Message>>;
  recipients: Recipient[];
  addRecipient: (recipient: Recipient) => void;
  removeRecipient: (recipient: Recipient) => void;
  // getValidatedRecipient: (recipient: Recipient) => void;

  filteredSuggestedRecipients: SuggestedRecipient[];
  filterSuggestedRecipients: (searchTerm: string) => void;
};

const NewMessageContext = createContext<MessageContextValues | null>(null);

export function NewMessageProvider({
  allSuggestedRecipients,
  children,
}: {
  allSuggestedRecipients: SuggestedRecipient[];
  children: React.ReactNode;
}) {
  const [message, setMessage] = useState<Message>({
    id: generateUniqueId(),
    sender: "ETPZP",
    recipients: [],
    subject: "",
    body: "",
  }); // stored is guaranteed to be defined
  const [filteredSuggestedRecipients, setFilteredSuggestedRecipients] =
    useState(allSuggestedRecipients);

  const addRecipient = (recipient: Recipient) => {
    // Check if the recipient already exists in the array. The result is inverted because it returns the opposite from what we want.
    if (
      !message.recipients.find((item) => item.id === recipient.contactId || item.id === recipient.id) &&
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

  const removeRecipient = (recipient: Recipient) => {
    setMessage((prev) => {
      const updated = {
        ...prev,
        recipients: prev.recipients.filter((r) => r !== recipient),
      };
      return updated;
    });
  };

  const getValidatedRecipient = (recipient: Recipient): Recipient => {
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
    const searchTerm = rawSearchTerm.trim();
    if (searchTerm === "") {
      // return suggested recipients
      setFilteredSuggestedRecipients(allSuggestedRecipients);
    } else {
      setFilteredSuggestedRecipients(
        allSuggestedRecipients.filter(
          (recipient) =>
            recipient.contact_name?.includes(searchTerm.toLowerCase()) ||
            recipient.phone.includes(searchTerm.toLowerCase())
        )
      );
    }
  };

  // DEBUG
  useEffect(() => {
    console.log(allSuggestedRecipients);
  }, [allSuggestedRecipients]);

  return (
    <NewMessageContext.Provider
      value={{
        message,
        recipients: message.recipients,
        addRecipient,
        removeRecipient,
        filteredSuggestedRecipients,
        filterSuggestedRecipients,
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
