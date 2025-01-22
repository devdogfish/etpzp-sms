import ContactsPage from "@/components/contacts-page";
import CreateContactModal from "@/components/modals/create-contact-modal";
import { ContactModalsProvider } from "@/contexts/use-contact-modals";
import { fetchContacts } from "@/lib/actions/contact.actions";
import { Suspense } from "react";

export async function Page() {
  return (
    <Suspense fallback={"Loading..."}>
      <ContactsPageFetcher />
    </Suspense>
  );
}

export default async function ContactsPageFetcher() {
  const result = await fetchContacts();

  return (
    <ContactModalsProvider>
      <CreateContactModal />
      <ContactsPage contacts={result.success ? result.data : []} />
    </ContactModalsProvider>
  );
}
