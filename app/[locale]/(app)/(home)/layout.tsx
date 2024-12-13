import MessageContainer from "@/components/message-container";
import { MessageProvider } from "@/contexts/use-message";
import { Message, messages } from "@/lib/test-data";

async function getMessages(): Promise<Message[]> {
  // This is a mock function. In a real app, you'd fetch from an API or database
  return messages;
}

export default async function MessagePage({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const initialMessages = await getMessages();

  return (
    <MessageProvider initialMessages={initialMessages}>
      <MessageContainer>{children}</MessageContainer>
    </MessageProvider>
  );
}
