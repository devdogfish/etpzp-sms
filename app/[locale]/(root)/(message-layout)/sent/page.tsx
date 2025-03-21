import MessagesPage from "@/components/messages-page";
import { fetchSentIn } from "@/lib/db/message";

export default async function Page() {
  const messages = await fetchSentIn("PAST");

  console.log(messages);

  return (
    <MessagesPage
      messages={messages || []}
      error={messages === undefined}
      category="SENT"
    />
  );
}
