"use server";
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

async function sendMessage() {
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok " + response.statusText);
  }

  const responseData = await response.json();

  if (response.ok) {
    console.log("Success:", responseData);
  } else {
    console.log("Failed", responseData);
  }
}

// await sendMessage();
