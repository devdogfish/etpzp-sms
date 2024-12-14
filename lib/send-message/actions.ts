"use server";

export async function submitMessage(formData: FormData) {
  const message = formData.get("message") as string;
  const formattedMessage = message ? message.replace(/\r\n/g, "\n") : "";

  console.log(`Message:\n${formattedMessage}`);

  // Here you can add your server-side logic, such as saving to a database
  // For now, we'll just return a success message
  //   return { success: true, message: "Message submitted successfully" };
}
