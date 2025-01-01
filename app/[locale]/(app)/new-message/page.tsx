import ChildrenPanel from "@/components/children-panel";
import NewMessageForm from "@/components/new-message-form";
import { fetchContacts } from "@/lib/db/contact.actions";
import { NewMessageProvider } from "@/contexts/use-new-message";

export default async function Page({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  const contacts = await fetchContacts();
  return (
    <ChildrenPanel>
      <NewMessageProvider>
        <NewMessageForm isFullScreen={false} contacts={contacts} />
      </NewMessageProvider>
    </ChildrenPanel>
  );
}
