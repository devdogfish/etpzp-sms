"use client";

import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeft, Menu } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { useLayout } from "@/contexts/use-layout";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import { cn } from "@/lib/utils";
import Account from "./shared/account";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

type PageHeaderProps = {
  title?: string;
  skeleton?: boolean;
  marginRight?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export function PageHeader({
  title,
  skeleton,
  marginRight = true,
  className,
  children,
}: PageHeaderProps) {
  const onMobile = useIsMobile();
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "flex items-center gap-2 px-4 h-[var(--simple-header-height)]",
          title && "border-b",
          className
        )}
      >
        <div className="shrink flex items-center min-w-min whitespace-nowrap">
          {onMobile &&
            (pathname.includes("/dashboard") ? (
              <Link
                href="/"
                className={buttonVariants({ variant: "ghost", size: "icon" })}
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
            ) : (
              <MobileHamburgerButton className="mr-2" />
            ))}
          {skeleton ? (
            <Skeleton
              // Consider to set this to 158 later which is the width of `New Message` title
              width=""
              height={28}
              containerClassName="mr-auto w-[30%]"
            />
          ) : (
            <h2 className={marginRight ? "mr-auto" : ""}>{title}</h2>
          )}
        </div>
        <div className="grow flex items-center gap-2 justify-end">
          {children}
          {onMobile && <Account profilePicPosition="RIGHT" hideNameRole />}
        </div>
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

export function MobileHamburgerButton({ className }: { className: string }) {
  const { setMobileNavPanel } = useLayout();
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("md:hidden", className)}
      type="button"
      onClick={() => setMobileNavPanel(true)}
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Toggle mobile menu</span>
    </Button>
  );
}
