import { MailLayoutWrapper } from "@/components/mail-layout-wrapper";
import { cn } from "@/lib/utils";
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import NavPanel from "@/components/nav-panel";
import { cookies } from "next/headers";
import { accounts, mails } from "@/lib/test-data.tsx";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MailList } from "@/components/mail-list";

export default function HomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const layout = cookies().get("react-resizable-panels:layout:mail");
  const collapsed = cookies().get("react-resizable-panels:collapsed");

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;
  return (
    <TooltipProvider delayDuration={0}>
      <MailLayoutWrapper>
        <NavPanel
          defaultCollapsed={defaultCollapsed}
          navCollapsedSize={4}
          accounts={accounts}
          defaultLayout={defaultLayout}
        />
        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={defaultLayout[1]} minSize={22}>
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
            <Separator />
            <TabsContent value="all">
              <MailList items={mails} />
            </TabsContent>
            <TabsContent value="scheduled">
              <MailList items={mails.filter((item) => !item.read)} />
            </TabsContent>
            <TabsContent value="failed">
              View your failed messages here.
            </TabsContent>
          </Tabs>
        </ResizablePanel>

        <ResizableHandle withHandle />
        <ResizablePanel>{children}</ResizablePanel>
      </MailLayoutWrapper>
    </TooltipProvider>
  );
}
