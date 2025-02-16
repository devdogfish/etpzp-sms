"use client";

import ChildrenPanel from "@/components/shared/children-panel";
import ErrorComponent from "@/components/shared/error-component";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation(["errors"]);

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
  return (
    <ChildrenPanel>
      <ErrorComponent
        title={t("error-header")}
        subtitle={t("error-header_caption")}
      >
        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          {t("try_again")}
        </Button>
      </ErrorComponent>
    </ChildrenPanel>
  );
}
