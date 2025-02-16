"use client";

import ChildrenPanel from "@/components/shared/children-panel";
import { Button, buttonVariants } from "@/components/ui/button";
import { Frown } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
  const { t } = useTranslation(["errors"]);
  return (
    <ChildrenPanel>
      <div className="h-full flex flex-col items-center justify-center gap-3">
        <h2>{t("error-header")}</h2>
        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          {t("try_again")}
        </Button>
      </div>
    </ChildrenPanel>
  );
}
