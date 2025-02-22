import MessagesPage from "@/components/messages-page";
import { fetchError } from "@/lib/db";
import { fetchTrashedMessages } from "@/lib/db/message";

export default async function Page() {
  const messages = await fetchTrashedMessages();

  return (
    <MessagesPage
      messages={messages || []}
      error={fetchError("messages in trash", !messages)}
      category="TRASH"
    />
  );
}
