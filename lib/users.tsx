import React from "react";

// lib/users.tsx
// Local Database for Multi-Tenant Prototype

export type OnRepeatItem = {
  title: string;
  artist: string;
  photo: string;
  coverArt?: string;
  audioSrc?: string;
};

export type HoroscopeChip = {
  label: string;
  tone: 'orange' | 'yellow' | 'pink';
};

export type ProfileNotification = {
  ic: string;
  bg: string;
  text: React.ReactNode;
  time: string;
  unread?: boolean;
};

export type ProfileData = {
  earnedArchetypeId: string;
  heldWeeks: string;
  earnedBlurb: string;
  traits: Array<{ n: string; l: React.ReactNode }>;
  artists: Array<{ name: string; photo: string; pos: string; rank: number }>;
  afterHoursCover: string[];
  playlistTrackCount: number;
  answerTrail: Array<{ day: string; song: string; artist: string; today?: boolean }>;
  playlistTracks: Array<{ title: string; artist: string; dur: string; photo: string; coverArt?: string }>;
  pastReads: Array<{ type?: string; date: string; head: string; body: string }>;
  currentStreak: number;
  longestStreak: number;
  tasteEvolution: Array<{ month: string; archetype: string; note?: string }>;
  rarestPicks: Array<{ stat: string; label: string }>;
  connectedSongs: Array<{ song: string; artist: string; people: number }>;
  firstToPick: Array<{ text: string }>;
  hotTake?: string;
  nowListening?: { title: string; artist: string; photo?: string; coverArt?: string };
  prompts?: Array<{ id: string; answer: string }>;
  onRepeat?: OnRepeatItem[];
  archetypeSubline?: React.ReactNode;
  mainstreamScoreAccent?: string;
  mainstreamScoreRest?: string;
  mainstreamMeterPct?: number;
  mainstreamFootnote?: React.ReactNode;
  horoscope?: { headline: string; body: string; chips: HoroscopeChip[] };
  playlistName?: string;
  secretTrack?: { label: string; title: string; artist: string; cover: string; accentColor?: string };
  receiptsFooter?: string;
  notifications?: ProfileNotification[];
  anthem?: { title: string; artist: string; coverArt: string };
  favoriteGenres?: string[];
  musicDealbreaker?: string;
  liveShowWishlist?: string;
};

export type UserProfile = {
  id: string;
  name: string;
  firstName: string;
  avatar: string;
  archetype: string;
  archetypeIcon: string;
  gradient: string;
  yearLevel?: string;
  pronouns?: string;
  school?: string;
  profile: ProfileData;
};

const ARTIST_IMG = "/assets/artists/";

export const PROFILE_PRESENTATION_DEFAULTS: Pick<
  ProfileData,
  | 'hotTake'
  | 'nowListening'
  | 'onRepeat'
  | 'archetypeSubline'
  | 'mainstreamScoreAccent'
  | 'mainstreamScoreRest'
  | 'mainstreamMeterPct'
  | 'mainstreamFootnote'
  | 'horoscope'
  | 'playlistName'
  | 'secretTrack'
  | 'receiptsFooter'
  | 'notifications'
  | 'anthem'
  | 'favoriteGenres'
  | 'musicDealbreaker'
  | 'liveShowWishlist'
> = {
  hotTake: "House music is just jazz for people who can't sleep.",
  nowListening: { title: 'Move L8r', artist: 'Keinemusik', photo: `${ARTIST_IMG}keinemusik.png` },
  onRepeat: [
    { title: 'Say What', artist: 'Keinemusik', photo: `${ARTIST_IMG}keinemusik.png`, coverArt: '/assets/tracks/2.jpg', audioSrc: '/assets/tracks/saywhatsnippet.mp3' },
    { title: 'Last Dance', artist: 'Juno (DE)', photo: `${ARTIST_IMG}juno-de.jpg`, coverArt: '/assets/tracks/1.jpg', audioSrc: '/assets/tracks/lastdancesnippet.mp3' },
    { title: 'Free Your Mind', artist: 'Prospa', photo: `${ARTIST_IMG}prospa.png`, coverArt: '/assets/tracks/3.jpg', audioSrc: '/assets/tracks/freeyourmindsnippet.mp3' },
  ],
  archetypeSubline: (
    <>
      <b style={{ color: '#fff' }}>7 genres</b> spanned · <b style={{ color: '#fff' }}>340</b> unique artists · <span style={{ color: '#F5D783', fontWeight: 600 }}>runs deep and late</span>
    </>
  ),
  mainstreamScoreAccent: 'Top 6%',
  mainstreamScoreRest: 'most niche at Georgetown',
  mainstreamMeterPct: 94,
  mainstreamFootnote: (
    <>
      <b>Keinemusik, Prospa, Black Coffee</b> — followed by fewer than 9 other Georgetown students.
    </>
  ),
  horoscope: {
    headline: "You're running deep and hypnotic today.",
    body: 'Your last five Ligo answers lean late-night house and Afro rhythms, and Keinemusik is your most-played this week. Today reads like a 2am set, eyes closed, no skips.',
    chips: [
      { label: 'Keinemusik energy', tone: 'orange' },
      { label: 'Organic house head', tone: 'yellow' },
      { label: 'Dancefloor over radio', tone: 'pink' },
    ],
  },
  playlistName: 'after hours',
  secretTrack: {
    label: 'Guilty Pleasure',
    title: 'Nightcrawler',
    artist: 'Travis Scott',
    cover: '/assets/artists/nightcrawlerbside.jpeg',
    accentColor: '#F5D783',
  },
  receiptsFooter: 'Built from your daily answers · Keinemusik, Prospa, Anyma, amapiano, dancehall, and 340+ picks across the semester.',
  notifications: [
    { ic: 'T', bg: 'linear-gradient(145deg,#71C07F,#2A5E40)', text: <><b>Theo</b> bumped you — you&apos;re an <b>87% match</b> on late-night house.</>, time: '12 min ago', unread: true },
    { ic: '◉', bg: '#0A0907', text: <>Your archetype held steady — <b>The Hypnotist</b> for 3 weeks running.</>, time: '2 hr ago', unread: true },
    { ic: '🔥', bg: 'linear-gradient(145deg,#F97316,#C2410C)', text: <>Day <b>5</b> streak — answer today&apos;s question to keep it alive.</>, time: 'Today, 9:02' },
    { ic: '♬', bg: 'linear-gradient(145deg,#EA8CE1,#A13D99)', text: <><b>3 people</b> saved <b>after hours</b> this week.</>, time: 'Yesterday' },
  ],
  anthem: { title: 'Losing My Edge', artist: 'LCD Soundsystem', coverArt: 'https://i.scdn.co/image/ab67616d0000b2734121faee3df82c506ebdc2c8' },
  favoriteGenres: ['Organic House', 'Indie Dance', 'Minimal Techno'],
  musicDealbreaker: "If you don't like dancing, we probably won't get along.",
  liveShowWishlist: "Fred again.., Jamie xx, Bicep",
};

export const USER_IDENTITY_DEFAULTS = {
  yearLevel: 'Senior',
  pronouns: 'He/him',
  school: 'Georgetown',
};

// Fallback profile data for users who haven't been mapped yet.
const fallbackProfileData: ProfileData = {
  earnedArchetypeId: 'throwback',
  heldWeeks: '1 week',
  earnedBlurb: "Earned by listeners who consistently pick stadium anthems.",
  traits: [
    { n: '3', l: <><b>genres spanned</b> — pop, rock, country</> },
    { n: '120', l: <><b>unique artists</b> in your last 6 months</> }
  ],
  artists: [
    { name: 'Loading', photo: '', pos: 'center', rank: 1 }
  ],
  afterHoursCover: [],
  playlistTrackCount: 0,
  answerTrail: [],
  playlistTracks: [],
  pastReads: [],
  currentStreak: 0,
  longestStreak: 0,
  tasteEvolution: [],
  rarestPicks: [],
  connectedSongs: [],
  firstToPick: []
};


