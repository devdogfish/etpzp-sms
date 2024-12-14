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
        setLayout(sizes);
        // console.log(`Saving layout cookie with new sizes: ${sizes}`);
        const cookieValue = JSON.stringify(sizes);
        const cookiePath = "/"; // Specify a url path. The layout should be the same, no matter where it got saved.
        document.cookie = `react-resizable-panels:layout:mail=${cookieValue}; path=${cookiePath};`;
      }}
      className="h-full items-stretch"
    >
      {children}
    </ResizablePanelGroup>
  );
}
