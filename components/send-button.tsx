"use client";

import { SetStateAction, useState } from "react";
import { Button } from "./ui/button";
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
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "./ui/dialog";
import { addDays, addHours, format, nextSaturday } from "date-fns";
import { Calendar } from "./ui/calendar";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function ScheduleMessageDropdown({
  loading,
  setScheduledTime,
  submit,
}: {
  loading: boolean;
  setScheduledTime: React.Dispatch<SetStateAction<number>>;
  submit: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedHour, setSelectedHour] = useState<string>("12");
  const [selectedMinute, setSelectedMinute] = useState<string>("00");
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const today = new Date();

  const handlePresetDate = (date: Date) => {
    setSelectedDate(date);
    setSelectedHour(format(date, "HH"));
    setSelectedMinute(format(date, "mm"));
  };

  const handleSchedule = () => {
    if (selectedDate) {
      const scheduledDate = new Date(selectedDate);
      scheduledDate.setHours(Number.parseInt(selectedHour, 10));
      scheduledDate.setMinutes(Number.parseInt(selectedMinute, 10));

      const secondsFromNow = Math.floor(
        (scheduledDate.getTime() - new Date().getTime()) / 1000
      );

      // Send secondsFromNow to the server
      console.log("Seconds from now:", secondsFromNow);

      // Close the dialog
      setIsDialogOpen(false);
      setScheduledTime(secondsFromNow);

    }
    submit();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
        <DropdownMenu onOpenChange={setIsOpen}>
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
                  isOpen && "rotate-180"
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
            <DropdownMenuItem onSelect={() => setIsDialogOpen(true)}>
              <Clock className="h-4 w-4 mr-2" />
              <span>Custom date</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <DialogContent className="flex p-4 min-w-max">
        <div className="flex flex-col gap-2 border-r px-2 ">
          <div className="px-4 text-sm font-medium">Select a date</div>
          <div className="grid min-w-[250px] gap-1">
            <Button
              variant="ghost"
              className="justify-start font-normal"
              onClick={() => handlePresetDate(addHours(today, 4))}
            >
              Later today{" "}
              <span className="ml-auto text-muted-foreground">
                {format(addHours(today, 4), "E, h:mm a")}
              </span>
            </Button>
            <Button
              variant="ghost"
              className="justify-start font-normal"
              onClick={() => handlePresetDate(addDays(today, 1))}
            >
              Tomorrow
              <span className="ml-auto text-muted-foreground">
                {format(addDays(today, 1), "E, h:mm a")}
              </span>
            </Button>
            <Button
              variant="ghost"
              className="justify-start font-normal"
              onClick={() => handlePresetDate(nextSaturday(today))}
            >
              This weekend
              <span className="ml-auto text-muted-foreground">
                {format(nextSaturday(today), "E, h:mm a")}
              </span>
            </Button>
            <Button
              variant="ghost"
              className="justify-start font-normal"
              onClick={() => handlePresetDate(addDays(today, 7))}
            >
              Next week
              <span className="ml-auto text-muted-foreground">
                {format(addDays(today, 7), "E, h:mm a")}
              </span>
            </Button>
          </div>
        </div>
        <div className="p-2 flex flex-col gap-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
          <div className="flex gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="hour">Hour</Label>
              <Input
                id="hour"
                type="number"
                min="0"
                max="23"
                value={selectedHour}
                onChange={(e) => setSelectedHour(e.target.value)}
                className="w-20"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="minute">Minute</Label>
              <Input
                id="minute"
                type="number"
                min="0"
                max="59"
                value={selectedMinute}
                onChange={(e) => setSelectedMinute(e.target.value)}
                className="w-20"
              />
            </div>
          </div>
          <Button onClick={handleSchedule}>Schedule</Button>
        </div>
      </DialogContent>
      <DialogTitle className="sr-only">Schedule your message</DialogTitle>
    </Dialog>
  );
}
