"use client";

import { Modals, StringBoolMap } from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";

const ModalContext = createContext<{
  modal: Modals;
  setModal: React.Dispatch<React.SetStateAction<Modals>>;
} | null>(null);

// These are popups used to work with contacts (create, edit, insert into new message, view more info) used on /contacts and /new-message.
export function ModalProvider({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  const [modal, setModal] = useState<Modals>({
    schedule: false,
    contact: { create: false, edit: false, insert: false, info: false },
  });

  // useEffect(() => {
  //   console.log(modal);
  // }, [modal]);

  return (
    <ModalContext.Provider value={{ modal, setModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("ModalContext must be within ModalProvider");
  }
  return context;
}
