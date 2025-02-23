import MessagesPage from "@/components/messages-page";
import { fetchMessagesByStatus } from "@/lib/db/message";

export default async function Page() {
  const messages = await fetchMessagesByStatus("DRAFTED");

  return (
    <MessagesPage
      messages={messages || []}
      error={messages === undefined}
      category="DRAFTS"
    />
  );
}
