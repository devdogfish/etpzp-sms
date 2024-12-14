import ResizablePanelWrapper from "@/components/resizable-panel-wrapper";
import { ResizableHandle } from "@/components/ui/resizable";
import NavPanel from "@/components/nav-panel";

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function AppLayout({ children, params }: RootLayoutProps) {
  return (
    <ResizablePanelWrapper>
      <NavPanel navCollapsedSize={4} />
      <ResizableHandle withHandle />

      {children}
    </ResizablePanelWrapper>
  );
}
