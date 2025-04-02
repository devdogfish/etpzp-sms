import initTranslations from "@/app/i18n";
import MessagesPage from "@/components/messages-page";
import { METADATA_APP_NAME } from "@/global.config";
import { fetchMessagesByStatus } from "@/lib/db/message";

export default async function Page() {
  const messages = await fetchMessagesByStatus("FAILED");
  console.log(messages);

  return (
    <MessagesPage
      messages={messages || []}
      error={messages === undefined}
      category="FAILED"
    />
  );
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { t } = await initTranslations(locale, ["metadata"]);

  return {
    title: METADATA_APP_NAME + t("failed-title"),
    description: t("failed-description"),
  };
}
