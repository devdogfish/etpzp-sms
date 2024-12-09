import ChildrenPanel from "@/components/children-panel";
import MessagesPanel from "@/components/messages-panel";
import { ResizableHandle } from "@/components/ui/resizable";
import { useLayout } from "@/contexts/use-layout";

export default function HomeLayout({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  return (
    <>
      <MessagesPanel />
      <ResizableHandle withHandle />
      <ChildrenPanel
        // use the prev layout if possible
        hasMiddleBar={true}
      >
        {children}
      </ChildrenPanel>
    </>
  );
}
