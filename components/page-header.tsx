"use client";
import { Separator } from "@/components/ui/separator";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { useNavPanel } from "@/contexts/use-nav-panel";
import { useIsMobile } from "@/hooks/use-mobile";

type PageHeaderProps = {
  title: string;
  children?: React.ReactNode;
};
export default function PageHeader({ title, children }: PageHeaderProps) {
  const { setIsExpanded } = useNavPanel();
  const isMobile = useIsMobile();
  return (
    <>
      <div className="flex items-center gap-2 px-4 h-[var(--header-height)]">
        {isMobile && (
          <Button variant="ghost" onClick={() => setIsExpanded(true)}>
            <Menu className="w-4 h-4" />
          </Button>
        )}
        <h2 className="mr-auto">{title}</h2>
        {children}
      </div>
      <Separator />
    </>
  );
}
