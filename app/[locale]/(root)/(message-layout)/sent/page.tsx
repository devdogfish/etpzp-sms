import MessagesPage from "@/components/messages-page";
import { fetchSent } from "@/lib/db/message";

export default async function Page() {
  const messages = await fetchSent();

  console.log(messages);

  return (
    <MessagesPage
      messages={messages || []}
      error={messages === undefined}
      category="SENT"
    />
  );
}
