"use client";
import React from "react";

import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useLayout } from "@/contexts/use-layout";

import { useMessage } from "@/contexts/use-message";
import { MessageList } from "./message-list";
import { ResizableHandle, ResizablePanel } from "./ui/resizable";
import { useTranslation } from "react-i18next";
import ChildrenPanel from "./children-panel";
import PageHeader from "./page-header";

interface MessageContainerProps {
  children: React.ReactNode;
}

export default function MessageContainer({ children }: MessageContainerProps) {
  const { layout, fallbackLayout } = useLayout();
  const { t } = useTranslation();
  const { messages, setSelected, selected } = useMessage();
  return (
    <>
      {/* Start message panel */}
      <ResizablePanel
        // Check if the layout is a 3-column middle-bar panel. Use the previous 3-column layout if available; otherwise, render the fallback for different or undefined layouts.
        defaultSize={
          Array.isArray(layout) && layout.length === 3
            ? layout[1]
            : fallbackLayout[1]
        }
        minSize={22}
        maxSize={50}
      >
        <Tabs defaultValue="all">
          <div id="message-panel-header">
            <PageHeader title={t("sent_messages")}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                <TabsTrigger value="failed">Failed</TabsTrigger>
              </TabsList>
            </PageHeader>
            <div className="p-4">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search"
                    className="pl-8 placeholder:text-muted-foreground "
                  />
                </div>
              </form>
            </div>
          </div>
          <TabsContent value="all">
            <MessageList
              messages={messages}
              selectedMessageId={selected?.id || null}
              onSelectMessage={setSelected}
            />
          </TabsContent>
          <TabsContent value="scheduled">
            <MessageList
              messages={messages.filter((m) => m.status === "scheduled")}
              selectedMessageId={selected?.id || null}
              onSelectMessage={setSelected}
            />
          </TabsContent>
          <TabsContent value="failed">
            <MessageList
              messages={messages.filter((m) => m.status === "failed")}
              selectedMessageId={selected?.id || null}
              onSelectMessage={setSelected}
            />
          </TabsContent>
        </Tabs>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ChildrenPanel hasMiddleBar>{children}</ChildrenPanel>
    </>
  );
}
