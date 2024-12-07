import MessagesSidebar from "@/components/messages-sidebar";
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";

export default function HomeLayout({ children }: { children: Readonly<React.ReactNode>}) {
  return (
    <>
      <MessagesSidebar />
      <ResizableHandle withHandle />
      <ResizablePanel>{children}</ResizablePanel>
    </>
  );
}
