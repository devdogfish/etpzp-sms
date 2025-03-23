"use client";

import { ChevronDown } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DBUser } from "@/types/user";
import { DBMessage } from "@/types";
import { getNameInitials } from "@/lib/utils";
import ProfilePic from "../profile-pic";

export default function UserRanking({
  users,
  messages,
}: {
  users: DBUser[];
  messages: DBMessage[];
}) {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>
          Currently signed up users and their messages
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        <div className="max-h-[300px] overflow-auto">
          <table className="">
            <tbody>
              {users
                .map((user) => ({
                  ...user,
                  messageCount: messages.filter((m) => m.user_id === user.id)
                    .length,
                }))
                .sort((a, b) => b.messageCount - a.messageCount)
                .map((user, index) => (
                  <tr key={user.id || index} className="text-left">
                    <td className="w-1/12 p-2">
                      {/* First column for index */}
                      <p>{index + 1}.</p>
                    </td>
                    <td className="w-1/12 p-2">
                      {/* Second column for profile picture */}
                      <ProfilePic name={user.name} />
                    </td>
                    <td className="p-2">
                      {/* Last column for user details */}
                      <div className="flex flex-col">
                        <p className="text-sm font-medium leading-none">
                          {user.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </td>
                    <td className="w-1/12 p-2 font-semibold">
                      {messages.filter((m) => m.user_id == user.id).length}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 



<Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto">
                Owner <ChevronDown className="text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="end">
              <Command>
                <CommandInput placeholder="Select new role..." />
                <CommandList>
                  <CommandEmpty>No roles found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                      <p>Viewer</p>
                      <p className="text-sm text-muted-foreground">
                        Can view and comment.
                      </p>
                    </CommandItem>
                    <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                      <p>Developer</p>
                      <p className="text-sm text-muted-foreground">
                        Can view, comment and edit.
                      </p>
                    </CommandItem>
                    <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                      <p>Billing</p>
                      <p className="text-sm text-muted-foreground">
                        Can view, comment and manage billing.
                      </p>
                    </CommandItem>
                    <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                      <p>Owner</p>
                      <p className="text-sm text-muted-foreground">
                        Admin-level access to all resources.
                      </p>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
 */
