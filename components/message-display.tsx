"use client";

import styles from "@/app/scattered-profiles.module.css";
import { format } from "date-fns/format";
import {
  ArchiveRestore,
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  Edit,
  MessageCircleX,
  ReplyAll,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CategoryEnums, DBMessage } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn, shuffleArray, toastActionResult } from "@/lib/utils";
import {
  cancelCurrentlyScheduled,
  deleteMessage,
  saveDraft,
  toggleTrash,
} from "@/lib/actions/message.actions";
import { toast } from "sonner";
import { ActionResponse } from "@/types/action";
import { usePathname, useRouter } from "next/navigation";
import ProfilePic from "./profile-pic";
import { DBRecipient, NewRecipient } from "@/types/recipient";
import { useTranslation } from "react-i18next";
import { PORTUGUESE_DATE_FORMAT } from "@/global.config";
import { useContacts } from "@/contexts/use-contacts";
import { PRIMARY_COLOR_CSS_NAMES } from "@/lib/theme.colors";
import React, { useEffect, useMemo, useState } from "react";
import { useContactModals } from "@/contexts/use-contact-modals";
import RecipientInfoModal from "./modals/recipient-info-modal";

function MessageDisplay({
  message,
  category,
  reset,
}: {
  message: DBMessage | null;
  category?: CategoryEnums;
  reset: () => void;
}) {
  const today = new Date();
  const onMobile = useIsMobile();
  const router = useRouter();
  const { t } = useTranslation(["messages-page"]);
  const pathname = usePathname();
  const [moreInfoOn, setMoreInfoOn] = useState<NewRecipient | null>(null);
  const { modal, setModal } = useContactModals();

  const [recipientsExpanded, setRecipientsExpanded] = useState(false);
  const { contacts, contactFetchError } = useContacts();
  // State to store random colors for each item
  const [profileColors, setProfileColors] = useState<string[]>([]);
  const showInfoAbout = (recipient: NewRecipient) => {
    console.log(recipient);
    setMoreInfoOn(recipient);
    setModal((prev) => ({ ...prev, info: true }));
  };

  const handleTrashButtonClick = async () => {
    if (message) {
      let result: ActionResponse<null>;

      // Drafts should also be discarded (deleted) immediately
      if (message.in_trash || message.status === "DRAFTED") {
        console.log(pathname);

        result = await deleteMessage(message.id, pathname);
      } else {
        result = await toggleTrash(message.id, true);
      }

      toastActionResult(result, t);
    }
  };

  const resend = async () => {
    if (message) {
      const newDraft = await saveDraft(undefined, {
        sender: message.sender,
        subject: message.subject || undefined,
        body: message.body,
        // convert DBRecipient to NewRecipient
        recipients: message.recipients.map((r) => ({
          phone: r.phone,
        })),
      });

      if (newDraft.draftId) {
        router.push(`/new-message?editDraft=${newDraft.draftId}`);
      }
    }
  };

  const putBack = async () => {
    if (message) {
      const result = await toggleTrash(message.id, false);

      toastActionResult(result, t);
    }
  };

  const cancelSend = async () => {
    if (message) {
      const smsReferenceId = parseInt(message.sms_reference_id);

      if (smsReferenceId && !isNaN(smsReferenceId)) {
        const result = await cancelCurrentlyScheduled(smsReferenceId);

        toastActionResult(result, t);
      } else {
        toast.error(t("messages-page:server-cancel_scheduled_invalid_id"));
      }
    }
  };

  const initialColors = PRIMARY_COLOR_CSS_NAMES;
  let colors = [...initialColors]; // Create a copy of the array by spreading it.
  useEffect(() => {
    if (message) {
      shuffleArray(colors);

      setProfileColors(
        message.recipients.map((item, index) => {
          // Create a stable color for each item by using the index or item (in case the order doesn't change)

          if (colors.length === 0) {
            // All items have been used
            // Reset the array using the initial array and reshuffle
            colors = [...initialColors]; // Reset array to original values
            shuffleArray(colors); // Shuffle the reset array
          }

          // Pick and remove the first item from the shuffled colors
          return colors.pop() as string;
        })
      );
    }
  }, [message]);

  return (
    <div className={cn("flex h-full flex-col")}>
      {moreInfoOn && <RecipientInfoModal recipient={moreInfoOn} />}
      <div className="flex items-center p-2 h-[var(--header-height)] border-b">
        <div className="flex items-center gap-2">
          {onMobile && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => reset()}>
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">{t("common:go_back")}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("common:go_back")}</TooltipContent>
            </Tooltip>
          )}

          {/* Move message to trash or delete it */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={!message}
                onClick={handleTrashButtonClick}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">
                  {message?.in_trash || message?.status === "DRAFTED"
                    ? t("common:delete_permanently")
                    : t("common:move_to_trash")}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {message?.in_trash || message?.status === "DRAFTED"
                ? t("common:delete_permanently")
                : t("common:move_to_trash")}
            </TooltipContent>
          </Tooltip>

          {/* Cancel the sending of a scheduled message */}
          {category === "SCHEDULED" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!message}
                  onClick={cancelSend}
                >
                  <MessageCircleX className="w-4 h-4" />
                  <span className="sr-only">{t("cancel_scheduled")}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("cancel_scheduled")}</TooltipContent>
            </Tooltip>
          )}

          {/* Put back / restore trashed message */}
          {category === "TRASH" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!message}
                  onClick={putBack}
                >
                  <ArchiveRestore className="w-4 h-4" />
                  <span className="sr-only">{t("restore")}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("restore")}</TooltipContent>
            </Tooltip>
          )}

          {/* Reply to all recipients in the message */}
          {category !== "DRAFTS" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={resend}
                  disabled={!message}
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">{t("resend")}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("resend")}</TooltipContent>
            </Tooltip>
          )}

          {/* Reply to all recipients in the message */}
          {category === "DRAFTS" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    message
                      ? router.push(`/new-message?editDraft=${message.id}`)
                      : ""
                  }
                  disabled={!message}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">{t("continue_draft")}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("continue_draft")}</TooltipContent>
            </Tooltip>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          {/* Close (deselect) the selected message */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => reset()}
                disabled={!message}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">{t("common:close")}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("common:close")}</TooltipContent>
          </Tooltip>
        </div>
      </div>
      {/* <Separator /> */}
      {message ? (
        <div className="flex flex-1 flex-col">
          <div className="flex justify-between p-4">
            <div className="flex gap-4 text-sm w-full">
              <div className="flex relative min-w-[50px] min-h-[50px] h-[50px]">
                {message.recipients.map((recipient: DBRecipient, index) => {
                  if (index >= 5) return; // Max recipients reached; remaining will be shown as a single picture with count

                  let foundContactName: string | undefined = undefined;

                  foundContactName = contacts.find(
                    (contact) => contact.phone === recipient.phone
                  )?.name;

                  if (index == 4) {
                    // the fifth recipient should be the number of missing recipients
                    const missingRecipients = message.recipients.length - index;
                    if (missingRecipients > 1) {
                      // if there are many missing recipients,
                      foundContactName = `+ ${missingRecipients}`;
                    }
                  }

                  return (
                    <ProfilePic
                      key={index}
                      // size={10}
                      customSize
                      name={foundContactName}
                      className={cn(
                        styles["profile-absolute"],
                        index === 0 &&
                          cn("center-absolute", styles["profile-big"]),
                        index === 1 && styles["profile-top-left"],
                        index === 2 && styles["profile-bottom-left"],
                        index === 3 && styles["profile-top-right"],
                        index === 4 && styles["profile-bottom-right"]
                      )}
                      // The dynamically generated class `bg-${chosenColor}` won't work because Tailwind purges unused classes in production, and it doesn't recognize dynamically created class names.
                      style={{
                        // Only show color for saved contacts
                        backgroundColor: foundContactName
                          ? profileColors[index]
                          : "",
                      }}
                    />
                  );
                })}
              </div>
              <div className="flex flex-col gap-1 grow overflow-hidden">
                <div className="flex justify-between items-center relative">
                  <span className="font-semibold ellipsis">
                    {message.subject || t("no_subject")}
                  </span>
                  {message.send_time && (
                    <span
                      className="text-xs text-muted-foreground relative whitespace-nowrap"
                      style={{ top: "1px" }}
                    >
                      {format(
                        new Date(message.send_time),
                        PORTUGUESE_DATE_FORMAT
                      )}
                    </span>
                  )}
                  <Button
                    onClick={() =>
                      setRecipientsExpanded((prevExpanded) => !prevExpanded)
                    }
                    variant="none"
                    className="p-0 pl-1 h-min absolute right-0 bottom-[-20px] bg-background z-10 rounded-none"
                  >
                    <ChevronDown
                      className={cn(
                        "duration-200",
                        !recipientsExpanded && "rotate-90"
                      )}
                    />
                  </Button>
                </div>
                <div className={cn("flex text-xs gap-1 relative")}>
                  {!recipientsExpanded && (
                    <div
                      // Have a div cover the recipients so that the user has to expand the recipients first to be able to view more info
                      className="container-overlay"
                      onClick={() => setRecipientsExpanded(true)}
                    />
                  )}
                  <div
                    className={cn(
                      "flex gap-1",
                      recipientsExpanded ? "flex-wrap mr-5" : ""
                    )}
                  >
                    <div className="font-medium">{t("common:to")}:</div>

                    {message.recipients.map(
                      (recipientWithoutContact, index) => {
                        const recipient = {
                          ...recipientWithoutContact,
                          contact: contacts.find(
                            (contact) =>
                              contact.phone === recipientWithoutContact.phone
                          ),
                        };
                        return (
                          <div key={recipient.id} className="flex">
                            <Button
                              variant="none"
                              onClick={() => showInfoAbout(recipient)}
                              className="whitespace-nowrap p-0 text-xs h-min hover:bg-muted px-[2px]"
                            >
                              {recipient.contact?.name || recipient.phone}
                            </Button>
                            {index < message.recipients.length - 1 && ", "}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />
          <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
            {message.body}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          {t("none_selected")}
        </div>
      )}
      {
        // You can remove the message check if you want to, I like it better that this bottom bar only shows up on selection
        category === "DRAFTS" && message && (
          <>
            <Separator className="mt-auto" />
            <div className="flex px-4 py-2 justify-end gap-2">
              <Button
                variant="default"
                type="button"
                className="w-max"
                disabled={!message}
                onClick={() =>
                  message
                    ? router.push(`/new-message?editDraft=${message.id}`)
                    : ""
                }
              >
                <Edit className="h-4 w-4" />
                {t("continue_draft")}
              </Button>
            </div>
          </>
        )
      }
    </div>
  );
}
export default React.memo(MessageDisplay);
