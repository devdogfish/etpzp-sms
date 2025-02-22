import NewMessageForm from "@/components/new-message-form";
import { NewMessageProvider } from "@/contexts/use-new-message";
import { fetchContacts } from "@/lib/db/contact";
import { fetchError } from "@/lib/db";
import { fetchRecipients } from "@/lib/db/recipients";
import { fetchDraft } from "@/lib/db/message";
import { matchContactsToRecipients, validatePhoneNumber } from "@/lib/utils";

type NewMessagePageProps = {
  params: Promise<{ draft: string }>;
};
export const EMPTY_MESSAGE = {
  body: "",
  subject: undefined,
  sender: "ETPZP",
  recipients: [],
  sendDelay: undefined,
};
export default async function Page({ params }: NewMessagePageProps) {
  const contacts = await fetchContacts();
  const rawRecipients = await fetchRecipients();

  // const { draft } = await params;
  const draft = "3";
  const fetchedDraft = await fetchDraft(draft);

  return (
    <NewMessageProvider
      fetchedRecipients={rawRecipients || []}
      fetchedContacts={contacts || []}
      initialMessage={{
        body: fetchedDraft?.body || EMPTY_MESSAGE.body,
        subject: fetchedDraft?.subject || EMPTY_MESSAGE.subject,
        sender: fetchedDraft?.sender || EMPTY_MESSAGE.sender,
        recipients:
          fetchedDraft?.recipients.map((r) => ({
            ...r,
            error: validatePhoneNumber(r.phone),
            formattedPhone: validatePhoneNumber(r.phone).formattedPhone,
          })) || EMPTY_MESSAGE.recipients,
      }}
    >
      <NewMessageForm contacts={contacts || []} draft={fetchedDraft} />
    </NewMessageProvider>
  );
}
