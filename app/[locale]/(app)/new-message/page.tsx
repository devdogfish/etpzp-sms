import ChildrenPanel from "@/components/children-panel";
import NewMessageForm from "@/components/new-message-form";
import { RecipientProvider } from "@/contexts/use-recipient";
import { fetchContacts } from "@/lib/db/contact.actions";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  const contacts = await fetchContacts();
  return (
    <ChildrenPanel>
      <RecipientProvider initialRecipients={[]}>
        <NewMessageForm isFullScreen={false} contacts={contacts} />
      </RecipientProvider>
    </ChildrenPanel>
  );
}
