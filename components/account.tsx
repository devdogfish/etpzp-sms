"use client";

import { logout } from "@/lib/auth";
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
import { useSession } from "@/hooks/use-session";
import { useRouter } from "next/navigation";

export default function Account({ isCollapsed }: { isCollapsed: boolean }) {
  const { session, loading } = useSession();
  const router = useRouter();
  // console.log(session);

  if (loading) return <h2>Loading</h2>;
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
          <p className="font-semibold mb-[-3px]">{session?.user?.name}</p>
          <span className="text-xs">{session?.isAdmin ? "Admin" : "User"}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="z-[1000]">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <DropdownMenuGroup> */}
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Report a bug</DropdownMenuItem>
        {/* </DropdownMenuGroup> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={async () => await logout()}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
