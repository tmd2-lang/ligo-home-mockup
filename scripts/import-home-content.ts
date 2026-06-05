/**
 * Import data/canon/home_content.json → Supabase home_* tables.
 *
 * Usage: npm run import:home
 * Prerequisite: 002_home_content.sql applied
 */

import * as fs from "fs";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";
import { EXPECTED_HOME_COUNTS } from "./home/constants";

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

type NewsItem = { art: string; src: string; when: string; head: string };
type ShowItem = { name: string; venue: string; when: string; tag: string; tagCls: string; art: string };

type HomeContentFile = {
  news: Record<string, NewsItem[]>;
  shows: Record<string, ShowItem[]>;
  wrapped: Record<string, unknown>;
};

async function main() {
  loadEnvLocal();
  const dryRun = process.argv.includes("--dry-run");

  const jsonPath = path.join(process.cwd(), "data/canon/home_content.json");
  if (!fs.existsSync(jsonPath)) {
    console.error("Missing data/canon/home_content.json — run npm run export:home first");
    process.exit(1);
  }

  const payload = JSON.parse(fs.readFileSync(jsonPath, "utf8")) as HomeContentFile;

  const newsRows = Object.entries(payload.news).flatMap(([profile_id, items]) =>
    items.map((item, sort_order) => ({
      profile_id,
      sort_order,
      art_url: item.art,
      source_label: item.src,
      time_label: item.when,
      headline: item.head,
    }))
  );

  const showRows = Object.entries(payload.shows).flatMap(([profile_id, items]) =>
    items.map((item, sort_order) => ({
      profile_id,
      sort_order,
      name: item.name,
      venue: item.venue,
      when_label: item.when,
      tag: item.tag,
      tag_style: item.tagCls,
      art_url: item.art,
    }))
  );

  const wrappedRows = Object.entries(payload.wrapped).map(([profile_id, content]) => ({
    profile_id,
    content,
  }));

  console.log("Parsed from home_content.json:");
  console.log(`  home_news: ${newsRows.length}`);
  console.log(`  home_shows: ${showRows.length}`);
  console.log(`  wrapped_stories: ${wrappedRows.length}`);

  if (dryRun) {
    console.log("\nDry run — no writes.");
    return;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }

  const supabase = createClient(url, key);

  {
    const { error } = await supabase.from("home_news").upsert(newsRows, { onConflict: "profile_id,sort_order" });
    if (error) throw error;
    console.log(`home_news: ${newsRows.length} upserted`);
  }

  {
    const { error } = await supabase.from("home_shows").upsert(showRows, { onConflict: "profile_id,sort_order" });
    if (error) throw error;
    console.log(`home_shows: ${showRows.length} upserted`);
  }

  {
    const { error } = await supabase.from("wrapped_stories").upsert(wrappedRows, { onConflict: "profile_id" });
    if (error) throw error;
    console.log(`wrapped_stories: ${wrappedRows.length} upserted`);
  }

  console.log("\n--- counts ---");
  let failed = false;
  for (const [table, expected] of Object.entries(EXPECTED_HOME_COUNTS)) {
    const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
    if (error) throw error;
    const ok = count === expected;
    console.log(`${table}: ${count} ${ok ? "OK" : `EXPECTED ${expected}`}`);
    if (!ok) failed = true;
  }

  if (failed) {
    console.error("\nImport count mismatch — aborting.");
    process.exit(1);
  }

  console.log("\nHome content import complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
