import ContactsPage from "@/components/contacts-page";
import { ModalProvider } from "@/contexts/use-modal";
import initTranslations from "@/app/i18n";
import { METADATA_APP_NAME } from "@/global.config";

export default async function Page() {
  return (
    <ModalProvider>
      <ContactsPage />
    </ModalProvider>
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
    title: METADATA_APP_NAME + t("contacts-title"),
    description: t("contacts-description"),
  };
}
