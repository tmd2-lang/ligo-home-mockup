import type { DailyAnswerRow, DailyQuestionRow } from "@/lib/supabase/types";

export const CANON_WINDOW_START = "2026-05-08";
export const CANON_WINDOW_END = "2026-06-04";
export const CLAMP_DAY_NUMBER = 28;

const ET = "America/New_York";

export type AnswerTrailItem = {
  dayLabel: string;
  weekday: string;
  day_number: number;
  song: string;
  artist: string;
  today: boolean;
  answer_text: string;
  answer_kind: DailyAnswerRow["answer_kind"];
};

export type DailyRevealBundle = {
  currentDayNumber: number;
  currentQuestion: DailyQuestionRow;
  currentAnswer: DailyAnswerRow;
  answerTrail: AnswerTrailItem[];
};

/** Today as YYYY-MM-DD in Eastern Time. */
export function todayEtIso(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ET,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function resolveCurrentDayNumber(
  questions: DailyQuestionRow[],
  now = new Date()
): number {
  const today = todayEtIso(now);
  if (today < CANON_WINDOW_START || today > CANON_WINDOW_END) {
    return CLAMP_DAY_NUMBER;
  }

  let resolved = 1;
  for (const q of questions) {
    if (q.scheduled_date <= today && q.day_number > resolved) {
      resolved = q.day_number;
    }
  }
  return resolved;
}

export function getQuestionForDay(
  questions: DailyQuestionRow[],
  dayNumber: number
): DailyQuestionRow {
  const q = questions.find((row) => row.day_number === dayNumber);
  if (!q) throw new Error(`No question for day ${dayNumber}`);
  return q;
}

export function getAnswerForDay(
  answers: DailyAnswerRow[],
  dayNumber: number
): DailyAnswerRow {
  const a = answers.find((row) => row.day_number === dayNumber);
  if (!a) throw new Error(`No answer for day ${dayNumber}`);
  return a;
}

function weekdayAbbrev(weekday: string): string {
  return weekday.slice(0, 3);
}

export function displayFieldsForAnswer(answer: DailyAnswerRow): { song: string; artist: string } {
  const text = answer.answer_text.trim();
  if (answer.answer_kind === "song") {
    const title = answer.title?.trim() || text.split(" — ")[0]?.trim() || text;
    const artist = answer.artist?.trim() || text.split(" — ")[1]?.trim() || "";
    return { song: title, artist };
  }
  if (answer.answer_kind === "artist") {
    const name = answer.artist?.trim() || text;
    return { song: name, artist: "" };
  }
  return { song: text, artist: "" };
}

export function mapAnswerTrailSlice(
  questions: DailyQuestionRow[],
  answers: DailyAnswerRow[],
  currentDay: number,
  count = 7
): AnswerTrailItem[] {
  const start = Math.max(1, currentDay - count + 1);
  const questionByDay = new Map(questions.map((q) => [q.day_number, q]));
  const answerByDay = new Map(answers.map((a) => [a.day_number, a]));

  const trail: AnswerTrailItem[] = [];
  for (let day = start; day <= currentDay; day++) {
    const question = questionByDay.get(day);
    const answer = answerByDay.get(day);
    if (!question || !answer) continue;
    const { song, artist } = displayFieldsForAnswer(answer);
    trail.push({
      dayLabel: day === currentDay ? "Today" : weekdayAbbrev(question.weekday),
      weekday: question.weekday,
      day_number: day,
      song,
      artist,
      today: day === currentDay,
      answer_text: answer.answer_text,
      answer_kind: answer.answer_kind,
    });
  }
  return trail;
}

export function buildDailyRevealBundle(
  questions: DailyQuestionRow[],
  answers: DailyAnswerRow[],
  now = new Date()
): DailyRevealBundle {
  const currentDayNumber = resolveCurrentDayNumber(questions, now);
  const currentQuestion = getQuestionForDay(questions, currentDayNumber);
  const currentAnswer = getAnswerForDay(answers, currentDayNumber);
  const answerTrail = mapAnswerTrailSlice(questions, answers, currentDayNumber);

  return {
    currentDayNumber,
    currentQuestion,
    currentAnswer,
    answerTrail,
  };
}
