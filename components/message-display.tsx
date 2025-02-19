"use client";

import { format } from "date-fns/format";
import {
  ArchiveRestore,
  ArrowLeft,
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
import { cn, toastActionResult } from "@/lib/utils";
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
import { DBRecipient } from "@/types/recipient";
import { useTranslation } from "react-i18next";

export function MessageDisplay({
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

  const handleTrashButtonClick = async () => {
    if (message) {
      let result: ActionResponse<null>;

      // Drafts should also be discarded (deleted) immediately
      if (message.in_trash || message.status === "DRAFTED") {
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
          contactId: r.contact_id?.toString(),
        })),
      });

      if (newDraft.draftId) {
        router.push(`/new-message?draft=${newDraft.draftId}`);
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
        // TODO TRANSLATION: server-cancel_scheduled_invalid_id
        toast.error(t("messages-page:server-cancel_scheduled_unknown_error"));
      }
    }
  };
  return (
    <div className={cn("flex h-full flex-col")}>
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
                      ? router.push(`/new-message?draft=${message.id}`)
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
          <div className="flex items-start p-4">
            <div className="flex items-start gap-4 text-sm">
              {message.recipients.map((recipient: DBRecipient, idx) => {
                if (idx > 3) {
                  console.log("more than 3 recipients");
                  return;
                }
                return <ProfilePic key={idx} size={9} name={recipient.name} />;
              })}
              <div className="grid gap-1">
                <div className="font-semibold">
                  {message.subject || t("no_subject")}
                </div>
                <div className="flex text-xs">
                  <div className="font-medium mr-1">{t("common:to")}:</div>

                  {message.recipients.map((recipient) => (
                    <div key={recipient.id}>
                      {recipient?.name || recipient.phone}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {message.created_at && (
              <div className="ml-auto text-xs text-muted-foreground">
                {format(new Date(message.created_at), "PPpp")}
              </div>
            )}
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
                  message ? router.push(`/new-message?draft=${message.id}`) : ""
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
