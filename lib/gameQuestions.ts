// 10-day rotating question bank for Ligo Games Hub.
// Each format delivers 3 questions per session: easy → medium → hard.
// Trivia: 10 complete sets. Soundmoji/Ranking/Tier: 2 sets each, cycling via dayIndex % 2.

export type Difficulty = 'easy' | 'medium' | 'hard';
export type TriviaOpt = { id: string; text: string };

export type TriviaQ = {
  format: 'trivia'; difficulty: Difficulty;
  content: { prompt: string; options: TriviaOpt[]; correctOptionId: string };
};
export type SoundmojiQ = {
  format: 'soundmoji'; difficulty: Difficulty;
  content: { emojis: string; hint: string; options: TriviaOpt[]; correctOptionId: string };
};
export type RankingItem = { id: string; label: string; sublabel?: string; value: number };
export type RankingQ = {
  format: 'ranking'; difficulty: Difficulty;
  content: { prompt: string; dimensionLabel: string; units: string; direction: 'asc' | 'desc'; items: RankingItem[] };
};
export type TierItem = { id: string; label: string; sublabel?: string; correctTier: string };
export type TierQ = {
  format: 'tier'; difficulty: Difficulty;
  content: { prompt: string; dimensionLabel: string; tiers: { id: string; label: string }[]; items: TierItem[] };
};
export type AnyQ = TriviaQ | SoundmojiQ | RankingQ | TierQ;
export type QSet = [AnyQ, AnyQ, AnyQ]; // [easy, medium, hard]

const EPOCH = new Date('2025-01-01T00:00:00Z').getTime();
export function getDayIndex(): number {
  if (typeof window !== 'undefined') {
    const ov = localStorage.getItem('ligo:demo:night');
    if (ov !== null && ov !== 'cn') {
      const n = parseInt(ov, 10);
      if (!Number.isNaN(n)) return Math.max(0, Math.min(9, n));
    }
  }
  return (((Math.floor((Date.now() - EPOCH) / 86_400_000)) % 10) + 10) % 10;
}

// ── Timing constants (mirrors shared/config.ts) ──────────────────
export const FLASH_MS: Record<string, number> = {
  trivia: 2000, soundmoji: 2500, ranking: 0, tier: 0,
};
export const ANSWER_MS: Record<string, Record<Difficulty, number>> = {
  trivia:    { easy: 6000,  medium: 7000,  hard: 8000  },
  soundmoji: { easy: 10000, medium: 12000, hard: 15000 },
  ranking:   { easy: 25000, medium: 27500, hard: 30000 },
  tier:      { easy: 25000, medium: 27500, hard: 30000 },
};
export const SPEED_MS: Record<string, number> = {
  trivia: 3000, soundmoji: 5000, ranking: 12000, tier: 12000,
};

