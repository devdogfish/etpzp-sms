"use client";

import React, { useEffect, useState } from "react";
import ChildrenPanel from "./shared/children-panel";
import { ResizableHandle, ResizablePanel } from "./ui/resizable";
import { useLayout } from "@/contexts/use-layout";
import { PageHeader } from "./header";
import { useTranslation } from "react-i18next";
import ContactsList from "./contacts-list";

import { cn, searchContacts } from "@/lib/utils";
import ContactDisplay from "./contact-display";
import { useIsMobile } from "@/hooks/use-mobile";
import Search from "./shared/search";
import { useRouter, useSearchParams } from "next/navigation";
import { CirclePlus } from "lucide-react";
import { Button } from "./ui/button";
import { useContactModals } from "@/contexts/use-contact-modals";
import { DBContact } from "@/types/contact";
import CreateContactModal from "./modals/create-contact-modal";
import useIsMounted from "@/hooks/use-mounted";

export default function ContactsPage({
  contacts,
  error,
}: Readonly<{
  contacts: DBContact[];
  error: string;
}>) {
  const { layout, fallbackLayout } = useLayout();
  const { t } = useTranslation(["contacts-page"]);
  const [filteredContacts, setFilteredContacts] = useState(contacts);
  const onMobile = useIsMobile();
  const isMounted = useIsMounted();

  const [selected, setSelected] = useState<DBContact | null>(
    filteredContacts[0] || null
  );

  const searchParams = useSearchParams();

  const onSearch = () => {
    setFilteredContacts(searchContacts(contacts, searchParams.get("query")));
  };

  useEffect(() => {
    setFilteredContacts(searchContacts(contacts, searchParams.get("query")));
    if (selected && contacts.some((msg) => msg.id === selected.id)) {
      // Keep the current selection
      setSelected(selected);
    } else {
      // If the selected contact is not in the new messages, select the first contact or handle accordingly
      setSelected(contacts[0] || null);
    }
  }, [contacts]);

  useEffect(() => {
    if (isMounted && onMobile) {
      // On mobile, it should show the list by default without having the first one selected like on desktop.
      setSelected(null);
    }
  }, [isMounted]);

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
        <PageHeader title={t("header")}>
          {/* Not sure if this is allowed to be here */}
          <CreateContactModal
            onCreateNew={(contact: DBContact) => setSelected(contact)}
          />
          <Button size="sm" onClick={showCreateModal}>
            <CirclePlus />
            {t("new")}
          </Button>
        </PageHeader>
        <Search
          onSearch={onSearch}
          placeholder={t("search_contacts")}
          className="pl-8 placeholder:text-muted-foreground border"
        />
        {filteredContacts.length > 0 ? (
          <ContactsList
            contacts={filteredContacts}
            selectedContactId={selected?.id || null}
            setSelected={setSelected}
          />
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            {error || t("none_found")}
          </div>
        )}
      </ResizablePanel>
      <ResizableHandle withHandle className={cn(onMobile && "hidden")} />

      <ChildrenPanel
        hasMiddleBar
        // reverse logic like above: on mobile and with nothing selected, this component should be hidden.
        className={cn(onMobile && selected === null && "hidden")} // like above we are using reverse logic here. If we are on mobile, and nothing is selected, this component should not be displayed.
      >
        <ContactDisplay contact={selected} reset={() => setSelected(null)} />
      </ChildrenPanel>
    </>
  );
}
