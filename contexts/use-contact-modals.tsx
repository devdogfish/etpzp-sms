"use client";

import { StringBoolMap } from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";

type ContactModalContextValues = {
  modal: StringBoolMap;
  setModal: React.Dispatch<React.SetStateAction<StringBoolMap>>;
};

const ContactModalsContext = createContext<ContactModalContextValues | null>(
  null
);

// These are popups used to work with contacts (create, edit, insert into new message, view more info) used on /contacts and /new-message.
export function ContactModalsProvider({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  const [modal, setModal] = useState<StringBoolMap>({
    create: false,
    edit: false,
    insert: false,
    info: false,
  });

  return (
    <ContactModalsContext.Provider value={{ modal, setModal }}>
      {children}
    </ContactModalsContext.Provider>
  );
}

export function useContactModals() {
  const context = useContext(ContactModalsContext);
  if (!context) {
    throw new Error(
      "ContactModalsContext must be within ContactModalsProvider"
    );
  }
  return context;
}
