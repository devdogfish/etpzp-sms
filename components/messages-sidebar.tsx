"use client";
import React from "react";
import { ResizableHandle, ResizablePanel } from "./ui/resizable";

import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { MailList } from "./mail-list";
import { mails } from "@/lib/test-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { usePathname } from "next/navigation";

export default function MessagesSidebar({ defaultLayout = [20, 32, 48] }) {
  const pathname = usePathname();

  return (
    <>
      {pathname === "/" && (
        <>
          <ResizableHandle withHandle />

          <ResizablePanel
            defaultSize={defaultLayout && defaultLayout[1]}
            minSize={22}
          >
            <Tabs defaultValue="all">
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
                    <Input placeholder="Search" className="pl-8" />
                  </div>
                </form>
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
      )}
    </>
  );
}
