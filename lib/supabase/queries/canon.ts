import type { SupabaseClient } from "@supabase/supabase-js";
import type { CanonBundle, ConnectionRosterRow, DailyAnswerRow, ProfileRow, Database } from "../types";

export async function getProfile(
  supabase: SupabaseClient<Database>,
  id: string
): Promise<ProfileRow | null> {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getDailyAnswersForProfile(
  supabase: SupabaseClient<Database>,
  profileId: string
): Promise<DailyAnswerRow[]> {
  const { data, error } = await supabase
    .from("daily_answers")
    .select("*")
    .eq("profile_id", profileId)
    .order("day_number", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getDailyAnswersForProfiles(
  supabase: SupabaseClient<Database>,
  profileIds: string[]
): Promise<Record<string, DailyAnswerRow[]>> {
  if (!profileIds.length) return {};
  const { data, error } = await supabase
    .from("daily_answers")
    .select("*")
    .in("profile_id", profileIds)
    .order("day_number", { ascending: true });
  if (error) throw error;

  const rows = (data ?? []) as DailyAnswerRow[];
  const byProfile: Record<string, DailyAnswerRow[]> = {};
  for (const id of profileIds) byProfile[id] = [];
  for (const row of rows) {
    byProfile[row.profile_id]?.push(row);
  }
  return byProfile;
}

export async function getConnectionRoster(
  supabase: SupabaseClient<Database>,
  viewerId: string
): Promise<ConnectionRosterRow[]> {
  const { data, error } = await supabase
    .from("connection_roster")
    .select("*")
    .eq("viewer_id", viewerId)
    .order("rank", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getCanonBundle(
  supabase: SupabaseClient<Database>,
  profileId: string
): Promise<CanonBundle | null> {
  const profile = await getProfile(supabase, profileId);
  if (!profile) return null;
  const [dailyAnswers, connectionRoster] = await Promise.all([
    getDailyAnswersForProfile(supabase, profileId),
    getConnectionRoster(supabase, profileId),
  ]);
  return { profile, dailyAnswers, connectionRoster };
}
