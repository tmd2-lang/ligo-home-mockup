/**
 * Import canon xlsx → Supabase (service role).
 * Scores and copy are verbatim — never computes matches.
 *
 * Usage: npm run import:canon
 * Requires: SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SUPABASE_URL in .env.local
 */

import * as fs from "fs";
import * as path from "path";
import * as XLSX from "xlsx";
import { createClient } from "@supabase/supabase-js";
import {
  ANSWER_PROFILE_COLUMNS,
  EXPECTED_COUNTS,
  PROFILE_IDENTITY,
  PROFILE_SLUGS,
  answerTypeToKind,
  excelSerialToIsoDate,
  normalizePairIds,
  parseAnswerText,
  slugFromDisplayName,
} from "./canon/constants";

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

function cellStr(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "number") return String(v);
  return String(v).trim();
}

function readSheetRows(wb: XLSX.WorkBook, sheetName: string): Record<string, unknown>[] {
  const sheet = wb.Sheets[sheetName];
  if (!sheet) throw new Error(`Sheet not found: ${sheetName}`);
  return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
}

async function main() {
  loadEnvLocal();

  const dryRun = process.argv.includes("--dry-run");

  const dailyPath = path.join(process.cwd(), "data/canon/Ligo_28_Day_Daily_Answers_Matrix.xlsx");
  const seedPath = path.join(process.cwd(), "data/canon/Ligo_Connection_Seed.xlsx");
  const copyPath = path.join(process.cwd(), "data/canon/Ligo_Directional_Copy.xlsx");
  if (!fs.existsSync(dailyPath) || !fs.existsSync(seedPath) || !fs.existsSync(copyPath)) {
    console.error("Canon xlsx missing in data/canon/ (matrix, seed, directional copy)");
    process.exit(1);
  }

  const dailyWb = XLSX.readFile(dailyPath);
  const seedWb = XLSX.readFile(seedPath);
  const copyWb = XLSX.readFile(copyPath);

  const matrixRows = readSheetRows(dailyWb, "Daily Answer Matrix");
  const profilesRows = readSheetRows(dailyWb, "Profiles");
  const questionBankRows = readSheetRows(dailyWb, "Question Bank");
  const rosterRows = readSheetRows(copyWb, "connection_roster");
  const pairsRows = readSheetRows(seedWb, "Unique Connections");

  const profileCount = PROFILE_IDENTITY.length;
  const questionCount = matrixRows.filter((row) => cellStr(row["Day #"])).length;
  const answerCount = matrixRows.filter((row) => cellStr(row["Day #"])).length * Object.keys(ANSWER_PROFILE_COLUMNS).length;
  const pairCount = pairsRows.filter((row) => cellStr(row["Person A"])).length;
  const rosterCount = rosterRows.filter((row) => cellStr(row["viewer_id"])).length;

  console.log("Parsed from xlsx:");
  console.log(`  profiles: ${profileCount}`);
  console.log(`  daily_questions: ${questionCount}`);
  console.log(`  daily_answers: ${answerCount}`);
  console.log(`  connection_pairs: ${pairCount}`);
  console.log(`  connection_roster: ${rosterCount}`);

  const expected = EXPECTED_COUNTS;
  const ok =
    profileCount === expected.profiles &&
    questionCount === expected.daily_questions &&
    answerCount === expected.daily_answers &&
    pairCount === expected.connection_pairs &&
    rosterCount === expected.connection_roster;

  if (!ok) {
    console.error("\nParsed counts do not match expected canon.");
    process.exit(1);
  }

  if (dryRun) {
    console.log("\nDry run OK — skipping Supabase upsert.");
    return;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
    console.error("Run with --dry-run to validate xlsx parsing only.");
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // --- profiles ---
  const behavioralBySlug = new Map<string, string>();
  for (const row of profilesRows) {
    const name = cellStr(row["Profile"]);
    if (!name) continue;
    const slug = slugFromDisplayName(name);
    behavioralBySlug.set(slug, cellStr(row["Behavioral Notes for Answers"]));
  }

  const profileRows = PROFILE_IDENTITY.map((p) => ({
    ...p,
    behavioral_note: behavioralBySlug.get(p.id) ?? null,
  }));

  {
    const { error } = await supabase.from("profiles").upsert(profileRows, { onConflict: "id" });
    if (error) throw error;
    console.log(`profiles: ${profileRows.length} upserted`);
  }

  // --- daily_questions ---
  const bankByShuffledDay = new Map<number, { original_number: number; scheduled_date: string }>();
  for (const row of questionBankRows) {
    const shuffled = Number(row["Shuffled Day #"]);
    if (!shuffled) continue;
    const serial = Number(row["Scheduled Date"]);
    bankByShuffledDay.set(shuffled, {
      original_number: Number(row["Original #"]) || 0,
      scheduled_date: Number.isFinite(serial) ? excelSerialToIsoDate(serial) : cellStr(row["Scheduled Date"]),
    });
  }

  const questionRows = matrixRows
    .filter((row) => cellStr(row["Day #"]))
    .map((row) => {
      const day_number = Number(row["Day #"]);
      const answer_type = cellStr(row["Answer Type"]);
      const bank = bankByShuffledDay.get(day_number);
      let scheduled_date = bank?.scheduled_date ?? "";
      if (!scheduled_date) {
        const serial = Number(row["Date"]);
        if (Number.isFinite(serial)) scheduled_date = excelSerialToIsoDate(serial);
      }
      return {
        day_number,
        scheduled_date,
        weekday: cellStr(row["Weekday"]),
        question_type: cellStr(row["Question Type"]),
        answer_type,
        question_text: cellStr(row["Daily Question"]),
        original_number: bank?.original_number ?? null,
      };
    });

  {
    const { error } = await supabase
      .from("daily_questions")
      .upsert(questionRows, { onConflict: "day_number" });
    if (error) throw error;
    console.log(`daily_questions: ${questionRows.length} upserted`);
  }

  const kindByDay = new Map(questionRows.map((q) => [q.day_number, answerTypeToKind(q.answer_type)]));

  // --- daily_answers ---
  const answerRows: Array<{
    day_number: number;
    profile_id: string;
    answer_text: string;
    answer_kind: "song" | "artist" | "genre";
    artist: string | null;
    title: string | null;
    cover_url: string | null;
  }> = [];

  for (const row of matrixRows) {
    const day_number = Number(row["Day #"]);
    if (!day_number) continue;
    const answer_kind = kindByDay.get(day_number);
    if (!answer_kind) throw new Error(`No question for day ${day_number}`);

    for (const [displayName, profile_id] of Object.entries(ANSWER_PROFILE_COLUMNS)) {
      const answer_text = cellStr(row[displayName]);
      if (!answer_text) continue;
      const parsed = parseAnswerText(answer_text);
      let artist: string | null = parsed.artist;
      let title: string | null = parsed.title;
      if (answer_kind === "artist" && !artist) artist = answer_text;
      if (answer_kind === "genre" && !artist) artist = answer_text;
      answerRows.push({
        day_number,
        profile_id,
        answer_text,
        answer_kind,
        artist,
        title,
        cover_url: null,
      });
    }
  }

  {
    const { error } = await supabase
      .from("daily_answers")
      .upsert(answerRows, { onConflict: "day_number,profile_id" });
    if (error) throw error;
    console.log(`daily_answers: ${answerRows.length} upserted`);
  }

  // --- connection_pairs (reference, verbatim) ---
  const pairRows = pairsRows
    .filter((row) => cellStr(row["Person A"]))
    .map((row) => {
      const [profile_a_id, profile_b_id] = normalizePairIds(
        slugFromDisplayName(cellStr(row["Person A"])),
        slugFromDisplayName(cellStr(row["Person B"]))
      );
      return {
        profile_a_id,
        profile_b_id,
        score: Number(row["Score"]),
        match_type: cellStr(row["Match Type"]),
        shared_lane: cellStr(row["Shared Lane"]) || null,
        headline_overlap: cellStr(row["Headline Overlap"]) || null,
        why_copy: cellStr(row["Why (copy)"]),
      };
    });

  {
    const { error } = await supabase.from("connection_pairs").upsert(pairRows, {
      onConflict: "profile_a_id,profile_b_id",
    });
    if (error) throw error;
    console.log(`connection_pairs: ${pairRows.length} upserted`);
  }

  // --- connection_roster (directional copy — viewer-facing "you" voice) ---
  const rosterData = rosterRows
    .filter((row) => cellStr(row["viewer_id"]))
    .map((row) => ({
      viewer_id: cellStr(row["viewer_id"]),
      rank: Number(row["rank"]),
      match_id: cellStr(row["match_id"]),
      score: Number(row["score"]),
      match_type: cellStr(row["match_type"]),
      shared_lane: cellStr(row["shared_lane"]) || null,
      headline_overlap: null,
      why_copy: cellStr(row["why_copy"]),
    }));

  {
    const { error } = await supabase.from("connection_roster").upsert(rosterData, {
      onConflict: "viewer_id,rank",
    });
    if (error) throw error;
    console.log(`connection_roster: ${rosterData.length} upserted`);
  }

  // --- verify counts ---
  const tables = [
    "profiles",
    "daily_questions",
    "daily_answers",
    "connection_pairs",
    "connection_roster",
  ] as const;

  console.log("\n--- counts ---");
  let failed = false;
  for (const table of tables) {
    const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
    if (error) throw error;
    const expected = EXPECTED_COUNTS[table];
    const ok = count === expected;
    console.log(`${table}: ${count} ${ok ? "OK" : `EXPECTED ${expected}`}`);
    if (!ok) failed = true;
  }

  if (failed) {
    console.error("\nImport count mismatch — aborting.");
    process.exit(1);
  }

  console.log("\nCanon import complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
