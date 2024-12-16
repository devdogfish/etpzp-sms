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

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        from: from,
        to: to,
        message: message,
      }).toString(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Response data:", data);
    return data;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    throw error;
  }
}
