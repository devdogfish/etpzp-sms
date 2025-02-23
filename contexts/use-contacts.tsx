"use client";

import { fetchContacts } from "@/lib/db/contact";
import { DBContact } from "@/types/contact";
import React, { createContext, useContext, useEffect, useState } from "react";

type ContactContextValues = {
  contacts: DBContact[];
  refetchContacts: () => void;
};

const ContactsContext = createContext<ContactContextValues | null>(null);

export function ContactsProvider({
  children,
  initialContacts,
}: {
  children: Readonly<React.ReactNode>;
  initialContacts: DBContact[];
}) {
  const [contacts, setContacts] = useState<DBContact[]>(initialContacts);

  const refetchContacts = async () => {
    const newContacts = await fetchContacts();
    setContacts((prevContacts) => (newContacts ? newContacts : prevContacts));
  };

  return (
    <ContactsContext.Provider value={{ contacts, refetchContacts }}>
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
