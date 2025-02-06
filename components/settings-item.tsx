"use client";

import { Input } from "@/components/ui/input";
import { updateSetting } from "@/lib/actions/user.actions";
import { cn } from "@/lib/utils";
import React, {
  useState,
  useTransition,
  FormEvent,
  InputHTMLAttributes,
} from "react";

export type RenderInputArgs = {
  value: string;
  onChange: (newValue: string) => void;
  onBlur: (
    event?:
      | React.FocusEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      | undefined
  ) => void;
  id: string;
  initialValue?: string;
};

type SettingItemProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  initialValue?: string;
  label?: string;
  description?: string;
  inputType?: string; // e.g. "text", "password", "email", etc.
  renderInput?: (props: RenderInputArgs) => React.ReactNode;
  onUpdate?: (newValue: string) => void;
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
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e?: FormEvent) {
    if (e) e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("value", value);

    startTransition(async () => {
      try {
        // await updateSetting(formData);
        await updateSetting();
        setError(null);
        if (onUpdate) onUpdate(value);
      } catch (err: any) {
        setError(err.message || "Update failed");
      }
    });
  }

  // Default input element that passes the inputType and additional props
  const defaultInput = (
    <Input
      id={name}
      type={inputType}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleSubmit}
      style={{ width: "max-content" }}
      {...inputProps}
    />
  );

  const inputElement = renderInput
    ? renderInput({
        value,
        onChange: (newValue: string) => setValue(newValue),
        onBlur: handleSubmit,
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
          error ? "text-destructive" : "text-muted-foreground"
        )}
      >
        {error || description}
      </p>
    </form>
  );
}

export default SettingItem;
