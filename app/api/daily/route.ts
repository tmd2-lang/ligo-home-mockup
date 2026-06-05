import { NextResponse } from "next/server";
import { getDailyRevealForProfile } from "@/lib/supabase/queries/daily";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        error: "Supabase not configured",
        hint: "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart the dev server",
      },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const profileId = searchParams.get("profile")?.trim().toLowerCase();
  if (!profileId) {
    return NextResponse.json({ error: "Missing query param: profile" }, { status: 400 });
  }

  try {
    const supabase = createServerSupabaseClient();
    const bundle = await getDailyRevealForProfile(supabase, profileId);
    if (!bundle) {
      return NextResponse.json({ error: `Profile not found: ${profileId}` }, { status: 404 });
    }

    return NextResponse.json({
      profileId,
      currentDayNumber: bundle.currentDayNumber,
      currentQuestion: bundle.currentQuestion,
      currentAnswer: bundle.currentAnswer,
      answerTrail: bundle.answerTrail,
      meta: {
        trailCount: bundle.answerTrail.length,
        windowStart: "2026-05-08",
        windowEnd: "2026-06-04",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
