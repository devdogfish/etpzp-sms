"use client";

import { Input } from "@/components/ui/input";
import { updateSetting } from "@/lib/actions/user.actions";
import { cn } from "@/lib/utils";
import React, { SetStateAction } from "react";
import {
  useState,
  useTransition,
  type FormEvent,
  type InputHTMLAttributes,
  useEffect,
} from "react";
import type { UpdateSettingResponse } from "@/types/action";
import { useSettings } from "@/contexts/use-settings";

export type RenderInputArgs = {
  value: string;
  onChange: (newValue: string) => void;
  onBlur: (e?: FormEvent<Element>, submittedValue?: string) => void;
  id: string;
  initialValue?: string;
  className?: string;
  isPending: boolean;
  setServerState?: React.Dispatch<SetStateAction<UpdateSettingResponse>>;
};

type SettingItemProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  initialValue?: string;
  label?: string;
  caption?: string;
  inputType?: string;
  renderInput?: (props: RenderInputArgs) => React.ReactNode;
  onUpdate?: (newValue: string) => void;
};

const initialState: UpdateSettingResponse = {
  success: false,
  input: "",
};

export function SettingItem({
  name,
  initialValue = "",
  label,
  caption,
  inputType = "text",
  renderInput,
  onUpdate,
  ...inputProps
}: SettingItemProps) {
  const [value, setValue] = useState<string>(initialValue);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [serverState, setServerState] = useState(initialState);
  const { setSettings } = useSettings();

  async function handleSubmit(e?: FormEvent, submittedValue?: string) {
    if (e) e.preventDefault();
    setIsPending(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("value", submittedValue || value);

    const result = await updateSetting(formData);
    setServerState(result);
    if (onUpdate) onUpdate(value);

    // these are currently the settings that we store in localstorage as well as state
    const stateSettingNames = [
      "display_name",
      "profile_color_id",
      "appearance_layout",
    ];
    if (stateSettingNames.includes(name)) {
      // 1. Update localstorage itself
      localStorage.setItem(name, result.data || initialValue);

      // 2. Update state since localStorage changes don't trigger re-renders.
      setSettings((prev) => ({
        displayName: name === "display_name" ? result.data : prev.displayName,
        profileColorId:
          name === "profile_color_id" ? result.data : prev.profileColorId,
        layout: name === "appearance_layout" ? result.data : prev.layout,
      }));
    }
    setIsPending(false);
  }

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  const defaultInput = (
    <Input
      id={name}
      type={inputType}
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={(e?: any, v?: any) => handleSubmit(e, v)}
      style={{ width: "max-content" }}
      disabled={isPending}
      {...inputProps}
    />
  );

  const inputElement = renderInput
    ? renderInput({
        value,
        onChange: handleChange,
        onBlur: (e, submittedValue) => handleSubmit(e, submittedValue),
        id: name,
        initialValue,
        isPending,
        setServerState,
      })
    : defaultInput;

  return (
    <form
      onSubmit={handleSubmit}
      style={{ marginBottom: "1rem" }}
      className="space-y-2 flex flex-col"
    >
      <label
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        htmlFor={name}
      >
        {(isPending && "Saving...") || label || name}
      </label>
      {inputElement}
      <p
        className={cn(
          "text-[0.8rem] order-1",
          serverState.error ? "text-destructive" : "text-muted-foreground"
        )}
      >
        {serverState.error || caption}
      </p>
    </form>
  );
}

export default SettingItem;
