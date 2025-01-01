import NewMessageForm from "@/components/new-message-form";
import { NewMessageProvider } from "@/contexts/use-new-message";
import { fetchContacts } from "@/lib/db/contact.actions";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  const contacts = await fetchContacts();
  return (
    <NewMessageProvider>
      <NewMessageForm isFullScreen={false} contacts={contacts} />
    </NewMessageProvider>
  );
}
