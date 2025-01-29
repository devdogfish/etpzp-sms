import NewMessageForm from "@/components/new-message-form";
import { NewMessageProvider } from "@/contexts/use-new-message";
import { fetchContacts } from "@/lib/db/contact";
import { fetchError } from "@/lib/db";
import { fetchRecipients } from "@/lib/db/recipients";
import { calcTopRecipients, processRecipients } from "@/lib/recipients.filters";

export default async function Page() {
  const contacts = await fetchContacts();
  const recipientsResult = await fetchRecipients();

  const processedRecipients = processRecipients(recipientsResult || []);

  return (
    <NewMessageProvider
      allSuggestedRecipients={processedRecipients}
      allContacts={contacts || []}
    >
      <NewMessageForm
        contacts={contacts || []}
        error={fetchError("contacts", !contacts)}
      />
    </NewMessageProvider>
  );
}
