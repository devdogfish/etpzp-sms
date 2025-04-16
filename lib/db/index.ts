import { Pool, QueryResult } from "pg";

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

async function db(query: string, params?: any[]): Promise<QueryResult> {
  const client = await pool.connect();
  try {
    const res = await client.query(query, params);
    return res;
  } catch (err) {
    console.error("Database query error", err);
    throw err; // Rethrow the error for handling in the calling function
  } finally {
    client.release(); // Always release the client back to the pool
  }
}

export default db;

// For testing database connections
// db("SELECT $1::text as message", ["Hello world!"])
//   .then(() => console.log("Connected to Postgres!"))
//   .catch((err) => console.error("Error connecting to Postgres!", err));
