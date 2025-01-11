"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";

import { cn, normalizePath } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

type NavLink = {
  title: string;
  label?: string;
  icon: LucideIcon;
  href: string;
  variant: "default" | "ghost";
  size?: "sm" | "md" | "xl";
};
type NavProps = {
  isCollapsed: boolean;
  links: NavLink[];
};

export default function NavLinks({ links, isCollapsed }: NavProps) {
  const pathname = usePathname();
  const { i18n } = useTranslation();

  const activeStyles =
    "bg-accent text-primary-accent hover:bg-accent hover:text-accent-foreground";

  const isNewButton = (size: string | undefined) => size === "xl"; // we only have one xl button and that is the new-message button
  // isActive takes Link, compares it to the current url, and returns whether it is the same link we are on or not.
  const isActive = (link: NavLink) => {
    return (
      !isNewButton(link.size) &&
      normalizePath(link.href, i18n) === normalizePath(pathname, i18n)
    );
  };
  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          isCollapsed ? ( // NavPanel is collapsed = render with tooltips
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={link.href}
                  className={cn(
                    buttonVariants({ variant: link.variant, size: "icon" }),
                    isNewButton(link.size) && "mb-3",
                    "h-9 w-9",
                    isActive(link) && activeStyles
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
                {link.label && (
                  <span className="ml-auto text-muted-foreground">
                    {link.label}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : ( // NavPanel is not collapsed = render links normally without tooltips
            <Link
              key={index}
              href={link.href}
              className={cn(
                buttonVariants({
                  variant: link.variant,
                  size: isNewButton(link.size) ? "lg" : "sm",
                }),
                "justify-start",
                isActive(link) && activeStyles,
                isNewButton(link.size) && "justify-center"
              )}
            >
              {!isNewButton(link.size) && (
                <link.icon className="mr-2 h-4 w-4" />
              )}
              {link.title}
              {link.label && (
                <span
                  className={cn(
                    "ml-auto",
                    link.variant === "default" &&
                      "text-background dark:text-white"
                  )}
                >
                  {link.label}
                </span>
              )}
            </Link>
          )
        )}
      </nav>
    </div>
  );
}
