"use client";
import ChildrenPanel from "@/components/shared/children-panel";
import { useLayout } from "@/contexts/use-layout";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Trans, useTranslation } from "react-i18next";
import LinkCard from "@/components/cards";
import { useThemeContext } from "@/contexts/theme-data-provider";
import Envelope from "@/public/icons/envelope-solid.svg";
import Contact from "@/public/icons/user-solid.svg";
import { Metadata } from "next";

// why doesn't this work
export const metaData: Metadata = {
  title: `${process.env.APP_NAME} - Welcome`,
  description: "Welcome to the application!",
};
export default function WelcomePage() {
  const { amountIndicators } = useLayout();
  const { themeColor } = useThemeContext();

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
      <div className="h-full flex flex-col p-4">
        <div className="flex-1 flex flex-col items-center justify-center gap-5">
          {/* <PageHeader title="Welcome to the Etpzp SMS App!" /> */}
          <h1 className="text-center">
            <Trans i18nKey="welcome-page:welcome_message" i18n={i18n}>
              Welcome to the
              <div className="text-6xl _gradient-text">ETPZP-SMS</div>
              app
            </Trans>
          </h1>
          {/*  */}
          <div className="flex grid-cols-2 gap-2 w-full justify-center items-center">
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

            {/* <div className="flex-1">Send a message</div>
        <div className="flex-1">Create a contact</div>
        <div className="flex-1">3</div> */}
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
          >
            Luigi Girke
          </Link>
        </p>
      </div>
    </ChildrenPanel>
  );
}
