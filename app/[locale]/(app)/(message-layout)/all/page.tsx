import MessagesPageSkeleton from "@/components/message-page-skeleton";
import MessagesPage from "@/components/messages-page";
import { fetchAllMessages } from "@/lib/db/message";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<MessagesPageSkeleton location="ALL" />}>
      <AllMessagesPage />
    </Suspense>
  );
}

export async function AllMessagesPage() {
  const messages = await fetchAllMessages();

  return (
    <MessagesPage
      messages={messages.data || []}
      error={!messages.success ? messages.message : undefined}
      location="ALL"
    />
  );
}
