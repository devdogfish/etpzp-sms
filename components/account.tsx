"use client";

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

interface AccountProps {
  isCollapsed: boolean;
}

export default function Account({ isCollapsed }: AccountProps) {
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
        <div
          className={cn("flex flex-col items-start", isCollapsed && "hidden")}
        >
          <p className="font-semibold mb-[-3px]">User Name</p>
          <span className="text-xs">Admin</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <DropdownMenuGroup> */}
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Report a bug</DropdownMenuItem>
        {/* </DropdownMenuGroup> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
