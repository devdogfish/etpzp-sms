import { Button } from "@/components/ui/button";
import { sendMessage } from "@/lib/actions/fetch-message-working";
import { testFetch } from "@/lib/send-sms/data";

export default async function Page() {
  const data = await testFetch();
  console.log(data);
  return (
    <div className="p-3 flex flex-col">
      <h2>Send a sms</h2>
      <form action={sendMessage}>
        <Button type="submit">Send a SMS</Button>
      </form>
    </div>
  );
}
