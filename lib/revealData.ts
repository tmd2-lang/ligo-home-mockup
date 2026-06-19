export type RevealNight = {
  nightLabel: string;
  nightOrdinal: string;
  question: string;
  topSong: string;
  topArtist: string;
  topArt: string;
  consensusPct: number;
  totalVotes: number;
  wordCloud: { word: string; size: 'xl' | 'lg' | 'md' | 'sm' }[];
  tomorrowTeaser: string;
};

/** v2: single pinned reveal night (formerly N1). Full N1–N10 set lives in archive/v1. */
export const ACTIVE_REVEAL_NIGHT: RevealNight = {
  nightLabel: 'Night one · the reveal',
  nightOrdinal: 'one',
  question: 'What song would play first at a Hoya house party right now?',
  topSong: 'Not Like Us',
  topArtist: 'Kendrick Lamar',
  topArt: '/artists/kendrick.png',
  consensusPct: 38,
  totalVotes: 1204,
  wordCloud: [
    { word: 'Not Like Us', size: 'xl' },
    { word: 'Espresso', size: 'lg' },
    { word: 'HUMBLE.', size: 'lg' },
    { word: 'luther', size: 'md' },
    { word: 'Blinding Lights', size: 'md' },
    { word: 'Starboy', size: 'sm' },
    { word: 'Good 4 U', size: 'sm' },
  ],
  tomorrowTeaser: 'Tomorrow: The most iconic chorus of the last 5 years?',
};

export type CNProfile = {
  id: string;
  name: string;
  initials: string;
  avatar: string;
  grad: string; // Background gradient or color for initial circle
  major: string;
  school: string;
  year: string;
  answer: string;
  matchReason: string;
  archetype: string;
  aIconKey: string;
  matchType: string;
  score: string;
};

export const CN_PROFILES: CNProfile[] = [
  {
    id: "cole",
    name: "Cole",
    initials: "C",
    avatar: "/assets/cole-profile.png",
    grad: "linear-gradient(135deg, #11A3A3, #096D6D)",
    major: "Computer Science",
    school: "Georgetown",
    year: "'25",
    answer: "FE!N",
    matchReason: "Cole finds the hypnotic thread in everything. You matched on pace this week — slow burn, same destination.",
    archetype: "The Hypnotist",
    aIconKey: "hypnotist",
    matchType: "Pace Match",
    score: "94% Sync",
  },
  {
    id: "maddie",
    name: "Maddie",
    initials: "M",
    avatar: "/assets/maddie-profile.png",
    grad: "linear-gradient(135deg, #D4122C, #8C0A1C)",
    major: "Economics",
    school: "Georgetown",
    year: "'26",
    answer: "Good 4 U",
    matchReason: "Maddie picks like every night could be a video. You matched on energy before you matched on titles — the kind of overlap that shows up at the same pregame.",
    archetype: "Pregame Menace",
    aIconKey: "pregame-menace",
    matchType: "Energy Match",
    score: "98% Sync",
  },
  {
    id: "marcus",
    name: "Marcus",
    initials: "M",
    avatar: "/assets/Marcus-profile.png",
    grad: "linear-gradient(135deg, #FF6B00, #B34B00)",
    major: "Government",
    school: "Georgetown",
    year: "'25",
    answer: "Not Like Us",
    matchReason: "Marcus commits to a chorus like it's a promise. You matched twice this week without trying — mainstream doesn't mean predictable between you two.",
    archetype: "Main Character",
    aIconKey: "main-character",
    matchType: "Chorus Match",
    score: "91% Sync",
  }
];
