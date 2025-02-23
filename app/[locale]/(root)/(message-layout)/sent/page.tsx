import MessagesPage from "@/components/messages-page";
import { fetchSent } from "@/lib/db/message";

export default async function Page() {
  const messages = await fetchSent();

  return (
    <MessagesPage
      messages={messages || []}
      error={messages === undefined}
      category="SENT"
    />
  );
}
