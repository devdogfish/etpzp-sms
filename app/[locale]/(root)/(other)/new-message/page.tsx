import NewMessageForm from "@/components/new-message-form";
import { NewMessageProvider } from "@/contexts/use-new-message";
import { fetchContacts } from "@/lib/actions/contact.actions";
import { fetchRecipients } from "@/lib/db/recipients";
import { getTopRecipients, processRecipients } from "@/lib/recipients.filters";

export default async function Page({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  const contactsResult = await fetchContacts();
  const recipientsResult = await fetchRecipients();

  const processedRecipients = processRecipients(recipientsResult.data || []);
  const contacts = contactsResult.data || [];

  return (
    <NewMessageProvider
      allSuggestedRecipients={processedRecipients}
      allContacts={contacts}
    >
      <NewMessageForm isFullScreen={true} contacts={contactsResult} />
    </NewMessageProvider>
  );
}
