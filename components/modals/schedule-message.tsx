"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogHeader,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button, buttonVariants } from "../ui/button";
import { useTranslation } from "react-i18next";
import { useModal } from "@/contexts/use-modal";
import { useNewMessage } from "@/contexts/use-new-message";

export default function ScheduleMessageModal() {
  const now = new Date();
  const { t } = useTranslation();
  const { modal, setModal } = useModal();
  const { message, setMessage } = useNewMessage();
  const [selectedDate, setSelectedDate] = useState(message.scheduledDate);

  const handleCancelButtonClick = () => {
    if (selectedDate > new Date()) {
      // date is in the future - so reset it to now
      setSelectedDate(now);
    } else {
      setModal((m) => ({ ...m, schedule: false }));
    }
  };

  const applySelectedDate = () => {
    if (selectedDate.getTime() !== message.scheduledDate.getTime()) {
      // When a date is specified by the user, we set a flag to true.
      // We do it like this, because message.scheduledDate could be in the past due to retrieved database value.
      setMessage((m) => ({ ...m, scheduledDateModified: true }));
    }

    setMessage((m) => ({ ...m, scheduledDate: selectedDate }));
    setModal((m) => ({ ...m, schedule: false }));
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (modal.schedule === true && event.key === "Enter") {
      applySelectedDate();
    }
  };

  useEffect(() => {
    // Add event listener for keydown
    document.addEventListener("keydown", handleKeyPress);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [modal.schedule]);

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
            selected={selectedDate}
            onSelect={(date: Date | undefined) => {
              setSelectedDate((prev) => (date ? date : prev));
            }}
            className="rounded-md border"
          />
          <div className="flex flex-col justify-between w-full">
            <div /** className="flex flex-col h-full justify-center" */>
              <div className="flex flex-col gap-2 mb-3">
                <Label htmlFor="hour">
                  {t("modals:schedule_message-hour_label")}
                </Label>
                <TimeInput
                  id="hour"
                  min={0}
                  max={23}
                  value={selectedDate.getHours()}
                  onChange={(value) =>
                    setSelectedDate((prev) => new Date(prev.setHours(value)))
                  }
                />
              </div>
              <div className="flex flex-col gap-2 mb-3">
                <Label htmlFor="minute">
                  {t("modals:schedule_message-minute_label")}
                </Label>
                <TimeInput
                  id="minute"
                  min={0}
                  max={59}
                  value={selectedDate.getMinutes()}
                  onChange={(value) =>
                    setSelectedDate((prev) => new Date(prev.setMinutes(value)))
                  }
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleCancelButtonClick}>
                {selectedDate > now
                  ? t("modals:schedule_message-reset")
                  : t("common:cancel")}
              </Button>
              <Button onClick={applySelectedDate}>
                {selectedDate > now
                  ? t("modals:schedule_message-submit")
                  : t("modals:schedule_message-submit_now")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ScheduleAlertModal() {
  const { modal, setModal } = useModal();
  const { form } = useNewMessage();
  const { t } = useTranslation();

  return (
    <>
      {/* "Confirm Logout" dialog */}
      <AlertDialog
        open={modal.scheduleAlert}
        onOpenChange={(value) =>
          setModal((m) => ({ ...m, scheduleAlert: value }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("modals:schedule_alert-header")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("modals:schedule_alert-header_caption")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common:cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                console.log("Requesting submit from form", form);
                // DEBUG / CONTINUE_HERE
                form?.submit();
              }}
            >
              {t("common:continue")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Define the props type for the TimeInput component
type TimeInputProps = {
  id: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
};

// TimeInput component
function TimeInput({ id, value, onChange, min, max }: TimeInputProps) {
  const [displayValue, setDisplayValue] = useState<string>(
    value < 10 ? `0${value}` : value.toString()
  );
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);

    const numericValue = Number(inputValue);
    if (numericValue >= min && numericValue <= max) {
      onChange(numericValue);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    const numericValue = Number(displayValue);
    if (numericValue >= min && numericValue <= max) {
      setDisplayValue(
        numericValue < 10 ? `0${numericValue}` : numericValue.toString()
      );
    }
  };

  useEffect(() => {
    // reflect the current date object in the inputs whenever they change
    if (isFocused === false) {
      setDisplayValue(value < 10 ? `0${value}` : value.toString());
    }
  }, [value]);

  return (
    <Input
      id={id}
      type="number"
      min={min}
      max={max}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur} // Add onBlur event handler
      onFocus={() => setIsFocused(true)}
    />
  );
}
