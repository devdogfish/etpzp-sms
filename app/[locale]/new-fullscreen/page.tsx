import NewMessageForm from "@/components/new-message-form";

export default async function Page({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  return <NewMessageForm isFullScreen={true} />;
}
