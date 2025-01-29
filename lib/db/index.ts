import { Pool, QueryResult } from "pg";

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
});

// lib/db.js helper query function
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

export function fetchError(name: string, isError: boolean) {
  return isError ? `An unknown error occurred. Failed to fetch ${name}.` : "";
}
