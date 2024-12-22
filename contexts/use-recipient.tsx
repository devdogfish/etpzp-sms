"use client";

import { validatePhoneNumber } from "@/lib/utils";
import { Recipient } from "@/types";
import parsePhoneNumberFromString from "libphonenumber-js";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

export const RecipientContext = createContext<RecipientContextValues | null>(
  null
);

type RecipientContextValues = {
  recipients: Recipient[];
  setRecipients: Dispatch<SetStateAction<Recipient[]>>;
  addRecipient: (recipient: Recipient) => void;
  removeRecipient: (recipient: Recipient) => void;
};

export function RecipientProvider({
  children,
  initialRecipients,
}: Readonly<{
  children: React.ReactNode;
  initialRecipients: Recipient[] | [];
}>) {
  const [recipients, setRecipients] = useState<Recipient[]>(initialRecipients);

  const addRecipient = (r: Recipient) => {
    setRecipients((prev) => [...prev, getValidatedRecipient(r)]);
  };
  const removeRecipient = (recipient: Recipient) => {
    setRecipients((prev) => prev.filter((r) => r !== recipient));
  };
  const getValidatedRecipient = (recipient: Recipient): Recipient => {
    const error = validatePhoneNumber(recipient.phone);
    if (!error) {
      return recipient;
    }

    const validatedRecipient = {
      ...recipient,
      error: error,
    };
    return validatedRecipient;
  };

  return (
    <RecipientContext.Provider
      value={{
        recipients,
        setRecipients,
        addRecipient,
        removeRecipient,
      }}
    >
      {children}
    </RecipientContext.Provider>
  );
}

export function useRecipient() {
  const context = useContext(RecipientContext);
  if (!context) {
    throw new Error("useRecipient must be used within a RecipientProvider");
  }
  return context;
}
