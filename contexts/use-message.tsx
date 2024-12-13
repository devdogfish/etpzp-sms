"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Message } from "@/lib/test-data";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

type MessageContextType = {
  messages: Message[];
  selected: Message | null;
  setMessages: (messages: Message[]) => void;
  setSelected: (message: Message | null) => void;
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
  useEffect(() => {
    if (selected) {
      const lang = i18n.language;
      const newPath = `/${lang}`;
      if (pathname !== newPath) {
        router.push(newPath);
      }
    }
  }, [selected]);

  const contextValue = {
    messages,
    selected,
    setMessages,
    setSelected,
  };

  return (
    <MessageContext.Provider value={contextValue}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessage() {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessageContext must be used within a MessageProvider");
  }
  return context;
}
