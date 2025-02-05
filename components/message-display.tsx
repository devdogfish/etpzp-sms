"use client";

import { format } from "date-fns/format";
import {
  Archive,
  ArchiveRestore,
  ArchiveX,
  ArrowLeft,
  Clock,
  Edit,
  Forward,
  MoreVertical,
  Reply,
  ReplyAll,
  Trash2,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  deleteMessage,
  saveDraft,
  toggleTrash,
} from "@/lib/actions/message.actions";
import { toast } from "sonner";
import { ActionResponse } from "@/types/action";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const onMobile = useIsMobile();
  const handleTrashButtonClick = async () => {
    if (message) {
      let result: ActionResponse<null>;
      // Drafts should also be discarded (deleted) immediately
      if (message.in_trash || message.status === "DRAFTED") {
        result = await deleteMessage(message.id);
      } else {
        result = await toggleTrash(message.id, true);
      }

      toastActionResult(result);
      reset();
    }
  };

  const replyAll = async () => {
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
      console.log(
        "created new draft with id ",
        newDraft.draftId,
        " to then redirect to edit it on the new message page"
      );

      if (newDraft.draftId) {
        router.push(`/new-message?draft=${newDraft.draftId}`);
      } else toast.error("An error occurred");
    }
  };

  const putBack = async () => {
    if (message) {
      const result = await toggleTrash(message.id, false);
      if (result.success) {
        reset();
      }
      toastActionResult(result);
    }
  };
  return (
    <div className={cn("flex h-full flex-col")}>
      <div className="flex items-center p-2">
        <div className="flex items-center gap-2">
          {onMobile && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={reset}>
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Go back</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Go back</TooltipContent>
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
                  {message?.in_trash ? "Delete permanently" : "Move to trash"}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {message?.in_trash ? "Delete permanently" : "Move to trash"}
            </TooltipContent>
          </Tooltip>

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
                  <span className="sr-only">Restore</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Restore</TooltipContent>
            </Tooltip>
          )}

          {/* Reply to all recipients in the message */}
          {category !== "DRAFT" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={replyAll}
                  disabled={!message}
                >
                  <ReplyAll className="h-4 w-4" />
                  <span className="sr-only">Reply all</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reply all</TooltipContent>
            </Tooltip>
          )}

          {/* Reply to all recipients in the message */}
          {category === "DRAFT" && (
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
                  <span className="sr-only">Continue draft</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Continue draft</TooltipContent>
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
                onClick={reset}
                disabled={!message}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Close</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <Separator />
      {message ? (
        <div className="flex flex-1 flex-col">
          <div className="flex items-start p-4">
            <div className="flex items-start gap-4 text-sm">
              <Avatar>
                <AvatarImage alt={message.subject || "No Subject"} />
                <AvatarFallback>
                  {message.subject &&
                    message.subject
                      .split(" ")
                      .map((chunk) => chunk[0])
                      .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-semibold">{message.subject}</div>
                <div className="line-clamp-1 text-xs">{message.subject}</div>
                <div className="line-clamp-1 text-xs">
                  <span className="font-medium">Reply-To:</span>{" "}
                  {message.user_id}
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
            <h2>
              This message has an id of <strong>{message.id}</strong>
            </h2>
            <h2>
              This message has {message.recipients.length} recipients:{" "}
              {message.recipients.map((r) => (
                <div key={r.phone}>{JSON.stringify(r)}</div>
              ))}
            </h2>
            {message.body}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          No message selected
        </div>
      )}
    </div>
  );
}
