import ContactsPage from "@/components/contacts-page";
import CreateContact from "@/components/modals/create-contact";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { fetchContacts } from "@/lib/actions/contact.actions";

export default async function Page() {
  const result = await fetchContacts();
  const contacts = result.success ? result.data : [];

  return <ContactsPage contacts={contacts} />;
}
