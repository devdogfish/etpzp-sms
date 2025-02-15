import MessagesPageSkeleton from "@/components/messages-page-skeleton";
import MessagesPage from "@/components/messages-page";
import { Suspense } from "react";
import { fetchError } from "@/lib/db";
import { fetchTrashedMessages } from "@/lib/db/message";

export default function Page() {
  return (
    <Suspense fallback={<MessagesPageSkeleton category="TRASH" />}>
      <TrashMessagesPage />
    </Suspense>
  );
}

export async function TrashMessagesPage() {
  const messages = await fetchTrashedMessages();

  return (
    <MessagesPage
      messages={messages || []}
      error={fetchError("messages in trash", !messages)}
      category="TRASH"
    />
  );
}
