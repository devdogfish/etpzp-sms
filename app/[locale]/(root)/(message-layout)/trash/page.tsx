import MessagesPage from "@/components/messages-page";
import { fetchTrashedMessages } from "@/lib/db/message";

export default async function Page() {
  const messages = await fetchTrashedMessages();

  return (
    <MessagesPage
      messages={messages || []}
      error={messages === undefined}
      category="TRASH"
    />
  );
}
