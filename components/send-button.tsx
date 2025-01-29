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
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogHeader,
} from "./ui/dialog";
import { addDays, addHours, format, nextSaturday } from "date-fns";
import { Calendar } from "./ui/calendar";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { DialogClose } from "@radix-ui/react-dialog";

type DateState = {
  date: Date;
  hour: string;
  minute: string;
};
export default function ScheduleMessageDropdown({
  loading,
  submit,
}: {
  loading: boolean;
  submit: (seconds: number) => void;
}) {
  const [dialog, setDialog] = useState(true);
  const [dropdown, setDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState<DateState>({
    date: new Date(),
    hour: format(Date.now(), "HH"),
    minute: format(Date.now(), "mm"),
  });

  const handleSchedule = () => {
    console.log("handleSchedule called");

    if (selectedDate) {
      console.log("SELECTED DATE:", selectedDate);

      const scheduledDate = selectedDate.date;
      scheduledDate.setHours(Number.parseInt(selectedDate.hour, 10));
      scheduledDate.setMinutes(Number.parseInt(selectedDate.minute, 10));
      const secondsFromNow = Math.floor(
        (scheduledDate.getTime() - new Date().getTime()) / 1000
      );

      // Send secondsFromNow to the server
      console.log(
        `Message will be sent in ${Math.floor(secondsFromNow / 60)} minutes`
      );

      // Close the dialog
      setDialog(false);
      submit(secondsFromNow);
    } else {
      console.log(
        "selectedDate is undefined. Can't schedule message on client"
      );
    }
  };

  return (
    <Dialog open={dialog} onOpenChange={setDialog}>
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
          Send
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
              <h6 className="font-bold">Schedule send</h6>
              <p className="text-muted-foreground font-normal">
                When do you want the message to be sent?
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Tomorrow morning</DropdownMenuItem>
            <DropdownMenuItem>Tomorrow afternoon</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setDialog(true)}>
              <Clock className="h-4 w-4 mr-2" />
              <span>Custom date</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <DialogContent className="p-6 min-w-max">
        <DialogHeader>
          <DialogTitle>Pick date and time</DialogTitle>
          <DialogDescription>View more info about a message.</DialogDescription>
        </DialogHeader>
        <div
          className="p-0 flex gap-4 h-[325px]" /** This is the exact maximum height of the calendar */
        >
          <Calendar
            mode="single"
            selected={selectedDate.date}
            onSelect={(date: Date | undefined) => {
              if (date) {
                setSelectedDate((prev) => ({ ...prev, date }));
              }
            }}
            className="rounded-md border"
          />
          <div className="flex flex-col justify-between w-full">
            <div /**className="flex flex-col h-full justify-center" */>
              <div className="flex flex-col gap-2 mb-3">
                <Label htmlFor="hour">Hour</Label>
                <Input
                  id="hour"
                  type="number"
                  min="0"
                  max="23"
                  value={selectedDate.hour}
                  onChange={(e) =>
                    setSelectedDate((prev) => ({
                      ...prev,
                      hour: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex flex-col gap-2 mb-3">
                <Label htmlFor="minute">Minute</Label>
                <Input
                  id="minute"
                  type="number"
                  min="0"
                  max="59"
                  value={selectedDate.minute}
                  onChange={(e) =>
                    setSelectedDate((prev) => ({
                      ...prev,
                      minute: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <DialogClose
                className={cn(buttonVariants({ variant: "outline" }), "")}
              >
                Close
              </DialogClose>
              <Button onClick={handleSchedule}>Schedule</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
