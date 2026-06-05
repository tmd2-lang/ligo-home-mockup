export const PROFILE_IDS = [
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

export const NEWS_CONST_BY_PROFILE: Record<string, string> = {
  jordan: "NEWS",
  charlotte: "CHARLOTTE_NEWS",
  cole: "COLE_NEWS",
  caroline: "CAROLINE_NEWS",
  maddie: "MADDIE_NEWS",
  bennett: "BENNETT_NEWS",
  marcus: "MARCUS_NEWS",
  alessia: "ALESSIA_NEWS",
  sofia: "NEWS",
};

export const SHOWS_CONST_BY_PROFILE: Record<string, string> = {
  jordan: "SHOWS",
  charlotte: "CHARLOTTE_SHOWS",
  cole: "COLE_SHOWS",
  caroline: "CAROLINE_SHOWS",
  maddie: "MADDIE_SHOWS",
  bennett: "BENNETT_SHOWS",
  marcus: "MARCUS_SHOWS",
  alessia: "ALESSIA_SHOWS",
  sofia: "SHOWS",
};

export const EXPECTED_HOME_COUNTS = {
  home_news: 45,
  home_shows: 18,
  wrapped_stories: 9,
} as const;
