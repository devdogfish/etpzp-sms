import MessagesPanel from "@/components/messages-panel";
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";

export default function HomeLayout({ children }: { children: Readonly<React.ReactNode>}) {
  return (
    <>
      <MessagesPanel />
      <ResizableHandle withHandle />
      <ResizablePanel>{children}</ResizablePanel>
    </>
  );
}
