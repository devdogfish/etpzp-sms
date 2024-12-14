import initTranslations from "@/app/[locale]/i18n";
import NewMessageForm from "@/components/new-message-form";
import PageHeader from "@/components/page-header";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Maximize2, X } from "lucide-react";
import Link from "next/link";

export default async function NewMessage({
  locale,
  isFullScreen,
}: {
  locale: string;
  isFullScreen: boolean;
}) {
  const { t } = await initTranslations(locale, ["Navigation"]);
  return (
    <>
      <PageHeader title={t("new_message")}>
        {!isFullScreen && (
          <Link
            href="/new-fullscreen"
            style={{ padding: 0 }}
            className={cn("aspect-1", buttonVariants({ variant: "ghost" }))}
          >
            <Maximize2 className="h-4 w-4" />
          </Link>
        )}

        {isFullScreen ? (
          <Link
            href="/new"
            style={{ padding: 0 }}
            className={cn("aspect-1", buttonVariants({ variant: "ghost" }))}
          >
            <X className="h-4 w-4" />
          </Link>
        ) : (
          <Link
            href="/"
            style={{ padding: 0 }}
            className={cn("aspect-1", buttonVariants({ variant: "ghost" }))}
          >
            <X className="h-4 w-4" />
          </Link>
        )}
      </PageHeader>

      <NewMessageForm />
    </>
  );
}
