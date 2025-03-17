"use client";

import { SetStateAction, useState } from "react";
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

export default function ScheduleMessageDropdown({
  loading,
  submit,
}: {
  loading: boolean;
  submit: (seconds: number) => void;
}) {
  const now = new Date();
  const { modal, setModal } = useModal();
  const [dropdown, setDropdown] = useState(false);
  const { message, setMessage } = useNewMessage();

  const { t } = useTranslation(["messages-page", "modals", "common"]);

  function scheduleForTomorrow(hour: number) {
    // Create a new Date object for the current date
    const now = new Date();

    // Create a new Date object for tomorrow
    const tomorrow: Date = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    // Set the specified hour and default minutes to 0
    tomorrow.setHours(hour, 0, 0, 0);
    const hours = tomorrow.getHours();

    setMessage((m) => ({
      ...m,
      scheduledDate: tomorrow,
    }));
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
          ? t(
              t("submit_btn-scheduled", {
                time: `${message.scheduledDate.getHours()}:${message.scheduledDate.getMinutes()}`,
              })
            )
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
            <h6 className="font-bold">{t("schedule-header")}</h6>
            <p className="text-muted-foreground font-normal">
              {t("schedule-header_caption")}
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => scheduleForTomorrow(9)}>
            {t("schedule-tomorrow_morning")}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => scheduleForTomorrow(15)}>
            {t("schedule-tomorrow_afternoon")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setModal((m) => ({ ...m, schedule: true }))}
          >
            <Clock className="h-4 w-4 mr-2" />
            <span>{t("schedule-custom")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
