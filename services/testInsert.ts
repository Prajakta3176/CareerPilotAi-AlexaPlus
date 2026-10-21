
import "dotenv/config";
import { pool } from "./db";

async function testInsert() {
  try {
    const result = await pool.query(
      `INSERT INTO users (name, email)
       VALUES ($1, $2)
       RETURNING *`,
      ["Test User", "test@careerpilot.local"]
    );

    console.log("Record saved successfully!");
    console.log(result.rows[0]);
  } catch (error) {
    console.error("Insert failed:", error);
  } finally {
    await pool.end();
  }
}

testInsert();
