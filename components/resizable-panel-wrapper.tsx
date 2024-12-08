"use client";

import { ResizablePanelGroup } from "@/components/ui/resizable";
import { useLayout } from "@/contexts/use-layout";

interface ResizablePanelWrapperProps {
  children: React.ReactNode;
}

export default function ResizablePanelWrapper({
  children,
}: ResizablePanelWrapperProps) {
  const { setLayout } = useLayout();
  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        // console.log(`Saving layout cookie with new sizes: ${sizes}`);
        document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
          sizes
        )}`;
        setLayout(sizes);
      }}
      className="h-full items-stretch"
    >
      {children}
    </ResizablePanelGroup>
  );
}
