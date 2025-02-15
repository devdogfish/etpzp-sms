"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";
import useSettings from "@/hooks/use-setting";
import { useTranslation } from "react-i18next";

type NavLink = {
  title: string;
  label?: string;
  icon: LucideIcon;
  href?: string;
  action?: () => void;
  variant: "default" | "ghost";
  size?: "sm" | "md" | "xl";
  hidden?: boolean;
  isNewButton?: boolean;
};
type NavProps = {
  isCollapsed: boolean;
  links: NavLink[];
  onMobile?: boolean;
};

export default function NavLinks({ links, isCollapsed, onMobile }: NavProps) {
  const pathname = usePathname();
  const { i18n } = useTranslation();
  const { normalizePath } = useSettings(i18n.language);

  const activeStyles =
    "bg-accent text-primary-accent hover:bg-accent hover:text-accent-foreground";

  // isActive takes Link, compares it to the current url, and returns whether it is the same link we are on or not.
  const isActive = (href: string, isNewButton: boolean | undefined) => {
    return !isNewButton && normalizePath(href) === normalizePath(pathname);
  };
  return (
    <div
      data-collapsed={isCollapsed}
      className={cn(
        `group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2`,
        onMobile && "w-[250px]"
      )}
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) => {
          const desktopItemClassName = cn(
            buttonVariants({
              variant: link.variant,
              size: link.isNewButton ? "lg" : "sm",
            }),
            "w-full justify-start",
            link.href && isActive(link.href, link.isNewButton) && activeStyles,
            link.isNewButton && "justify-center",
            link.hidden === true && "hidden"
          );

          return isCollapsed ? ( // NavPanel is collapsed = render with tooltips
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger
                className={cn(
                  buttonVariants({ variant: link.variant, size: "icon" }),
                  link.isNewButton && "mb-3",
                  "h-9 w-9",
                  link.href &&
                    isActive(link.href, link.isNewButton) &&
                    activeStyles,
                  link.hidden === true && "hidden"
                )}
                asChild
              >
                {link.href ? (
                  <Link href={link.href}>
                    <link.icon className="h-4 w-4" />
                    <span className="sr-only">{link.title}</span>
                  </Link>
                ) : (
                  <Button onClick={link.action} variant="none">
                    <link.icon className="h-4 w-4" />
                    <span className="sr-only">{link.title}</span>
                  </Button>
                )}
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
          ) : (
            // NavPanel is not collapsed = render links normally without tooltips
            <div key={index}>
              {link.href ? (
                <Link href={link.href} className={desktopItemClassName}>
                  {!link.isNewButton && <link.icon className="mr-2 h-4 w-4" />}
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
              ) : (
                <Button
                  onClick={link.action}
                  variant="none"
                  className={desktopItemClassName}
                >
                  {!link.isNewButton && <link.icon className="mr-2 h-4 w-4" />}
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
                </Button>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
