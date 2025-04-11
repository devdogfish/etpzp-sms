import initTranslations from "@/app/i18n";
import MessagesPage from "@/components/messages-page";
import { METADATA_APP_NAME } from "@/global.config";
import { fetchTrashedMessages } from "@/lib/db/message";

export default async function Page() {
  const messages = await fetchTrashedMessages();

  return (
    <MessagesPage
      messages={messages || []}
      error={messages === undefined}
      category="TRASH"
    />
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await initTranslations(locale, ["metadata"]);

  return {
    title: METADATA_APP_NAME + t("trash-title"),
    description: t("trash-description"),
  };
}
