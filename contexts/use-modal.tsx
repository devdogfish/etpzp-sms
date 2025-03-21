"use client";

import { Modals, StringBoolMap } from "@/types";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

const ModalContext = createContext<{
  modal: Modals;
  setModal: Dispatch<SetStateAction<Modals>>;
  scheduleDropdown: boolean;
  setScheduleDropdown: Dispatch<SetStateAction<boolean>>;
} | null>(null);

// These are popups used to work with contacts (create, edit, insert into new message, view more info) used on /contacts and /new-message.
export function ModalProvider({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  const [modal, setModal] = useState<Modals>({
    schedule: false,
    scheduleAlert: false,
    contact: { create: false, edit: false, insert: false, info: false },
  });
  const [scheduleDropdown, setScheduleDropdown] = useState(false);

  // useEffect(() => {
  //   console.log(modal);
  // }, [modal]);

  return (
    <ModalContext.Provider
      value={{ modal, setModal, scheduleDropdown, setScheduleDropdown }}
    >
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
