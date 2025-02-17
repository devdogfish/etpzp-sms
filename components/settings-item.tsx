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

  async function handleSubmit(e?: FormEvent, submittedValue?: string) {
    if (e) e.preventDefault();

    setIsPending(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("value", submittedValue || value);

    const result = await updateSetting(formData);
    setServerState(result);
    console.log(result);

    if (onUpdate) onUpdate(value);

    if (name === "display_name" || name === "profile_color_id") {
      localStorage.setItem(name, result.data || initialValue);

      // Dispatch a custom event to update other components that display settings stored in localstorage
      window.dispatchEvent(new Event("settingsUpdated"));
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
