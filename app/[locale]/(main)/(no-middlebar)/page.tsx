import ChildrenPanel from "@/components/children-panel";
import MessageContainer from "@/components/message-container";
import { ResizableHandle } from "@/components/ui/resizable";
import { Message, messages } from "@/lib/test-data";

async function getMessages(): Promise<Message[]> {
  // This is a mock function. In a real app, you'd fetch from an API or database
  return messages;
}

export default async function MessagePage() {
  const initialMessages = await getMessages();

  return <MessageContainer initialMessages={initialMessages} />;
}
