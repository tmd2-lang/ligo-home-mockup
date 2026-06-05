/**
 * Export home feed constants from HomeScreen.tsx → data/canon/home_content.json
 *
 * Usage: npm run export:home
 */

import * as fs from "fs";
import * as path from "path";
import * as vm from "vm";
import { NEWS_CONST_BY_PROFILE, PROFILE_IDS, SHOWS_CONST_BY_PROFILE } from "./home/constants";

type NewsItem = { art: string; src: string; when: string; head: string };
type ShowItem = { name: string; venue: string; when: string; tag: string; tagCls: string; art: string };

function extractConstLiteral(source: string, name: string): string {
  const marker = `const ${name} = `;
  const start = source.indexOf(marker);
  if (start === -1) throw new Error(`Constant not found: ${name}`);

  let i = start + marker.length;
  while (i < source.length && /\s/.test(source[i])) i++;

  const open = source[i];
  if (open !== "[" && open !== "{") {
    throw new Error(`Expected [ or { for ${name}, got ${source[i]}`);
  }
  const close = open === "[" ? "]" : "}";
  let depth = 0;
  const begin = i;

  for (; i < source.length; i++) {
    const ch = source[i];
    if (ch === open) depth++;
    else if (ch === close) {
      depth--;
      if (depth === 0) return source.slice(begin, i + 1);
    }
  }
  throw new Error(`Unbalanced literal for ${name}`);
}

function evalConst<T>(source: string, name: string): T {
  const literal = extractConstLiteral(source, name);
  return vm.runInNewContext(`(${literal})`, {}, { timeout: 1000 }) as T;
}

function main() {
  const screenPath = path.join(process.cwd(), "components/HomeScreen.tsx");
  const source = fs.readFileSync(screenPath, "utf8");

  const wrapped = evalConst<Record<string, unknown>>(source, "WRAPPED_DATA");

  const news: Record<string, NewsItem[]> = {};
  const shows: Record<string, ShowItem[]> = {};

  for (const profileId of PROFILE_IDS) {
    const newsConst = NEWS_CONST_BY_PROFILE[profileId];
    const showsConst = SHOWS_CONST_BY_PROFILE[profileId];
    news[profileId] = evalConst<NewsItem[]>(source, newsConst);
    shows[profileId] = evalConst<ShowItem[]>(source, showsConst);
  }

  const payload = {
    exported_at: new Date().toISOString(),
    source: "components/HomeScreen.tsx",
    news,
    shows,
    wrapped,
  };

  const outPath = path.join(process.cwd(), "data/canon/home_content.json");
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2) + "\n");

  const newsCount = Object.values(news).reduce((n, rows) => n + rows.length, 0);
  const showsCount = Object.values(shows).reduce((n, rows) => n + rows.length, 0);
  const wrappedCount = Object.keys(wrapped).length;

  console.log(`Wrote ${outPath}`);
  console.log(`  news: ${newsCount} (${PROFILE_IDS.length} profiles)`);
  console.log(`  shows: ${showsCount}`);
  console.log(`  wrapped: ${wrappedCount}`);
}

main();
