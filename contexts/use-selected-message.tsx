"use client";

import React, { createContext, useContext } from "react";
import { useMessage } from "@/hooks/use-message";
import { Message } from "@/lib/test-data";

type SelectedMessageContextType = ReturnType<any>;

const SelectedMessageContext = createContext<SelectedMessageContextType | null>(
  null
);

export function SelectedMessageProvider({
  children,
  selectedMessage,
}: {
  children: React.ReactNode;
  selectedMessage: Message;
}) {
  return (
    <SelectedMessageContext.Provider value={selectedMessage}>
      {children}
    </SelectedMessageContext.Provider>
  );
}

export function useSelectedMessageContext() {
  const context = useContext(SelectedMessageContext);
  if (!context) {
    throw new Error("useMessageContext must be used within a MessageProvider");
  }
  return context;
}
