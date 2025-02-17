import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cookies } from "next/headers";
import initTranslations from "./i18n";
import { i18nConfig } from "@/i18n.config";
import ErrorComponent from "@/components/shared/error-component";

export default async function NotFound() {
  // we have to get it directly from the cookie here, because we are not in the [locale] route segment
  const cookieStore = await cookies();
  const currentLocale = cookieStore.get("NEXT_LOCALE")?.value;

  const { t } = await initTranslations(
    currentLocale || i18nConfig.defaultLocale,
    ["errors", "common"]
  );

  return (
    <ErrorComponent
      title={t("404_error-header")}
      subtitle={t("404_error-header_caption")}
    >
      <Link href="/" className={buttonVariants({ variant: "default" })}>
        {t("common:go_back")}
      </Link>
    </ErrorComponent>
  );
}
