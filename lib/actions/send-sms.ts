"use server";
import axios from "axios";

export const sendSMSAxios = async () => {
  const senderName = "Test";
  const messageContent =
    "Hello there! This message was sent using axios!";
  const recipientNumber = process.env.MY_NUMBER;

  try {
    console.log(`Sending sms to ${recipientNumber}`);
    const res = await axios({
      method: "post",
      url: `${process.env.API_URL}/sms.do`,
      data: [
        { key: "format", value: "json" },
        { key: "from", value: senderName },
        { key: "to", value: recipientNumber },
        { key: "message", value: messageContent },
        { key: "test", value: "1" },
      ],
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });

    // Log the response from SMSAPI
    console.log(`RESPONSE:${res}`);
  } catch (err) {
    // Handle any errors that occur during the request
    console.error(err);
  }
};

export const sendSMSFetch = async () => {
  const senderName = "Test_fetch";
  const messageContent = "Hello there! This message was sent using fetch()!";
  const recipientNumber = process.env.MY_NUMBER || "";

  try {
    console.log(`Sending sms to ${recipientNumber}`);
    const res = await fetch(`${process.env.API_URL}/sms.do`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      body: new URLSearchParams({
        from: senderName,
        to: recipientNumber,
        message: messageContent,
        test: "1",
      }),
    });

    // Log the response from SMSAPI
    console.log(`RESPONSE:${res}`);
  } catch (err) {
    // Handle any errors that occur during the request
    console.error(err);
  }
};

export async function sendMessage() {
  const bearerToken = process.env.API_KEY;

  const from = "Test";
  const to = process.env.MY_NUMBER;
  const message = "Hello this is me";
  if (!bearerToken || !to || !from || !message) {
    throw new Error("Something is undefined");
  }
  const url = new URL(`${process.env.API_URL}/sms.do`);
  url.searchParams.append("format", "json");
  console.log(`Current url before adding all params: ${url}`);

  // console.log(`ABOUT TO FETCH WITH FOLLOWING PARAMS: token:${bearerToken}, to: ${to}, from: ${from}, content${message}`)
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
    body: new URLSearchParams({
      from: from.toString(),
      to: to.toString(),
      message: message.toString(),
    }),
  });

  // console.log(await response.json());
  console.log(response);
}
