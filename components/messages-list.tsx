"use client";

import { cn, getDateFnsLocale } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ComponentProps } from "react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { Badge } from "@/components/ui/badge";
import type { DBMessage } from "@/types";
import { useTranslation } from "react-i18next";
import ClockIcon from "./clock-icon";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";

type MessageListProps = {
  messages: DBMessage[];
  selectedMessageId: string | null;
  setSelected: (message: DBMessage) => void;
};

export function MessageList({
  messages,
  selectedMessageId,
  setSelected,
}: MessageListProps) {
  const { t, i18n } = useTranslation(["messages-page"]);
  const onMobile = useIsMobile();

  return (
    <ScrollArea
      className={
        onMobile
          ? `h-[calc(100vh-var(--simple-header-height)-68px)]`
          : `h-[calc(100vh-var(--header-height)-68px)]`
      }
    >
      <div className="flex flex-col gap-2 p-4 pt-0">
        {messages.map((message) => {
          const sendInFuture = message.send_time.getTime() > Date.now();
          const statusTranslationString = (
            message.status !== "SCHEDULED"
              ? message.status
              : sendInFuture
              ? "SCHEDULED"
              : "SENT"
          ).toLowerCase();
          return (
            <Button
              key={message.id}
              variant="ghost"
              className={cn(
                "h-full flex flex-col items-start gap-2 rounded-lg border p-3 text-left mt-[1px]",
                selectedMessageId === message.id && "bg-accent"
              )}
              onClick={() => setSelected(message)}
            >
              <div className="flex w-full flex-col">
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">
                      {message.subject
                        ? message.subject
                        : t("common:no_subject")}
                    </div>
                    {sendInFuture && message.status === "SCHEDULED" && (
                      <ClockIcon
                        hour={
                          Math.round(message.send_time.getHours() % 12) || 12
                        }
                      />
                    )}
                    {message.status === "FAILED" && (
                      <div className="flex items-center gap-1 text-destructive text-xs">
                        <div className="flex h-2 w-2 rounded-full bg-destructive" />
                        {message.api_error_code}
                      </div>
                    )}
                  </div>
                  <div
                    className={cn(
                      "ml-auto text-xs",
                      selectedMessageId === message.id
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {formatDistanceToNow(new Date(message.send_time), {
                      addSuffix: true,
                      locale: getDateFnsLocale(i18n.language),
                    })}
                  </div>
                </div>
              </div>
              <div className="line-clamp-2 text-xs text-muted-foreground whitespace-pre-wrap">
                {message.body}
              </div>

              {/* If we are on the trash page, render a badge to show what the message was before it got moved to the trash */}
              {message.in_trash == true && (
                <Badge
                  variant="outline"
                  className="tracking-widest text-xs text-muted-foreground"
                  style={{ letterSpacing: "1px" }}
                >
                  {/* Play around with the styles */}
                  {t(`status_${statusTranslationString}`).toUpperCase()}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>
    </ScrollArea>
  );
}

function getBadgeVariantFromLabel(
  label: string
): ComponentProps<typeof Badge>["variant"] {
  // if (["success"].includes(label.toLowerCase())) {
  //   return "positive";
  // }

  if (["FAILED"].includes(label.toLowerCase())) {
    return "destructive";
  }

  if (["SCHEDULED"].includes(label.toLowerCase())) {
    return "outline";
  }

  return "secondary";
}
