import MessageContainer from "@/components/message-container";
import { MessageProvider } from "@/contexts/use-messages";
import { Message, messages } from "@/lib/data.test";
import { MessageLocation } from "@/types";
import { notFound } from "next/navigation";

async function getMessages(): Promise<Message[]> {
  // This is a mock function. In a real app, you'd fetch from an API or database
  return messages;
}
const validLocations = ["sent", "drafts", "trash"];

export default async function MessagePage({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { location: MessageLocation };
}>) {
  const { location } = await params;

  const initialMessages = await getMessages();
  if (!validLocations.includes(location)) notFound();
  return (
    <MessageProvider initialMessages={initialMessages}>
      <MessageContainer location={location}>{children}</MessageContainer>
    </MessageProvider>
  );
}
