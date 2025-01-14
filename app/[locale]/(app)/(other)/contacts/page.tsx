import ContactsTable from "@/components/contacts-table";
import CreateContact from "@/components/modals/create-contact";
import PageHeader from "@/components/page-header";
import { fetchContacts } from "@/lib/db/contact.actions";

export default async function ContactsPage() {
  const result = await fetchContacts();
  const contacts = result.success ? result.data : [];

  return (
    <div>
      <PageHeader title="Contacts">
        <CreateContact />
      </PageHeader>
      {contacts.length ? (
        <ContactsTable contacts={contacts} variant="lg" />
      ) : (
        <div className="p-3">You don't have any contacts.</div>
      )}
    </div>
  );
}
