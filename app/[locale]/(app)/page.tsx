"use client";
import ChildrenPanel from "@/components/children-panel";
import PageHeader from "@/components/page-header";
import { useLayout } from "@/contexts/use-layout";

export default function HomePage() {
  const { layout, fallbackLayout } = useLayout();
  return (
    <ChildrenPanel>
      <PageHeader title="Welcome to the Etpzp SMS App!" />
    </ChildrenPanel>
  );
}
