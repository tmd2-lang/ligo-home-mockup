import type { ConnectionRosterRow, DailyAnswerRow } from "@/lib/supabase/types";

export type ConnectionNightDemoBundle = {
  currentDayNumber: number;
  currentAnswer: DailyAnswerRow;
  connectionRoster: ConnectionRosterRow[];
};

const PROFILE_IDS = [
  "jordan",
  "alessia",
  "charlotte",
  "cole",
  "sofia",
  "bennett",
  "caroline",
  "maddie",
  "marcus",
] as const;

export type DemoProfileId = (typeof PROFILE_IDS)[number];

function rosterRow(
  viewerId: string,
  rank: number,
  matchId: string,
  score: number,
  matchType: string,
  sharedLane: string | null,
  whyCopy: string
): ConnectionRosterRow {
  return {
    viewer_id: viewerId,
    rank,
    match_id: matchId,
    score,
    match_type: matchType,
    shared_lane: sharedLane,
    headline_overlap: null,
    why_copy: whyCopy,
  };
}

function tonightAnswer(profileId: string): DailyAnswerRow {
  return {
    id: `demo-cn-${profileId}-tonight`,
    day_number: 28,
    profile_id: profileId,
    answer_text: "Self Control — Frank Ocean",
    answer_kind: "song",
    artist: "Frank Ocean",
    title: "Self Control",
    cover_url: "/artists/frank-blond.png",
  };
}