export const USERS: Record<string, UserProfile> = {
  jordan: {
    id: 'jordan',
    name: 'Jordan D.',
    firstName: 'Jordan',
    avatar: '/assets/Jordan-profile.png',
    archetype: 'The Hypnotist',
    archetypeIcon: 'hypnotist',
    gradient: 'linear-gradient(145deg, #F97316, #EA8CE1)',
    yearLevel: 'Senior',
    pronouns: 'He/him',
    school: 'Georgetown',
    profile: {
      earnedArchetypeId: 'hypnotist',
      heldWeeks: '3 weeks',
      earnedBlurb: "Earned by listeners who go deep, late, and rhythm-first. You've held it 3 weeks running.",
      traits: [
        { n: '7', l: <><b>genres spanned</b> — house, Afro house, dancehall, R&amp;B, ambient, dub</> },
        { n: '340', l: <><b>unique artists</b> in your last 6 months</> },
        { n: '0.1%', l: <><b>top Keinemusik listener</b> at Georgetown</> },
      ],
      artists: [
        { name: 'Keinemusik',   photo: `${ARTIST_IMG}keinemusik.png`, pos: 'center 28%', rank: 1 },
        { name: 'Black Coffee', photo: `${ARTIST_IMG}black-coffee.png`, pos: 'center 22%', rank: 2 },
        { name: 'Drake',        photo: `/artists/drake-profile.jpeg`, pos: 'center 18%', rank: 3 },
        { name: 'Chris Lake',   photo: `${ARTIST_IMG}chris-lake.png`, pos: 'center 20%', rank: 4 },
        { name: 'Popcaan',      photo: `${ARTIST_IMG}popcaan.png`, pos: 'center 30%', rank: 5 },
        { name: 'Prospa',       photo: `${ARTIST_IMG}prospa.png`, pos: 'center 22%', rank: 6 },
      ],
      afterHoursCover: [
        `${ARTIST_IMG}keinemusik.png`,
        `${ARTIST_IMG}black-coffee.png`,
        `${ARTIST_IMG}chris-lake.png`,
        `${ARTIST_IMG}prospa.png`,
      ],
      playlistTrackCount: 37,
      answerTrail: [],
      playlistTracks: [
        { title: 'Reflections', artist: 'Black Coffee, Tellaman', dur: '6:58', photo: `${ARTIST_IMG}black-coffee.png` },
        { title: 'Free', artist: 'Keinemusik', dur: '7:24', photo: `${ARTIST_IMG}keinemusik.png` },
        { title: 'The Smile', artist: 'Prospa', dur: '5:11', photo: `${ARTIST_IMG}prospa.png` },
        { title: 'Turn On The Lights', artist: 'Chris Lake, Aatig', dur: '6:02', photo: `${ARTIST_IMG}chris-lake.png` },
      ],
      pastReads: [
        { type: 'time-machine', date: 'Exactly 1 year ago', head: 'The Time Machine', body: '365 days ago, you played Frank Ocean 14 times in a row. You good?' },
        { type: 'honest', date: 'Brutally Honest Stat', head: 'Fastest Skip', body: 'You skipped "Water" by Tyla exactly 2.4 seconds into the track.' },
        { date: 'Yesterday', head: 'A slow build, then all percussion.', body: 'You opened on ambient and closed on Black Coffee. Your week is trending toward longer, wordless tracks — the radio edit isn\'t for you anymore.' },
      ],
      currentStreak: 5,
      longestStreak: 12,
      tasteEvolution: [
        { month: 'March', archetype: 'The Drifter' },
        { month: 'April', archetype: 'The Hypnotist' },
        { month: 'May', archetype: 'The Hypnotist', note: 'held 3 weeks' },
      ],
      rarestPicks: [
        { stat: 'Prospa', label: 'only 3 of 612 picked it' },
        { stat: '0.4%', label: 'Anyma — top at Georgetown' },
        { stat: '1 of 7', label: 'Fela Kuti — you stood alone on campus' },
      ],
      connectedSongs: [
        { song: 'Drive', artist: 'Black Coffee', people: 4 },
        { song: 'ten', artist: 'Fred again..', people: 3 },
        { song: 'Free', artist: 'Keinemusik', people: 2 },
      ],
      firstToPick: [
        { text: 'You picked Prospa before 200 other Georgetown students' },
        { text: 'First at Georgetown to pick Anyma this semester' },
      ],
      prompts: [
        { id: 'music-dealbreaker', answer: 'you only listen to the Spotify Top 50 playlist' },
        { id: 'main-3', answer: 'Taylor Swift. I grew up with every era.' },
        { id: 'hot-take-4', answer: 'anything by Imagine Dragons. Instant ban.' }
      ],
      ...PROFILE_PRESENTATION_DEFAULTS,
    }
  },
  marcus: {
    id: 'marcus',
    name: 'Marcus T.',
    firstName: 'Marcus',
    avatar: '/assets/Marcus-profile.png',
    archetype: 'The Deep Cut Generalist',
    archetypeIcon: 'deep-cut',
    gradient: 'linear-gradient(145deg, #10B981, #3B82F6)',
    yearLevel: 'Senior',
    pronouns: 'He/Him',
    school: 'Georgetown',
    profile: {
      earnedArchetypeId: 'deep-cut',
      heldWeeks: '1 week',
      earnedBlurb: "The true mixer. Marcus is no longer niche for niche sake. He can move from Fleetwood Mac to Freddie Gibbs, MK to Tame Impala, Disclosure to The Strokes, and make it feel like one worldview.",
      traits: [
        { n: '38%', l: <><b>more niche</b> at Georgetown</> },
        { n: '12', l: <><b>core artists</b> carried your week</> },
        { n: '1', l: <><b>perfect transition</b> made the room stop and ask for the song</> }
      ],
      artists: [
        { name: 'Tame Impala', photo: `/artists/tameimpala-profile.jpeg`, pos: 'center 20%', rank: 1 },
        { name: 'MGMT', photo: `/artists/MGMT-profile.jpeg`, pos: 'center 20%', rank: 2 },
        { name: 'Fleetwood Mac', photo: `/artists/fleetwoodmac-profike.jpeg`, pos: 'center 20%', rank: 3 },
        { name: 'MK', photo: `/artists/MK-profile.jpeg`, pos: 'center 20%', rank: 4 },
        { name: 'Freddie Gibbs', photo: `/artists/freddiegibbs-profile.jpeg`, pos: 'center 20%', rank: 5 },
        { name: 'KAYTRANADA', photo: `/artists/katry-profile.jpeg`, pos: 'center 20%', rank: 6 },
      ],
      afterHoursCover: [
        `/artists/tameimpala-profile.jpeg`,
        `/artists/MGMT-profile.jpeg`,
        `/artists/fleetwoodmac-profike.jpeg`,
        `/artists/MK-profile.jpeg`,
      ],
      playlistTrackCount: 100,
      answerTrail: [],
      playlistTracks: [
        { title: 'Electric Feel', artist: 'MGMT', dur: '3:49', photo: `/artists/MGMT-profile.jpeg`, coverArt: `/covers/oracularspectacular-coverart.jpeg` },
        { title: 'Let It Happen', artist: 'Tame Impala', dur: '7:47', photo: `/artists/tameimpala-profile.jpeg`, coverArt: `/covers/currents-coverart.jpeg` },
        { title: '17', artist: 'MK', dur: '3:16', photo: `/artists/MK-profile.jpeg`, coverArt: `/covers/MK17-coverart.jpeg` },
        { title: 'Crime Pays', artist: 'Freddie Gibbs, Madlib', dur: '3:02', photo: `/artists/freddiegibbs-profile.jpeg`, coverArt: `/covers/bandana-coverart.jpeg` },
      ],
      pastReads: [
        { type: 'time-machine', date: 'Your Ligo Horoscope', head: "You’re the compatibility wild card today.", body: 'Your last five Ligo answers jump from MGMT and Tame Impala into MK and Freddie Gibbs, which means your night starts chill, hits the dancefloor, and somehow ends with everyone agreeing on your answers.' },
        { type: 'honest', date: 'Hot Take', head: '“The best aux is one your dad would respect and your friends would still dance to.”', body: 'Tame Impala, MGMT, Fleetwood Mac, MK — you share a different lane with almost everyone.' },
      ],
      currentStreak: 4,
      longestStreak: 11,
      tasteEvolution: [
        { month: 'March', archetype: 'The Mood Curator' },
        { month: 'April', archetype: 'The Deep Cut Generalist' },
        { month: 'May', archetype: 'The Deep Cut Generalist', note: 'held 2 weeks' },
      ],
      rarestPicks: [
        { stat: 'Top 38%', label: 'more niche at Georgetown' },
      ],
      connectedSongs: [
        { song: 'Let It Happen', artist: 'Tame Impala', people: 5 },
        { song: '17', artist: 'MK', people: 2 },
        { song: 'Reptilia', artist: 'The Strokes', people: 4 },
      ],
      firstToPick: [
        { text: 'Tame Impala energy' },
        { text: 'Mixes everything' },
        { text: 'Unites the room' }
      ],
      hotTake: 'The best aux is one your dad would respect and your friends would still dance to.',
      nowListening: { title: 'Electric Feel', artist: 'MGMT', photo: `/artists/MGMT-profile.jpeg`, coverArt: `/covers/oracularspectacular-coverart.jpeg` },
      onRepeat: [
        { title: 'Electric Feel', artist: 'MGMT', photo: `/artists/MGMT-profile.jpeg`, coverArt: `/covers/oracularspectacular-coverart.jpeg` },
        { title: 'Let It Happen', artist: 'Tame Impala', photo: `/artists/tameimpala-profile.jpeg`, coverArt: `/covers/currents-coverart.jpeg` },
        { title: '17', artist: 'MK', photo: `/artists/MK-profile.jpeg`, coverArt: `/covers/MK17-coverart.jpeg` },
      ],
      archetypeSubline: (
        <>
          <b style={{ color: '#fff' }}>38%</b> more niche · <b style={{ color: '#fff' }}>Tame, MGMT, Fleetwood</b> core · <span style={{ color: '#3B82F6', fontWeight: 600 }}>the true mixer</span>
        </>
      ),
      mainstreamScoreAccent: 'Top 38%',
      mainstreamScoreRest: 'more niche at Georgetown',
      mainstreamMeterPct: 62,
      mainstreamFootnote: (
        <>
          <b>Tame Impala, MGMT, Fleetwood Mac, MK</b> — you share a different lane with almost everyone.
        </>
      ),
      horoscope: {
        headline: "You’re the compatibility wild card today.",
        body: 'Your last five Ligo answers jump from MGMT and Tame Impala into MK and Freddie Gibbs, which means your night starts chill, hits the dancefloor, and somehow ends with everyone agreeing on your answers.',
        chips: [
          { label: 'Tame Impala energy', tone: 'orange' },
          { label: 'Mixes everything', tone: 'yellow' },
          { label: 'Unites the room', tone: 'pink' },
        ],
      },
      playlistName: 'the true mixer',
      secretTrack: {
        label: 'Guilty Pleasure',
        title: 'Dreams',
        artist: 'Fleetwood Mac',
        cover: `/covers/rumorsfleetwood-coverart.jpeg`,
        accentColor: '#3B82F6',
      },
      receiptsFooter: 'Built from your daily answers · Tame Impala, MGMT, Fleetwood Mac, MK, Freddie Gibbs, The Rolling Stones, and 100 tracks across the semester.',
      notifications: [
        { ic: 'M', bg: 'linear-gradient(145deg,#14B8A6,#A78BFA)', text: <><b>Maddie</b> bumped you — you&apos;re a <b>85% match</b> on Tame Impala and The Strokes.</>, time: '11 min ago', unread: true },
        { ic: 'C', bg: 'linear-gradient(145deg,#3B82F6,#14B8A6)', text: <><b>Cole</b> bumped you — you&apos;re a <b>75% match</b> on MK and Disclosure.</>, time: '15 min ago', unread: true },
        { ic: '◉', bg: '#0A0907', text: <>Your archetype held steady — <b>The Deep Cut Generalist</b> for 2 weeks running.</>, time: '4 hr ago', unread: true },
      ],

      prompts: [
        { id: 'compat-3', answer: 'sounds like driving down PCH at midnight' },
        { id: 'main-4', answer: 'getting whiplash between techno and country' },
        { id: 'hot-take-1', answer: 'that Nickelback actually slaps and I will not apologize' }
      ],
    }
  },
  charlotte: {
    id: 'charlotte',
    name: 'Charlotte W.',
    firstName: 'Charlotte',
    avatar: '/assets/Charlotte-Profile.png',
    archetype: 'The Pop Oracle',
    archetypeIcon: 'main-character',
    gradient: 'linear-gradient(145deg, #FF6B9D, #C2410C)',
    yearLevel: 'Sophomore',
    pronouns: 'She/her',
    school: 'Georgetown',
    profile: {
      earnedArchetypeId: 'main-character',
      heldWeeks: '1 week',
      earnedBlurb: "pop precision · R&B feelings · every bridge memorized",
      traits: [
        { n: '93%', l: <><b>more mainstream</b> than most at Georgetown</> },
        { n: '3', l: <><b>core artists</b> carried your week</> },
        { n: '1', l: <><b>bridge</b> sung perfectly in the car</> }
      ],
      artists: [
        { name: 'Taylor Swift', photo: `/artists/taylorswift-updatedprofile-usethis-profile.jpeg`, pos: 'center 20%', rank: 1 },
        { name: 'SZA', photo: `/artists/sza-profile.jpeg`, pos: 'center 20%', rank: 2 },
        { name: 'Drake', photo: `/artists/drake-profile.jpeg`, pos: 'center 20%', rank: 3 },
        { name: 'Beyoncé', photo: `/artists/beyonce-profile.jpeg`, pos: 'center 20%', rank: 4 },
        { name: 'Frank Ocean', photo: `/artists/frankocean-profile.jpeg`, pos: 'center 20%', rank: 5 },
        { name: 'Tyler, The Creator', photo: `/artists/tylerthecreator-profile.jpeg`, pos: 'center 20%', rank: 6 },
      ],
      afterHoursCover: [
        `/artists/taylorswift-updatedprofile-usethis-profile.jpeg`,
        `/artists/sza-profile.jpeg`,
        `/artists/drake-profile.jpeg`,
        `/artists/beyonce-profile.jpeg`,
      ],
      playlistTrackCount: 68,
      answerTrail: [],
      playlistTracks: [
        { title: 'Style', artist: 'Taylor Swift', dur: '3:51', photo: `/artists/taylorswift-updatedprofile-usethis-profile.jpeg` },
        { title: 'Snooze', artist: 'SZA', dur: '3:21', photo: `/artists/sza-profile.jpeg` },
        { title: 'CUFF IT', artist: 'Beyoncé', dur: '3:45', photo: `/artists/beyonce-profile.jpeg` },
        { title: 'Passionfruit', artist: 'Drake', dur: '4:58', photo: `/artists/drake-profile.jpeg` },
        { title: 'Pink + White', artist: 'Frank Ocean', dur: '3:04', photo: `/artists/frankocean-profile.jpeg` },
        { title: 'See You Again', artist: 'Tyler, The Creator', dur: '3:00', photo: `/artists/tylerthecreator-profile.jpeg` },
      ],
      pastReads: [
        { type: 'time-machine', date: 'Your Ligo Horoscope', head: "You're in full main-character rotation today.", body: 'Your last five Ligo answers move from Taylor and Sabrina before class to SZA and Frank after midnight, with Drake and Beyoncé carrying the pregame. Today reads like a perfect outfit, a full group chat breakdown, and one song you swear is not about him.' },
        { type: 'honest', date: 'Hot Take', head: '“Mainstream music is only basic when you have no emotional range.”', body: 'Taylor Swift, Beyoncé, Drake — your answers cross campus faster than most at Georgetown.' },
      ],
      currentStreak: 6,
      longestStreak: 14,
      tasteEvolution: [
        { month: 'March', archetype: 'The Mood Curator' },
        { month: 'April', archetype: 'The Pop Oracle' },
        { month: 'May', archetype: 'The Pop Oracle', note: 'held 4 weeks' },
      ],
      rarestPicks: [
        { stat: 'Top 93%', label: 'more mainstream at Georgetown' },
      ],
      connectedSongs: [
        { song: 'Style', artist: 'Taylor Swift', people: 12 },
        { song: 'Snooze', artist: 'SZA', people: 8 },
        { song: 'Passionfruit', artist: 'Drake', people: 15 },
      ],
      firstToPick: [
        { text: 'Taylor Swift energy' },
        { text: 'SZA after midnight' },
        { text: 'Perfect bridge timing' }
      ],
      hotTake: 'Mainstream music is only basic when you have no emotional range.',
      nowListening: { title: 'Style', artist: 'Taylor Swift', photo: `/artists/taylorswift-updatedprofile-usethis-profile.jpeg` },
      onRepeat: [
        { title: 'Style', artist: 'Taylor Swift', photo: `/artists/taylorswift-updatedprofile-usethis-profile.jpeg` },
        { title: 'Snooze', artist: 'SZA', photo: `/artists/sza-profile.jpeg` },
        { title: 'Passionfruit', artist: 'Drake', photo: `/artists/drake-profile.jpeg` },
      ],
      archetypeSubline: (
        <>
          <b style={{ color: '#fff' }}>93%</b> more mainstream · <b style={{ color: '#fff' }}>Taylor, SZA, Drake</b> core · <span style={{ color: '#FF6B9D', fontWeight: 600 }}>every bridge memorized</span>
        </>
      ),
      mainstreamScoreAccent: 'Top 93%',
      mainstreamScoreRest: 'more mainstream at Georgetown',
      mainstreamMeterPct: 7,
      mainstreamFootnote: (
        <>
          <b>Taylor Swift, SZA, Drake</b> — shared by most of campus, but your rotation still feels personal.
        </>
      ),
      horoscope: {
        headline: "You're in full main-character rotation today.",
        body: 'Your last five Ligo answers move from Taylor and Sabrina before class to SZA and Frank after midnight, with Drake and Beyoncé carrying the pregame. Today reads like a perfect outfit, a full group chat breakdown, and one song you swear is not about him.',
        chips: [
          { label: 'Taylor energy', tone: 'orange' },
          { label: 'SZA after midnight', tone: 'yellow' },
          { label: 'Pop oracle', tone: 'pink' },
        ],
      },
      playlistName: 'main character behavior',
      secretTrack: {
        label: 'Guilty Pleasure',
        title: 'Espresso',
        artist: 'Sabrina Carpenter',
        cover: `/artists/sabrinacarpenter-profile.jpeg`,
        accentColor: '#FF6B9D',
      },
      receiptsFooter: 'Built from your daily answers · Taylor, SZA, Drake, Beyoncé, Frank Ocean, and 68 tracks across the semester.',
      notifications: [
        { ic: 'C', bg: 'linear-gradient(145deg,#FF6B9D,#C2410C)', text: <><b>Cole</b> bumped you — you&apos;re a <b>96% match</b> on pop and pregame.</>, time: '12 min ago', unread: true },
        { ic: '◉', bg: '#0A0907', text: <>Your archetype held steady — <b>The Pop Oracle</b> for 1 week running.</>, time: '2 hr ago', unread: true },
        { ic: '🔥', bg: 'linear-gradient(145deg,#F97316,#C2410C)', text: <>Day <b>6</b> streak — answer today&apos;s question to keep it alive.</>, time: 'Today, 9:02' },
        { ic: '♬', bg: 'linear-gradient(145deg,#EA8CE1,#A13D99)', text: <><b>8 people</b> saved <b>main character behavior</b> this week.</>, time: 'Yesterday' },
      ],

      prompts: [
        { id: 'main-2', answer: 'Espresso by Sabrina Carpenter. I am fueled by iced lattes.' },
        { id: 'hot-take-3', answer: 'Don\'t Stop Believin\' — skip immediately.' },
        { id: 'confess-1', answer: 'Party In The U.S.A. and I know every word.' }
      ],
    }
  },
  caroline: {
    id: 'caroline',
    name: 'Caroline M.',
    firstName: 'Caroline',
    avatar: '/assets/caroline-profile.png',
    archetype: 'The Southern Romantic',
    archetypeIcon: 'southern-romantic',
    gradient: 'linear-gradient(145deg, #F5D783, #D97706)',
    profile: {
      earnedArchetypeId: 'southern-romantic',
      heldWeeks: '1 week',
      earnedBlurb: "country heartbreak · tailgate anthems · soft songs after midnight",
      traits: [
        { n: '72%', l: <><b>more mainstream</b> than most at Georgetown</> },
        { n: '4', l: <><b>tailgate artists</b> carried your week</> },
        { n: '1', l: <><b>singalong</b> started at midnight</> }
      ],
      artists: [
        { name: 'Zach Bryan', photo: `/artists/zachbryan-profile.jpeg`, pos: 'center 20%', rank: 1 },
        { name: 'Megan Moroney', photo: `/artists/meganmoroney-profile.jpeg`, pos: 'center 20%', rank: 2 },
        { name: 'Morgan Wallen', photo: `/artists/morganwallen-profile.jpeg`, pos: 'center 20%', rank: 3 },
        { name: 'Kacey Musgraves', photo: `/artists/kaceymusgraves-profile.jpeg`, pos: 'center 20%', rank: 4 },
        { name: 'Taylor Swift', photo: `/artists/taylorswift-updatedprofile-usethis-profile.jpeg`, pos: 'center 20%', rank: 5 },
        { name: 'Noah Kahan', photo: `/artists/noahkahan-profile.jpeg`, pos: 'center 20%', rank: 6 },
      ],
      afterHoursCover: [
        `/artists/zachbryan-profile.jpeg`,
        `/artists/meganmoroney-profile.jpeg`,
        `/artists/morganwallen-profile.jpeg`,
        `/artists/kaceymusgraves-profile.jpeg`,
      ],
      playlistTrackCount: 44,
      answerTrail: [],
      playlistTracks: [
        { title: 'Tennessee Orange', artist: 'Megan Moroney', dur: '3:43', photo: `/covers/meganlucky-coverart.jpeg` },
        { title: 'Something in the Orange', artist: 'Zach Bryan', dur: '3:48', photo: `/covers/zachbryanamericanheartbreak-coverart.jpeg` },
        { title: 'Last Night', artist: 'Morgan Wallen', dur: '2:43', photo: `/covers/morganwallenonethingatatime-coverart.jpeg` },
        { title: 'Slow Burn', artist: 'Kacey Musgraves', dur: '4:06', photo: `/covers/kaceygoldenhour-coverart.jpeg` },
      ],
      pastReads: [
        { type: 'time-machine', date: 'Your Ligo Horoscope', head: "You’re in your soft-country era today.", body: 'Your last five Ligo answers move from Megan Moroney and Zach Bryan into Taylor and Noah Kahan, which means the night starts cute, gets loud, and somehow ends with everyone pretending they’re not emotional.' },
        { type: 'honest', date: 'Hot Take', head: '“Country music is only corny if you’ve never screamed it with your friends at midnight.”', body: 'Zach Bryan, Megan Moroney, Morgan Wallen — your answers hit the tailgate faster than most at Georgetown.' },
      ],
      currentStreak: 5,
      longestStreak: 12,
      tasteEvolution: [
        { month: 'March', archetype: 'The Throwback' },
        { month: 'April', archetype: 'The Southern Romantic' },
        { month: 'May', archetype: 'The Southern Romantic', note: 'held 2 weeks' },
      ],
      rarestPicks: [
        { stat: 'Top 72%', label: 'more mainstream at Georgetown' },
      ],
      connectedSongs: [
        { song: 'Tennessee Orange', artist: 'Megan Moroney', people: 11 },
        { song: 'Something in the Orange', artist: 'Zach Bryan', people: 16 },
        { song: 'Last Night', artist: 'Morgan Wallen', people: 18 },
      ],
      firstToPick: [
        { text: 'Country girl energy' },
        { text: 'Tailgate tears' },
        { text: 'Midnight singalong' }
      ],
      hotTake: 'Country music is only corny if you’ve never screamed it with your friends at midnight.',
      nowListening: { title: 'Tennessee Orange', artist: 'Megan Moroney', photo: `/covers/meganlucky-coverart.jpeg` },
      onRepeat: [
        { title: 'Something in the Orange', artist: 'Zach Bryan', photo: `/artists/zachbryan-profile.jpeg`, coverArt: `/covers/zachbryanamericanheartbreak-coverart.jpeg` },
        { title: 'Last Night', artist: 'Morgan Wallen', photo: `/artists/morganwallen-profile.jpeg`, coverArt: `/covers/morganwallenonethingatatime-coverart.jpeg` },
        { title: 'Slow Burn', artist: 'Kacey Musgraves', photo: `/artists/kaceymusgraves-profile.jpeg`, coverArt: `/covers/kaceygoldenhour-coverart.jpeg` },
      ],
      archetypeSubline: (
        <>
          <b style={{ color: '#fff' }}>72%</b> more mainstream · <b style={{ color: '#fff' }}>Zach, Megan, Morgan</b> core · <span style={{ color: '#F5D783', fontWeight: 600 }}>tailgate tears</span>
        </>
      ),
      mainstreamScoreAccent: 'Top 72%',
      mainstreamScoreRest: 'more mainstream at Georgetown',
      mainstreamMeterPct: 28,
      mainstreamFootnote: (
        <>
          <b>Zach Bryan, Megan Moroney, Morgan Wallen</b> — your answers hit the tailgate faster than most.
        </>
      ),
      horoscope: {
        headline: "You're in your soft-country era today.",
        body: 'Your last five Ligo answers move from Megan Moroney and Zach Bryan into Taylor and Noah Kahan, which means the night starts cute, gets loud, and somehow ends with everyone pretending they’re not emotional.',
        chips: [
          { label: 'Country girl energy', tone: 'orange' },
          { label: 'Tailgate tears', tone: 'yellow' },
          { label: 'Midnight singalong', tone: 'pink' },
        ],
      },
      playlistName: 'tailgate tears',
      secretTrack: {
        label: 'Guilty Pleasure',
        title: 'Cruel Summer',
        artist: 'Taylor Swift',
        cover: `/covers/taylorswift-lover-coverart.jpeg`,
        accentColor: '#F5D783',
      },
      receiptsFooter: 'Built from your daily answers · Zach Bryan, Megan Moroney, Morgan Wallen, Kacey Musgraves, and 44 tracks across the semester.',
      notifications: [
        { ic: 'C', bg: 'linear-gradient(145deg,#F5D783,#D97706)', text: <><b>Charlotte</b> bumped you — you&apos;re a <b>89% match</b> on country and singalongs.</>, time: '14 min ago', unread: true },
        { ic: '◉', bg: '#0A0907', text: <>Your archetype held steady — <b>The Southern Romantic</b> for 2 weeks running.</>, time: '4 hr ago', unread: true },
        { ic: '🔥', bg: 'linear-gradient(145deg,#F97316,#C2410C)', text: <>Day <b>5</b> streak — answer today&apos;s question to keep it alive.</>, time: 'Today, 9:02' },
        { ic: '♬', bg: 'linear-gradient(145deg,#EA8CE1,#A13D99)', text: <><b>9 people</b> saved <b>tailgate tears</b> this week.</>, time: 'Yesterday' },
      ],

      prompts: [
        { id: 'main-3', answer: 'Zach Bryan. The poetry gets me.' },
        { id: 'confess-3', answer: 'Stick Season by Noah Kahan. It gets me every time.' },
        { id: 'compat-2', answer: 'an embarrassing amount of 2010s Kesha' }
      ],
    }
  },
  cole: {
    id: 'cole',
    name: 'Cole B.',
    firstName: 'Cole',
    avatar: '/assets/Cole-profile.png',
    archetype: 'The Social Aux',
    archetypeIcon: 'social-aux',
    gradient: 'linear-gradient(145deg, #3B82F6, #14B8A6)',
    profile: {
      earnedArchetypeId: 'social-aux',
      heldWeeks: '1 week',
      earnedBlurb: "rap in the Uber · country at the tailgate · pop when the room knows every word",
      traits: [
        { n: '88%', l: <><b style={{ color: '#fff' }}>more mainstream</b> than most at Georgetown</> },
        { n: '5', l: <><b style={{ color: '#fff' }}>genres</b> played perfectly to the room</> },
        { n: '1', l: <><b style={{ color: '#fff' }}>aux cord</b> strictly guarded</> }
      ],
      artists: [
        { name: 'Drake', photo: `/artists/drake-profile.jpeg`, pos: 'center 20%', rank: 1 },
        { name: 'Travis Scott', photo: `/artists/travisscott-profile.jpeg`, pos: 'center 20%', rank: 2 },
        { name: 'Morgan Wallen', photo: `/artists/morganwallen-profile.jpeg`, pos: 'center 20%', rank: 3 },
        { name: 'Future', photo: `/artists/future-profile.jpeg`, pos: 'center 20%', rank: 4 },
        { name: 'Gunna', photo: `/artists/gunnaprofile.jpeg`, pos: 'center 20%', rank: 5 },
        { name: 'SZA', photo: `/artists/sza-profile.jpeg`, pos: 'center 20%', rank: 6 },
      ],
      afterHoursCover: [
        `/artists/drake-profile.jpeg`,
        `/artists/travisscott-profile.jpeg`,
        `/artists/morganwallen-profile.jpeg`,
        `/artists/future-profile.jpeg`,
      ],
      playlistTrackCount: 58,
      answerTrail: [],
      playlistTracks: [
        { title: 'Passionfruit', artist: 'Drake', dur: '4:58', photo: `/covers/drakepassionfruitandmorelife-coverart.jpeg` },
        { title: 'FE!N', artist: 'Travis Scott', dur: '3:11', photo: `/covers/travisscott-utopia.jpeg` },
        { title: 'fukumean', artist: 'Gunna', dur: '2:05', photo: `/covers/gunnagiftandcurse-coverart.jpeg` },
        { title: 'Last Night', artist: 'Morgan Wallen', dur: '2:43', photo: `/covers/morganwallenonethingatatime-coverart.jpeg` },
      ],
      pastReads: [
        { type: 'time-machine', date: 'Your Ligo Horoscope', head: "You’re playing the room perfectly today.", body: 'Your last five Ligo answers run Drake into Travis, then Morgan Wallen and SZA when the night gets social. Today reads like a pregame where everyone thinks they should get the aux, but somehow you still have it.' },
        { type: 'honest', date: 'Hot Take', head: '“The best aux is knowing when to stop proving your answers.”', body: 'Drake, Travis Scott, Morgan Wallen — your answers move through campus faster than most at Georgetown.' },
      ],
      currentStreak: 6,
      longestStreak: 16,
      tasteEvolution: [
        { month: 'March', archetype: 'The Main Character' },
        { month: 'April', archetype: 'The Social Aux' },
        { month: 'May', archetype: 'The Social Aux', note: 'held 2 weeks' },
      ],
      rarestPicks: [
        { stat: 'Top 88%', label: 'more mainstream at Georgetown' },
      ],
      connectedSongs: [
        { song: 'Passionfruit', artist: 'Drake', people: 21 },
        { song: 'FE!N', artist: 'Travis Scott', people: 17 },
        { song: 'Last Night', artist: 'Morgan Wallen', people: 19 },
      ],
      firstToPick: [
        { text: 'Drake energy' },
        { text: 'Pregame fluent' },
        { text: 'Knows the room' }
      ],
      hotTake: 'The best aux is knowing when to stop proving your answers.',
      nowListening: { title: 'Passionfruit', artist: 'Drake', photo: `/covers/drakepassionfruitandmorelife-coverart.jpeg` },
      onRepeat: [
        { title: 'Passionfruit', artist: 'Drake', photo: `/covers/drakepassionfruitandmorelife-coverart.jpeg` },
        { title: 'FE!N', artist: 'Travis Scott', photo: `/covers/travisscott-utopia.jpeg` },
        { title: 'fukumean', artist: 'Gunna', photo: `/covers/gunnagiftandcurse-coverart.jpeg` },
      ],
      archetypeSubline: (
        <>
          <b style={{ color: '#fff' }}>88%</b> more mainstream · <b style={{ color: '#fff' }}>Drake, Travis, Gunna</b> core · <span style={{ color: '#3B82F6', fontWeight: 600 }}>knows the room</span>
        </>
      ),
      mainstreamScoreAccent: 'Top 88%',
      mainstreamScoreRest: 'more mainstream at Georgetown',
      mainstreamMeterPct: 12,
      mainstreamFootnote: (
        <>
          <b>Drake, Travis Scott, Morgan Wallen</b> — your answers move through campus faster than most.
        </>
      ),
      horoscope: {
        headline: "You're playing the room perfectly today.",
        body: 'Your last five Ligo answers run Drake into Travis, then Morgan Wallen and SZA when the night gets social. Today reads like a pregame where everyone thinks they should get the aux, but somehow you still have it.',
        chips: [
          { label: 'Drake energy', tone: 'orange' },
          { label: 'Pregame fluent', tone: 'yellow' },
          { label: 'Social aux', tone: 'pink' },
        ],
      },
      playlistName: 'pass the aux',
      secretTrack: {
        label: 'Guilty Pleasure',
        title: 'Last Night',
        artist: 'Morgan Wallen',
        cover: `/covers/morganwallenonethingatatime-coverart.jpeg`,
        accentColor: '#3B82F6',
      },
      receiptsFooter: 'Built from your daily answers · Drake, Travis Scott, Morgan Wallen, Future, Gunna, and 58 tracks across the semester.',
      notifications: [
        { ic: 'B', bg: 'linear-gradient(145deg,#3B82F6,#14B8A6)', text: <><b>Bennett</b> bumped you — you&apos;re a <b>92% match</b> on rap and pregame.</>, time: '20 min ago', unread: true },
        { ic: '◉', bg: '#0A0907', text: <>Your archetype held steady — <b>The Social Aux</b> for 2 weeks running.</>, time: '3 hr ago', unread: true },
        { ic: '🔥', bg: 'linear-gradient(145deg,#F97316,#C2410C)', text: <>Day <b>6</b> streak — answer today&apos;s question to keep it alive.</>, time: 'Today, 10:15' },
        { ic: '♬', bg: 'linear-gradient(145deg,#EA8CE1,#A13D99)', text: <><b>12 people</b> saved <b>pass the aux</b> this week.</>, time: 'Yesterday' },
      ],

      prompts: [
        { id: 'hot-take-4', answer: 'anything by Imagine Dragons. Instant ban.' },
        { id: 'main-5', answer: '"Real G\'s move in silence like lasagna"' },
        { id: 'irl-3', answer: 'Kendrick Lamar on the Big Steppers tour. Life changing.' }
      ],
    }
  },
  bennett: {
    id: 'bennett',
    name: 'Bennett R.',
    firstName: 'Bennett',
    avatar: '/assets/bennet-profile.png',
    archetype: 'The Pregame Menace',
    archetypeIcon: 'pregame-menace',
    gradient: 'linear-gradient(145deg, #14110D, #ef4444)',
    profile: {
      earnedArchetypeId: 'pregame-menace',
      heldWeeks: '1 week',
      earnedBlurb: "rage rap early · Atlanta trap late · house when the room turns",
      traits: [
        { n: '61%', l: <><b>more mainstream</b> than most at Georgetown</> },
        { n: '14', l: <><b>students</b> follow your top niche artists</> },
        { n: '1', l: <><b>noise complaint</b> imminent</> }
      ],
      artists: [
        { name: 'Playboi Carti', photo: `/artists/playboicarti-profile.jpeg`, pos: 'center 20%', rank: 1 },
        { name: 'Ken Carson', photo: `/artists/kencarson-profile.jpeg`, pos: 'center 20%', rank: 2 },
        { name: 'Gunna', photo: `/artists/gunnaprofile.jpeg`, pos: 'center 20%', rank: 3 },
        { name: 'Young Thug', photo: `/artists/youngthug-profile.jpeg`, pos: 'center 20%', rank: 4 },
        { name: 'Destroy Lonely', photo: `/artists/destroylonely-profile.jpeg`, pos: 'center 20%', rank: 5 },
        { name: 'Lil Baby', photo: `/artists/lilbaby-profile.jpeg`, pos: 'center 20%', rank: 6 },
      ],
      afterHoursCover: [
        `/artists/playboicarti-profile.jpeg`,
        `/artists/kencarson-profile.jpeg`,
        `/artists/gunnaprofile.jpeg`,
        `/artists/youngthug-profile.jpeg`,
      ],
      playlistTrackCount: 46,
      answerTrail: [],
      playlistTracks: [
        { title: 'Sky', artist: 'Playboi Carti', dur: '3:13', photo: `/artists/playboicarti-profile.jpeg`, coverArt: `/covers/wholelottared-coverart.jpeg` },
        { title: 'Yale', artist: 'Ken Carson', dur: '2:55', photo: `/artists/kencarson-profile.jpeg`, coverArt: `/covers/kencarson-teenx-coverart.jpeg` },
        { title: 'if looks could kill', artist: 'Destroy Lonely', dur: '2:53', photo: `/artists/destroylonely-profile.jpeg`, coverArt: `/covers/iflookscouldkill-coverart.jpeg` },
        { title: 'My Love', artist: 'Route 94, Jess Glynne', dur: '4:19', photo: `/artists/route94-profile.jpeg`, coverArt: `/covers/route94mylove-coverart.jpeg` },
      ],
      pastReads: [
        { type: 'time-machine', date: 'Your Ligo Horoscope', head: "You’re bringing reckless aux energy today.", body: 'Your last five Ligo answers move from Ken and Carti before the night starts to Gunna and Lil Baby in the Uber, then Disclosure once the room gets warmer. Tonight reads like a townhouse pregame that was supposed to be chill and somehow became everybody’s plans.' },
        { type: 'honest', date: 'Hot Take', head: '“Pregames only die when someone gets scared of playing Carti.”', body: 'Playboi Carti, Ken Carson, Destroy Lonely — followed by fewer than 14 other Georgetown students.' },
      ],
      currentStreak: 5,
      longestStreak: 8,
      tasteEvolution: [
        { month: 'March', archetype: 'The Festival Head' },
        { month: 'April', archetype: 'The Pregame Menace' },
        { month: 'May', archetype: 'The Pregame Menace', note: 'held 2 weeks' },
      ],
      rarestPicks: [
        { stat: 'Top 61%', label: 'more mainstream at Georgetown' },
      ],
      connectedSongs: [
        { song: 'Yale', artist: 'Ken Carson', people: 11 },
        { song: 'fukumean', artist: 'Gunna', people: 14 },
        { song: 'Sky', artist: 'Playboi Carti', people: 9 },
      ],
      firstToPick: [
        { text: 'Carti energy' },
        { text: 'Lacrosse house chaos' },
        { text: 'House at 1:47am' }
      ],
      hotTake: 'Pregames only die when someone gets scared of playing Carti.',
      nowListening: { title: 'Sky', artist: 'Playboi Carti', photo: `/artists/playboicarti-profile.jpeg`, coverArt: `/covers/wholelottared-coverart.jpeg` },
      onRepeat: [
        { title: 'Stop Breathing', artist: 'Playboi Carti', photo: `/artists/playboicarti-profile.jpeg`, coverArt: `/covers/wholelottared-coverart.jpeg` },
        { title: 'Fighting My Demons', artist: 'Ken Carson', photo: `/artists/kencarson-profile.jpeg`, coverArt: `/covers/kencarsonagreatchaos-coverart.jpeg` },
        { title: 'NOSTYLIST', artist: 'Destroy Lonely', photo: `/artists/destroylonely-profile.jpeg`, coverArt: `/covers/nostylist-coverart.jpeg` }
      ],
      archetypeSubline: (
        <>
          <b style={{ color: '#fff' }}>61%</b> more mainstream · <b style={{ color: '#fff' }}>Carti, Ken Carson, Gunna</b> core · <span style={{ color: '#ef4444', fontWeight: 600 }}>noise complaint imminent</span>
        </>
      ),
      mainstreamScoreAccent: 'Top 61%',
      mainstreamScoreRest: 'more mainstream at Georgetown',
      mainstreamMeterPct: 39,
      mainstreamFootnote: (
        <>
          <b>Playboi Carti, Ken Carson, Destroy Lonely</b> — followed by fewer than 14 other Georgetown students.
        </>
      ),
      horoscope: {
        headline: "You’re bringing reckless aux energy today.",
        body: 'Your last five Ligo answers move from Ken and Carti before the night starts to Gunna and Lil Baby in the Uber, then Disclosure once the room gets warmer. Tonight reads like a townhouse pregame that was supposed to be chill and somehow became everybody’s plans.',
        chips: [
          { label: 'Carti energy', tone: 'orange' },
          { label: 'Lacrosse house chaos', tone: 'yellow' },
          { label: 'House at 1:47am', tone: 'pink' },
        ],
      },
      playlistName: 'lacrosse house chaos',
      secretTrack: {
        label: 'Guilty Pleasure',
        title: 'My Love',
        artist: 'Route 94',
        cover: `/covers/route94mylove-coverart.jpeg`,
        accentColor: '#ef4444',
      },
      receiptsFooter: 'Built from your daily answers · Playboi Carti, Ken Carson, Gunna, Young Thug, Destroy Lonely, and 46 tracks across the semester.',
      notifications: [
        { ic: 'C', bg: 'linear-gradient(145deg,#3B82F6,#14B8A6)', text: <><b>Cole</b> bumped you — you&apos;re a <b>92% match</b> on rap and pregame.</>, time: '12 min ago', unread: true },
        { ic: '◉', bg: '#0A0907', text: <>Your archetype held steady — <b>The Pregame Menace</b> for 2 weeks running.</>, time: '3 hr ago', unread: true },
        { ic: '🔥', bg: 'linear-gradient(145deg,#F97316,#C2410C)', text: <>Day <b>5</b> streak — answer today&apos;s question to keep it alive.</>, time: 'Today, 9:02' },
        { ic: '♬', bg: 'linear-gradient(145deg,#EA8CE1,#A13D99)', text: <><b>14 people</b> saved <b>lacrosse house chaos</b> this week.</>, time: 'Yesterday' },
      ],

      prompts: [
        { id: 'hot-take-2', answer: 'Drake. The monotone just puts me to sleep.' },
        { id: 'main-1', answer: 'exclusively 90s hip-hop to make me feel cool' },
        { id: 'irl-2', answer: 'Mr. Brightside. Yes, I am that guy.' }
      ],
    }
  },
  maddie: {
    id: 'maddie',
    name: 'Maddie R.',
    firstName: 'Maddie',
    avatar: '/assets/Maddie-profile.png',
    archetype: 'The Alt Socialite',
    archetypeIcon: 'algorithm-dodger',
    gradient: 'linear-gradient(145deg, #14B8A6, #A78BFA)',
    yearLevel: 'Junior',
    pronouns: 'She/Her',
    school: 'Georgetown',
    profile: {
      earnedArchetypeId: 'algorithm-dodger',
      heldWeeks: '1 week',
      earnedBlurb: "The alt profile that still works socially. You make weird answers feel playable at a rooftop pregame.",
      traits: [
        { n: '24%', l: <><b>more niche</b> at Georgetown</> },
        { n: '12', l: <><b>core artists</b> carried your week</> },
        { n: '1', l: <><b>track</b> played ironically at the pregame</> }
      ],
      artists: [
        { name: 'Charli XCX', photo: `/artists/charliexcx-profile.jpeg`, pos: 'center 20%', rank: 1 },
        { name: 'The 1975', photo: `/artists/the1975-profile.jpeg`, pos: 'center 20%', rank: 2 },
        { name: 'PinkPantheress', photo: `/artists/pinkpantheress-profile.jpeg`, pos: 'center 20%', rank: 3 },
        { name: 'The Dare', photo: `/artists/thedare-profile.jpeg`, pos: 'center 20%', rank: 4 },
        { name: 'Lil Uzi Vert', photo: `/artists/liluzivert-profile.jpeg`, pos: 'center 20%', rank: 5 },
        { name: 'Disclosure', photo: `/artists/disclosurespotifynew.jpeg`, pos: 'center 20%', rank: 6 },
      ],
      afterHoursCover: [
        `/artists/charliexcx-profile.jpeg`,
        `/artists/the1975-profile.jpeg`,
        `/artists/thedare-profile.jpeg`,
        `/artists/disclosurespotifynew.jpeg`,
      ],
      playlistTrackCount: 108,
      answerTrail: [],
      playlistTracks: [
        { title: '360', artist: 'Charli XCX', dur: '2:13', photo: `/covers/brat-coverart.jpeg` },
        { title: 'Girls', artist: 'The Dare', dur: '2:25', photo: `/covers/whatswrongwithnewyork-coverart.jpeg` },
        { title: 'Somebody Else', artist: 'The 1975', dur: '5:47', photo: `/covers/ilikeitwhenyousleep-1975-coverart.jpeg` },
        { title: 'XO Tour Llif3', artist: 'Lil Uzi Vert', dur: '3:02', photo: `/covers/luvisrage2-coverart.jpeg` },
      ],
      pastReads: [
        { type: 'time-machine', date: 'Your Ligo Horoscope', head: "You’re making weird answers feel playable today.", body: 'Your last five Ligo answers jump from Charli and PinkPantheress into The 1975 and The Dare, which means your night starts ironic, gets loud, and somehow becomes everyone else’s new answers next month.' },
        { type: 'honest', date: 'Hot Take', head: '“The best playlists have at least one song that makes no sense until the third drink.”', body: 'Charli XCX, The Dare, The 1975 — the cool alt-social girl rotation.' },
      ],
      currentStreak: 4,
      longestStreak: 11,
      tasteEvolution: [
        { month: 'March', archetype: 'The Mood Curator' },
        { month: 'April', archetype: 'The Alt Socialite' },
        { month: 'May', archetype: 'The Alt Socialite', note: 'held 2 weeks' },
      ],
      rarestPicks: [
        { stat: 'Top 24%', label: 'more niche at Georgetown' },
      ],
      connectedSongs: [
        { song: '360', artist: 'Charli XCX', people: 5 },
        { song: 'Girls', artist: 'The Dare', people: 2 },
        { song: 'Somebody Else', artist: 'The 1975', people: 4 },
      ],
      firstToPick: [
        { text: 'Charli energy' },
        { text: 'Alt social aux' },
        { text: 'Too early again' }
      ],
      hotTake: 'The best playlists have at least one song that makes no sense until the third drink.',
      nowListening: { title: '360', artist: 'Charli XCX', photo: `/covers/brat-coverart.jpeg` },
      onRepeat: [
        { title: '360', artist: 'Charli XCX', photo: `/artists/charliexcx-profile.jpeg`, coverArt: `/covers/brat-coverart.jpeg` },
        { title: 'WNBA', artist: 'Drake', photo: `/artists/drake-profile.jpeg`, coverArt: `/covers/drake-habibti-spotify.jpeg` },
        { title: 'Diet Pepsi', artist: 'Addison Rae', photo: `/artists/addisonrae-profile.jpeg`, coverArt: `/covers/dietpepsi-coverart.jpeg` },
      ],
      archetypeSubline: (
        <>
          <b style={{ color: '#fff' }}>24%</b> more niche · <b style={{ color: '#fff' }}>Charli, The 1975, The Dare</b> core · <span style={{ color: '#14B8A6', fontWeight: 600 }}>playable at a rooftop pregame</span>
        </>
      ),
      mainstreamScoreAccent: 'Top 24%',
      mainstreamScoreRest: 'more niche at Georgetown',
      mainstreamMeterPct: 76,
      mainstreamFootnote: (
        <>
          <b>Charli XCX, PinkPantheress, The 1975</b> — you&apos;re picking songs that still work socially.
        </>
      ),
      horoscope: {
        headline: "You’re making weird answers feel playable today.",
        body: 'Your last five Ligo answers jump from Charli and PinkPantheress into The 1975 and The Dare, which means your night starts ironic, gets loud, and somehow becomes everyone else’s new answers next month.',
        chips: [
          { label: 'Charli energy', tone: 'orange' },
          { label: 'Alt social aux', tone: 'pink' },
          { label: 'Pregame wildcards', tone: 'yellow' },
        ],
      },
      playlistName: 'alt social chaos',
      secretTrack: {
        label: 'Guilty Pleasure',
        title: 'Diet Pepsi',
        artist: 'Addison Rae',
        cover: `/covers/dietpepsi-coverart.jpeg`,
        accentColor: '#14B8A6',
      },
      receiptsFooter: 'Built from your daily answers · Charli XCX, PinkPantheress, The Dare, The 1975, Lil Uzi Vert, and 108 tracks across the semester.',
      notifications: [
        { ic: 'M', bg: 'linear-gradient(145deg,#14B8A6,#A78BFA)', text: <><b>Marcus</b> bumped you — you&apos;re a <b>85% match</b> on The 1975.</>, time: '11 min ago', unread: true },
        { ic: '◉', bg: '#0A0907', text: <>Your archetype held steady — <b>The Alt Socialite</b> for 2 weeks running.</>, time: '4 hr ago', unread: true },
        { ic: '🔥', bg: 'linear-gradient(145deg,#F97316,#C2410C)', text: <>Day <b>4</b> streak — answer today&apos;s question to keep it alive.</>, time: 'Today, 8:45' },
        { ic: '♬', bg: 'linear-gradient(145deg,#EA8CE1,#A13D99)', text: <><b>4 people</b> saved <b>alt social chaos</b> this week.</>, time: 'Yesterday' },
      ],

      prompts: [
        { id: 'confess-4', answer: 'something embarrassing by The 1975.' },
        { id: 'irl-1', answer: 'Frank Ocean if he ever actually performs again' },
        { id: 'compat-4', answer: 'Mr. Brightside. I just can\'t do it anymore.' }
      ],
    }
  },
  alessia: {
    id: 'alessia',
    name: 'Alessia C.',
    firstName: 'Alessia',
    avatar: '/assets/alessianewprofile.png',
    archetype: 'The Afterglow',
    archetypeIcon: 'afterglow',
    gradient: 'linear-gradient(145deg, #e8c4f0, #8b5cf6)',
    yearLevel: 'Junior',
    pronouns: 'She/Her',
    school: 'Georgetown',
    profile: {
      earnedArchetypeId: 'afterglow',
      heldWeeks: '1 week',
      earnedBlurb: "Loud, expensive, romantic, then gone quiet. You turn house music into a full emotional arc.",
      traits: [
        { n: '31%', l: <><b>more mainstream</b> than most at Georgetown</> },
        { n: '12', l: <><b>core artists</b> carried your week</> },
        { n: '1', l: <><b>mood shift</b> after midnight</> }
      ],
      artists: [
        { name: 'Adam Port', photo: '/assets/artists/adamportspotifynew.jpeg', pos: 'center 20%', rank: 1 },
        { name: 'Chris Stussy', photo: '/artists/chrisstussy-profile.jpeg', pos: 'center 20%', rank: 2 },
        { name: 'Disclosure', photo: '/assets/artists/disclosurespotifynew.jpeg', pos: 'center 20%', rank: 3 },
        { name: 'Disco Lines', photo: '/artists/discolines-profile.jpeg', pos: 'center 20%', rank: 4 },
        { name: 'Lana Del Rey', photo: '/assets/artists/lanadelreyspotifynew.jpeg', pos: 'center 20%', rank: 5 },
        { name: 'The Weeknd', photo: '/artists/theweekndprofile.jpeg', pos: 'center 20%', rank: 6 },
      ],
      afterHoursCover: [
        '/assets/artists/adamportspotifynew.jpeg',
        '/artists/chrisstussy-profile.jpeg',
        '/assets/artists/disclosurespotifynew.jpeg',
        '/artists/discolines-profile.jpeg',
      ],
      playlistTrackCount: 52,
      answerTrail: [],
      playlistTracks: [
        { title: 'Brooklyn Baby', artist: 'Lana Del Rey', dur: '5:51', photo: '/assets/artists/lanadelreyspotifynew.jpeg' },
        { title: 'Move', artist: 'Adam Port', dur: '7:24', photo: '/assets/artists/adamportspotifynew.jpeg' },
        { title: 'Space Song', artist: 'Beach House', dur: '4:21', photo: '/assets/artists/beachhousespotifynew.jpeg' },
        { title: 'Call Out My Name', artist: 'The Weeknd', dur: '3:48', photo: '/artists/theweekndprofile.jpeg' },
      ],
      pastReads: [
        { type: 'time-machine', date: 'Your Ligo Horoscope', head: "You peak on the floor and melt on the way home.", body: 'Your last five Ligo answers start with Adam Port and Disclosure in the club, then immediately drop into Lana and Beach House for the Uber ride home. You need the party to be loud, but the afters to be devastating.' },
        { type: 'honest', date: 'Hot Take', head: '“The Weeknd is better when he sounds haunted, not famous.”', body: 'Lana Del Rey, The Weeknd, Beach House — you want your pop music to hurt a little.' },
      ],
      currentStreak: 4,
      longestStreak: 10,
      tasteEvolution: [
        { month: 'March', archetype: 'The Mood Curator' },
        { month: 'April', archetype: 'The Afterglow' },
        { month: 'May', archetype: 'The Afterglow', note: 'held 2 weeks' },
      ],
      rarestPicks: [
        { stat: 'Top 31%', label: 'more mainstream at Georgetown' },
      ],
      connectedSongs: [
        { song: 'Brooklyn Baby', artist: 'Lana Del Rey', people: 14 },
        { song: 'Latch', artist: 'Disclosure', people: 19 },
        { song: 'Call Out My Name', artist: 'The Weeknd', people: 22 },
      ],
      firstToPick: [
        { text: 'Lana energy' },
        { text: 'House music royalty' },
        { text: 'After-hours emotional' }
      ],
      hotTake: 'The Weeknd is better when he sounds haunted, not famous.',
      nowListening: { title: 'Brooklyn Baby', artist: 'Lana Del Rey', photo: '/assets/artists/lanadelreyspotifynew.jpeg' },
      onRepeat: [
        { title: 'Brooklyn Baby', artist: 'Lana Del Rey', photo: '/assets/artists/lanadelreyspotifynew.jpeg', coverArt: '/covers/lanadelreyultraviolence-coverart.jpeg' },
        { title: 'Move', artist: 'Adam Port', photo: '/assets/artists/adamportspotifynew.jpeg', coverArt: '/covers/move-coverart.jpeg' },
        { title: 'Space Song', artist: 'Beach House', photo: '/assets/artists/beachhousespotifynew.jpeg', coverArt: '/covers/beachhousedepressioncherry-coverart.jpeg' },
      ],
      archetypeSubline: (
        <>
          <b style={{ color: '#fff' }}>31%</b> more mainstream · <b style={{ color: '#fff' }}>Adam Port, Lana, The Weeknd</b> core · <span style={{ color: '#EA8CE1', fontWeight: 600 }}>peak then melt</span>
        </>
      ),
      mainstreamScoreAccent: 'Top 31%',
      mainstreamScoreRest: 'more mainstream at Georgetown',
      mainstreamMeterPct: 69,
      mainstreamFootnote: (
        <>
          <b>Adam Port, Disclosure, Lana Del Rey</b> — a perfect split between the floor and the feelings.
        </>
      ),
      horoscope: {
        headline: "You peak on the floor and melt on the way home.",
        body: 'Your last five Ligo answers start with Adam Port and Disclosure in the club, then immediately drop into Lana and Beach House for the Uber ride home. You need the party to be loud, but the afters to be devastating.',
        chips: [
          { label: 'House royalty', tone: 'orange' },
          { label: 'Lana energy', tone: 'pink' },
          { label: 'Haunted Weeknd', tone: 'yellow' },
        ],
      },
      playlistName: 'emotional afters',
      secretTrack: {
        label: 'Guilty Pleasure',
        title: 'Starboy',
        artist: 'The Weeknd',
        cover: '/covers/weekndstarboy-coverart.jpeg',
        accentColor: '#EA8CE1',
      },
      receiptsFooter: 'Built from your daily answers · Adam Port, Disclosure, Lana Del Rey, The Weeknd, Peggy Gou, and 52 tracks across the semester.',
      notifications: [
        { ic: 'J', bg: 'linear-gradient(145deg,#F97316,#EA8CE1)', text: <><b>Jordan</b> bumped you — you&apos;re a <b>91% match</b> on late-night house.</>, time: '14 min ago', unread: true },
        { ic: '◉', bg: '#0A0907', text: <>Your archetype held steady — <b>The Afterglow</b> for 2 weeks running.</>, time: '5 hr ago', unread: true },
        { ic: '🔥', bg: 'linear-gradient(145deg,#F97316,#C2410C)', text: <>Day <b>4</b> streak — answer today&apos;s question to keep it alive.</>, time: 'Today, 8:45' },
        { ic: '♬', bg: 'linear-gradient(145deg,#EA8CE1,#A13D99)', text: <><b>6 people</b> saved <b>emotional afters</b> this week.</>, time: 'Yesterday' },
      ],

      prompts: [
        { id: 'irl-5', answer: 'Losing It by Fisher at a massive festival' },
        { id: 'confess-5', answer: 'Demon Days by Gorillaz. A masterpiece.' },
        { id: 'music-dealbreaker', answer: 'you only listen to the Spotify Top 50 playlist' }
      ],
    }
  },
  sofia: {
    id: 'sofia',
    name: 'Sofia L.',
    firstName: 'Sofia',
    avatar: '/assets/sofia-profile.png',
    archetype: 'The Mood Curator',
    archetypeIcon: 'mood-curator',
    gradient: 'linear-gradient(145deg, #14B8A6, #3B82F6)',
    yearLevel: 'Sophomore',
    pronouns: 'She/Her',
    school: 'Georgetown',
    profile: {
      earnedArchetypeId: 'mood-curator',
      heldWeeks: '1 week',
      earnedBlurb: "The soft indie/R&B emotional bridge. Sofia is public-transit sadness, library crushes, and late-night dream-pop comedown.",
      traits: [
        { n: '48%', l: <><b>more mainstream</b> at Georgetown</> },
        { n: '12', l: <><b>core artists</b> carried your week</> },
        { n: '1', l: <><b>playlist</b> for crying on public transit</> }
      ],
      artists: [
        { name: 'Faye Webster', photo: `/assets/artists/FayeWebsterSpotify.jpeg`, pos: 'center 20%', rank: 1 },
        { name: 'Clairo', photo: `/assets/artists/ClairoSpotify.jpeg`, pos: 'center 20%', rank: 2 },
        { name: 'SZA', photo: `/assets/artists/SZASpotify.jpeg`, pos: 'center 20%', rank: 3 },
        { name: 'Frank Ocean', photo: `/assets/artists/frankocean-profile.jpeg`, pos: 'center 20%', rank: 4 },
        { name: 'Steve Lacy', photo: `/assets/artists/SteveLacySpotify.jpeg`, pos: 'center 20%', rank: 5 },
        { name: 'Phoebe Bridgers', photo: `/assets/artists/PhoebeBridgersSpotify.jpeg`, pos: 'center 20%', rank: 6 },
      ],
      afterHoursCover: [
        `/assets/artists/FayeWebsterSpotify.jpeg`,
        `/assets/artists/ClairoSpotify.jpeg`,
        `/assets/artists/SZASpotify.jpeg`,
        `/assets/artists/frankocean-profile.jpeg`,
      ],
      playlistTrackCount: 84,
      answerTrail: [],
      playlistTracks: [
        { title: 'Right Side of My Neck', artist: 'Faye Webster', dur: '2:59', photo: `/assets/artists/FayeWebsterSpotify.jpeg` },
        { title: 'Bags', artist: 'Clairo', dur: '4:20', photo: `/assets/artists/ClairoSpotify.jpeg` },
        { title: 'Good Days', artist: 'SZA', dur: '4:39', photo: `/assets/artists/SZASpotify.jpeg` },
        { title: 'Self Control', artist: 'Frank Ocean', dur: '4:09', photo: `/assets/artists/frankocean-profile.jpeg` },
      ],
      pastReads: [
        { type: 'time-machine', date: 'Your Ligo Horoscope', head: "You're making a public-transit soundtrack today.", body: 'Your last five Ligo answers start with Faye Webster and Clairo on the train, then into SZA and Frank Ocean for late night. You match through mood, not volume, turning shared sadness into a real connection.' },
        { type: 'honest', date: 'Hot Take', head: '“I do not trust people who do not have a playlist for crying on public transit.”', body: 'Faye Webster, Clairo, Phoebe Bridgers — the soft indie/R&B emotional bridge.' },
      ],
      currentStreak: 6,
      longestStreak: 12,
      tasteEvolution: [
        { month: 'March', archetype: 'The Afterglow' },
        { month: 'April', archetype: 'The Mood Curator' },
        { month: 'May', archetype: 'The Mood Curator', note: 'held 3 weeks' },
      ],
      rarestPicks: [
        { stat: 'Top 48%', label: 'more mainstream at Georgetown' },
      ],
      connectedSongs: [
        { song: 'Self Control', artist: 'Frank Ocean', people: 15 },
        { song: 'Bags', artist: 'Clairo', people: 11 },
        { song: 'Good Days', artist: 'SZA', people: 24 },
      ],
      firstToPick: [
        { text: 'Soft indie energy' },
        { text: 'R&B emotional bridge' },
        { text: 'Public transit tears' }
      ],
      hotTake: 'I do not trust people who do not have a playlist for crying on public transit.',
      nowListening: { title: 'Right Side of My Neck', artist: 'Faye Webster', photo: `/assets/artists/FayeWebsterSpotify.jpeg` },
      onRepeat: [
        { title: 'Right Side of My Neck', artist: 'Faye Webster', photo: `/assets/artists/FayeWebsterSpotify.jpeg` },
        { title: 'Bags', artist: 'Clairo', photo: `/assets/artists/ClairoSpotify.jpeg` },
        { title: 'Self Control', artist: 'Frank Ocean', photo: `/assets/artists/frankocean-profile.jpeg` },
      ],
      archetypeSubline: (
        <>
          <b style={{ color: '#fff' }}>48%</b> more mainstream · <b style={{ color: '#fff' }}>Faye, Clairo, SZA</b> core · <span style={{ color: '#14B8A6', fontWeight: 600 }}>the emotional bridge</span>
        </>
      ),
      mainstreamScoreAccent: 'Top 48%',
      mainstreamScoreRest: 'more mainstream at Georgetown',
      mainstreamMeterPct: 48,
      mainstreamFootnote: (
        <>
          <b>Faye Webster, Clairo, Frank Ocean</b> — you match through mood, not volume.
        </>
      ),
      horoscope: {
        headline: "You're making a public-transit soundtrack today.",
        body: 'Your last five Ligo answers start with Faye Webster and Clairo on the train, then into SZA and Frank Ocean for late night. You match through mood, not volume, turning shared sadness into a real connection.',
        chips: [
          { label: 'Indie tears', tone: 'orange' },
          { label: 'Late night R&B', tone: 'pink' },
          { label: 'Dream-pop', tone: 'yellow' },
        ],
      },
      playlistName: 'public transit tears',
      secretTrack: {
        label: 'Guilty Pleasure',
        title: 'Bad Habit',
        artist: 'Steve Lacy',
        cover: `/assets/artists/SteveLacySpotify.jpeg`,
        accentColor: '#14B8A6',
      },
      receiptsFooter: 'Built from your daily answers · Faye Webster, Clairo, Phoebe Bridgers, SZA, Frank Ocean, Steve Lacy, and 84 tracks across the semester.',
      notifications: [
        { ic: 'M', bg: 'linear-gradient(145deg,#14B8A6,#3B82F6)', text: <><b>Maddie</b> bumped you — you&apos;re a <b>88% match</b> on Clairo and Steve Lacy.</>, time: '12 min ago', unread: true },
        { ic: '◉', bg: '#0A0907', text: <>Your archetype held steady — <b>The Mood Curator</b> for 3 weeks running.</>, time: '2 hr ago', unread: true },
        { ic: '🔥', bg: 'linear-gradient(145deg,#F97316,#C2410C)', text: <>Day <b>6</b> streak — answer today&apos;s question to keep it alive.</>, time: 'Today, 9:02' },
        { ic: '♬', bg: 'linear-gradient(145deg,#EA8CE1,#A13D99)', text: <><b>8 people</b> saved <b>public transit tears</b> this week.</>, time: 'Yesterday' },
      ],

      prompts: [
        { id: 'compat-3', answer: 'is smooth 90s R&B' },
        { id: 'main-5', answer: '"Boy you got me hooked onto something"' },
        { id: 'confess-2', answer: 'Baby by Justin Bieber.' }
      ],
    }
  }
};
