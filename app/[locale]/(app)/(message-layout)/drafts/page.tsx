import MessagesPageSkeleton from "@/components/messages-page-skeleton";
import MessagesPage from "@/components/messages-page";
import { fetchMessagesByLocation } from "@/lib/db/message";
import { Suspense } from "react";
import { sleep } from "@/lib/utils";

export default function Page() {
  return (
    <Suspense fallback={<MessagesPageSkeleton location="DRAFT" />}>
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
