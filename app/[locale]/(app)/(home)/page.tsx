"use client";
import MessageContainer from "@/components/message-container";
import { MessageDisplay } from "@/components/message-display";
import { useSelectedMessageContext } from "@/contexts/use-selected-message";
import { useMessage } from "@/hooks/use-message";
import { Message, messages } from "@/lib/test-data";

export default function MessagePage() {
  const { selectedMessage } = useSelectedMessageContext();
  return <MessageDisplay message={selectedMessage} />;
}
