-- Ligo demo — phase 5 home content tables
-- Run after 001_initial_schema.sql

-- ---------------------------------------------------------------------------
-- home_news — "Your artists this week" carousel
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS home_news (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id    text NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  sort_order    int NOT NULL,
  art_url       text NOT NULL,
  source_label  text NOT NULL,
  time_label    text NOT NULL,
  headline      text NOT NULL,
  UNIQUE (profile_id, sort_order)
);

CREATE INDEX IF NOT EXISTS home_news_profile_id_idx ON home_news (profile_id);

-- ---------------------------------------------------------------------------
-- home_shows — "Near you" list
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS home_shows (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id    text NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  sort_order    int NOT NULL,
  name          text NOT NULL,
  venue         text NOT NULL,
  when_label    text NOT NULL,
  tag           text NOT NULL,
  tag_style     text NOT NULL CHECK (tag_style IN ('green', 'orange')),
  art_url       text NOT NULL,
  UNIQUE (profile_id, sort_order)
);

CREATE INDEX IF NOT EXISTS home_shows_profile_id_idx ON home_shows (profile_id);

-- ---------------------------------------------------------------------------
-- wrapped_stories — full-screen Wrapped carousel (jsonb blob per profile)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wrapped_stories (
  profile_id  text PRIMARY KEY REFERENCES profiles (id) ON DELETE CASCADE,
  content     jsonb NOT NULL
);

-- ---------------------------------------------------------------------------
-- RLS — public read for demo; writes via service role only
-- ---------------------------------------------------------------------------
ALTER TABLE home_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE wrapped_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_home_news" ON home_news
  FOR SELECT USING (true);

CREATE POLICY "public_read_home_shows" ON home_shows
  FOR SELECT USING (true);

CREATE POLICY "public_read_wrapped_stories" ON wrapped_stories
  FOR SELECT USING (true);
