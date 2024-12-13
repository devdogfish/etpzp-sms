import { useState, useCallback } from "react";
import { Message } from "@/lib/test-data.tsx";

type Config = {
  selected: Message["id"] | null;
};

export function useMessage(initialMessages: Message[]) {
  const [messages] = useState(initialMessages);
  const [config, setConfig] = useState<Config>({
    selected: messages.length > 0 ? messages[0].id : null,
  });

  const setSelected = useCallback((id: Message["id"] | null) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      selected: id,
    }));
  }, []);

  const selectedMessage =
    messages.find((message) => message.id === config.selected) || null;
  return { messages, selectedMessage, setSelected };
}
