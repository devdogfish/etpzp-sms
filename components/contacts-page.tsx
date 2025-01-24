"use client";
import { Contact } from "@/types";
import React, { useEffect, useState } from "react";
import ChildrenPanel from "./shared/children-panel";
import { ResizableHandle, ResizablePanel } from "./ui/resizable";
import { useLayout } from "@/contexts/use-layout";
import PageHeader from "./page-header";
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

export default function ContactsPage({
  contacts,
}: Readonly<{
  contacts: Contact[];
}>) {
  const { layout, fallbackLayout } = useLayout();
  const { t, i18n } = useTranslation(["Common Words"]);
  const [filteredContacts, setFilteredContacts] = useState(contacts);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [isLarge, setIsLarge] = useState({
    bool: window.matchMedia("(min-width: 1024px)").matches,
    breakpoint: window.matchMedia("(min-width: 1024px)").matches ? 29 : 44,
  });
  const onMobile = useIsMobile();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const currentPage = Number(searchParams.get("page")) || 1;
  const isMobile = useIsMobile();
  const router = useRouter();

  // Update ui based on search term
  const onSearch = (term: string) => {
    // CAUTION: when implementing pagination make sure the url is not delayed usually, you would use searchParams which are always up to date, but we are using params.set() which can be one late
    setFilteredContacts(searchContacts(contacts, term, currentPage));
  };

  useEffect(() => {
    // Filter the contacts with URLsearchParams on page load
    setFilteredContacts(searchContacts(contacts, query, currentPage));
    // We are managing state for when to replace icons with words. The breakpoint be less on big screens while on smaller screens, the icons should show up faster.
    const handleResize = () => {
      const _isLarge = window.matchMedia("(min-width: 1024px)").matches;
      setIsLarge({ bool: _isLarge, breakpoint: _isLarge ? 33 : 49 });
    };

    handleResize(); // Check on mount
    window.addEventListener("resize", handleResize); // Check on resize

    setFilteredContacts(contacts);
    setSelected((prev) => {
      if (prev !== null)
        return contacts.find((contact) => contact.id == prev.id) || null;
      else return null;
    });
    return () => window.removeEventListener("resize", handleResize); // Cleanup
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
            New Contact
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