/** Directed connection copy — viewer → match */
const ROSTERS: Record<DemoProfileId, ConnectionRosterRow[]> = {
  cole: [
    rosterRow(
      "cole",
      1,
      "caroline",
      91,
      "Spark",
      "stadium country",
      "You both reach for the same songs when the night gets loud — Caroline names the hook before you finish the thought. Three answers this week landed in the same lane."
    ),
    rosterRow(
      "cole",
      2,
      "charlotte",
      84,
      "Vibe",
      "late-night R&B",
      "Charlotte builds playlists like you build excuses to stay out — Frank Ocean keeps showing up for both of you. Not coincidence. Pattern."
    ),
    rosterRow(
      "cole",
      3,
      "marcus",
      79,
      "Vibe",
      "house & techno",
      "Marcus goes harder on the aux but you share the same 2 a.m. energy. Campus thinks you're opposites. Your answers disagree."
    ),
  ],
  caroline: [
    rosterRow(
      "caroline",
      1,
      "cole",
      91,
      "Spark",
      "stadium country",
      "Cole picks like he's DJing for a room that hasn't arrived yet — you keep meeting him on the same choruses. The overlap isn't subtle anymore."
    ),
    rosterRow(
      "caroline",
      2,
      "charlotte",
      86,
      "Vibe",
      "pop devotion",
      "Charlotte treats Taylor eras like weather reports. You matched on two answers before lunch this week — same sky, different forecast."
    ),
    rosterRow(
      "caroline",
      3,
      "maddie",
      77,
      "Vibe",
      "sing-along pop",
      "Maddie picks songs built for windows-down drives. You both answered like the campus was a passenger seat."
    ),
  ],
  charlotte: [
    rosterRow(
      "charlotte",
      1,
      "cole",
      84,
      "Vibe",
      "late-night R&B",
      "Cole names Frank Ocean like it's a reflex. You went different tracks, same artist, same hour — that's a lane, not a fluke."
    ),
    rosterRow(
      "charlotte",
      2,
      "caroline",
      86,
      "Vibe",
      "pop devotion",
      "Caroline commits to a chorus like it's a promise. You matched twice this week without trying — mainstream doesn't mean predictable between you two."
    ),
    rosterRow(
      "charlotte",
      3,
      "sofia",
      80,
      "Spark",
      "indie & alt",
      "Sofia finds the deep cut in every question. You both answered like the majority was a suggestion, not a rule."
    ),
  ],
  marcus: [
    rosterRow(
      "marcus",
      1,
      "maddie",
      88,
      "Spark",
      "club & pop",
      "Maddie picks like every night could be a video. You matched on energy before you matched on titles — the kind of overlap that shows up at the same pregame."
    ),
    rosterRow(
      "marcus",
      2,
      "cole",
      79,
      "Vibe",
      "house & techno",
      "Cole's taste is louder on paper but your answers keep brushing the same BPM. Different genres, same appetite for momentum."
    ),
    rosterRow(
      "marcus",
      3,
      "jordan",
      74,
      "Vibe",
      "underground house",
      "Jordan disappears into hypnotic records the way you disappear into a set. Two answers this week felt like the same room."
    ),
  ],
  maddie: [
    rosterRow(
      "maddie",
      1,
      "marcus",
      88,
      "Spark",
      "club & pop",
      "Marcus treats every question like a drop is coming. You keep landing on the same side of campus — loud, immediate, unapologetic."
    ),
    rosterRow(
      "maddie",
      2,
      "alessia",
      82,
      "Vibe",
      "moody pop",
      "Alessia answers like she's scoring a film only she can see. You matched on vibe twice — not the same song, the same temperature."
    ),
    rosterRow(
      "maddie",
      3,
      "caroline",
      77,
      "Vibe",
      "sing-along pop",
      "Caroline picks hooks made for crowds. You both answered like Georgetown was one big car ride."
    ),
  ],
  alessia: [
    rosterRow(
      "alessia",
      1,
      "maddie",
      82,
      "Vibe",
      "moody pop",
      "Maddie chooses brightness; you choose ache — but this week your answers kept orbiting the same mood. Opposites that still rhyme."
    ),
    rosterRow(
      "alessia",
      2,
      "sofia",
      78,
      "Vibe",
      "indie & alt",
      "Sofia hears texture where other people hear trends. You both went off-campus on the same night — minority frame, same instinct."
    ),
    rosterRow(
      "alessia",
      3,
      "jordan",
      73,
      "Vibe",
      "afterhours electronic",
      "Jordan's answers feel like 3 a.m. in headphone form. You shared a lane without sharing a title — that's the interesting kind of match."
    ),
  ],
  sofia: [
    rosterRow(
      "sofia",
      1,
      "charlotte",
      80,
      "Spark",
      "indie & alt",
      "Charlotte lives in the mainstream on purpose. You keep finding the side door anyway — and this week, you knocked on the same one."
    ),
    rosterRow(
      "sofia",
      2,
      "alessia",
      78,
      "Vibe",
      "moody pop",
      "Alessia writes feelings in minor keys. Your answers lined up on atmosphere before they lined up on artists."
    ),
    rosterRow(
      "sofia",
      3,
      "bennett",
      75,
      "Vibe",
      "country & aux",
      "Bennett picks like the night is always almost over. You both answered with songs that sound better when you're not ready to go home."
    ),
  ],
  bennett: [
    rosterRow(
      "bennett",
      1,
      "jordan",
      81,
      "Vibe",
      "late-night range",
      "Jordan finds the hypnotic thread in everything. You matched on pace this week — slow burn, same destination."
    ),
    rosterRow(
      "bennett",
      2,
      "sofia",
      75,
      "Vibe",
      "country & alt",
      "Sofia picks like she's avoiding the obvious on principle. You still met in the middle of two unexpected answers."
    ),
    rosterRow(
      "bennett",
      3,
      "cole",
      72,
      "Vibe",
      "stadium & singalong",
      "Cole names crowd songs without embarrassment. You both answered like the party was already happening somewhere on campus."
    ),
  ],
  jordan: [
    rosterRow(
      "jordan",
      1,
      "marcus",
      74,
      "Vibe",
      "underground house",
      "Marcus brings velocity; you bring depth — but your answers touched the same floor twice this week. Different tempo, same room."
    ),
    rosterRow(
      "jordan",
      2,
      "bennett",
      81,
      "Vibe",
      "late-night range",
      "Bennett answers like every song is the last one of the night. You keep picking records that feel like an afterhours invite."
    ),
    rosterRow(
      "jordan",
      3,
      "alessia",
      73,
      "Vibe",
      "afterhours electronic",
      "Alessia hears melancholy in stereo. You matched on mood when the campus was still deciding what tonight meant."
    ),
  ],
};

function bundleFor(profileId: string): ConnectionNightDemoBundle | null {
  const id = profileId.toLowerCase() as DemoProfileId;
  const roster = ROSTERS[id];
  if (!roster) return null;
  return {
    currentDayNumber: 28,
    currentAnswer: tonightAnswer(id),
    connectionRoster: roster,
  };
}

export function getConnectionNightDemoBundle(profileId: string): ConnectionNightDemoBundle | null {
  return bundleFor(profileId);
}

export function hasConnectionNightDemo(profileId: string): boolean {
  return bundleFor(profileId) != null;
}

/** API-shaped payload for hook / route fallback */
export function getConnectionNightDemoResponse(profileId: string) {
  const bundle = bundleFor(profileId);
  if (!bundle) return null;
  return {
    profileId: profileId.toLowerCase(),
    currentDayNumber: bundle.currentDayNumber,
    currentAnswer: bundle.currentAnswer,
    connectionRoster: bundle.connectionRoster,
    dailyAnswers: [] as DailyAnswerRow[],
    matchAnswersById: {} as Record<string, DailyAnswerRow[]>,
    dailyQuestions: [] as never[],
    meta: { demo: true as const },
  };
}

export const DEMO_PROFILE_IDS = PROFILE_IDS;
