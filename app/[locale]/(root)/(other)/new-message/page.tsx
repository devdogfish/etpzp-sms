import NewMessageForm from "@/components/new-message-form";
import { NewMessageProvider } from "@/contexts/use-new-message";
import { fetchContacts } from "@/lib/db/contact";
import { fetchError } from "@/lib/db";
import { fetchRecipients } from "@/lib/db/recipients";
import { fetchDraft } from "@/lib/db/message";
import { matchContactsToRecipients, validatePhoneNumber } from "@/lib/utils";
import { DraftingCompass } from "lucide-react";

type NewMessagePageProps = {
  searchParams: Promise<{ draft: string }>;
};
export const EMPTY_MESSAGE = {
  body: "",
  subject: undefined,
  sender: "ETPZP",
  recipients: [],
  sendDelay: undefined,
};
export default async function Page({ searchParams }: NewMessagePageProps) {
  const contacts = await fetchContacts();
  const rawRecipients = await fetchRecipients();

  const draftInUrl = await searchParams;
  const fetchedDraft = await fetchDraft(draftInUrl.draft);
  
  
  console.log("Re-rendering new-message server component");
  console.log(contacts);
  
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
