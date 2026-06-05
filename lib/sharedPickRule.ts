import type { DailyAnswerRow, DailyQuestionRow } from "@/lib/supabase/types";

export type SharedPickType = "exact" | "same_artist" | "neighborhood";

export type SharedPickRule = {
  show: boolean;
  artist: string;
  cardLabel: string;
  type: SharedPickType;
  date: string;
  detail: string;
};

export type SharedPickCard = {
  label: string;
  date: string;
  detail: string;
  artist: string;
  type: SharedPickType;
};

export type WeekGridCell = {
  label: string;
  status: "match" | "miss" | "today";
};

function pairKey(a: string, b: string): string {
  return a < b ? `${a}+${b}` : `${b}+${a}`;
}

/** Verbatim from Ligo_SharedPick_Rule.xlsx — 16 undirected pairs. */
export const SHARED_PICK_RULES: Record<string, SharedPickRule> = {
  "caroline+cole": {
    show: true,
    artist: "Morgan Wallen",
    cardLabel: "You both picked Morgan Wallen",
    type: "exact",
    date: "Thu, May 21",
    detail: "You both named Morgan Wallen",
  },
  "caroline+charlotte": {
    show: true,
    artist: "Taylor Swift",
    cardLabel: "You both picked Taylor Swift",
    type: "exact",
    date: "Sun, May 17",
    detail: "You both named Taylor Swift",
  },
  "charlotte+cole": {
    show: true,
    artist: "Frank Ocean",
    cardLabel: "You both reached for Frank Ocean",
    type: "same_artist",
    date: "Wed, May 13",
    detail: "Nights vs. Pink + White",
  },
  "alessia+maddie": {
    show: true,
    artist: "Addison Rae",
    cardLabel: "You both reached for Addison Rae",
    type: "same_artist",
    date: "Sun, May 10",
    detail: "Diet Pepsi vs. Aquamarine",
  },
  "maddie+marcus": { show: false, artist: "", cardLabel: "", type: "neighborhood", date: "", detail: "" },
  "alessia+jordan": { show: false, artist: "", cardLabel: "", type: "neighborhood", date: "", detail: "" },
  "alessia+sofia": { show: false, artist: "", cardLabel: "", type: "neighborhood", date: "", detail: "" },
  "alessia+charlotte": { show: false, artist: "", cardLabel: "", type: "neighborhood", date: "", detail: "" },
  "alessia+marcus": { show: false, artist: "", cardLabel: "", type: "neighborhood", date: "", detail: "" },
  "bennett+jordan": { show: false, artist: "", cardLabel: "", type: "neighborhood", date: "", detail: "" },
  "cole+sofia": { show: false, artist: "", cardLabel: "", type: "neighborhood", date: "", detail: "" },
  "charlotte+sofia": { show: false, artist: "", cardLabel: "", type: "neighborhood", date: "", detail: "" },
  "caroline+sofia": { show: false, artist: "", cardLabel: "", type: "neighborhood", date: "", detail: "" },
  "bennett+cole": { show: false, artist: "", cardLabel: "", type: "neighborhood", date: "", detail: "" },
  "jordan+marcus": { show: false, artist: "", cardLabel: "", type: "neighborhood", date: "", detail: "" },
  "maddie+sofia": { show: false, artist: "", cardLabel: "", type: "neighborhood", date: "", detail: "" },
};

export function sharedPickRuleForPair(viewerId: string, matchId: string): SharedPickRule | null {
  return SHARED_PICK_RULES[pairKey(viewerId, matchId)] ?? null;
}

export function sharedPickCardForPair(viewerId: string, matchId: string): SharedPickCard | null {
  const rule = sharedPickRuleForPair(viewerId, matchId);
  if (!rule?.show) return null;
  return {
    label: rule.cardLabel,
    date: rule.date,
    detail: rule.detail,
    artist: rule.artist,
    type: rule.type,
  };
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

function artistFromAnswer(answer: DailyAnswerRow): string {
  return normalizeText(answer.artist?.trim() || answer.answer_text.split(" — ")[1]?.trim() || answer.answer_text);
}

function answersOverlap(viewer: DailyAnswerRow, match: DailyAnswerRow): boolean {
  if (normalizeText(viewer.answer_text) === normalizeText(match.answer_text)) return true;
  const viewerArtist = artistFromAnswer(viewer);
  const matchArtist = artistFromAnswer(match);
  if (viewerArtist && matchArtist && viewerArtist === matchArtist) return true;
  return false;
}

export function buildWeekAnswerGrid(
  questions: DailyQuestionRow[],
  viewerAnswers: DailyAnswerRow[],
  matchAnswers: DailyAnswerRow[],
  currentDay: number,
  windowSize = 5
): WeekGridCell[] {
  const questionByDay = new Map(questions.map((q) => [q.day_number, q]));
  const viewerByDay = new Map(viewerAnswers.map((a) => [a.day_number, a]));
  const matchByDay = new Map(matchAnswers.map((a) => [a.day_number, a]));

  const start = Math.max(1, currentDay - windowSize + 1);
  const grid: WeekGridCell[] = [];

  for (let day = start; day <= currentDay; day++) {
    const question = questionByDay.get(day);
    const viewer = viewerByDay.get(day);
    const match = matchByDay.get(day);
    if (!question || !viewer || !match) continue;

    const status: WeekGridCell["status"] =
      day === currentDay ? "today" : answersOverlap(viewer, match) ? "match" : "miss";

    grid.push({
      label: question.weekday.slice(0, 3),
      status,
    });
  }

  return grid;
}
