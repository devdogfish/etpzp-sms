"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { DBMessage } from "@/types";

type MessageContextType = {
  messages: DBMessage[];
  selected: DBMessage | null;
  // setMessages: (messages: DBMessage[]) => void;
  // setSelected: (message: DBMessage | null) => void;
  navigateToMessage: (message: DBMessage) => void;
};

const MessageContext = createContext<MessageContextType | null>(null);

export function MessageProvider({
  children,
  initialMessages,
}: {
  children: React.ReactNode;
  initialMessages: DBMessage[];
}) {
  const { i18n } = useTranslation();
  const [messages, setMessages] = useState<DBMessage[]>(initialMessages);
  const [selected, setSelected] = useState<DBMessage | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split("/").filter((segment) => segment !== "");
  const location = segments[0];
  
  // Instead of wrapping each message in a <a> tag, we are doing the redirection to / here,
  // because whenever a user selects a message this code will run anyway. This solution is genius!
  const navigateToMessage = useCallback(
    (message: DBMessage) => {
      if (message && message.id) {
        setSelected(message);

        console.log("pathname");

        console.log(pathname);

        const lang = i18n.language;
        const newPath = `/${lang}/${location}/${message.id}`;
        if (pathname !== newPath) {
          router.push(newPath);
        }
      } else {
        throw new Error(
          `Error while redirecting to message: Invalid message ${message}`
        );
      }
    },
    [router, pathname, i18n.language]
  );

  const contextValue = {
    messages,
    selected,
    // setMessages,
    // setSelected,
    navigateToMessage,
  };

  return (
    <MessageContext.Provider value={contextValue}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessagesContext must be used within a MessageProvider");
  }
  return context;
}
