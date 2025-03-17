"use client";

import { cn, getDateFnsLocale } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ComponentProps, useEffect } from "react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { Badge } from "@/components/ui/badge";
import type { DBMessage } from "@/types";
import { useTranslation } from "react-i18next";
import ClockIcon from "./clock-icon";

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
            <div className="flex w-full flex-col">
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">
                    {item.subject ? item.subject : t("common:no_subject")}
                  </div>
                  {item.status === "SCHEDULED" && item.send_time ? (
                    <ClockIcon
                      hour={Math.round(item.send_time.getHours() % 12) || 12}
                    />
                  ) : (
                    item.status === "FAILED" && (
                      <div className="flex items-center gap-1 text-destructive text-xs">
                        <div className="flex h-2 w-2 rounded-full bg-destructive" />
                        {item.api_error_code}
                      </div>
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
              <Badge
                variant={"outline"}
                className="tracking-widest text-xs"
                style={{ letterSpacing: "3px" }}
              >
                {/* Play around with the styles */}
                {t(`status_${item.status.toLowerCase()}`).toLowerCase()}
              </Badge>
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
