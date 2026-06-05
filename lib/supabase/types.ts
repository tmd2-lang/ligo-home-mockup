export type ProfileRow = {
  id: string;
  display_name: string;
  first_name: string;
  year_level: string | null;
  pronouns: string | null;
  school: string;
  archetype_name: string;
  archetype_id: string;
  avatar_url: string | null;
  gradient: string | null;
  hot_take: string | null;
  behavioral_note: string | null;
  sort_order: number;
  created_at: string;
};

export type DailyQuestionRow = {
  day_number: number;
  scheduled_date: string;
  weekday: string;
  question_type: string;
  answer_type: string;
  question_text: string;
  original_number: number | null;
};

export type DailyAnswerRow = {
  id: string;
  day_number: number;
  profile_id: string;
  answer_text: string;
  answer_kind: "song" | "artist" | "genre";
  artist: string | null;
  title: string | null;
  cover_url: string | null;
};

export type ConnectionPairRow = {
  profile_a_id: string;
  profile_b_id: string;
  score: number;
  match_type: string;
  shared_lane: string | null;
  headline_overlap: string | null;
  why_copy: string;
};

export type ConnectionRosterRow = {
  viewer_id: string;
  rank: number;
  match_id: string;
  score: number;
  match_type: string;
  shared_lane: string | null;
  headline_overlap: string | null;
  why_copy: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: { Row: ProfileRow; Insert: Omit<ProfileRow, "created_at">; Update: Partial<ProfileRow> };
      daily_questions: { Row: DailyQuestionRow; Insert: DailyQuestionRow; Update: Partial<DailyQuestionRow> };
      daily_answers: { Row: DailyAnswerRow; Insert: Omit<DailyAnswerRow, "id">; Update: Partial<DailyAnswerRow> };
      connection_pairs: { Row: ConnectionPairRow; Insert: ConnectionPairRow; Update: Partial<ConnectionPairRow> };
      connection_roster: { Row: ConnectionRosterRow; Insert: ConnectionRosterRow; Update: Partial<ConnectionRosterRow> };
      home_news: { Row: HomeNewsRow; Insert: Omit<HomeNewsRow, "id">; Update: Partial<HomeNewsRow> };
      home_shows: { Row: HomeShowRow; Insert: Omit<HomeShowRow, "id">; Update: Partial<HomeShowRow> };
      wrapped_stories: { Row: WrappedStoryRow; Insert: WrappedStoryRow; Update: Partial<WrappedStoryRow> };
    };
  };
};

export type HomeNewsRow = {
  id: string;
  profile_id: string;
  sort_order: number;
  art_url: string;
  source_label: string;
  time_label: string;
  headline: string;
};

export type HomeShowRow = {
  id: string;
  profile_id: string;
  sort_order: number;
  name: string;
  venue: string;
  when_label: string;
  tag: string;
  tag_style: "green" | "orange";
  art_url: string;
};

export type WrappedStoryRow = {
  profile_id: string;
  content: Record<string, unknown>;
};

export type CanonBundle = {
  profile: ProfileRow;
  dailyAnswers: DailyAnswerRow[];
  connectionRoster: ConnectionRosterRow[];
};
