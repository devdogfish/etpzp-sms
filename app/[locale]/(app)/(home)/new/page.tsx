import NewMessageForm from "@/components/new-message-form";
import { fetchContacts } from "@/lib/db/contact.actions";

export default async function Page({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  const contacts = await fetchContacts();

  return (
    <NewMessageForm
      isFullScreen={false}
      contacts={contacts}
    />
  );
}