// ── TRIVIA (10 sets × 3 questions) ──────────────────────────────
const T = 'trivia' as const;
export const TRIVIA_SETS: QSet[] = [
  [
    { format: T, difficulty: 'easy',   content: { prompt: 'Who sang "Umbrella"?', options: [{id:'a',text:'Rihanna'},{id:'b',text:'Beyoncé'},{id:'c',text:'Ciara'},{id:'d',text:'Keri Hilson'}], correctOptionId: 'a' } },
    { format: T, difficulty: 'medium', content: { prompt: '"Levitating" and "Don\'t Start Now" are from which Dua Lipa album?', options: [{id:'a',text:'Future Nostalgia'},{id:'b',text:'Radical Optimism'},{id:'c',text:'Dua Lipa'},{id:'d',text:'Club Future Nostalgia'}], correctOptionId: 'a' } },
    { format: T, difficulty: 'hard',   content: { prompt: 'Rihanna has won 9 Grammys. What is true of all but two of them?', options: [{id:'a',text:'They\'re for collaborations/features, not solo work'},{id:'b',text:'They\'re for albums, not songs'},{id:'c',text:'They were all won before 2010'},{id:'d',text:'They\'re all in rap categories'}], correctOptionId: 'a' } },
  ],
  [
    { format: T, difficulty: 'easy',   content: { prompt: '"God\'s Plan" is by which artist?', options: [{id:'a',text:'Drake'},{id:'b',text:'Future'},{id:'c',text:'Travis Scott'},{id:'d',text:'Lil Baby'}], correctOptionId: 'a' } },
    { format: T, difficulty: 'medium', content: { prompt: 'Kendrick Lamar won a Pulitzer Prize for which album?', options: [{id:'a',text:'DAMN.'},{id:'b',text:'To Pimp a Butterfly'},{id:'c',text:'good kid, m.A.A.d city'},{id:'d',text:'Mr. Morale & the Big Steppers'}], correctOptionId: 'a' } },
    { format: T, difficulty: 'hard',   content: { prompt: 'Who was the first hip-hop artist to win the Grammy for Album of the Year?', options: [{id:'a',text:'Lauryn Hill'},{id:'b',text:'OutKast'},{id:'c',text:'Kanye West'},{id:'d',text:'Jay-Z'}], correctOptionId: 'a' } },
  ],
  [
    { format: T, difficulty: 'easy',   content: { prompt: '"Bad Guy" is by which artist?', options: [{id:'a',text:'Billie Eilish'},{id:'b',text:'Lorde'},{id:'c',text:'Halsey'},{id:'d',text:'Olivia Rodrigo'}], correctOptionId: 'a' } },
    { format: T, difficulty: 'medium', content: { prompt: "Billie Eilish's debut album was produced mainly by her brother, named?", options: [{id:'a',text:'Finneas'},{id:'b',text:'Phineas'},{id:'c',text:'Felix'},{id:'d',text:'Frankie'}], correctOptionId: 'a' } },
    { format: T, difficulty: 'hard',   content: { prompt: '"Old Town Road" broke the record for most weeks at #1 on the Hot 100. What was the record it beat?', options: [{id:'a',text:'16 weeks ("One Sweet Day" / "Despacito")'},{id:'b',text:'12 weeks ("Macarena")'},{id:'c',text:'14 weeks ("I Gotta Feeling")'},{id:'d',text:'20 weeks ("Uptown Funk")'}], correctOptionId: 'a' } },
  ],
  [
    { format: T, difficulty: 'easy',   content: { prompt: '"Sicko Mode" is by which artist?', options: [{id:'a',text:'Travis Scott'},{id:'b',text:'Drake'},{id:'c',text:'21 Savage'},{id:'d',text:'Quavo'}], correctOptionId: 'a' } },
    { format: T, difficulty: 'medium', content: { prompt: '"Sicko Mode" appears on which 2018 Travis Scott album?', options: [{id:'a',text:'Astroworld'},{id:'b',text:'Rodeo'},{id:'c',text:'Utopia'},{id:'d',text:'Birds in the Trap Sing McKnight'}], correctOptionId: 'a' } },
    { format: T, difficulty: 'hard',   content: { prompt: "SZA's debut studio album is Ctrl (2017). What did she release before it on Top Dawg Entertainment?", options: [{id:'a',text:'An EP called Z'},{id:'b',text:'An album called SOS'},{id:'c',text:'A mixtape called A'},{id:'d',text:'Nothing — Ctrl was her first release'}], correctOptionId: 'a' } },
  ],
  [
    { format: T, difficulty: 'easy',   content: { prompt: 'Who sang "I Will Always Love You" from The Bodyguard?', options: [{id:'a',text:'Whitney Houston'},{id:'b',text:'Mariah Carey'},{id:'c',text:'Celine Dion'},{id:'d',text:'Toni Braxton'}], correctOptionId: 'a' } },
    { format: T, difficulty: 'medium', content: { prompt: 'Which group released "Dynamite," their first all-English single?', options: [{id:'a',text:'BTS'},{id:'b',text:'EXO'},{id:'c',text:'Stray Kids'},{id:'d',text:'Seventeen'}], correctOptionId: 'a' } },
    { format: T, difficulty: 'hard',   content: { prompt: 'How many times was Beyoncé nominated for Album of the Year before finally winning it?', options: [{id:'a',text:'4 times (won on the 5th, for Cowboy Carter)'},{id:'b',text:'She never lost it'},{id:'c',text:'2 times'},{id:'d',text:'7 times'}], correctOptionId: 'a' } },
  ],
  [
    { format: T, difficulty: 'easy',   content: { prompt: '"Shape of You" is by which artist?', options: [{id:'a',text:'Ed Sheeran'},{id:'b',text:'Shawn Mendes'},{id:'c',text:'Charlie Puth'},{id:'d',text:'Sam Smith'}], correctOptionId: 'a' } },
    { format: T, difficulty: 'medium', content: { prompt: 'Which Taylor Swift album includes "Anti-Hero"?', options: [{id:'a',text:'Midnights'},{id:'b',text:'Lover'},{id:'c',text:'Folklore'},{id:'d',text:'1989'}], correctOptionId: 'a' } },
    { format: T, difficulty: 'hard',   content: { prompt: 'Who was the first artist to claim the entire top 10 of the Billboard Hot 100 at once?', options: [{id:'a',text:'Taylor Swift'},{id:'b',text:'Drake'},{id:'c',text:'The Beatles'},{id:'d',text:'Beyoncé'}], correctOptionId: 'a' } },
  ],
  [
    { format: T, difficulty: 'easy',   content: { prompt: 'Bad Bunny mainly records in which language?', options: [{id:'a',text:'Spanish'},{id:'b',text:'Portuguese'},{id:'c',text:'English'},{id:'d',text:'Italian'}], correctOptionId: 'a' } },
    { format: T, difficulty: 'medium', content: { prompt: "Doja Cat's first big viral hit (2019) was?", options: [{id:'a',text:'Say So'},{id:'b',text:'Kiss Me More'},{id:'c',text:'Woman'},{id:'d',text:'Need to Know'}], correctOptionId: 'a' } },
    { format: T, difficulty: 'hard',   content: { prompt: 'Which Bad Bunny album was the most-streamed album globally on Spotify in 2022?', options: [{id:'a',text:'Un Verano Sin Ti'},{id:'b',text:'YHLQMDLG'},{id:'c',text:'X 100PRE'},{id:'d',text:'Nadie Sabe Lo Que Va a Pasar Mañana'}], correctOptionId: 'a' } },
  ],
  [
    { format: T, difficulty: 'easy',   content: { prompt: '"Don\'t Stop Believin\'" is by which band?', options: [{id:'a',text:'Journey'},{id:'b',text:'Foreigner'},{id:'c',text:'Boston'},{id:'d',text:'Toto'}], correctOptionId: 'a' } },
    { format: T, difficulty: 'medium', content: { prompt: "Fleetwood Mac's \"Dreams\" went viral on TikTok in 2020. Which album is it from?", options: [{id:'a',text:'Rumours'},{id:'b',text:'Tusk'},{id:'c',text:'Fleetwood Mac'},{id:'d',text:'Mirage'}], correctOptionId: 'a' } },
    { format: T, difficulty: 'hard',   content: { prompt: '"Dreams" is notable as which of these for Fleetwood Mac?', options: [{id:'a',text:'Their only #1 single on the US Hot 100'},{id:'b',text:'Their best-selling single worldwide'},{id:'c',text:'The first song they ever recorded'},{id:'d',text:'Their only Grammy winner'}], correctOptionId: 'a' } },
  ],
  [
    { format: T, difficulty: 'easy',   content: { prompt: 'Who is known as the "Queen of Soul"?', options: [{id:'a',text:'Aretha Franklin'},{id:'b',text:'Tina Turner'},{id:'c',text:'Diana Ross'},{id:'d',text:'Gladys Knight'}], correctOptionId: 'a' } },
    { format: T, difficulty: 'medium', content: { prompt: 'Beyoncé\'s 2016 "visual album" was titled?', options: [{id:'a',text:'Lemonade'},{id:'b',text:'Beyoncé'},{id:'c',text:'Renaissance'},{id:'d',text:'4'}], correctOptionId: 'a' } },
    { format: T, difficulty: 'hard',   content: { prompt: '"Lose Yourself" by Eminem made history as the first of its kind to do what?', options: [{id:'a',text:'First hip-hop song to win the Academy Award for Best Original Song'},{id:'b',text:'First rap song to win a Grammy'},{id:'c',text:'First rap song to hit #1 on the Hot 100'},{id:'d',text:'First rap song featured in a film'}], correctOptionId: 'a' } },
  ],
  [
    { format: T, difficulty: 'easy',   content: { prompt: '"Lose Yourself" is by which artist?', options: [{id:'a',text:'Eminem'},{id:'b',text:'50 Cent'},{id:'c',text:'Jay-Z'},{id:'d',text:'Nelly'}], correctOptionId: 'a' } },
    { format: T, difficulty: 'medium', content: { prompt: "Kanye West's 2004 debut album is titled?", options: [{id:'a',text:'The College Dropout'},{id:'b',text:'Late Registration'},{id:'c',text:'Graduation'},{id:'d',text:'808s & Heartbreak'}], correctOptionId: 'a' } },
    { format: T, difficulty: 'hard',   content: { prompt: 'Before Beyoncé took the record, who had won the most Grammys of all time?', options: [{id:'a',text:'Georg Solti (classical conductor)'},{id:'b',text:'Quincy Jones'},{id:'c',text:'Stevie Wonder'},{id:'d',text:'Michael Jackson'}], correctOptionId: 'a' } },
  ],
];

