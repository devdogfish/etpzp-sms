import { useState, useCallback } from "react";
import { Mail, mails } from "@/lib/test-data.tsx";

type Config = {
  selected: Mail["id"] | null;
};

const useMailState = () => {
  const [config, setConfig] = useState<Config>({
    selected: mails[0].id,
  });

  const setSelected = useCallback((id: Mail["id"] | null) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      selected: id,
    }));
  }, []);

  return [config, setSelected] as const;
};

export function useMail() {
  return useMailState();
}
