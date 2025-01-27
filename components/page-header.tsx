"use client";

import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { useLayout } from "@/contexts/use-layout";

type PageHeaderProps = {
  title: string;
  children?: React.ReactNode;
};

export default function PageHeader({ title, children }: PageHeaderProps) {
  const onMobile = useIsMobile();
  const { setMobileNavPanel } = useLayout();
  return (
    <>
      <div className="flex items-center gap-2 px-4 h-[52px] min-h-[52px]">
        {onMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            type="button"
            onClick={() => setMobileNavPanel(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle mobile menu</span>
          </Button>
        )}
        <h2 className="mr-auto">{title}</h2>
        {children}
      </div>
      <Separator />
    </>
  );
}
