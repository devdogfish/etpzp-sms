import MessagesPageSkeleton from "@/components/messages-page-skeleton";
import MessagesPage from "@/components/messages-page";
import { fetchCurrentScheduled } from "@/lib/db/message";
import { Suspense } from "react";
import { fetchError } from "@/lib/db";

export default function Page() {
  return (
    <Suspense fallback={<MessagesPageSkeleton category="SCHEDULED" />}>
      <DraftsMessagesPage />
    </Suspense>
  );
}

export async function DraftsMessagesPage() {
  const messages = await fetchCurrentScheduled();

  return (
    <MessagesPage
      messages={messages || []}
      error={fetchError("scheduled messages", !messages)}
      category="SCHEDULED"
    />
  );
}
