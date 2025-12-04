"use server";

import { Pool, QueryResult } from "pg";
import { neon } from "@neondatabase/serverless";

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

// async function db(query: string, params?: any[]): Promise<QueryResult> {
//   const client = await pool.connect();
//   try {
//     const res = await client.query(query, params);
//     return res;
//   } catch (err) {
//     console.error("Database query error", err);
//     throw err; // Rethrow the error for handling in the calling function
//   } finally {
//     client.release(); // Always release the client back to the pool
//   }
// }
async function db(query: string, params?: any[],verbose?: boolean) {
  if (verbose) {
    console.log(query, params);
    
  }

  const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });
  const result = await pool.query(query, params || []);
  await pool.end();
  return { rows: result.rows };
}

export default db;

// For testing database connections
// db("SELECT $1::text as message", ["Hello world!"])
//   .then(() => console.log("Connected to Postgres!"))
//   .catch((err) => console.error("Error connecting to Postgres!", err));
