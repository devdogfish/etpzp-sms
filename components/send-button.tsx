"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { ChevronDown, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function ScheduleMessageDropdown({ loading }: { loading: boolean}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex ml-auto">
      <Button
        type="submit"
        className="rounded-tr-none rounded-br-none border-primary-foreground border-r"
        disabled={loading}
      >
        {loading ? <Loader2 className="animate-spin" /> : ""}
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
          <DropdownMenuItem>Custom date (toggle popup)</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
