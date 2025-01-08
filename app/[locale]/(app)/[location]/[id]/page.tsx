import { MessageDisplay } from "@/components/message-display";

export default async function MessagePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  
  return <MessageDisplay messageId={id} />;
}
