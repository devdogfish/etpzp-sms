"use client";

import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { useLayout } from "@/contexts/use-layout";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";

type PageHeaderProps = {
  title: string;
  children?: React.ReactNode;
  skeleton?: boolean;
};

export function PageHeader({ title, children, skeleton }: PageHeaderProps) {
  const onMobile = useIsMobile();
  const { setMobileNavPanel } = useLayout();
  return (
    <>
      <div className="flex items-center gap-2 px-4 h-[var(--header-height)] border-b">
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
        {skeleton ? (
          <Skeleton
            // Consider to set this to 158 later which is the width of `Nova mensagem` title
            width=""
            height={28}
            containerClassName="mr-auto w-[30%]"
          />
        ) : (
          <h2 className="mr-auto">{title}</h2>
        )}
        {children}
      </div>
    </>
  );
}

type SectionHeaderProps = {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
  anchorName: string;
};
export function SectionHeader({
  title,
  subtitle,
  children,
  anchorName,
}: SectionHeaderProps) {
  return (
    <div>
      <Link href={`#${anchorName}`} className="mr-auto">
        <h3 id={anchorName}>{title}</h3>
      </Link>
      <p className="subtitle">{subtitle}</p>
      <Separator className="mt-5 mb-3 lg:max-w-2xl" />
      <div className="space-y-5 px-5">{children}</div>
    </div>
  );
}
