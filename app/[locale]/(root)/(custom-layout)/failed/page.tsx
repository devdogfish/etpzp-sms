import MessagesPageSkeleton from "@/components/messages-page-skeleton";
import MessagesPage from "@/components/messages-page";
import { fetchMessagesByStatus } from "@/lib/db/message";
import { Suspense } from "react";
import { fetchError } from "@/lib/db";

export default function Page() {
  return (
    <Suspense fallback={<MessagesPageSkeleton location="FAILED" />}>
      <DraftsMessagesPage />
    </Suspense>
  );
}

export async function DraftsMessagesPage() {
  const messages = await fetchMessagesByStatus("FAILED");

  return (
    <MessagesPage
      messages={messages || []}
      error={fetchError("failed messages", !messages)}
      location="FAILED"
    />
  );
}
