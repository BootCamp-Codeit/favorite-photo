import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "../src/db/mysql.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(__dirname, "..", "schema.sql");

async function main() {
  const raw = fs.readFileSync(schemaPath, "utf8");
  const sql = raw
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");

  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const conn = await pool.getConnection();
  try {
    for (const statement of statements) {
      const label =
        statement.match(/CREATE TABLE IF NOT EXISTS\s+(`?\w+`?)/i)?.[1] ?? "statement";
      try {
        await conn.query(statement);
        console.log(`OK: ${label}`);
      } catch (err) {
        console.error(`FAIL: ${label} — ${err.message}`);
        throw err;
      }
    }
    console.log("Schema applied successfully.");
  } finally {
    conn.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error("Schema apply failed:", err.message);
  process.exit(1);
});
