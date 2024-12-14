import db from "@/lib/db";

export async function testFetch() {
  const result = await db("SELECT NOW()");
  return result.rows;
}

