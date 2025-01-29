import MessagesPageSkeleton from "@/components/messages-page-skeleton";
import MessagesPage from "@/components/messages-page";
import { fetchMessagesByStatus } from "@/lib/db/message";
import { Suspense } from "react";
import { fetchError } from "@/lib/db";

export default function Page() {
  return (
    <Suspense fallback={<MessagesPageSkeleton location="DRAFT" />}>
      <DraftsMessagesPage />
    </Suspense>
  );
}

export async function DraftsMessagesPage() {
  const messages = await fetchMessagesByStatus("DRAFTED");

  return (
    <MessagesPage
      messages={messages || []}
      error={fetchError("drafts", !messages)}
      location="DRAFT"
    />
  );
}