// ── SOUNDMOJI (2 sets × 3 questions) ────────────────────────────
const S = 'soundmoji' as const;
export const SOUNDMOJI_SETS: QSet[] = [
  [
    { format: S, difficulty: 'easy',   content: { emojis: '👁️🐅', hint: 'Guess the song', options: [{id:'a',text:'Eye of the Tiger'},{id:'b',text:'Thunderstruck'},{id:'c',text:'We Will Rock You'},{id:'d',text:'Born to Run'}], correctOptionId: 'a' } },
    { format: S, difficulty: 'medium', content: { emojis: '💜🌧️', hint: 'Guess the song', options: [{id:'a',text:'Purple Haze'},{id:'b',text:'When Doves Cry'},{id:'c',text:'Purple Rain'},{id:'d',text:'Raspberry Beret'}], correctOptionId: 'c' } },
    { format: S, difficulty: 'hard',   content: { emojis: '🚀🧑', hint: 'Guess the song', options: [{id:'a',text:'Rocket Man'},{id:'b',text:'Space Oddity'},{id:'c',text:'Starman'},{id:'d',text:'Man on the Moon'}], correctOptionId: 'a' } },
  ],
  [
    { format: S, difficulty: 'easy',   content: { emojis: '🌧️☂️', hint: 'Guess the song', options: [{id:'a',text:'Set Fire to the Rain'},{id:'b',text:'Umbrella'},{id:'c',text:'Rain on Me'},{id:'d',text:'Singin\' in the Rain'}], correctOptionId: 'b' } },
    { format: S, difficulty: 'medium', content: { emojis: '🤠🛣️🐴', hint: 'Guess the song', options: [{id:'a',text:'The Box'},{id:'b',text:'Wagon Wheel'},{id:'c',text:'Ride Wit Me'},{id:'d',text:'Old Town Road'}], correctOptionId: 'd' } },
    { format: S, difficulty: 'hard',   content: { emojis: '🐒💃', hint: 'Guess the song', options: [{id:'a',text:'Watch Me'},{id:'b',text:'The Monster'},{id:'c',text:'Dance Monkey'},{id:'d',text:'Jungle'}], correctOptionId: 'c' } },
  ],
];

