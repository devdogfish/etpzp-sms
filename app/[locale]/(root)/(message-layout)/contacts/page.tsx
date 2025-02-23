import ContactsPage from "@/components/contacts-page";
import { ContactModalsProvider } from "@/contexts/use-contact-modals";
import { fetchContacts } from "@/lib/db/contact";
import { fetchError } from "@/lib/db";

export default async function Page() {
  const contacts = await fetchContacts();
  console.log("Server contacts re-rendered");

  return (
    <ContactModalsProvider>
      <ContactsPage
        contacts={contacts || []}
        error={fetchError("contacts", !contacts)}
      />
    </ContactModalsProvider>
  );
}
