"use client";

import { format } from "date-fns/format";
import {
  Archive,
  ArchiveRestore,
  ArchiveX,
  ArrowLeft,
  Clock,
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
      if (message.in_trash) {
        result = await deleteMessage(message.id);
      } else {
        result = await toggleTrash(message.id, true);
      }

      if (result.success) {
        reset();
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    }
  };
  const replyAll = async () => {
    if (message) {
      const newDraft = await saveDraft(undefined, message);
      if (newDraft.draftId) {
        router.push(`/new-message?draft=${newDraft.draftId}`);
      }
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
        </div>
        <div className="ml-auto flex items-center gap-2">
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
