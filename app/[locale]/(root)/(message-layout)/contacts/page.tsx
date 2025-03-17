import ContactsPage from "@/components/contacts-page";
import { ModalProvider } from "@/contexts/use-modal";

export default async function Page() {
  return (
    <ModalProvider>
      <ContactsPage />
    </ModalProvider>
  );
}
