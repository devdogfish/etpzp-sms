import MessagesPage from "@/components/messages-page";
import { fetchMessagesByStatus } from "@/lib/db/message";
import { fetchError } from "@/lib/db";

export default async function Page() {
  const messages = await fetchMessagesByStatus("FAILED");

  return (
    <MessagesPage
      messages={messages || []}
      error={fetchError("failed messages", !messages)}
      category="FAILED"
    />
  );
}
