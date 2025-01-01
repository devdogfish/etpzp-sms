import NewMessageForm from "@/components/new-message-form";
import { NewMessageProvider } from "@/contexts/use-new-message";
import { fetchContacts } from "@/lib/db/contact.actions";

export default async function Page({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  const contacts = await fetchContacts();
  return (
    <NewMessageProvider>
      <NewMessageForm isFullScreen={true} contacts={contacts} />
    </NewMessageProvider>
  );
}
