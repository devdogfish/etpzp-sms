"use client";
import { Message, Recipient } from "@/types";
import React, { useContext, createContext, useState } from "react";
import { validatePhoneNumber } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/use-localstorage";
import { defaultMessage, MessageSchema } from "@/lib/form.schemas";
import { z } from "zod";

type MessageContextValues = {
  message: Message;
  setMessage: React.Dispatch<React.SetStateAction<Message>>;
  recipients: Recipient[];
  addRecipient: (recipient: Recipient) => void;
  removeRecipient: (recipient: Recipient) => void;
};

const NewMessageContext = createContext<MessageContextValues | null>(null);

export function NewMessageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [stored, setStored] = useLocalStorage<z.infer<typeof MessageSchema>>(
    "new_message",
    defaultMessage
  );

  // stored is guaranteed to be defined
  const [message, setMessage] = useState<Message>(stored); 

  const addRecipient = (r: Recipient) => {
    setMessage((prev) => {
      const updated = {
        ...prev,
        to: [...prev.to, getValidatedRecipient(r)],
      };
      setStored(updated);
      return updated;
    });
  };

  const removeRecipient = (recipient: Recipient) => {
    
    setMessage((prev) => {
      const updated = {
        ...prev,
        to: prev.to.filter((r) => r !== recipient),
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

 

  return (
    <NewMessageContext.Provider
      value={{
        message,
        setMessage,
        recipients: message.to,
        addRecipient,
        removeRecipient,
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
