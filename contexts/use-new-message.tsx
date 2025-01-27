"use client";

import type { Message } from "@/types";
import type {
  DBContactRecipient,
  NewRecipient,
  ProcessedDBContactRecipient,
} from "@/types/recipient";
import React, {
  useContext,
  createContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import {
  convertToRecipient,
  generateUniqueId,
  validatePhoneNumber,
} from "@/lib/utils";
import { toast } from "sonner";
import { getTopRecipients } from "@/lib/recipients.filters";
import { DBContact } from "@/types/contact";

type MessageContextValues = {
  message: Message;
  setMessage: React.Dispatch<React.SetStateAction<Message>>;

  recipients: NewRecipient[];
  addRecipient: (phone: string, contacts: DBContact[]) => void;
  removeRecipient: (recipient: NewRecipient) => void;
  // getValidatedRecipient: (recipient: NewRecipient) => void;

  searchedRecipients: DBContactRecipient[];
  searchRecipients: (searchTerm: string) => void;

  getValidatedRecipient: (recipient: NewRecipient) => NewRecipient;

  moreInfoOn: NewRecipient | null;
  setMoreInfoOn: Dispatch<SetStateAction<NewRecipient | null>>;
};

const NewMessageContext = createContext<MessageContextValues | null>(null);

export function NewMessageProvider({
  allSuggestedRecipients,
  allContacts,
  children,
}: {
  allSuggestedRecipients: ProcessedDBContactRecipient[];
  allContacts: DBContact[];
  children: React.ReactNode;
}) {
  const [message, setMessage] = useState<Message>({
    id: generateUniqueId(),
    sender: "ETPZP",
    recipients: [],
    subject: "",
    body: "",
  });
  const [moreInfoOn, setMoreInfoOn] = useState<NewRecipient | null>(null);

  const topRecipients = getTopRecipients(allSuggestedRecipients);
  const recommendedRecipients = topRecipients.length
    ? topRecipients
    : // specify here how many contacts you want in the case of no existing recipients but unused existing contacts.
      allContacts.slice(0, 4).map(({ id, phone, name, description }) => ({
        id,
        phone,
        contact_id: id,
        contact_name: name,
        contact_description: description || null,
      }));

  const [searchedRecipients, setSearchedRecipients] = useState(
    recommendedRecipients
  );

  const addRecipient = (phone: string, contacts: DBContact[]) => {
    searchRecipients("");
    // Check if the recipient already exists in the array. We can use either `.some()` or `.find()`
    if (!message.recipients.some((item) => item.phone === phone)) {
      setMessage((prev) => {
        let newRecipient: NewRecipient;

        const contactDetails = contacts.find(
          (contact) => contact.phone === phone
        );

        if (contactDetails) {
          // Contact found:
          newRecipient = convertToRecipient(contactDetails);
        } else {
          // Contact not found:
          newRecipient = { phone };
        }
        return {
          ...prev,
          recipients: [...prev.recipients, getValidatedRecipient(newRecipient)],
        };
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

  const searchRecipients = (rawSearchTerm: string) => {
    const searchTerm = rawSearchTerm.trim().toLowerCase();

    if (searchTerm.length) {
      setSearchedRecipients(
        allSuggestedRecipients.filter((recipient) => {
          return (
            recipient.contact_name?.toLowerCase().includes(searchTerm) ||
            recipient.phone.toLowerCase().includes(searchTerm)
          );
        })
      );
    } else {
      setSearchedRecipients(recommendedRecipients);
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
        searchedRecipients,
        searchRecipients,
        getValidatedRecipient,
        moreInfoOn,
        setMoreInfoOn,
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
