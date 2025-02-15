import MessagesPageSkeleton from "@/components/messages-page-skeleton";
import MessagesPage from "@/components/messages-page";
import { fetchMessagesByStatus } from "@/lib/db/message";
import { Suspense } from "react";
import { fetchError } from "@/lib/db";

export default function Page() {
  return (
    <Suspense fallback={<MessagesPageSkeleton category="FAILED" />}>
      <FailedMessagesPage />
    </Suspense>
  );
}

export async function FailedMessagesPage() {
  const messages = await fetchMessagesByStatus("FAILED");

  return (
    <MessagesPage
      messages={messages || []}
      error={fetchError("failed messages", !messages)}
      category="FAILED"
    />
  );
}
