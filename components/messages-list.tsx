"use client";

import { cn, getDateFnsLocale } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ComponentProps, useEffect } from "react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { Badge } from "@/components/ui/badge";
import type { DBMessage } from "@/types";
import { useTranslation } from "react-i18next";

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
  useEffect(() => {
    console.log("MESSAGES:");

    console.log(messages);
  }, []);

  return (
    <ScrollArea className="h-[calc(100vh-var(--header-height)-68px)]">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {messages.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
              selectedMessageId === item.id && "bg-muted"
            )}
            onClick={() => setSelected(item)}
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">
                    {item.subject ? item.subject : t("common:no_subject")}
                  </div>
                  {item.status === "SCHEDULED" ? (
                    <span className="flex h-2 w-2 rounded-full bg-yellow-600" />
                  ) : (
                    item.status === "FAILED" && (
                      <span className="flex h-2 w-2 rounded-full bg-red-600" />
                    )
                  )}
                </div>
                <div
                  className={cn(
                    "ml-auto text-xs",
                    selectedMessageId === item.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.send_time &&
                    formatDistanceToNow(new Date(item.send_time), {
                      addSuffix: true,
                      locale: getDateFnsLocale(i18n.language),
                    })}
                </div>
              </div>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {item.body.substring(0, 300)}
            </div>

            {/* If we are on the trash page, render a badge to show what the message was before it got moved to the trash */}
            {item.in_trash == true && (
              <div className="flex items-center gap-2">
                <Badge variant={getBadgeVariantFromLabel(item.status)}>
                  {item.status}
                </Badge>

                {/* I don't know if we need this because scheduled messages would be of status SCHEDULED */}
                {/* {item.sendDelay && (
                <Badge variant={getBadgeVariantFromLabel("SCHEDULED")}>
                  Scheduled
                </Badge>
              )} */}
              </div>
            )}
          </button>
        ))}
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
