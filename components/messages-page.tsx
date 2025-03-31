"use client";

import { DBMessage, CategoryEnums } from "@/types";
import React, { useEffect, useState } from "react";
import ChildrenPanel from "./shared/children-panel";
import { ResizableHandle, ResizablePanel } from "./ui/resizable";
import { useLayout } from "@/contexts/use-layout";
import { PageHeader } from "./headers";
import { useTranslation } from "react-i18next";
import { MessageList } from "./messages-list";

import { cn, searchMessages } from "@/lib/utils";
import MessageDisplay from "./message-display";
import { useIsMobile } from "@/hooks/use-mobile";
import Search from "./shared/search";
import { useSearchParams } from "next/navigation";
import useIsMounted from "@/hooks/use-mounted";
import { ModalProvider } from "@/contexts/use-modal";

export default function MessagesPage({
  messages,
  error,
  category,
}: Readonly<{
  messages: DBMessage[];
  error: boolean;
  category: CategoryEnums;
}>) {
  const { layout, fallbackLayout } = useLayout();
  const { t } = useTranslation(["messages-page", "common"]); // and more
  const [filteredMessages, setFilteredMessages] = useState(messages);
  const [selected, setSelected] = useState<DBMessage | null>(
    filteredMessages[0] || null
  );
  const isMounted = useIsMounted();
  const [isLarge, setIsLarge] = useState({
    bool: window.matchMedia("(min-width: 1024px)").matches,
    breakpoint: window.matchMedia("(min-width: 1024px)").matches ? 29 : 44,
  });
  const onMobile = useIsMobile();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  // Update ui based on search term
  const onSearch = (searchTerm: string) => {
    setFilteredMessages(searchMessages(messages, searchTerm, currentPage));
  };

  useEffect(() => {
    // Filter the messages with URLsearchParams on page load
    setFilteredMessages(searchMessages(messages, query, currentPage));
    if (selected && messages.some((msg) => msg.id === selected.id)) {
      // Keep the current selection
      setSelected(selected);
    } else {
      // If the selected message is not in the new messages, set it to null or handle accordingly
      setSelected(messages[0] || null);
    }

    // We are managing state for when to replace icons with words. The breakpoint be less on big screens while on smaller screens, the icons should show up faster.
    const handleResize = () => {
      const _isLarge = window.matchMedia("(min-width: 1024px)").matches;
      setIsLarge({ bool: _isLarge, breakpoint: _isLarge ? 33 : 49 });
    };

    handleResize(); // Check on mount
    window.addEventListener("resize", handleResize); // Check on resize

    return () => window.removeEventListener("resize", handleResize); // Cleanup
  }, [messages]);

  useEffect(() => {
    if (isMounted && onMobile) {
      // On mobile, it should show the list by default without having the first one selected like on desktop.
      setSelected(null);
    }
  }, [isMounted]);

  return (
    <>
      <ResizablePanel
        className={cn(onMobile && selected !== null && "hidden")} // If we are on mobile and a message is selected we only want to show the column containing the selected message.
        // Check if the layout is a 3-column middle-bar panel. Use the previous 3-column layout if available; otherwise, render the fallback for different or undefined layouts.
        defaultSize={
          Array.isArray(layout) && layout.length === 3
            ? layout[1]
            : fallbackLayout[1]
        }
        minSize={22}
        maxSize={50}
      >
        <PageHeader title={t(`header_${category.toLowerCase()}`)} />
        <Search
          onSearch={onSearch}
          placeholder={t(`search_${category.toLowerCase()}`)}
          className="pl-8 placeholder:text-muted-foreground border"
        />

        {filteredMessages.length > 0 ? (
          <MessageList
            messages={filteredMessages}
            selectedMessageId={selected?.id || null}
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
        className={cn(onMobile && selected === null && "hidden")}
      >
        {/* If you need other modals somewhere else, move the provider up the component tree. And don't forget to update the skeleton too! */}
        <ModalProvider>
          <MessageDisplay
            message={selected}
            reset={() => setSelected(null)}
            category={category}
          />
        </ModalProvider>
      </ChildrenPanel>
    </>
  );
}
