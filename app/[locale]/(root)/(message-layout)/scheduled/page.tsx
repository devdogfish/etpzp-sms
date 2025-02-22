import MessagesPage from "@/components/messages-page";
import { fetchCurrentlyScheduled } from "@/lib/db/message";
import { fetchError } from "@/lib/db";

export default async function Page() {
  const messages = await fetchCurrentlyScheduled();

  return (
    <MessagesPage
      messages={messages || []}
      error={fetchError("scheduled messages", !messages)}
      category="SCHEDULED"
    />
  );
}
