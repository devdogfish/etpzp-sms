import ChildrenPanel from "@/components/shared/children-panel";
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

async function insertUsers() {
  try {
    const result = await db(
      `
        INSERT INTO "user" (name, email, role, created_at, updated_at, first_name, last_name, lang, profile_color_id, display_name, dark_mode, primary_color_id)
        VALUES
          ('Alice Johnson', 'alice@example.com', 'USER', NOW(), NOW(), 'Alice', 'Johnson', 'en', 1, 'Alice J.', false, 1),
          ('Bob Smith', 'bob@example.com', 'USER', NOW(), NOW(), 'Bob', 'Smith', 'en', 1, 'Bob S.', false, 1),
          ('Charlie Brown', 'charlie@example.com', 'ADMIN', NOW(), NOW(), 'Charlie', 'Brown', 'en', 1, 'Charlie B.', false, 1),
          ('David Wilson', 'david@example.com', 'USER', NOW(), NOW(), 'David', 'Wilson', 'pt', 1, 'David W.', false, 1),
          ('Eve Davis', 'eve@example.com', 'ADMIN', NOW(), NOW(), 'Eve', 'Davis', 'pt', 1, 'Eve D.', true, 1),
          ('Frank Miller', 'frank@example.com', 'USER', NOW(), NOW(), 'Frank', 'Miller', 'en', 1, 'Frank M.', false, 1),
          ('Grace Lee', 'grace@example.com', 'USER', NOW(), NOW(), 'Grace', 'Lee', 'en', 1, 'Grace L.', false, 1),
          ('Hank Green', 'hank@example.com', 'USER', NOW(), NOW(), 'Hank', 'Green', 'pt', 1, 'Hank G.', true, 1),
          ('Irene Taylor', 'irene@example.com', 'ADMIN', NOW(), NOW(), 'Irene', 'Taylor', 'en', 1, 'Irene T.', false, 1),
          ('Jack White', 'jack@example.com', 'USER', NOW(), NOW(), 'Jack', 'White', 'pt', 1, 'Jack W.', false, 1);
    `
    );
    console.log("Users inserted successfully:", result.rows);
  } catch (err) {
    console.error("Error inserting users:", err);
  }
}

// Call the function to insert a message
export default async function Page() {
  await insertUsers();
  for (let i = 1; i <= 300; i++) {
    await insertMessage();
  }

  return (
    <ChildrenPanel>
      <div className="centered">Seeded successfully</div>
    </ChildrenPanel>
  );
}
