import MessagesPageSkeleton from "@/components/message-page-skeleton";
import MessagesPage from "@/components/messages-page";
import { fetchMessagesByLocation } from "@/lib/db/message";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<MessagesPageSkeleton location="DRAFTS" />}>
      <DraftsMessagesPage />
    </Suspense>
  );
}

export async function DraftsMessagesPage() {
  const messages = await fetchMessagesByLocation("DRAFT");

  return (
    <MessagesPage
      messages={messages.data || []}
      error={!messages.success ? messages.message : undefined}
      location="DRAFT"
    />
  );
}
