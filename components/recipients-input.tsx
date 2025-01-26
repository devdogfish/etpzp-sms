"use client";

import { Input } from "./shared/input";
import React, {
  useState,
  type KeyboardEvent,
  ChangeEvent,
  useRef,
  useEffect,
  SetStateAction,
} from "react";
import { Key, Search, UserPlus, X } from "lucide-react";

import { Button, buttonVariants } from "./ui/button";
import { cn, generateUniqueId, getNameInitials } from "@/lib/utils";
import type { Contact } from "@/types/contact";
import type { ProcessedDBContactRecipient as DBRecipient } from "@/types/recipient";
import { useNewMessage } from "@/contexts/use-new-message";
import type { ActionResult } from "@/types/action";
import { useContactModals } from "@/contexts/use-contact-modals";
import { ScrollArea } from "./ui/scroll-area";
import { useSession } from "@/hooks/use-session";
import { useSearchParams } from "next/navigation";
import { NewRecipient } from "@/types/recipient";
// import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

type InputState = {
  value: string;
  isFocused: boolean;
  error?: string;
};

export default function RecipientsInput({
  contacts,
  errors,
  selectContact,
}: {
  contacts: ActionResult<Contact[]>;
  errors?: string[];
  selectContact: React.Dispatch<SetStateAction<NewRecipient | null>>;
}) {
  const [input, setInput] = useState<InputState>({
    value: "",
    isFocused: false,
    error: undefined,
  });
  const container = useRef<HTMLDivElement | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchParams = useSearchParams();
  const {
    recipients,
    addRecipient,
    removeRecipient,
    // Suggested recipients
    filteredSuggestedRecipients,
    filterSuggestedRecipients,
    setMessage,
    getValidatedRecipient,
  } = useNewMessage();
  const { setModal } = useContactModals();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        container.current &&
        !container.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (searchParams.get("contactId")) {
      // On the contact page we have a message this contact link where we pass over the contactId
      const contact = contacts.data?.find(
        (contact) => contact.id == searchParams.get("contactId")
      );

      // It could be an invalid id
      if (contact) {
        const recipient = getValidatedRecipient({
          contactName: contact.name,
          contactId: contact.id,
          ...contact,
        });
        // Replace all existing contacts instead of pushing the contact
        setMessage((prev) => ({ ...prev, recipients: [recipient] }));
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        // reset input value
        setInput((prevInput) => ({ ...prevInput, value: "" }));
      }
    }

    if (e.key === "Backspace" && input.value === "" && recipients.length) {
      removeRecipient(recipients[recipients.length - 1]); // remove last recipient in the array
    }
  };
  const createRecipient = ({
    phone,
    contact_id,
    contact_name,
  }: DBRecipient) => {
    addRecipient({
      id: generateUniqueId(),
      phone,
      contactId: String(contact_id),
      contactName: contact_name || undefined,
    });
    // reset input value
    setInput((prevInput) => ({ ...prevInput, value: "" }));
  };
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput((prevInput) => ({
      ...prevInput,
      value,
    }));
    setIsDropdownOpen(true);

    filterSuggestedRecipients(value);
  };
  const showInsertModal = () => setModal((prev) => ({ ...prev, insert: true }));
  const showRecipientInfo = (recipient: NewRecipient) => {
    selectContact(recipient);
    setModal((prev) => ({ ...prev, info: true }));
  };
  return (
    <div className="flex-1 py-1 relative">
      <div className="max-h-24 overflow-auto" ref={container}>
        <div
          className={cn(
            "w-full flex flex-wrap items-center gap-x-1 py-1 h-full border-b px-5",
            input.isFocused && "border-primary",
            errors && "border-red-500"
          )}
        >
          <span className="my-0.5 mr-0.5 px-0 flex items-center text-sm text-muted-foreground">
            To
          </span>
          {recipients.map((recipient) => (
            <div
              key={recipient.id}
              className="flex items-center h-7" /* Height of the row/container */
            >
              <div className="h-6" /* height of the contact chip itself */>
                <div
                  className={cn(
                    "flex items-center text-xs border rounded-xl hover:bg-muted cursor-pointer whitespace-nowrap h-full",
                    // recipient.error?.type === "warning" && "bg-yellow-100",
                    recipient.error?.type === "error" && "border-destructive"
                  )}
                >
                  <div
                    onClick={() => showRecipientInfo(recipient)}
                    className="h-full content-center rounded-l-xl pl-1.5"
                  >
                    {recipient.contactName
                      ? recipient.contactName
                      : recipient.phone}
                  </div>
                  <Button
                    variant="none"
                    className="h-full py-0 px-1.5 cursor-pointer closeX rounded-l-none rounded-r-xl"
                    onClick={() => removeRecipient(recipient)}
                    type="button"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <div
            className={cn(
              "h-8 min-w-[200px] flex-1 py-1 my-0.5 ml-3"
            )} /* we are taking advantage of the default positioning of absolute elements this common parent div */
          >
            <Input
              className={cn(
                "h-full my-0.5 w-full p-0 ring-0 focus:ring-0 shadow-none rounded-none placeholder:text-muted-foreground"
              )}
              placeholder={
                recipients.length !== 0 && input.isFocused ? "Phone number" : ""
              }
              value={input.value}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                setInput((prevInput) => ({
                  ...prevInput,
                  isFocused: true,
                }));
                setIsDropdownOpen(true);
              }}
              onBlur={() => {
                setInput((prevInput) => ({
                  ...prevInput,
                  isFocused: false,
                }));
                setIsDropdownOpen(false);
              }}
            />
            {isDropdownOpen && (
              <div className="absolute top-[88%] bg-white border rounded-md">
                <ScrollArea className="w-[300px] h-[330px] ">
                  <div
                    className="p-2" /* this is necessary to have a separate container so that the items scroll all the way up to the end of the container */
                  >
                    <h3 className="mb-2 px-2 text-sm font-medium">
                      Suggestions
                    </h3>
                    <div className="flex flex-col gap-1">
                      {filteredSuggestedRecipients.map((recipient) => (
                        <button
                          key={recipient.phone}
                          className={cn(
                            "flex items-center w-full gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent"
                          )}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            createRecipient(recipient);
                          }}
                        >
                          <div className="rounded-full h-12 w-12 border centered">
                            {getNameInitials(recipient.contact_name)}
                          </div>
                          <div className="space-y-1">
                            <div className="font-semibold">
                              {recipient.contact_name || recipient.phone}
                            </div>
                            <div className="text-xs font-medium">
                              {recipient.contact_name ? recipient.phone : ""}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </div>
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
  );
}
