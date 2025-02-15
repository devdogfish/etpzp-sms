"use client";

import { cn, getNameInitials } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import CreateContact from "./modals/create-contact-modal";
import { DBContact } from "@/types/contact";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation(["contacts-page"]);
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
              <div className="rounded-full h-12 w-12 border centered">
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
            <p>{t("none_found")}</p>
            <CreateContact />
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
