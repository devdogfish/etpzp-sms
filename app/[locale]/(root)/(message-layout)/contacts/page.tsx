import ContactsPage from "@/components/contacts-page";
import CreateContactModal from "@/components/modals/create-contact-modal";
import { ContactModalsProvider } from "@/contexts/use-contact-modals";
import { fetchContacts } from "@/lib/db/contact";
import { fetchError } from "@/lib/db";

export default async function Page() {
  const contacts = await fetchContacts();

  return (
    <ContactModalsProvider>
      <CreateContactModal />
      <ContactsPage
        contacts={contacts || []}
        error={fetchError("contacts", !contacts)}
      />
    </ContactModalsProvider>
  );
}
