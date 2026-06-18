/** localStorage value for Night Preview → Connection Night (not an aurora index). */
export const CONNECTION_NIGHT_PREVIEW_KEY = "cn";

/** Default profile when none is stored in localStorage. */
export const REVEAL_DEMO_PROFILE_ID = "marcus";

/** Internal demo: seconds to wait after lock-in before reveal auto-opens. */
export const REVEAL_COUNTDOWN_SECONDS = 5;

/** Fallback when the daily-reveal API returns empty (v1 Supabase canvas). */
export const DEMO_QUESTION =
  "One song for walking through Healy at night.";

export function isConnectionNightPreview(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("ligo:demo:night") === CONNECTION_NIGHT_PREVIEW_KEY;
}
