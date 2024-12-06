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
import MessagesSidebar from "@/components/messages-sidebar";
import initTranslations from "@/app/i18n";

const i18nNamespaces = ["Home", "Common"];
export default async function HomeLayout({
  children, params
}: Readonly<{ children: React.ReactNode }>) {
  // const { t} = initTranslations(params.locales, i18nNamespaces)

  const cookieStore = await cookies();
  const layout = cookieStore.get("react-resizable-panels:layout:mail");
  const collapsed = cookieStore.get("react-resizable-panels:collapsed");

  // getting prev. sizes resizable-sidebar-panels and using it as default value
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
        <MessagesSidebar />
        <ResizableHandle withHandle />

        <ResizablePanel>{children}</ResizablePanel>
      </MailLayoutWrapper>
    </TooltipProvider>
  );
}
