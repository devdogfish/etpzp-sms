"use client";
import { ComponentProps, useEffect } from "react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

import { cn, getNameInitials } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Contact } from "@/types";
import { Button } from "./ui/button";
import { CirclePlus } from "lucide-react";
import CreateContact from "./modals/create-contact-modal";

type ContactListProps = {
  contacts: Contact[];
  selectedContactId: string | null;
  setSelected: (contact: Contact) => void;
};

export default function ContactsList({
  contacts,
  selectedContactId,
  setSelected,
}: ContactListProps) {
  return (
    <ScrollArea className="h-[calc(100vh-52px-68px)]">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {contacts.length ? (
          contacts.map((contact) => (
            <button
              key={contact.id}
              className={cn(
                "flex contacts-start items-center gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                selectedContactId === contact.id && "bg-muted"
              )}
              onClick={() => setSelected(contact)}
            >
              <div className="rounded-full h-12 w-12 border centered ">
                {getNameInitials(contact.name)}
              </div>
              <div className="space-y-1">
                <div className="font-semibold">{contact.name}</div>
                <div className="text-xs font-medium">{contact.phone}</div>
              </div>
            </button>
          ))
        ) : (
          <div className="space-y-3 p-8 text-center text-muted-foreground">
            <p>You don't have any contacts yet</p>
            <CreateContact>
              <Button size="sm">
                <CirclePlus className="w-4 h-4" />
                Create
              </Button>
            </CreateContact>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
