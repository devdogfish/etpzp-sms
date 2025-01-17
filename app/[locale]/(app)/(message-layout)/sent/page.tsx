import MessagesPage from "@/components/messages-page";
import { fetchMessagesByLocation } from "@/lib/db/message";

export default async function AllMessagesPage() {
  console.log("AllMessagesPageComponent re-rendered");

  const messages = await fetchMessagesByLocation("SENT");

  return (
    <MessagesPage
      messages={messages.data || []}
      error={!messages.success ? messages.message : undefined}
      location="SENT"
    />
  );
}
