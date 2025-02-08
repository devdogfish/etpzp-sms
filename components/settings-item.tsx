"use client";

import { Input } from "@/components/ui/input";
import { updateSetting } from "@/lib/actions/user.actions";
import { cn } from "@/lib/utils";
import type React from "react";
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
};

type SettingItemProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  initialValue?: string;
  label?: string;
  description?: string;
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
  description,
  inputType = "text",
  renderInput,
  onUpdate,
  ...inputProps
}: SettingItemProps) {
  const [value, setValue] = useState<string>(initialValue);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (initialValue && value === "") {
      console.log("VALUE GOT RESET TO initialValue");
      setValue(initialValue);
    }
  }, [initialValue, value]);

  const [serverState, setServerState] = useState(initialState);

  async function handleSubmit(e?: FormEvent, submittedValue?: string) {
    if (e) e.preventDefault();

    console.log("submitted value", submittedValue);

    setIsPending(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("value", submittedValue || value);

    const result = await updateSetting(formData);
    setServerState(result);
    if (onUpdate) onUpdate(value);

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
      })
    : defaultInput;

  return (
    <form
      onSubmit={handleSubmit}
      style={{ marginBottom: "1rem" }}
      className="space-y-2 flex flex-col"
    >
      {serverState.data && <div>serverState.data: {serverState.data}</div>}
      <label
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        htmlFor={name}
      >
        {(isPending && "Saving...") || label || name}
      </label>
      {inputElement}
      <p
        className={cn(
          "text-[0.8rem]",
          serverState.error ? "text-destructive" : "text-muted-foreground"
        )}
      >
        {serverState.error || description}
      </p>
    </form>
  );
}

export default SettingItem;
