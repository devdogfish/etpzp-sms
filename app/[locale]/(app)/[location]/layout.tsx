import MessageContainer from "@/components/message-container";
import { MessageProvider } from "@/contexts/use-messages";
import { fetchMessages } from "@/lib/db/message";
import { DBMessage, MessageLocation } from "@/types";
import { notFound } from "next/navigation";

const validLocations = ["sent", "draft", "trash"];

export default async function MessagePage({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { location: MessageLocation };
}>) {
  const { location } = await params;

  const initialMessages = await fetchMessages();

  if (!validLocations.includes(location)) notFound();
  return (
    <MessageProvider initialMessages={initialMessages}>
      <MessageContainer location={location}>{children}</MessageContainer>
    </MessageProvider>
  );
}
