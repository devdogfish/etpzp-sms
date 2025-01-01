"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Message } from "@/lib/data.test";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

type MessageContextType = {
  messages: Message[];
  selected: Message | null;
  // setMessages: (messages: Message[]) => void;
  // setSelected: (message: Message | null) => void;
  navigateToMessage: (message: Message) => void;
};

const MessageContext = createContext<MessageContextType | null>(null);

export function MessageProvider({
  children,
  initialMessages,
}: {
  children: React.ReactNode;
  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [selected, setSelected] = useState<Message | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { i18n } = useTranslation();

  // Instead of wrapping each message in a <a> tag, we are doing the redirection to / here,
  // because whenever a user selects a message this code will run anyway. This solution is genius!
  const navigateToMessage = useCallback(
    (message: Message) => {
      if (message && message.id) {
        setSelected(message);

        const lang = i18n.language;
        const newPath = `/${lang}/${message.id}`;
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
