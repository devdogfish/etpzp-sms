import NewMessageForm from "@/components/new-message-form";
import { NewMessageProvider } from "@/contexts/use-new-message";
import { fetchContacts } from "@/lib/actions/contact.actions";
import { fetchRecipients } from "@/lib/db/recipients";

export default async function Page({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  const contacts = await fetchContacts();
  const fetchedRecipients = await fetchRecipients();

  return (
    <NewMessageProvider allSuggestedRecipients={fetchedRecipients.data || []}>
      <NewMessageForm isFullScreen={true} contacts={contacts} />
    </NewMessageProvider>
  );
}
