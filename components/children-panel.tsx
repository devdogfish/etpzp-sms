"use client";

import { ResizablePanel } from "./ui/resizable";
import { useLayout } from "@/contexts/use-layout";

export default function ChildrenPanel({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  const { layout } = useLayout();
  return (
    <ResizablePanel defaultSize={100 - layout[0]}>{children}</ResizablePanel>
  );
}
