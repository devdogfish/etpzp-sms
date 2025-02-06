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

export function PageHeader({ title, children }: PageHeaderProps) {
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

type SectionHeaderProps = {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
};
export function SectionHeader({
  title,
  subtitle,
  children,
}: SectionHeaderProps) {
  const onMobile = useIsMobile();
  const { setMobileNavPanel } = useLayout();
  return (
    <div>
      <h3 className="mr-auto">{title}</h3>
      <p className="subtitle">{subtitle}</p>
      <Separator className="mt-5 mb-3 lg:max-w-2xl" />
      <div className="space-y-5 px-5">{children}</div>
    </div>
  );
}
