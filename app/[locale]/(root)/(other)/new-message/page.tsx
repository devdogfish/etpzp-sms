import NewMessageForm from "@/components/new-message-form";
import { NewMessageProvider } from "@/contexts/use-new-message";
import { fetchContacts } from "@/lib/actions/contact.actions";
import { fetchRecipients } from "@/lib/db/recipients";
import { getTopRecipients, processRecipients } from "@/lib/recipients.filters";

export default async function Page({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  const contacts = await fetchContacts();
  const fetchedRecipients = await fetchRecipients();

  const processed = processRecipients(fetchedRecipients.data || []);
  console.log("RAW: ", fetchedRecipients.data);
  console.log("PROCESSED: ", processed);
  console.log("TOP 5: ", getTopRecipients(processed));

  return (
    <NewMessageProvider allSuggestedRecipients={fetchedRecipients.data || []}>
      <NewMessageForm isFullScreen={true} contacts={contacts} />
    </NewMessageProvider>
  );
}
