"use client";

import { Input } from "./shared/input";
import React, {
  useState,
  useRef,
  useEffect,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";
import { Key, Search, UserPlus, X } from "lucide-react";

import { Button, buttonVariants } from "./ui/button";
import { cn, generateUniqueId, getNameInitials } from "@/lib/utils";
import { useNewMessage } from "@/contexts/use-new-message";
import { useContactModals } from "@/contexts/use-contact-modals";
import { ScrollArea } from "./ui/scroll-area";
import { useSearchParams } from "next/navigation";
import { NewRecipient } from "@/types/recipient";
import { DBContact } from "@/types/contact";
import useIsMounted from "@/hooks/use-mounted";
import ProfilePic from "./profile-pic";
import { useTranslation } from "react-i18next";

type InputState = {
  value: string;
  isFocused: boolean;
  error?: string;
};

React.memo(RecipientsInput);
export default function RecipientsInput({
  contacts,
  error,
  onFocus,
  onBlur,
}: {
  contacts: DBContact[];
  error?: boolean;
  onFocus: () => void;
  onBlur: () => void;
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
    suggestedRecipients,
    searchRecipients,
    setMoreInfoOn,
    selectedPhone,
    updateSelectedPhone,
  } = useNewMessage();
  const { setModal } = useContactModals();
  const [activeError, setActiveError] = useState<boolean>(false);
  const { t } = useTranslation();

  const isMounted = useIsMounted();

  useEffect(() => {
    if (isMounted) {
      const addInitialRecipients = () => {
        // Add recipient from URL if present
        const contactId = searchParams.get("contactId");
        if (contactId) {
          const contact = contacts.find((contact) => contact.id == contactId);
          if (contact) {
            addRecipient(contact.phone, contacts);
          }
        }

        // Update searched recipients after adding all initial recipients
        searchRecipients("");
      };

      addInitialRecipients();
    }
  }, [isMounted]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    setTimeout(() => {
      if (container.current) {
        // automatically scroll to the bottom of the recipients container when user starts typing
        container.current.scrollTop += container.current.scrollHeight;
      }
    }, 0);

    const trimmedInput = input.value.trim();
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();
      if (selectedPhone) {
        addRecipient(selectedPhone, contacts);
      } else if (trimmedInput !== "") {
        addRecipient(trimmedInput, contacts);
        // reset input value
        setInput((prevInput) => ({ ...prevInput, value: "" }));
      }
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      updateSelectedPhone(e.key);
    }

    if (e.key === "Backspace" && trimmedInput === "" && recipients.length) {
      removeRecipient(recipients[recipients.length - 1]); // remove last recipient in the array
    }
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput((prevInput) => ({
      ...prevInput,
      value,
    }));
    setIsDropdownOpen(true);
    searchRecipients(value);
  };

  useEffect(() => {
    if (error) {
      setActiveError(error);
      // look for errors in recipients to then update the UI
      const noErrorRecipientFound = recipients.find(
        (recipient) => recipient.formattedPhone !== undefined
      );
      if (noErrorRecipientFound) setActiveError(false);
    }
  }, [recipients, error]);

  const showInsertModal = () => setModal((prev) => ({ ...prev, insert: true }));
  const showRecipientInfo = (recipient: NewRecipient) => {
    setMoreInfoOn(recipient);
    setModal((prev) => ({ ...prev, info: true }));
  };

  return (
    <div className="flex-1 py-1 relative z--[1000]">
      <div className="max-h-24 overflow-auto" ref={container}>
        <div
          className={cn(
            "w-full flex flex-wrap items-center gap-x-1 py-1 h-full border-b px-5 z-50",
            input.isFocused && "border-primary",
            activeError && "border-red-500"
          )}
        >
          <span className="my-0.5 mr-0.5 px-0 flex items-center text-sm text-muted-foreground">
            {t("common:to")}
          </span>
          {recipients.map((recipient) => (
            <div
              key={recipient.phone}
              className="flex items-center h-7" /* Height of the row/container */
            >
              <div className="h-6" /* height of the contact chip itself */>
                <div
                  className={cn(
                    "bg-background flex items-center text-xs border rounded-xl hover:bg-muted cursor-pointer whitespace-nowrap h-full hover:shadow-none",
                    activeError && "error-border-pulse"
                  )}
                >
                  <div
                    onClick={() => showRecipientInfo(recipient)}
                    className="h-full content-center rounded-l-xl pl-1.5"
                  >
                    {recipient?.contact?.name || recipient.phone}
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
              // this name only used for the focus state, not for submitting any value
              name="new-recipient"
              className={cn(
                "h-full my-0.5 w-full p-0 ring-0 focus:ring-0 shadow-none rounded-none placeholder:text-muted-foreground"
              )}
              placeholder={input.isFocused ? t("common:phone_number") : ""}
              value={input.value}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                setInput((prevInput) => ({
                  ...prevInput,
                  isFocused: true,
                }));
                setIsDropdownOpen(true);
                searchRecipients(input.value);
                onFocus();
              }}
              onBlur={() => {
                setInput((prevInput) => ({
                  ...prevInput,
                  isFocused: false,
                }));
                setIsDropdownOpen(false);
                onBlur();
              }}
            />

            {isDropdownOpen && suggestedRecipients.length !== 0 && (
              <div className="absolute top-[85%] bg-background border rounded-lg">
                <ScrollArea className="w-[300px] h-[330px]">
                  <div
                    className="p-2" /* this is necessary to have a separate container so that the items scroll all the way up to the end of the container */
                  >
                    <h3 className="mb-2 px-2 text-sm font-medium">
                      {input.value.length === 0
                        ? "Suggestions"
                        : "Search results"}
                    </h3>
                    <div className="flex flex-col gap-1">
                      {suggestedRecipients.map((recipient) => (
                        <button
                          key={recipient.phone}
                          className={cn(
                            "flex items-center w-full gap-2 rounded-lg border-2 p-3 text-left text-sm transition-all hover:bg-accent",
                            selectedPhone === recipient.phone &&
                              "border-foreground"
                          )}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();

                            addRecipient(recipient.phone, contacts);
                            // reset input value
                            setInput((prevInput) => ({
                              ...prevInput,
                              value: "",
                            }));
                          }}
                        >
                          <ProfilePic
                            name={recipient.contact?.name || undefined}
                            size={10}
                            fill={false}
                          />
                          <div className="space-y-1">
                            <div className="font-semibold">
                              {recipient.contact?.name || recipient.phone}
                            </div>
                            <div className="text-xs font-medium">
                              {recipient.contact?.name ? recipient.phone : ""}
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
