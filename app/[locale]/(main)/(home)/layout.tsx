import ChildrenPanel from "@/components/children-panel";
import MessagesPanel from "@/components/messages-panel";
import { ResizableHandle } from "@/components/ui/resizable";

export default function HomeLayout({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  return (
    <>
      <MessagesPanel />
      <ResizableHandle withHandle />
      <ChildrenPanel>{children}</ChildrenPanel>
    </>
  );
}
