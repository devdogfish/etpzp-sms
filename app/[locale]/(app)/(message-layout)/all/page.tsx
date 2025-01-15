import MessagesPage from "@/components/messages-page";
import { fetchAllMessages } from "@/lib/db/message";

export default async function AllMessagesPage() {
  const messages = await fetchAllMessages();

  return (
    <MessagesPage
      messages={messages.data || []}
      error={!messages.success ? messages.message : undefined}
      location="ALL"
    />
  );
}
