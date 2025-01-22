"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type StringMap = { [key: string]: boolean };
type ContactModalContextValues = {
  modal: StringMap;
  setModal: React.Dispatch<React.SetStateAction<StringMap>>;
};

const ContactModalsContext = createContext<ContactModalContextValues | null>(
  null
);

export function ContactModalsProvider({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  const [modal, setModal] = useState<StringMap>({
    create: false,
    edit: false,
    select: false,
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
