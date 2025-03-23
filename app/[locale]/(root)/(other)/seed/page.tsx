import db from "@/lib/db";

// Function to generate a random date up to 3 years ago
function getRandomDate() {
  const now = new Date();
  const threeYearsAgo = new Date(now.setFullYear(now.getFullYear() - 2));
  const randomDate = new Date(
    threeYearsAgo.getTime() +
      Math.random() * (Date.now() - threeYearsAgo.getTime())
  );
  return randomDate;
}

// Function to generate random message data
function getRandomMessageData() {
  const users = Array.from({ length: 10 }, (_, i) => i + 1); // User IDs from 1 to 10
  const subjects = [
    "Hello",
    "Meeting Reminder",
    "Invoice",
    "Newsletter",
    "Promotion",
  ];
  const bodies = [
    "This is a test message.",
    "Don’t forget about our meeting tomorrow.",
    "Your invoice is attached.",
    "Check out our latest newsletter.",
    "Exclusive offer just for you!",
  ];
  const statuses = ["SENT", "SCHEDULED", "FAILED", "DRAFTED"];

  return {
    user_id: users[Math.floor(Math.random() * users.length)],
    sender: `user${Math.floor(Math.random() * 10) + 1}@example.com`,
    subject: subjects[Math.floor(Math.random() * subjects.length)],
    body: bodies[Math.floor(Math.random() * bodies.length)],
    send_time: getRandomDate(),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    in_trash: false, // Randomly true or false
    cost: parseFloat((Math.random() * 0.1).toFixed(4)), // Random cost between 0.0 and 0.1
    cost_currency: "EUR",
  };
}

// Function to insert a message into the database
async function insertMessage() {
  const messageData = getRandomMessageData();

  const query = `
        INSERT INTO "message" (user_id, sender, subject, body, send_time, status, in_trash, cost, cost_currency)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;

  const values = [
    messageData.user_id,
    messageData.sender,
    messageData.subject,
    messageData.body,
    messageData.send_time,
    messageData.status,
    messageData.in_trash,
    messageData.cost,
    messageData.cost_currency,
  ];

  try {
    await db(query, values);
    console.log("Message inserted successfully:", messageData);
  } catch (err) {
    console.error("Error inserting message:", err);
  }
}

// Call the function to insert a message
export default async function Page() {
  for (let i = 1; i <= 300; i++) {
    await insertMessage();
  }

  return <>Seeded successfully</>;
}
