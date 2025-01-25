import NewMessageForm from "@/components/new-message-form";
import { ContactModalsProvider } from "@/contexts/use-contact-modals";
import { NewMessageProvider } from "@/contexts/use-new-message";
import { fetchContacts } from "@/lib/actions/contact.actions";
import { fetchRecipients } from "@/lib/db/recipients";

export default async function Page({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  const contacts = await fetchContacts();
  const fetchedRecipients = await fetchRecipients();
  console.log("fetched recipients on server");
  console.log(fetchedRecipients);

  return (
    <NewMessageProvider fetchedRecipients={fetchedRecipients.data || []}>
      <NewMessageForm isFullScreen={true} contacts={contacts} />
    </NewMessageProvider>
  );
}
