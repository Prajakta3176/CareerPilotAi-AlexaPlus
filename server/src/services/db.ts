import "dotenv/config";
import { Pool } from "pg";

export const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "careerpilot",
  user: "postgres",
  password: process.env.DB_PASSWORD,
});

pool.on("error", (error) => {
  console.error("Unexpected database error:", error);
});
