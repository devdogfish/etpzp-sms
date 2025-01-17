"use client";
import { DBMessage, LocationEnums } from "@/types";
import React, { ChangeEvent, useCallback, useState } from "react";
import ChildrenPanel from "./children-panel";
import { ResizableHandle, ResizablePanel } from "./ui/resizable";
import { useLayout } from "@/contexts/use-layout";
import PageHeader from "./page-header";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { MessageList } from "./message-list";

import { cn, searchMessages } from "@/lib/utils";
import { MessageDisplay } from "./message-display";
import { useIsMobile } from "@/hooks/use-mobile";
import Search from "./shared/search";
import { useSearchParams } from "next/navigation";

export default function MessagesPage({
  messages,
  error,
  location,
}: Readonly<{
  messages: DBMessage[];
  error?: string;
  location: LocationEnums;
}>) {
  const { layout, fallbackLayout } = useLayout();
  const { t, i18n } = useTranslation(["Common Words"]);
  const [filteredMessages, setFilteredMessages] = useState(messages);
  const [selected, setSelected] = useState<DBMessage | null>(null);
  const onMobile = useIsMobile();

  // Cation: if we update the searchparams, the server-component will re-render
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  // Update ui based on search term
  const onSearch = () => {
    setFilteredMessages(searchMessages(messages, query, currentPage));
  };

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
        <Tabs defaultValue="ALL">
          {/** WE WILL HAVE location SUBSTITUTED HERE */}
          <PageHeader title={t(location)}>
            {!error && (
              <TabsList>
                <TabsTrigger value="ALL">{t("all")}</TabsTrigger>
                <TabsTrigger value="SCHEDULED">{t("scheduled")}</TabsTrigger>
                <TabsTrigger value="FAILED">{t("failed")}</TabsTrigger>
              </TabsList>
            )}
          </PageHeader>
          <Search
            onSearch={onSearch}
            // name="search"
            placeholder={String(t("search") + " " + t(location).toLowerCase())}
            className="pl-8 placeholder:text-muted-foreground border"
          />

          {error && <p>{error}</p>}
          <TabsContent value="ALL">
            <MessageList
              messages={filteredMessages}
              selectedMessageId={selected?.id || null}
              setSelected={setSelected}
            />
          </TabsContent>
          <TabsContent value="SCHEDULED">
            <MessageList
              messages={filteredMessages.filter(
                ({ status }) => status === "SCHEDULED"
              )}
              selectedMessageId={selected?.id || null}
              setSelected={setSelected}
            />
          </TabsContent>
          <TabsContent value="FAILED">
            <MessageList
              messages={filteredMessages.filter(
                ({ status }) => status === "FAILED"
              )}
              selectedMessageId={selected?.id || null}
              setSelected={setSelected}
            />
          </TabsContent>
        </Tabs>
      </ResizablePanel>
      <ResizableHandle withHandle className={cn(onMobile && "hidden")} />
      <ChildrenPanel
        hasMiddleBar
        className={cn(onMobile && selected === null && "hidden")} // like above we are using reverse logic here. If we are on mobile, and nothing is selected, this component should not be displayed.
      >
        <MessageDisplay
          message={selected}
          resetMessage={() => setSelected(null)}
        />
      </ChildrenPanel>
    </>
  );
}