// ── RANKING (2 sets × 3 questions) ──────────────────────────────
const R = 'ranking' as const;
export const RANKING_SETS: QSet[] = [
  [
    { format: R, difficulty: 'easy', content: { prompt: 'Order these songs by total Spotify streams, highest first.', dimensionLabel: 'Total Spotify streams', units: 'streams', direction: 'desc', items: [
      { id: 'i1', label: 'Blinding Lights', sublabel: 'The Weeknd', value: 4200000000 },
      { id: 'i2', label: 'Shape of You', sublabel: 'Ed Sheeran', value: 3900000000 },
      { id: 'i3', label: 'Someone You Loved', sublabel: 'Lewis Capaldi', value: 3200000000 },
      { id: 'i4', label: 'drivers license', sublabel: 'Olivia Rodrigo', value: 2100000000 },
    ] } },
    { format: R, difficulty: 'medium', content: { prompt: 'Order these artists by Spotify monthly listeners, highest first.', dimensionLabel: 'Monthly listeners', units: 'monthly listeners', direction: 'desc', items: [
      { id: 'i1', label: 'Taylor Swift', value: 100000000 },
      { id: 'i2', label: 'The Weeknd', value: 95000000 },
      { id: 'i3', label: 'Drake', value: 78000000 },
      { id: 'i4', label: 'SZA', value: 62000000 },
      { id: 'i5', label: 'Doja Cat', value: 58000000 },
    ] } },
    { format: R, difficulty: 'hard', content: { prompt: 'Order these songs by weeks at #1 on the Billboard Hot 100, most first.', dimensionLabel: 'Weeks at #1', units: 'weeks at #1', direction: 'desc', items: [
      { id: 'i1', label: 'Old Town Road', sublabel: 'Lil Nas X ft. Billy Ray Cyrus', value: 19 },
      { id: 'i2', label: 'Despacito', sublabel: 'Luis Fonsi & Daddy Yankee', value: 16 },
      { id: 'i3', label: 'Uptown Funk', sublabel: 'Mark Ronson ft. Bruno Mars', value: 14 },
      { id: 'i4', label: 'Blinding Lights', sublabel: 'The Weeknd', value: 4 },
    ] } },
  ],
  [
    { format: R, difficulty: 'easy', content: { prompt: 'Put these albums in order of release, oldest first.', dimensionLabel: 'Release year', units: 'year', direction: 'asc', items: [
      { id: 'i1', label: 'Thriller', sublabel: 'Michael Jackson', value: 1982 },
      { id: 'i2', label: '21', sublabel: 'Adele', value: 2011 },
      { id: 'i3', label: 'DAMN.', sublabel: 'Kendrick Lamar', value: 2017 },
      { id: 'i4', label: 'Midnights', sublabel: 'Taylor Swift', value: 2022 },
    ] } },
    { format: R, difficulty: 'medium', content: { prompt: 'Put these hit singles in order of release, oldest first.', dimensionLabel: 'Release year', units: 'year', direction: 'asc', items: [
      { id: 'i1', label: 'Rolling in the Deep', sublabel: 'Adele', value: 2010 },
      { id: 'i2', label: 'Uptown Funk', sublabel: 'Mark Ronson ft. Bruno Mars', value: 2014 },
      { id: 'i3', label: "God's Plan", sublabel: 'Drake', value: 2018 },
      { id: 'i4', label: 'good 4 u', sublabel: 'Olivia Rodrigo', value: 2021 },
    ] } },
    { format: R, difficulty: 'hard', content: { prompt: 'Order these tracks by total Spotify streams, highest first.', dimensionLabel: 'Total Spotify streams', units: 'streams', direction: 'desc', items: [
      { id: 'i1', label: 'Sunflower', sublabel: 'Post Malone & Swae Lee', value: 3550000000 },
      { id: 'i2', label: 'One Dance', sublabel: 'Drake ft. Wizkid & Kyla', value: 3510000000 },
      { id: 'i3', label: 'Dance Monkey', sublabel: 'Tones and I', value: 3480000000 },
      { id: 'i4', label: 'Stay', sublabel: 'The Kid LAROI & Justin Bieber', value: 3450000000 },
      { id: 'i5', label: 'Sweater Weather', sublabel: 'The Neighbourhood', value: 3420000000 },
    ] } },
  ],
];

