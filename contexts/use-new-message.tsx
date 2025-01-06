"use client";
import { Contact, Message, Recipient } from "@/types";
import React, { useContext, createContext, useState, useEffect } from "react";
import { validatePhoneNumber } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/use-localstorage";
import { defaultMessage, MessageSchema } from "@/lib/form.schemas";
import { z } from "zod";
import { toast } from "sonner";

type MessageContextValues = {
  message: Message;
  setMessage: React.Dispatch<React.SetStateAction<Message>>;
  recipients: Recipient[];
  addRecipient: (recipient: Recipient) => void;
  removeRecipient: (recipient: Recipient) => void;
  getValidatedRecipient: (recipient: Recipient) => void;
};

const NewMessageContext = createContext<MessageContextValues | null>(null);

export function NewMessageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [stored, setStored] = useLocalStorage<Message>(
    "new_message",
    defaultMessage
  );
  const [message, setMessage] = useState<Message>(stored); // stored is guaranteed to be defined

  const addRecipient = (recipient: Recipient) => {

    // Check if the recipient already exists in the array. The result is inverted because it returns the opposite from what we want.
    if (!message.recipients.some((item) => item.id === recipient.id)) {
      setMessage((prev) => {
        const updated = {
          ...prev,
          recipients: [...prev.recipients, getValidatedRecipient(recipient)],
        };
        setStored(updated);
        return updated;
      });
    } else {
      toast.error("You cannot add the same recipient multiple times");
    }
  };

  const removeRecipient = (recipient: Recipient) => {
    setMessage((prev) => {
      const updated = {
        ...prev,
        recipients: prev.recipients.filter((r) => r !== recipient),
      };
      setStored(updated);
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
      error: error,
    };
  };
  useEffect(() => {
    console.log(message.recipients);
  }, [message]);

  return (
    <NewMessageContext.Provider
      value={{
        message,
        setMessage,
        recipients: message.recipients,
        addRecipient,
        removeRecipient,
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
