import MessagesPageSkeleton from "@/components/messages-page-skeleton";
import MessagesPage from "@/components/messages-page";
import { fetchMessagesByStatus } from "@/lib/db/message";
import { Suspense } from "react";
import { fetchError } from "@/lib/db";

export default function Page() {
  return (
    <Suspense fallback={<MessagesPageSkeleton location="SENT" />}>
      <SentMessagesPage />
    </Suspense>
  );
}

export async function SentMessagesPage() {
  const messages = await fetchMessagesByStatus("SENT");

  return (
    <MessagesPage
      messages={messages || []}
      error={fetchError("sent messages", !messages)}
      location="SENT"
    />
  );
}
