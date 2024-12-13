import MessageContainer from "@/components/message-container";
import { SelectedMessageProvider } from "@/contexts/use-selected-message";
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
    <MessageContainer initialMessages={initialMessages}>
      {children}
    </MessageContainer>
  );
}
