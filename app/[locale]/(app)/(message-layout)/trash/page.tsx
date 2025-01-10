import MessagesPage from "@/components/messages-page";
import { fetchMessagesByLocation } from "@/lib/db/message";

export default async function AllMessagesPage() {
  const messages = await fetchMessagesByLocation("TRASH");

  return (
    <MessagesPage
      messages={messages.data}
      error={!messages.success ? messages.message : undefined}
      location="TRASH"
    />
  );
}
