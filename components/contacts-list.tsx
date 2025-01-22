"use client";
import { ComponentProps, useEffect } from "react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Contact } from "@/types";
import { Button } from "./ui/button";

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
                "flex flex-col contacts-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                selectedContactId === contact.id && "bg-muted"
              )}
              onClick={() => setSelected(contact)}
            >
              <div className="font-semibold">{contact.name}</div>
              <div className="text-xs font-medium">{contact.phone}</div>
            </button>
          ))
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            No contacts found
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

function getBadgeVariantFromLabel(
  label: string
): ComponentProps<typeof Badge>["variant"] {
  // if (["success"].includes(label.toLowerCase())) {
  //   return "positive";
  // }

  if (["FAILED"].includes(label.toLowerCase())) {
    return "destructive";
  }

  if (["SCHEDULED"].includes(label.toLowerCase())) {
    return "outline";
  }

  return "secondary";
}
