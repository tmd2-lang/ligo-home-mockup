/**
 * Apply supabase/migrations/001_initial_schema.sql via direct Postgres connection.
 *
 * Requires in .env.local:
 *   SUPABASE_DB_PASSWORD=...  (Project Settings → Database)
 * or DATABASE_URL=postgresql://postgres:...@db.<ref>.supabase.co:5432/postgres
 *
 * Usage: npm run db:migrate
 */

import * as fs from "fs";
import * as path from "path";
import pg from "pg";

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const password = process.env.SUPABASE_DB_PASSWORD;
  const match = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
  if (!match || !password) {
    console.error(
      "Missing DATABASE_URL or SUPABASE_DB_PASSWORD in .env.local\n" +
        "Get the database password from Supabase → Project Settings → Database"
    );
    process.exit(1);
  }
  const ref = match[1];
  return `postgresql://postgres:${encodeURIComponent(password)}@db.${ref}.supabase.co:5432/postgres`;
}

async function main() {
  loadEnvLocal();
  const migrationsDir = path.join(process.cwd(), "supabase/migrations");
  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  const client = new pg.Client({ connectionString: getDatabaseUrl(), ssl: { rejectUnauthorized: false } });

  try {
    await client.connect();
    console.log("Connected — applying migrations...");
    for (const file of files) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
      console.log(`  → ${file}`);
      await client.query(sql);
    }
    console.log("Migrations applied successfully.");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
