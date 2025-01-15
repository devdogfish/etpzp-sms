"use client";

import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNavPanel } from "@/components/nav-panel";

type PageHeaderProps = {
  title: string;
  children?: React.ReactNode;
};
export default function PageHeader({ title, children }: PageHeaderProps) {
  const onMobile = useIsMobile();
  return (
    <>
      <div className="flex items-center gap-2 px-4 h-[var(--header-height)]">
        {onMobile && <MobileNavPanel navCollapsedSize={4} />}
        <h2 className="mr-auto">{title}</h2>
        {children}
      </div>
      <Separator />
    </>
  );
}
