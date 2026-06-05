import type { HomeNewsRow, HomeShowRow, WrappedStoryRow } from "@/lib/supabase/types";
import type { SupabaseClient } from "@supabase/supabase-js";

export type HomeContentBundle = {
  news: HomeNewsRow[];
  shows: HomeShowRow[];
  wrapped: WrappedStoryRow["content"] | null;
};

export async function getHomeNews(
  supabase: SupabaseClient,
  profileId: string
): Promise<HomeNewsRow[]> {
  const { data, error } = await supabase
    .from("home_news")
    .select("*")
    .eq("profile_id", profileId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getHomeShows(
  supabase: SupabaseClient,
  profileId: string
): Promise<HomeShowRow[]> {
  const { data, error } = await supabase
    .from("home_shows")
    .select("*")
    .eq("profile_id", profileId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getWrappedStory(
  supabase: SupabaseClient,
  profileId: string
): Promise<WrappedStoryRow["content"] | null> {
  const { data, error } = await supabase
    .from("wrapped_stories")
    .select("content")
    .eq("profile_id", profileId)
    .maybeSingle();
  if (error) throw error;
  return data?.content ?? null;
}

export async function getHomeContentForProfile(
  supabase: SupabaseClient,
  profileId: string
): Promise<HomeContentBundle | null> {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", profileId)
    .maybeSingle();
  if (profileError) throw profileError;
  if (!profile) return null;

  const [news, shows, wrapped] = await Promise.all([
    getHomeNews(supabase, profileId),
    getHomeShows(supabase, profileId),
    getWrappedStory(supabase, profileId),
  ]);

  return { news, shows, wrapped };
}
