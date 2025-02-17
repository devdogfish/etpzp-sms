import ContactsPage from "@/components/contacts-page";
import CreateContactModal from "@/components/modals/create-contact-modal";
import { ContactModalsProvider } from "@/contexts/use-contact-modals";
import { fetchContacts } from "@/lib/db/contact";
import { fetchError } from "@/lib/db";
import { Suspense } from "react";
import ContactsPageSkeleton from "@/components/contacts-page-skeleton";

export default async function Page() {
  return (
    <Suspense fallback={<ContactsPageSkeleton />}>
      <ContactsPageFetcher />
    </Suspense>
  );
}

export async function ContactsPageFetcher() {
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
