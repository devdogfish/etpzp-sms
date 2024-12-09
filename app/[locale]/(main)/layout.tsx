import NavPanel from "@/components/nav-panel";
import ResizablePanelWrapper from "@/components/resizable-panel-wrapper";
import { ResizableHandle } from "@/components/ui/resizable";

export default function Layout({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  return (
    <ResizablePanelWrapper>
      <NavPanel navCollapsedSize={4} />
      <ResizableHandle withHandle />

      {children}
    </ResizablePanelWrapper>
  );
}
