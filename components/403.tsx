"use client";

import React from "react";
import ErrorComponent from "./shared/error-component";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

export default function UnauthorizedPage() {
  const { t } = useTranslation(["errors", "common"]);
  return (
    <ErrorComponent
      title={t("403_error-header")}
      subtitle={t("403_error-header_caption")}
    >
      <Link href="/sent" className={buttonVariants({ variant: "default" })}>
        {t("common:go_back")}
      </Link>
    </ErrorComponent>
  );
}
