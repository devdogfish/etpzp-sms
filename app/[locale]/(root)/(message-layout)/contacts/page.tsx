import ContactsPage from "@/components/contacts-page";
import { ContactModalsProvider } from "@/contexts/use-contact-modals";

export default async function Page() {
  return (
    <ContactModalsProvider>
      <ContactsPage />
    </ContactModalsProvider>
  );
}
