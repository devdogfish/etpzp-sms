"use server";
export async function sendMessage() {
  const bearerToken = process.env.API_KEY;
  const from = "Test";
  const to = process.env.MY_NUMBER;
  const message = "Hello this is me";

  if (!bearerToken || !to || !from || !message) {
    throw new Error("Required parameters are not set");
  }

  const url = new URL(`${process.env.API_URL}/sms.do`);
  url.searchParams.append("format", "json");
  console.log(`Current url before adding all params: ${url}`);

  console.log(
    `ABOUT TO FETCH WITH FOLLOWING PARAMS: token:${bearerToken}, to: ${to}, from: ${from}, content: ${message}`
  );

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

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  // console.log(await response.json());
  console.log(response);
}

// you can try some stuff to find out why it wasnt working:
// 1. change "Content type" to x-www-form-urlencoded
// 2. move the toSTring() to the end of the body
// 3. 
