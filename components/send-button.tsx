"use client";

import { SetStateAction, useEffect, useState } from "react";
import { Button, buttonVariants } from "./ui/button";
import { ChevronDown, Clock, Loader2, Send } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { useNewMessage } from "@/contexts/use-new-message";
import { useModal } from "@/contexts/use-modal";
import { PORTUGUESE_DATE_FORMAT } from "@/global.config";

export default function ScheduleMessageDropdown({
  loading,
}: {
  loading: boolean;
}) {
  const now = new Date();
  const { modal, setModal } = useModal();
  const [dropdown, setDropdown] = useState(false);
  const { message, setMessage } = useNewMessage();
  const { t } = useTranslation(["messages-page", "modals", "common"]);

  function tomorrowAt(hour: number) {
    // Create a new Date object for the current date
    const now = new Date();

    // Create a new Date object for tomorrow
    const tomorrow: Date = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    // Set the specified hour and default minutes to 0
    tomorrow.setHours(hour, 0, 0, 0);
    const hours = tomorrow.getHours();

    return tomorrow;
  }

  return (
    <div className="flex">
      <Button
        type="submit"
        className="rounded-tr-none rounded-br-none border-primary-foreground border-r"
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        {message.scheduledDate > now
          ? `${t("submit_btn-scheduled", {
              time: "",
            })} ${format(message.scheduledDate, PORTUGUESE_DATE_FORMAT)}`
          : t("submit_btn-normal")}
      </Button>
      <DropdownMenu onOpenChange={setDropdown}>
        <DropdownMenuTrigger
          className={cn("flex gap-3 items-center justify-start w-full")}
          asChild
        >
          <Button
            className="px-[1px] rounded-tl-none rounded-bl-none shadow-none"
            type="button"
            disabled={loading}
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                dropdown && "rotate-180"
              )}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <h6 className="font-bold">{t("schedule_dropdown-header")}</h6>
            <p className="text-muted-foreground font-normal">
              {t("schedule_dropdown-header_caption")}
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {message.scheduledDate > now && (
            <DropdownMenuItem
              onSelect={() => setMessage((m) => ({ ...m, scheduledDate: now }))}
            >
              {t("schedule_dropdown-reset")}
            </DropdownMenuItem>
          )}
          {message.scheduledDate.getTime() !== tomorrowAt(9).getTime() && (
            <DropdownMenuItem
              onSelect={() =>
                setMessage((m) => ({
                  ...m,
                  scheduledDate: tomorrowAt(9),
                }))
              }
            >
              {t("schedule_dropdown-tomorrow_morning")}
            </DropdownMenuItem>
          )}
          {message.scheduledDate.getTime() !== tomorrowAt(15).getTime() && (
            <DropdownMenuItem
              onSelect={() =>
                setMessage((m) => ({
                  ...m,
                  scheduledDate: tomorrowAt(15),
                }))
              }
            >
              {t("schedule_dropdown-tomorrow_afternoon")}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onSelect={() => setModal((m) => ({ ...m, schedule: true }))}
          >
            <span>{t("schedule_dropdown-custom")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
