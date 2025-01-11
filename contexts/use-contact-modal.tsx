"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

type ModalState = {
  isOpen: boolean;
  message: string;
}

type ModalContextType = {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

// this is for the create contact modal
export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    message: "",
  });
  const [modal, setModal] = useState(false);

  return (
    <ModalContext.Provider value={{ modal, setModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export const useContactModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
