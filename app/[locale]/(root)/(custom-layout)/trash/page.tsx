import MessagesPageSkeleton from "@/components/messages-page-skeleton";
import MessagesPage from "@/components/messages-page";
import { fetchMessagesByLocation } from "@/lib/db/message";
import { Suspense } from "react";
import { fetchError } from "@/lib/db";

export default function Page() {
  return (
    <Suspense fallback={<MessagesPageSkeleton location="TRASH" />}>
      <TrashMessagesPage />
    </Suspense>
  );
}

export async function TrashMessagesPage() {
  const messages = await fetchMessagesByLocation("TRASH");

  return (
    <MessagesPage
      messages={messages || []}
      error={fetchError("messages in trash", !messages)}
      location="TRASH"
    />
  );
}
