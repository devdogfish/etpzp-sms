import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Control, FieldPath } from "react-hook-form";
import { z } from "zod";
import { newMessageFormSchema } from "@/lib/form.schemas";

interface FormInputProps {
  type: string;
  name: FieldPath<z.infer<typeof newMessageFormSchema>>;
  control: Control<z.infer<typeof newMessageFormSchema>>;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function FormInput({
  type,
  name,
  label,
  placeholder,
  control,
  className,
  disabled,
}: FormInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {!!label && <FormLabel>{label}</FormLabel>}
          <div className="flex w-full flex-col">
            <FormControl>
              <Input
                placeholder={placeholder}
                type={type}
                {...field}
                className={className}
                disabled={disabled}
              />
            </FormControl>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
