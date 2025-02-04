import NewMessageForm from "@/components/new-message-form";
import { NewMessageProvider } from "@/contexts/use-new-message";
import { fetchContacts } from "@/lib/db/contact";
import { fetchError } from "@/lib/db";
import { fetchRecipients } from "@/lib/db/recipients";
import { getProcessedRecipients } from "@/lib/recipients.filters";
import { fetchDraft } from "@/lib/db/message";
import { Suspense } from "react";
import { NewRecipient } from "@/types/recipient";

export default async function Page({
  searchParams,
}: {
  searchParams: { draft: string };
}) {
  return (
    <Suspense fallback={"...Loading"}>
      <PageFetcher searchParams={await searchParams} />
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
  const { alphabetical, mostUsed } = getProcessedRecipients(
    recipientsResult || []
  );

  const draft = searchParams.draft
    ? await fetchDraft(searchParams.draft)
    : undefined;

  return (
    <NewMessageProvider
      suggestedRecipients={{
        all: contacts?.length
          ? [
              // All existing recipients..
              ...alphabetical,
              // plus the contacts that have never been used inside a message..
              ...contacts
                .filter(
                  (contact) =>
                    !alphabetical.some((a) => a.phone === contact.phone)
                )
                // converted the DBContactRecipient type.
                .map((contact) => ({
                  id: contact.id,
                  phone: contact.phone,
                  contact_id: contact.id,
                  contact_name: contact.name,
                  contact_description: contact.description || null,
                })),
            ]
          : alphabetical,
        alphabetical,
        mostUsed,
      }}
      allContacts={contacts || []}
      // TODO: add safe conversion of full type here (fetch contact fields from the database directly I think is easiest)
      defaultMessage={{
        body: draft?.body || "",
        subject: draft?.subject || undefined,
        sender: draft?.sender,
        recipients: draft?.recipients.length
          ? (draft?.recipients.map((r) => ({
              phone: r.phone,
              contactId: r.contact_id,
            })) as NewRecipient[])
          : [],
      }}
    >
      <NewMessageForm
        contacts={contacts || []}
        error={fetchError("contacts", !contacts)}
        draft={draft}
      />
    </NewMessageProvider>
  );
}
