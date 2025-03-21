import MessagesPage from "@/components/messages-page";
import { fetchSentIn } from "@/lib/db/message";

export default async function Page() {
  const messages = await fetchSentIn("FUTURE");
  console.log("ATTENTION: re-rendered scheduled server component");

  // if (messages && messages[0].sms_reference_id) {
  // messages.forEach(async (message) => {
  const res = await fetch(
    `${process.env.GATEWAYAPI_URL}/rest/mtsms/4456349522`,
    {
      method: "GET",
      headers: {
        Authorization: `Token ${process.env.GATEWAYAPI_TOKEN}`,
        Accept: "application/json, text/javascript",
        "Content-Type": "application/json",
      },
    }
  );
  const resJson = await res.json();
  console.log("fetched for status with result", 4456349522);
  console.log(res);
  // // });
  console.log(resJson);
  // }
  return (
    <MessagesPage
      messages={messages || []}
      error={messages === undefined}
      category="SCHEDULED"
    />
  );
}
