"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import {  ChevronDown, Clock, Loader2, Send } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { addDays, addHours, format, nextSaturday } from "date-fns";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Calendar } from "./ui/calendar";

export default function ScheduleMessageDropdown({
  loading,
}: {
  loading: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const today = new Date();

  // const { loading } = useFormStatus();
  return (
    <Dialog open={true}>
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
            <DropdownMenuItem>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" type="button">
                  <Clock className="h-4 w-4" />
                  <span>Custom date (toggle popup)</span>
                </Button>
              </DialogTrigger>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* Rest of dialog */}
      <DialogTitle>Hello</DialogTitle>
      <DialogContent className="flex p-4 min-w-max">
        <div className="flex flex-col gap-2 border-r px-2 ">
          <div className="px-4 text-sm font-medium">Select a date</div>
          <div className="grid min-w-[250px] gap-1">
            <Button variant="ghost" className="justify-start font-normal">
              Later today{" "}
              <span className="ml-auto text-muted-foreground">
                {format(addHours(today, 4), "E, h:m b")}
              </span>
            </Button>
            <Button variant="ghost" className="justify-start font-normal">
              Tomorrow
              <span className="ml-auto text-muted-foreground">
                {format(addDays(today, 1), "E, h:m b")}
              </span>
            </Button>
            <Button variant="ghost" className="justify-start font-normal">
              This weekend
              <span className="ml-auto text-muted-foreground">
                {format(nextSaturday(today), "E, h:m b")}
              </span>
            </Button>
            <Button variant="ghost" className="justify-start font-normal">
              Next week
              <span className="ml-auto text-muted-foreground">
                {format(addDays(today, 7), "E, h:m b")}
              </span>
            </Button>
          </div>
        </div>
        <div className="p-2">
          <Calendar />
        </div>
      </DialogContent>
    </Dialog>
  );
}
