"use client";
import { z } from "zod";
import { Input } from "./shared/input";
import React, { useState, KeyboardEvent, ChangeEvent, useRef } from "react";
import { UserPlus, X } from "lucide-react";

import { Button, buttonVariants } from "./ui/button";
import { cn, generateUniqueId } from "@/lib/utils";
import { Contact } from "@/types";

import { useNewMessage } from "@/contexts/use-new-message";
import { ActionResult } from "@/types/action";
import { useContactModals } from "@/contexts/use-contact-modals";

type InputState = {
  value: string;
  isFocused: boolean;
  error?: string;
};
export default function RecipientsInput({
  contacts,
  errors,
}: {
  contacts: ActionResult<Contact[]>;
  errors?: string[];
}) {
  const [input, setInput] = useState<InputState>({
    value: "",
    isFocused: false,
    error: undefined,
  });
  const container = useRef<HTMLDivElement | null>(null);

  const { recipients, addRecipient, removeRecipient } = useNewMessage();
  const { setModal } = useContactModals();

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
        createRecipient(input.value.trim());
      }
    }

    if (e.key === "Backspace" && input.value === "" && recipients.length) {
      removeRecipient(recipients[recipients.length - 1]); // remove last recipient in the array
    }
  };
  const createRecipient = (phone: string) => {
    addRecipient({
      id: generateUniqueId(),
      phone,
    });
    // reset input value
    setInput((prevInput) => ({ ...prevInput, value: "" }));
  };
  const showInsertModal = () => setModal((prev) => ({ ...prev, insert: true }));
  return (
    <div className="flex-1 py-1">
      <div className="max-h-24 overflow-auto" ref={container}>
        <div
          className={cn(
            "w-full flex flex-wrap items-stretch gap-x-1 py-1 h-full border-b px-5 relative",
            input.isFocused && "border-primary",
            errors && "border-red-500"
            // TODO: Add client side validation here
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
                  type="button"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {recipients.length === 0 && !input.isFocused && (
            <span className="my-0.5 px-0 flex items-center text-sm text-muted-foreground">
              To
            </span>
          )}
          <Input
            className={cn(
              "h-8 my-0.5 px-0 w-min flex-1 ring-0 focus:ring-0 shadow-none placeholder:text-muted-foreground",
              recipients.length > 0 && "ml-3"
            )}
            placeholder={recipients.length > 0 ? "Phone number" : ""}
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
            onBlur={() => {
              setInput((prevInput) => ({
                ...prevInput,
                isFocused: false,
              }));
              if (input.value.trim()) createRecipient(input.value.trim());
            }}
          />

          <Button
            className="absolute right-2 bottom-[6px] p-2 aspect-1 z-index-0"
            variant="ghost"
            type="button"
            onClick={showInsertModal}
          >
            <UserPlus className="h-1 w-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
