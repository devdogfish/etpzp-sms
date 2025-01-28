"use client";
import { ComponentProps, useEffect } from "react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DBMessage } from "@/types";
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
  return (
    <ScrollArea className="h-[calc(100vh-52px-68px)]">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {messages.length ? (
          messages.map((item) => (
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
                      {item.subject ? item.subject : "No Subject"}
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
                    {formatDistanceToNow(new Date(item.created_at), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
                <div className="text-xs font-medium">{item.subject}</div>
              </div>
              <div className="line-clamp-2 text-xs text-muted-foreground">
                {item.body.substring(0, 300)}
              </div>

              <div className="flex items-center gap-2">
                {item.status === "SENT" && (
                  <Badge variant={getBadgeVariantFromLabel(item.status)}>
                    Success
                  </Badge>
                )}
                {item.status === "FAILED" && (
                  <Badge variant={getBadgeVariantFromLabel(item.status)}>
                    Failed
                  </Badge>
                )}
                {/* {item.sendDelay && (
                <Badge variant={getBadgeVariantFromLabel("SCHEDULED")}>
                  Scheduled
                </Badge>
              )} */}
              </div>
            </button>
          ))
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            No messages found
          </div>
        )}
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
