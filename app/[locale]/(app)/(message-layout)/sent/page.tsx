import MessagesPageSkeleton from "@/components/messages-page-skeleton";
import MessagesPage from "@/components/messages-page";
import { fetchMessagesByLocation } from "@/lib/db/message";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<MessagesPageSkeleton location="SENT" />}>
      <SentMessagesPage />
    </Suspense>
  );
}

export async function SentMessagesPage() {
  const messages = await fetchMessagesByLocation("SENT");

  return (
    <MessagesPage
      messages={messages.data || []}
      error={!messages.success ? messages.message : undefined}
      location="SENT"
    />
  );
}
