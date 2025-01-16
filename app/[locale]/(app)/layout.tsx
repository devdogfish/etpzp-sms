import ResizablePanelWrapper from "@/components/resizable-panel-wrapper";
import NavPanel, { MobileNavPanel } from "@/components/nav-panel";
import { cn } from "@/lib/utils";

type AppLayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

export default async function AppLayout({ children, params }: AppLayoutProps) {
  return (
    <ResizablePanelWrapper>
      <NavPanel navCollapsedSize={4} /* resizableHandle is inside here */ />
      <MobileNavPanel /* the open state is managed in useLayout context */ />

      {children}
    </ResizablePanelWrapper>
  );
}
