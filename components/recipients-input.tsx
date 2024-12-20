"use client";
import { z } from "zod";
import { Input } from "./form-input";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import React, { useState, KeyboardEvent, ChangeEvent, useRef } from "react";
import { UserPlus, X } from "lucide-react";

import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import InsertContactModal from "./modals/insert-contact-modal";
import { Contact } from "@/types/contact";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

interface inputState {
  value: string;
  isFocused: boolean;
}
export default function RecipientsInput<T extends FieldValues>({
  name,
  control,
  placeholder,
  contacts,
}: {
  name: FieldPath<T>;
  control: Control<T>;
  placeholder: string;
  contacts: ActionResult<Contact[]>;
}) {
  const [input, setInput] = useState<inputState>({
    value: "",
    isFocused: false,
  });
  const container = useRef<HTMLDivElement | null>(null);

  const [recipients, setRecipients] = useState([
    {
      id: "a",
      name: "William Smith",
      phone: 123454641,
    },
    {
      id: "advb",
      name: "Donald Trump",
      phone: 168345492,
    },
    {
      id: "advblks",
      name: "Putin Valenski",
      phone: 462923492,
    },
  ]);
  const addRecipient = (value: string) => {
    // 1. validate the type to make sure it is a valid phone number
    // 2. make sure it doesnt exist yet by first finding out if it is a name or a number and comparing it to the contacts
    // 3. add it to the recipients array
    // setRecipients(prevRecipients => [...prevRecipients, contacts.find(value)])

    // dummy demo
    const id = String(
      `${recipients.length} ${Math.floor(Math.random() * 1000)}`
    );
    setRecipients((prevRecipients) => [
      ...prevRecipients,
      {
        id: id,
        name: `Willy Wonka ${id}`,
        phone: 12819591287,
      },
    ]);
    setInput((i) => ({ ...i, value: "" }));
  };
  const removeRecipient = (index: number) => {
    setRecipients(
      (prevRecipients) => prevRecipients.filter((_, i) => i !== index) // Filter out the item at the specified index
    );
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " && input.value.trim()) {
      e.preventDefault();
      addRecipient(input.value.trim());
    }
    if (e.key === "Backspace" && input.value === "") {
      setRecipients((prevRecipients) => prevRecipients.slice(0, -1));
    }
    setTimeout(() => {
      if (container.current)
        container.current.scrollTop += container.current.scrollHeight;
    }, 0);
  };
  return (
    <div className="py-1">
      <div className="max-h-24 overflow-auto" ref={container}>
        <div className="w-full relative">
          <div
            className={cn(
              "flex flex-wrap items-stretch gap-x-1 py-1 h-full border-b pl-5",
              input.isFocused && "border-primary"
            )}
          >
            {recipients.map(({ id, name }, idx) => (
              <div key={id} className="my-0.5 h-8">
                <div className="px-0.5 flex items-center text-xs border border-primary rounded-md whitespace-nowrap h-full">
                  <span>{name}</span>
                  <Button
                    variant="none"
                    className="p-0 h-4 cursor-pointer"
                    onClick={() => removeRecipient(idx)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <FormField
              control={control}
              name={name}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input // px-3 py-1 pl-5
                      {...field}
                      className="ring-0 focus:ring-0 h-8  my-0.5 px-0 shadow-none pr-8 placeholder:text-muted-foreground"
                      name={name}
                      placeholder={placeholder}
                      type="text"
                      control={control}
                      value={input.value}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setInput(({ isFocused }) => ({
                          value: e.target.value,
                          isFocused,
                        }))
                      }
                      onKeyDown={handleKeyDown}
                      // focus state
                      onFocus={() =>
                        setInput(({ value }) => ({
                          value,
                          isFocused: true,
                        }))
                      }
                      onBlur={() =>
                        setInput(({ value }) => ({
                          value,
                          isFocused: false,
                        }))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <InsertContactModal contacts={contacts}>
            <Button
              className="absolute right-[1px] bottom-[7px] p-2 aspect-1 z-index-0"
              variant="ghost"
              type="button"
            >
              <UserPlus className="h-1 w-1" />
            </Button>
          </InsertContactModal>
        </div>
      </div>
    </div>
  );
}