// ── TIER (2 sets × 3 questions) ──────────────────────────────────
const TI = 'tier' as const;
const STREAM_TIERS = [
  { id: 'S', label: 'S — Superstar' },
  { id: 'A', label: 'A — Headliner' },
  { id: 'B', label: 'B — Fan Fave' },
  { id: 'C', label: 'C — Cult Artist' },
];
export const TIER_SETS: QSet[] = [
  [
    { format: TI, difficulty: 'easy', content: { prompt: 'Tier these artists by Spotify monthly listeners — S = highest.', dimensionLabel: 'Spotify Monthly Listeners', tiers: STREAM_TIERS, items: [
      { id: 'a', label: 'Taylor Swift', correctTier: 'S' },
      { id: 'b', label: 'Bad Bunny', correctTier: 'A' },
      { id: 'c', label: 'Mitski', correctTier: 'B' },
      { id: 'd', label: 'Westside Boogie', correctTier: 'C' },
    ] } },
    { format: TI, difficulty: 'medium', content: { prompt: 'Tier these artists by Spotify monthly listeners.', dimensionLabel: 'Spotify Monthly Listeners', tiers: STREAM_TIERS, items: [
      { id: 'a', label: 'The Weeknd', correctTier: 'S' },
      { id: 'b', label: 'SZA', correctTier: 'A' },
      { id: 'c', label: 'Clairo', correctTier: 'B' },
      { id: 'd', label: 'Phoebe Bridgers', correctTier: 'C' },
    ] } },
    { format: TI, difficulty: 'hard', content: { prompt: 'Tier these artists by Spotify monthly listeners.', dimensionLabel: 'Spotify Monthly Listeners', tiers: STREAM_TIERS, items: [
      { id: 'a', label: 'Drake', correctTier: 'S' },
      { id: 'b', label: 'Tyler, the Creator', correctTier: 'A' },
      { id: 'c', label: 'Joey Bada$$', correctTier: 'B' },
      { id: 'd', label: 'Serpentwithfeet', correctTier: 'C' },
    ] } },
  ],
  [
    { format: TI, difficulty: 'easy', content: { prompt: 'Tier these artists by Spotify monthly listeners.', dimensionLabel: 'Spotify Monthly Listeners', tiers: STREAM_TIERS, items: [
      { id: 'a', label: 'Beyoncé', correctTier: 'S' },
      { id: 'b', label: 'Doja Cat', correctTier: 'A' },
      { id: 'c', label: 'Rex Orange County', correctTier: 'B' },
      { id: 'd', label: 'Aldous Harding', correctTier: 'C' },
    ] } },
    { format: TI, difficulty: 'medium', content: { prompt: 'Tier these artists by Spotify monthly listeners.', dimensionLabel: 'Spotify Monthly Listeners', tiers: STREAM_TIERS, items: [
      { id: 'a', label: 'Billie Eilish', correctTier: 'S' },
      { id: 'b', label: 'Lorde', correctTier: 'A' },
      { id: 'c', label: 'Snail Mail', correctTier: 'B' },
      { id: 'd', label: 'Alex G', correctTier: 'C' },
    ] } },
    { format: TI, difficulty: 'hard', content: { prompt: 'Tier these artists by Spotify monthly listeners.', dimensionLabel: 'Spotify Monthly Listeners', tiers: STREAM_TIERS, items: [
      { id: 'a', label: 'Post Malone', correctTier: 'S' },
      { id: 'b', label: 'Bryson Tiller', correctTier: 'A' },
      { id: 'c', label: 'SiR', correctTier: 'B' },
      { id: 'd', label: 'Mndsgn', correctTier: 'C' },
    ] } },
  ],
];

// ── Accessor ─────────────────────────────────────────────────────
export function getQSet(format: string, dayIndex: number): QSet {
  switch (format) {
    case 'trivia':    return TRIVIA_SETS[dayIndex % TRIVIA_SETS.length];
    case 'soundmoji': return SOUNDMOJI_SETS[dayIndex % SOUNDMOJI_SETS.length];
    case 'ranking':   return RANKING_SETS[dayIndex % RANKING_SETS.length];
    case 'tier':      return TIER_SETS[dayIndex % TIER_SETS.length];
    default:          return TRIVIA_SETS[0];
  }
}
