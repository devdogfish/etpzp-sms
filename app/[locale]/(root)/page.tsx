"use client";
import ChildrenPanel from "@/components/shared/children-panel";
import { useLayout } from "@/contexts/use-layout";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import LinkCard from "@/components/cards";

export default function WelcomePage() {
  const { amountIndicators } = useLayout();
  const { t } = useTranslation(["welcome-page"]);
  return (
    <ChildrenPanel
      className="h-full flex flex-col p-4" /**max-h-[100vh-var(--header-height)] */
    >
      <div className="flex-1 flex flex-col items-center justify-center gap-5">
        {/* <PageHeader title="Welcome to the Etpzp SMS App!" /> */}
        <h1>
          Welcome to the <strong className="text-orange-300">ETPZP-SMS</strong>{" "}
          app!
        </h1>
        <div className="flex grid-cols-2 gap-2 w-full justify-center items-center">
          <LinkCard
            href="/contacts"
            heroValue={amountIndicators?.contacts || 0}
            iconSrc="/icons/user-solid.svg"
            title={t("card_1-title")}
          />
          <LinkCard
            href="/sent"
            heroValue={
              (amountIndicators?.sent || 0) + (amountIndicators?.scheduled || 0)
            }
            iconSrc="/icons/envelope-solid.svg"
            title={t("card_2-title")}
          />

          {/* <div className="flex-1">Send a message</div>
        <div className="flex-1">Create a contact</div>
        <div className="flex-1">3</div> */}
        </div>
      </div>

      <p className="text-sm text-center my-8" /**mb-12 */>
        Created by{" "}
        <Link
          href="https://github.com/devdogfish"
          className={cn(
            buttonVariants({ variant: "link" }),
            "p-0"
            // "underline hover:no-underline"
          )}
        >
          Luigi Girke
        </Link>
      </p>
    </ChildrenPanel>
  );
}
