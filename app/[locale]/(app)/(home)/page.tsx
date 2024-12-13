"use client";
import { MessageDisplay } from "@/components/message-display";
import { useMessage } from "@/contexts/use-message";

export default function MessagePage() {
  const { selected } = useMessage();
  return <MessageDisplay message={selected} />;
}
