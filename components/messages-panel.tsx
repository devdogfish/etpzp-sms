"use client";
import React from "react";

import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { MailList } from "./mail-list";
import { mails } from "@/lib/test-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useLayout } from "@/contexts/use-layout";

import { ResizablePanel } from "./ui/resizable";

export default function MessagesPanel() {
  const { layout, fallbackLayout } = useLayout();

  // debug
  React.useEffect(() => {
    console.log("Messages Panel: ");

    if (layout === undefined)
      console.log(
        `Prev layout not found: ${layout}. Using fallback: ${fallbackLayout} to render global panel.`
      );
    else if (Array.isArray(layout) && layout.length !== 3)
      console.log(`Layout is defined, but NOT a 3 column layout: ${layout}.`);
    else console.log(`Everything is good, using previous layout: ${layout}.`);
    console.log("");

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
            <h1 className="font-bold text-xl">Inbox</h1>
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
          <MailList items={mails} />
        </TabsContent>
        <TabsContent value="scheduled">
          <MailList
            items={mails.filter((item) => item.status === "scheduled")}
          />
        </TabsContent>
        <TabsContent value="failed">
          <MailList 
            items={mails.filter((item) => item.status === "failed")} 
          />
        </TabsContent>
      </Tabs>
    </ResizablePanel>
  );
}
