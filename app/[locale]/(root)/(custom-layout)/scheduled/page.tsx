import MessagesPageSkeleton from "@/components/messages-page-skeleton";
import MessagesPage from "@/components/messages-page";
import { fetchMessagesByStatus } from "@/lib/db/message";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<MessagesPageSkeleton location="SCHEDULED" />}>
      <DraftsMessagesPage />
    </Suspense>
  );
}

export async function DraftsMessagesPage() {
  const messages = await fetchMessagesByStatus("SCHEDULED");

  return (
    <MessagesPage
      messages={messages.data || []}
      error={!messages.success ? messages.message : undefined}
      location="SCHEDULED"
    />
  );
}
