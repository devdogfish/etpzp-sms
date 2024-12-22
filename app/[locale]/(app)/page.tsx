"use client";
import ChildrenPanel from "@/components/children-panel";
import { useLayout } from "@/contexts/use-layout";

export default function HomePage() {
  const { layout, fallbackLayout } = useLayout();
  return <ChildrenPanel>Welcome to the messages app!</ChildrenPanel>;
}
