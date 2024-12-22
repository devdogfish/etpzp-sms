import { MessageDisplay } from "@/components/message-display";

interface MessagePageProps {
  params: { id: string };
}

export default async function MessagePage({ params }: MessagePageProps) {
  const { id } = await params;
  return <MessageDisplay messageId={id} />;
}
