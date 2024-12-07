"use client";
import React from "react";
import { ResizablePanel } from "./ui/resizable";

import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { MailList } from "./mail-list";
import { mails } from "@/lib/test-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useLayout } from "@/contexts/use-layout";

export default function MessagesSidebar() {
  const { layout } = useLayout();
  const fallbackLayout = [20, 32, 48];
  if (!layout[1]) throw new Error("DON'T KNOW WHAT TO DO");
  React.useEffect(() => {
    console.log(
      `RENDERING MessageSidebar with a width of ${layout[1]}. Layout available: ${layout}`
    );
  }, []);

  const header = document.getElementById("message-panel-header");
  document.documentElement.style.setProperty(
    "--message-panel-header-height",
    `${header?.offsetHeight}px` || `0px`
  );

  return (
    <>
      <ResizablePanel
        defaultSize={layout.length === 2 ? fallbackLayout[1] : layout[1]}
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
    </>
  );
}
