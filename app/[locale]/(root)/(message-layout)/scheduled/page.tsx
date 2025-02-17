import MessagesPageSkeleton from "@/components/messages-page-skeleton";
import MessagesPage from "@/components/messages-page";
import { fetchCurrentlyScheduled } from "@/lib/db/message";
import { Suspense } from "react";
import { fetchError } from "@/lib/db";

export default function Page() {
  return (
    <Suspense fallback={<MessagesPageSkeleton category="SCHEDULED" />}>
      <ScheduledMessagesPage />
    </Suspense>
  );
}

export async function ScheduledMessagesPage() {
  const messages = await fetchCurrentlyScheduled();

  return (
    <MessagesPage
      messages={messages || []}
      error={fetchError("scheduled messages", !messages)}
      category="SCHEDULED"
    />
  );
}
