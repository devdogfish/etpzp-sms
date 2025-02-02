import MessagesPageSkeleton from "@/components/messages-page-skeleton";
import MessagesPage from "@/components/messages-page";
import { fetchMessagesByStatus, fetchSent } from "@/lib/db/message";
import { Suspense } from "react";
import { fetchError } from "@/lib/db";

export default function Page() {
  return (
    <Suspense fallback={<MessagesPageSkeleton category="SENT" />}>
      <SentMessagesPage />
    </Suspense>
  );
}

export async function SentMessagesPage() {
  const messages = await fetchSent();

  return (
    <MessagesPage
      messages={messages || []}
      error={fetchError("sent messages", !messages)}
      category="SENT"
    />
  );
}
