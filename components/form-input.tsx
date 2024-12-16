"use client";
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input as ShadcnInput } from "./ui/input";
import { Control, FieldPath } from "react-hook-form";
import { z } from "zod";
import { newMessageFormSchema, authFormSchema } from "@/lib/form.schemas";

interface FormInputProps {
  type: string;
  name: FieldPath<z.infer<typeof authFormSchema>>;
  control: Control<z.infer<typeof authFormSchema>>;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function Input({
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
              <ShadcnInput
                placeholder={placeholder}
                type={type}
                className={className}
                disabled={disabled}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
