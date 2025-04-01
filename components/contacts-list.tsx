"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProfilePic from "./profile-pic";
import type { DBContact } from "@/types/contact";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";

type ContactListProps = {
  contacts: DBContact[];
  selectedContactId: string | null;
  setSelected: (contact: DBContact) => void;
};

export default function ContactsList({
  contacts,
  selectedContactId,
  setSelected,
}: ContactListProps) {
  const onMobile = useIsMobile();
  return (
    <ScrollArea
      className={
        onMobile
          ? `h-[calc(100vh-var(--simple-header-height)-68px)]`
          : `h-[calc(100vh-var(--header-height)-68px)]`
      }
    >
      <div className="flex flex-col gap-2 p-4 pt-0">
        {contacts.map((contact) => (
          <Button
            key={contact.id}
            variant="ghost"
            className={cn(
              "h-full flex items-center justify-start gap-2 rounded-lg border p-3 text-left mt-[1px]",
              selectedContactId === contact.id && "bg-accent"
            )}
            onClick={() => setSelected(contact)}
          >
            <ProfilePic name={contact.name} fill={false} size={10} />
            <div className="space-y-1">
              <div className="font-semibold">{contact.name}</div>
              <div className="text-xs font-medium">{contact.phone}</div>
            </div>
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
}
