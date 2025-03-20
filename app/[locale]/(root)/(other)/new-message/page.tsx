import NewMessageForm from "@/components/new-message-form";
import { MessageState, NewMessageProvider } from "@/contexts/use-new-message";
import { fetchRecipients } from "@/lib/db/recipients";
import { fetchDraft } from "@/lib/db/message";
import { rankRecipients, validatePhoneNumber } from "@/lib/utils";
import { ModalProvider } from "@/contexts/use-modal";
import { EMPTY_MESSAGE } from "@/global.config";

type NewMessagePageProps = {
  searchParams: Promise<{ message_id: string }>;
};

export default async function Page({ searchParams }: NewMessagePageProps) {
  const rawRecipients = await fetchRecipients();
  const draftInUrl = await searchParams;
  const fetchedDraft = await fetchDraft(draftInUrl.message_id);

  return (
    <ModalProvider>
      <NewMessageProvider
        rankedRecipients={rankRecipients(rawRecipients || []) || []}
        // initialMessage={fetchedDraft || EMPTY_MESSAGE}
        initialMessage={
          fetchedDraft
            ? {
                body: fetchedDraft?.body || EMPTY_MESSAGE.body,
                subject: fetchedDraft?.subject || EMPTY_MESSAGE.subject,
                sender: fetchedDraft?.sender || EMPTY_MESSAGE.sender,
                recipients:
                  fetchedDraft?.recipients.map((r) => {
                    return {
                      ...r,
                      ...validatePhoneNumber(r.phone),
                    };
                  }) || EMPTY_MESSAGE.recipients,
                recipientInput: EMPTY_MESSAGE.recipientInput,
                scheduledDate:
                  fetchedDraft.send_time || EMPTY_MESSAGE.scheduledDate,
                scheduledDateModified: EMPTY_MESSAGE.scheduledDateModified,
                scheduledDateConfirmed: EMPTY_MESSAGE.scheduledDateConfirmed,
              }
            : undefined
        }
      >
        <NewMessageForm message_id={fetchedDraft} />
      </NewMessageProvider>
    </ModalProvider>
  );
}
