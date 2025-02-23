import NewMessageForm from "@/components/new-message-form";
import { NewMessageProvider } from "@/contexts/use-new-message";
import { fetchContacts } from "@/lib/db/contact";
import { fetchRecipients } from "@/lib/db/recipients";
import { fetchDraft } from "@/lib/db/message";
import { validatePhoneNumber } from "@/lib/utils";
import { Message } from "@/types";

type NewMessagePageProps = {
  searchParams: Promise<{ editDraft: string }>;
};
export const EMPTY_MESSAGE: Message = {
  body: "",
  sender: "ETPZP",
  recipients: [],
};
export default async function Page({ searchParams }: NewMessagePageProps) {
  const contacts = await fetchContacts();
  const rawRecipients = await fetchRecipients();

  const draftInUrl = await searchParams;
  const fetchedDraft = await fetchDraft(draftInUrl.editDraft);

  return (
    <NewMessageProvider
      fetchedRecipients={rawRecipients || []}
      fetchedContacts={contacts || []}
      // initialMessage={fetchedDraft || EMPTY_MESSAGE}
      initialMessage={
        fetchedDraft
          ? {
              body: fetchedDraft?.body || EMPTY_MESSAGE.body,
              subject: fetchedDraft?.subject || EMPTY_MESSAGE.subject,
              sender: fetchedDraft?.sender || EMPTY_MESSAGE.sender,
              recipients:
                fetchedDraft?.recipients.map((r) => ({
                  ...r,
                  error: validatePhoneNumber(r.phone),
                  formattedPhone: validatePhoneNumber(r.phone).formattedPhone,
                })) || EMPTY_MESSAGE.recipients,
            }
          : EMPTY_MESSAGE
      }
    >
      <NewMessageForm contacts={contacts || []} editDraft={fetchedDraft} />
    </NewMessageProvider>
  );
}
