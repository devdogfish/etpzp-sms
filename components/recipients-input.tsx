"use client";

import { Input } from "./shared/input";
import React, {
  useState,
  useRef,
  useEffect,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";
import { UserPlus, X } from "lucide-react";

import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useNewMessage } from "@/contexts/use-new-message";
import { useModal } from "@/contexts/use-modal";
import { ScrollArea } from "./ui/scroll-area";
import { NewRecipient } from "@/types/recipient";
import ProfilePic from "./profile-pic";
import { useTranslation } from "react-i18next";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const OFF_FOCUSED_RECIPIENT_AMOUNT = 5;
React.memo(RecipientsInput);
export default function RecipientsInput({
  error,
  onFocus,
  onBlur,
}: {
  error: boolean;
  onFocus: () => void;
  onBlur: () => void;
}) {
  const container = useRef<HTMLDivElement | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputElement = useRef<HTMLInputElement | null>(null);

  const {
    message,
    setMessage,
    recipients,
    addRecipient,
    removeRecipient,
    suggestedRecipients,
    searchRecipients,
    showInfoAbout,
    focusedInput,
    typeableInputRefs,

    // Which one in the suggested recipients/contacts is currently selected. You can change the selection with up and down arrow keys.
    selectedPhone,
    updateSelectedPhone,
  } = useNewMessage();
  const { setModal } = useModal();
  const { t } = useTranslation(["new-message-page"]);

  // reset the input's value
  function clearInputValue() {
    setMessage((m) => ({
      ...m,
      recipientInput: {
        ...m.recipientInput,
        value: "",
      },
    }));
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setTimeout(() => {
      if (container.current) {
        // automatically scroll to the bottom of the recipients container when user starts typing
        container.current.scrollTop += container.current.scrollHeight;
      }
    }, 0);

    const trimmedInput = message.recipientInput.value.trim();
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();
      if (selectedPhone) {
        addRecipient(selectedPhone);
        clearInputValue();
      } else if (trimmedInput !== "") {
        addRecipient(trimmedInput);

        clearInputValue();
      }
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      updateSelectedPhone(e.key);
    }

    if (e.key === "Backspace" && trimmedInput === "" && recipients.length) {
      const lastRecipientIndex = recipients.length - 1;
      const lastRecipient = recipients[lastRecipientIndex];
      if (lastRecipient && lastRecipient.proneForDeletion) {
        // Remove the last recipient if it is already prone for deletion
        removeRecipient(lastRecipient);
      } else {
        setMessage((prev) => {
          const lastRecipientIndex = prev.recipients.length - 1;

          // Create a new array of recipients with the last recipient marked as prone for deletion
          const newRecipients = prev.recipients.map((recipient, index) => {
            if (index === lastRecipientIndex) {
              return { ...recipient, proneForDeletion: true }; // Mark as prone for deletion
            }
            return recipient; // Return the other recipients unchanged
          });

          // Return the new state with the last recipient marked as prone for deletion
          return { ...prev, recipients: newRecipients };
        });
      }
    }
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage((m) => ({
      ...m,
      recipientInput: {
        ...m.recipientInput,
        value,
      },
    }));
    setIsDropdownOpen(true);

    searchRecipients(value);
  };

  const showRecipientInfo = (recipient: NewRecipient) => {
    showInfoAbout(recipient);
    setModal((m) => ({ ...m, contact: { ...m.contact, info: true } }));
  };

  useEffect(() => {
    // automatically collapse the expanded recipients when another input gets selected
    if (focusedInput !== "new-recipient" && typeof focusedInput == "string") {
      setMessage((prev) => ({
        ...prev,
        recipientInput: { ...prev.recipientInput, recipientsExpanded: false },
      }));
    }
  }, [focusedInput]);
  return (
    <div className="flex-1 py-1 relative z--[1000]">
      <div className="max-h-24 overflow-auto" ref={container}>
        <div
          className={cn(
            "w-full min-h-[2.75rem] flex flex-wrap items-center gap-x-1 py-1 h-full border-b px-5 z-50",
            focusedInput === "new-recipient" && "border-primary",
            error && "border-red-500"
          )}
        >
          <span className="my-0.5 mr-0.5 px-0 flex items-center text-sm text-muted-foreground">
            {t("common:to")}
          </span>
          {/* Recipient chips */}
          {recipients.map((recipient, index) => {
            // Since we have so many recipients, only some should be shown until the user clicks to see the rest
            if (
              index >= OFF_FOCUSED_RECIPIENT_AMOUNT &&
              message.recipientInput.recipientsExpanded === false
            ) {
              return;
            }
            // else, we show all of them
            return (
              <div
                key={recipient.phone}
                // Height of the row/container
                className="flex items-center h-7"
              >
                <div
                  // Height of the contact chip itself
                  className={cn("h-6")}
                >
                  <TooltipProvider delayDuration={1000}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "bg-background flex items-center text-xs border rounded-xl hover:bg-muted dark:hover:bg-muted cursor-pointer whitespace-nowrap h-full hover:shadow-none",
                            error && "error-border-pulse",
                            recipient.proneForDeletion && "border-destructive",
                            !recipient.isValid &&
                              "bg-red-100/70 dark:bg-red-900/50",
                            recipient.error?.type === "warning" &&
                              "bg-yellow-50 dark:bg-yellow-400/40"
                          )}
                        >
                          <div
                            onClick={() => showRecipientInfo(recipient)}
                            className="h-full flex items-center rounded-l-xl pl-1.5"
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
                      </TooltipTrigger>
                      <TooltipContent>
                        {t(
                          recipient.error?.message
                            ? recipient.error?.message
                            : ""
                        ) || t("tooltip-more_info")}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            );
          })}

          {/* Button to show all recipients, when it's clicked we also focus the input */}
          {message.recipients.length > OFF_FOCUSED_RECIPIENT_AMOUNT &&
          message.recipientInput.recipientsExpanded === false ? (
            <Button
              variant="none"
              className="p-0 ml-2"
              type="button"
              onClick={() => {
                setMessage((prev) => ({
                  ...prev,
                  recipientInput: {
                    ...prev.recipientInput,
                    recipientsExpanded: true,
                  },
                }));
                setTimeout(() => {
                  if (typeableInputRefs["new-recipient"].current) {
                    typeableInputRefs["new-recipient"].current.focus();
                  }
                }, 0);
              }}
            >
              {t("x_more", {
                x: message.recipients.length - OFF_FOCUSED_RECIPIENT_AMOUNT,
              })}
            </Button>
          ) : (
            <></>
          )}

          <div
            className={cn(
              "h-7 min-w-[200px] flex-1 py-1 ml-3", // my-0
              message.recipients.length > OFF_FOCUSED_RECIPIENT_AMOUNT &&
                message.recipientInput.recipientsExpanded === false &&
                "hidden"
            )} /* we are taking advantage of the default positioning of absolute elements this common parent div */
          >
            <Input
              ref={typeableInputRefs["new-recipient"]}
              // this name only used for the focus state, not for submitting any value
              name="new-recipient"
              className={cn(
                "h-min text-sm w-full p-0 ring-0 focus:ring-0 shadow-none rounded-none placeholder:text-muted-foreground" //my-0
              )}
              placeholder={
                message.recipients.length <= OFF_FOCUSED_RECIPIENT_AMOUNT ||
                message.recipientInput.recipientsExpanded
                  ? t("common:phone_number")
                  : ""
              }
              value={message.recipientInput.value}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                setIsDropdownOpen(true);

                searchRecipients(message.recipientInput.value);
                onFocus();
              }}
              onBlur={() => {
                setMessage((m) => ({
                  ...m,
                  recipients: m.recipients.map((r) => ({
                    ...r,
                    proneForDeletion: false,
                  })),
                }));
                setIsDropdownOpen(false);

                // Create recipient from input value on blur if not empty
                if (message.recipientInput.value.trim() !== "") {
                  addRecipient(message.recipientInput.value);
                }

                onBlur();
              }}
            />

            {/* Begin suggested recipients dropdown */}
            {isDropdownOpen && suggestedRecipients.length !== 0 && (
              <div className="absolute top-[85%] bg-background rounded-lg border shadow-md dark:shadow-lg-light">
                <ScrollArea className="w-[230px] xs:w-[300px] h-[330px]">
                  <div
                    className="p-2" /* this is necessary to have a separate container so that the items scroll all the way up to the end of the container */
                  >
                    <h3 className="mb-2 px-2 text-sm font-medium">
                      {!message.recipientInput.value.length
                        ? t("suggestions")
                        : t("x_found", { x: suggestedRecipients.length })}
                    </h3>
                    <div className="flex flex-col gap-1">
                      {suggestedRecipients.map((recipient) => (
                        <button
                          key={recipient.phone}
                          className={cn(
                            "flex items-center w-full gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                            selectedPhone === recipient.phone &&
                              "border-primary"
                          )}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();

                            addRecipient(recipient.phone);
                          }}
                        >
                          <ProfilePic
                            name={recipient.contact?.name || undefined}
                            size={10}
                            className="border"
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
          className="absolute right-2 bottom-[6px] p-2 aspect-1 top-1/2 -translate-y-1/2 z-10"
          variant="ghost"
          type="button"
          onClick={() =>
            setModal((m) => ({ ...m, contact: { ...m.contact, insert: true } }))
          }
        >
          <UserPlus className="h-1 w-1" />
        </Button>
      </div>
    </div>
  );
}
