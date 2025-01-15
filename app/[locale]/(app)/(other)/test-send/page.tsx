const url = "https://gatewayapi.com/rest/mtsms";
const body = {
  sender: "ExampleSMS",
  message: "Is this message saved?",
  recipients: [{ msisdn: process.env.MY_NUMBER }],
  destaddr: "DISPLAY", // flash sms
};
const headers = {
  Authorization: `Token ${process.env.API_TOKEN}`,
  "Content-Type": "application/json",
};

export default async function Page() {
  async function sendMessage() {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }

      const responseData = await response.json();
      console.log("Success:", responseData);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // Call the function to send the message
  // await sendMessage();
  return <>Hello your message has been sent</>;
}
// http://localhost:3000/test-send
