const url = "https://gatewayapi.com/rest/mtsms";
const data = {
  message: "Hello World",
  //   destaddr: "DISPLAY", // flash sms
  recipients: [{ msisdn: process.env.PHONE_NUMBER }],
};

const headers = {
  Authorization: `Basic ${process.env.API_KEY}`,
  Accept: "application/json, text/javascript",
  "Content-Type": "application/json",
};

export default async function Page() {
  async function sendMessage() {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
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
  sendMessage();
  return <>hello your message has been sent</>;
}
