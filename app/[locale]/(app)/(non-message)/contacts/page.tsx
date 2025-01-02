import ContactsTable from "@/components/modals/contacts-table";
import CreateContactModal from "@/components/modals/create-contact-modal";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";

import { fetchContacts } from "@/lib/db/contact.actions";

export default async function ContactsPage() {
  const result = await fetchContacts();
  const contacts = result.success ? result.data : [];
  console.log(contacts);

  return (
    <div>
      <PageHeader title="Contacts">
        <CreateContactModal />
      </PageHeader>
      <ContactsTable contacts={contacts} variant="lg" />
    </div>
  );
}
