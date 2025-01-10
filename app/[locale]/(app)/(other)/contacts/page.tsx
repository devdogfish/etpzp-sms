import ContactsTable from "@/components/modals/contacts-table";
import CreateContact from "@/components/modals/create-contact";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";

import { fetchContacts } from "@/lib/db/contact.actions";
import { formatSimpleDate } from "@/lib/utils";

export default async function ContactsPage() {
  const result = await fetchContacts();
  const contacts = result.success ? result.data : [];

  
  return (
    <div>
      <PageHeader title="Contacts">
        <CreateContact />
      </PageHeader>
      <ContactsTable contacts={contacts} variant="lg" />
    </div>
  );
}
