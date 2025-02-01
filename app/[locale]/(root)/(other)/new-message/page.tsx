import NewMessageForm from "@/components/new-message-form";
import { NewMessageProvider } from "@/contexts/use-new-message";
import { fetchContacts } from "@/lib/db/contact";
import { fetchError } from "@/lib/db";
import { fetchRecipients } from "@/lib/db/recipients";
import { calcTopRecipients, processRecipients } from "@/lib/recipients.filters";
import { fetchDraft } from "@/lib/db/message";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: { draft: string };
}) {
  return (
    <Suspense fallback={"...Loading"}>
      <PageFetcher searchParams={searchParams} />
    </Suspense>
  );
}

export async function PageFetcher({
  searchParams,
}: {
  searchParams: { draft: string };
}) {
  const contacts = await fetchContacts();
  const recipientsResult = await fetchRecipients();

  const draft = searchParams.draft
    ? await fetchDraft(searchParams.draft)
    : undefined;

  if (!draft) console.log("Draft doesn't exist!");

  return (
    <NewMessageProvider
      allSuggestedRecipients={processRecipients(recipientsResult || [])}
      allContacts={contacts || []}
    >
      <NewMessageForm
        contacts={contacts || []}
        error={fetchError("contacts", !contacts)}
        draft={draft}
      />
    </NewMessageProvider>
  );
}
