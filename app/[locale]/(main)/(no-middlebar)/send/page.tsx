import { Button } from "@/components/ui/button";
import { sendMessage } from "@/lib/actions/fetch-message-working";

export default function Page() {
  return (
    <div className="p-3 flex flex-col">
      <h2>Send a sms</h2>
      <form action={sendMessage}>
        <Button type="submit">Send a SMS</Button>
      </form>
    </div>
  );
}
