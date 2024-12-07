"use client";

import * as React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface AccountSwitcherProps {
  isCollapsed: boolean;
  accounts: {
    label: string;
    email: string;
    icon: React.ReactNode;
  }[];
}

export function AccountSwitcher({ isCollapsed }: AccountSwitcherProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex gap-3 items-center justify-start w-full",
          isCollapsed && "w-9 h-9"
        )}
      >
        <Avatar className="w-9 h-9">
          <AvatarImage src="https://github.com/devdogfish.png" />
          <AvatarFallback>D</AvatarFallback>
        </Avatar>
        <span className={cn(" asflkjslkdjf", isCollapsed && "hidden")}>
          User Name
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <DropdownMenuGroup> */}
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        {/* </DropdownMenuGroup> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
