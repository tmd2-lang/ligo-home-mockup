import type { SupabaseClient } from "@supabase/supabase-js";
import { buildDailyRevealBundle } from "@/lib/dailyReveal";
import type { DailyRevealBundle } from "@/lib/dailyReveal";
import { getDailyAnswersForProfile } from "@/lib/supabase/queries/canon";
import type { DailyQuestionRow, Database } from "@/lib/supabase/types";

export async function getDailyQuestions(
  supabase: SupabaseClient<Database>
): Promise<DailyQuestionRow[]> {
  const { data, error } = await supabase
    .from("daily_questions")
    .select("*")
    .order("day_number", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getDailyRevealForProfile(
  supabase: SupabaseClient<Database>,
  profileId: string
): Promise<DailyRevealBundle | null> {
  const [questions, answers] = await Promise.all([
    getDailyQuestions(supabase),
    getDailyAnswersForProfile(supabase, profileId),
  ]);
  if (!answers.length) return null;
  return buildDailyRevealBundle(questions, answers);
}
