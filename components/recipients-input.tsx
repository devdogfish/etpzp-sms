"use client";
import { z } from "zod";
import { Input } from "./shared/input";
import React, { useState, KeyboardEvent, ChangeEvent, useRef } from "react";
import { UserPlus, X } from "lucide-react";

import { Button, buttonVariants } from "./ui/button";
import { cn, generateUniqueId } from "@/lib/utils";
import InsertContactModal from "./modals/insert-contact-modal";
import { Contact } from "@/types";

import { useNewMessage } from "@/contexts/use-new-message";

interface InputState {
  value: string;
  isFocused: boolean;
  error?: string;
}
export default function RecipientsInput({
  contacts,
}: {
  contacts: ActionResult<Contact[]>;
}) {
  const [input, setInput] = useState<InputState>({
    value: "",
    isFocused: false,
    error: undefined,
  });
  const container = useRef<HTMLDivElement | null>(null);

  const { recipients, addRecipient, removeRecipient } = useNewMessage();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    setTimeout(() => {
      if (container.current)
        container.current.scrollTop += container.current.scrollHeight; // automatically scroll to the bottom of the recipients when user starts typing
    }, 0);

    if (e.key === "Enter") {
      // submit the new recipient and store it in state
      e.preventDefault();
      e.stopPropagation();

      if (input.value.trim()) {
        addRecipient({
          id: generateUniqueId(),
          phone: input.value.trim(),
        });
        setInput((prevInput) => ({ ...prevInput, value: "" }));
      }
    }

    if (e.key === "Backspace" && input.value === "" && recipients.length) {
      removeRecipient(recipients[recipients.length - 1]); // remove last recipient in the array
    }
  };
  return (
    <div className="flex-1 py-1">
      <div className="max-h-24 overflow-auto" ref={container}>
        <div className="w-full relative">
          <div
            className={cn(
              "flex flex-wrap items-stretch gap-x-1 py-1 h-full border-b pl-5",
              input.isFocused && "border-primary"
            )}
          >
            {recipients.map((recipient) => (
              <div key={recipient.id} className="my-auto h-6">
                <div
                  className={cn(
                    "px-1.5 flex items-center text-xs border border-primary rounded-xl whitespace-nowrap h-full",
                    recipient.error?.type === "warning" && "bg-yellow-100",
                    recipient.error?.type === "error" && "bg-destructive/20"
                  )}
                >
                  <span>
                    {recipient.contactName
                      ? recipient.contactName
                      : recipient.phone}
                  </span>
                  <Button
                    variant="none"
                    className="p-0 h-4 cursor-pointer"
                    onClick={() => {
                      removeRecipient(recipient);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <Input // px-3 py-1 pl-5
              // {...field}
              className="ring-0 focus:ring-0 h-8 my-0.5 px-0 shadow-none pr-8 placeholder:text-muted-foreground w-min flex-1"
              // name="{name}"
              placeholder={recipients.length === 0 ? "Recipient/s" : undefined}
              value={input.value}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setInput((prevInput) => ({
                  ...prevInput,
                  value: e.target.value,
                }))
              }
              onKeyDown={handleKeyDown}
              // focus state
              onFocus={() =>
                setInput((prevInput) => ({
                  ...prevInput,
                  isFocused: true,
                }))
              }
              onBlur={() =>
                setInput((prevInput) => ({
                  ...prevInput,
                  isFocused: false,
                }))
              }
            />
          </div>

          <InsertContactModal contacts={contacts.success ? contacts.data : []}>
            <Button
              className="absolute right-[1px] bottom-[6px] p-2 aspect-1 z-index-0"
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
