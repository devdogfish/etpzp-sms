"use client";
import React from "react";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function SendButton() {
  return (
    <div className="flex ml-auto">
      {/* send message normally button */}
      <Button className="rounded-tr-none rounded-br-none">Send</Button>

      {/* schedule message button */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn("flex gap-3 items-center justify-start w-full")}
          asChild
        >
          <Button
            className="px-[1px] rounded-tl-none rounded-bl-none shadow-none border-primary-foreground border-l"
            type="button"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <h6 className="font-bold">Schedule send</h6>
            <p className="text-muted-foreground font-normal">When do you want the message to be sent?</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {/* <DropdownMenuGroup> */}
          <DropdownMenuItem>Tomorrow morning</DropdownMenuItem>
        <DropdownMenuItem>Tomorrow afternoon</DropdownMenuItem>
        <DropdownMenuItem>Custom date (toggle popup)</DropdownMenuItem>
          {/* </DropdownMenuGroup> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
