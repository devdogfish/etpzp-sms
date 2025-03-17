"use client";
import React, { ChangeEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogHeader,
} from "../ui/dialog";
import { addDays, addHours, format, nextSaturday } from "date-fns";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useModal } from "@/contexts/use-modal";
import { useNewMessage } from "@/contexts/use-new-message";

export default function ScheduleMessageModal() {
  const { t } = useTranslation();
  const { modal, setModal } = useModal();
  const { message, setMessage } = useNewMessage();
  return (
    <Dialog
      open={modal.schedule}
      onOpenChange={() => setModal((m) => ({ ...m, schedule: false }))}
    >
      <DialogContent className="p-6 min-w-max">
        <DialogHeader>
          <DialogTitle>{t("modals:schedule_message-header")}</DialogTitle>
          <DialogDescription>
            {t("modals:schedule_message-header_caption")}
          </DialogDescription>
        </DialogHeader>
        <div
          className="p-0 flex gap-4 h-[325px]" /** This is the exact maximum height of the calendar */
        >
          <Calendar
            mode="single"
            selected={message.scheduledDate}
            onSelect={(date: Date | undefined) => {
              if (date) {
                setMessage((m) => ({
                  ...m,
                  scheduledDate: date,
                }));
              }
            }}
            className="rounded-md border"
          />
          <div className="flex flex-col justify-between w-full">
            <div /** className="flex flex-col h-full justify-center" */>
              <div className="flex flex-col gap-2 mb-3">
                <Label htmlFor="hour">
                  {t("modals:schedule_message-hour_label")}
                </Label>
                <Input
                  id="hour"
                  type="number"
                  min="0"
                  max="23"
                  value={message.scheduledDate.getHours()}
                  onChange={(e) =>
                    setMessage((m) => ({
                      ...m,
                      scheduledDate: new Date(
                        m.scheduledDate.setHours(Number(e.target.value))
                      ),
                    }))
                  }
                />
              </div>
              <div className="flex flex-col gap-2 mb-3">
                <Label htmlFor="minute">
                  {t("modals:schedule_message-minute_label")}
                </Label>
                <Input
                  id="minute"
                  type="number"
                  min={0}
                  max={59}
                  value={message.scheduledDate.getMinutes()}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setMessage((m) => ({
                      ...m,
                      scheduledDate: new Date(
                        m.scheduledDate.setMinutes(Number(e.target.value))
                      ),
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <DialogClose
                className={cn(buttonVariants({ variant: "outline" }), "")}
              >
                {t("common:cancel")}
              </DialogClose>
              <Button onClick={() => console.log("TODO")}>
                {t("modals:schedule_message-submit", {
                  time: `${message.scheduledDate.getHours()}:${message.scheduledDate.getMinutes()}`,
                })}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
