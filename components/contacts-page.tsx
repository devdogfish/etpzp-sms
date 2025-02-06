"use client";

import React, { useEffect, useState } from "react";
import ChildrenPanel from "./shared/children-panel";
import { ResizableHandle, ResizablePanel } from "./ui/resizable";
import { useLayout } from "@/contexts/use-layout";
import { PageHeader } from "./header";
import { useTranslation } from "react-i18next";
import ContactsList from "./contacts-list";

import {
  cn,
  searchContacts,
  // searchContacts
} from "@/lib/utils";
import ContactDisplay from "./contact-display";
import { useIsMobile } from "@/hooks/use-mobile";
import Search from "./shared/search";
import { useRouter, useSearchParams } from "next/navigation";
import { CirclePlus } from "lucide-react";
import { Button } from "./ui/button";
import { useContactModals } from "@/contexts/use-contact-modals";
import { DBContact } from "@/types/contact";

export default function ContactsPage({
  contacts,
  error,
}: Readonly<{
  contacts: DBContact[];
  error: string;
}>) {
  const { layout, fallbackLayout } = useLayout();
  const { t, i18n } = useTranslation(["Common Words"]);
  const [filteredContacts, setFilteredContacts] = useState(contacts);
  const [selected, setSelected] = useState<DBContact | null>(null);

  const onMobile = useIsMobile();
  const searchParams = useSearchParams();

  const isMobile = useIsMobile();
  const router = useRouter();

  const onSearch = () => {
    setFilteredContacts(searchContacts(contacts, searchParams.get("query")));
  };

  useEffect(() => {
    setFilteredContacts(searchContacts(contacts, searchParams.get("query")));

    setFilteredContacts(contacts);
    setSelected((prev) => {
      if (prev !== null)
        return contacts.find((contact) => contact.id == prev.id) || null;
      else return null;
    });
  }, [contacts]);

  const { setModal } = useContactModals();
  const showCreateModal = () => setModal((prev) => ({ ...prev, create: true }));
  return (
    <>
      <ResizablePanel
        className={cn(onMobile && selected !== null && "hidden")} // If we are on mobile and a contact is selected we only want to show the column containing the selected contact.
        // Check if the layout is a 3-column middle-bar panel. Use the previous 3-column layout if available; otherwise, render the fallback for different or undefined layouts.
        defaultSize={
          Array.isArray(layout) && layout.length === 3
            ? layout[1]
            : fallbackLayout[1]
        }
        minSize={22}
        maxSize={50}
      >
        {/** WE WILL HAVE location SUBSTITUTED HERE */}
        <PageHeader title={t("CONTACT")}>
          <Button size="sm" onClick={showCreateModal}>
            <CirclePlus className="w-4 h-4" />
            New contact
          </Button>
        </PageHeader>
        <Search
          onSearch={onSearch}
          placeholder={String(t("search") + " " + t("CONTACT").toLowerCase())}
          className="pl-8 placeholder:text-muted-foreground border"
        />
        <ContactsList
          contacts={filteredContacts}
          selectedContactId={selected?.id || null}
          setSelected={setSelected}
        />
      </ResizablePanel>
      <ResizableHandle withHandle className={cn(onMobile && "hidden")} />

      <ChildrenPanel
        hasMiddleBar
        className={cn(onMobile && selected === null && "hidden")} // like above we are using reverse logic here. If we are on mobile, and nothing is selected, this component should not be displayed.
      >
        <ContactDisplay contact={selected} reset={() => setSelected(null)} />
      </ChildrenPanel>
    </>
  );
}
