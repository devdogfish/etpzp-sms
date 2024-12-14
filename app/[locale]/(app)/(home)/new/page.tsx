import initTranslations from "@/app/[locale]/i18n";
import NewMessage from "@/components/new-message";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { sendMessage } from "@/lib/actions/fetch-message-working";
import { testFetch } from "@/lib/send-sms/data";

export default async function Page({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  const data = await testFetch();
  const { t } = await initTranslations(locale, ["Navigation"]);
  return (
    <>
      <PageHeader title={t("new_message")} />
      <NewMessage />

      {/* <h2>Send a sms</h2>
      <form action={sendMessage}>
        <Button type="submit">Send a SMS</Button>
      </form> */}
    </>
  );
}
