import ContactsPage from "@/components/contacts-page";
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
  const contacts = result.success ? result.data : [];
  console.log("refetching contacts");

  return <ContactsPage contacts={contacts} />;
}
