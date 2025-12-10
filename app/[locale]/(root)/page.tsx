"use client";
import ChildrenPanel from "@/components/shared/children-panel";
import { useLayout } from "@/contexts/use-layout";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import LinkCard from "@/components/cards";
import { useThemeContext } from "@/contexts/theme-data-provider";
import Envelope from "@/public/icons/envelope-solid.svg";
import Contact from "@/public/icons/user-solid.svg";
import { PageHeader } from "@/components/headers";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

export default function WelcomePage() {
  const { amountIndicators } = useLayout();
  const { themeColor } = useThemeContext();
  const onMobile = useIsMobile();

  const { t, i18n } = useTranslation(["welcome-page"]);
  const gradientStyle = {
    fontSize: "48px", // Adjust the font size as needed
    fontWeight: "bold", // Make the text bold
    background: `linear-gradient(135deg, ${themeColor}, orange`, // Diagonal gradient using CSS variables
    WebkitBackgroundClip: "text", // Clip the background to the text
    WebkitTextFillColor: "transparent", // Make the text color transparent
    display: "inline-block", // Ensure the gradient applies correctly
  };
  return (
    <ChildrenPanel>
      <ScrollArea className="h-full">
        {onMobile && <PageHeader />}

        <div className="flex-1 flex flex-col p-4 min-h-[calc(100vh-var(--simple-header-height))]">
          <div className="flex-1 flex flex-col items-center justify-center gap-10">
            {/* <PageHeader title="Welcome to the Etpzp SMS App!" /> */}

            <div className="text-center">
              <span className="text-xl text-muted-foreground block">
                {t("welcome_message")}{" "}
              </span>
              <span className="text-6xl leading-tighter gradient-text">
                ETPZP-SMS
              </span>
            </div>

            {/*  */}
            <div className="flex flex-col xs:flex-row gap-2 w-full justify-center items-center">
              <LinkCard
                href="/contacts"
                heroValue={amountIndicators?.contacts || 0}
                Icon={Contact}
                title={t("card_1-title")}
              />
              <LinkCard
                href="/sent"
                heroValue={
                  (amountIndicators?.sent || 0) +
                  (amountIndicators?.scheduled || 0)
                }
                Icon={Envelope}
                title={t("card_2-title")}
              />
            </div>
          </div>

          <p className="text-sm text-center my-8" /**mb-12 */>
            {t("developer_credit")}{" "}
            <Link
              href="https://github.com/devdogfish"
              className={cn(
                buttonVariants({ variant: "link" }),
                "p-0 h-min"
                // "underline hover:no-underline"
              )}
              target="_blank"
            >
              Luigi Girke
            </Link>
          </p>
        </div>
      </ScrollArea>
    </ChildrenPanel>
  );
}
