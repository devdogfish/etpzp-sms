"use client";
// this component has been copied over completely to the message container, and is not used anywhere anymore
import React from "react";

import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { MessageList } from "./message-list";
import { messages } from "@/lib/test-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useLayout } from "@/contexts/use-layout";

import { ResizablePanel } from "./ui/resizable";
import { useTranslation } from "react-i18next";

export default function MessagesPanel() {
  const { layout, fallbackLayout } = useLayout();
  const { t } = useTranslation();

  // debug
  React.useEffect(() => {
    // keep this
    const header = document.getElementById("message-panel-header");
    document.documentElement.style.setProperty(
      "--message-panel-header-height",
      `${header?.offsetHeight}px` || `0px`
    );
  }, []);
  return (
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
          <div className="flex items-center justify-between px-4 py-2">
            <h2>{t("Titles:messages")}</h2>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="failed">Failed</TabsTrigger>
            </TabsList>
          </div>
          <Separator />
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
            selectedMessageId={selectedMessage?.id || null}
            onSelectMessage={setSelected}
          />
        </TabsContent>
        <TabsContent value="scheduled">
          <MessageList
            messages={messages}
            selectedMessageId={selectedMessage?.id || null}
            onSelectMessage={setSelected}
          />
        </TabsContent>
        <TabsContent value="failed">
          <MessageList
            messages={messages}
            selectedMessageId={selectedMessage?.id || null}
            onSelectMessage={setSelected}
          />
        </TabsContent>
      </Tabs>
    </ResizablePanel>
  );
}
