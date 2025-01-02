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
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";

interface InputProps<T extends FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  error?: boolean;
}

export function Input<T extends FieldValues>({
  name,
  control,
  label,
  error,
  ...props
}: InputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel
              className={cn("text-foreground", error && "text-destructive")}
            >
              {label}
            </FormLabel>
          )}
          <FormControl>
            <ShadcnInput {...field} {...props} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
