"use client";

import { ResizablePanelGroup } from "@/components/ui/resizable";
import { useLayout } from "@/contexts/use-layout";

interface MailLayoutWrapperProps {
  children: React.ReactNode;
}

export function ResizablePanelWrapper({ children }: MailLayoutWrapperProps) {
  const { setLayout } = useLayout();
  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        console.log(
          "saving layout cookie with new sizes: ",
          sizes
        );
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
