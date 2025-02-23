"use client";

import { fetchContacts } from "@/lib/db/contact";
import { DBContact } from "@/types/contact";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type ContactContextValues = {
  contacts: DBContact[];
  refetchContacts: () => void;
  contactFetchError: string | null;
};

const ContactsContext = createContext<ContactContextValues | null>(null);

export function ContactsProvider({
  children,
  initialContacts,
}: {
  children: Readonly<React.ReactNode>;
  initialContacts: DBContact[] | undefined;
}) {
  const { t } = useTranslation(["contacts-page"]);
  const [contacts, setContacts] = useState<DBContact[]>(initialContacts || []);
  const unknownFetchError = t("fetch_error");
  const [error, setError] = useState<string | null>(
    initialContacts === undefined ? unknownFetchError : null
  );

  const refetchContacts = async () => {
    const newContacts = await fetchContacts();
    setContacts(newContacts || []);

    if (newContacts === undefined) {
      setError(unknownFetchError);
    }
  };

  return (
    <ContactsContext.Provider
      value={{ contacts, refetchContacts, contactFetchError: error }}
    >
      {children}
    </ContactsContext.Provider>
  );
}

export function useContacts() {
  const context = useContext(ContactsContext);
  if (!context) {
    throw new Error("ContactsContext must be within ContactsProvider");
  }
  return context;
}
