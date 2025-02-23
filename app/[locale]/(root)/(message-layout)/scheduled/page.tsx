import MessagesPage from "@/components/messages-page";
import { fetchCurrentlyScheduled } from "@/lib/db/message";

export default async function Page() {
  const messages = await fetchCurrentlyScheduled();
  console.log("ATTENTION: re-rendered scheduled server component");

  return (
    <MessagesPage
      messages={messages || []}
      error={messages === undefined}
      category="SCHEDULED"
    />
  );
}
