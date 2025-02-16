import { Button, buttonVariants } from "@/components/ui/button";
import { Frown } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import initTranslations from "./i18n";

export default async function NotFound() {
  // we have to get it directly from the cookie here, because we are not in the [locale] route segment
  const cookieStore = await cookies();
  const currentLocale = cookieStore.get("NEXT_LOCALE");

  const { t } = await initTranslations(currentLocale, ["errors", "common"]);

  return (
    <div className="h-full flex flex-col items-center justify-center gap-3">
      <div className="flex flex-col items-center gap-1">
        <Frown className="text-muted-foreground h-10 w-10 stroke-[1.2px]" />
        <div className="flex flex-col items-center">
          <h2>{t("error-header")}</h2>
          <p className="text-sm">{t("error-header_caption")}</p>
        </div>
      </div>
      <Link href="/" className={buttonVariants({ variant: "default" })}>
        {t("common:go_back")}
      </Link>
    </div>
  );
}
