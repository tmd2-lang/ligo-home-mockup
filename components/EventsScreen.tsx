// @ts-nocheck — faithful port of the bundle's events.jsx; prototype data is loosely typed.
/* ============================================================
   EventsScreen — LIGO v3 Events tab.
   Ported from the offline bundle's events.jsx (forked from the
   Events Admin template): music-first member feed (campus · City·DC
   · cross-campus), event detail, RSVP popup, and the create-event
   sheet with cross-campus reach. Styles in app/events.css, scoped
   under .ligo-events. Cover art resolves to /public/artists.
   ============================================================ */
/* eslint-disable react/no-unescaped-entities, react-hooks/exhaustive-deps */
"use client";
import React, { useState } from "react";

const EVI = {
  Back:    (p: any)=>(<svg width="20" height="20" viewBox="0 0 20 20" fill="none" {...p}><path d="M12.5 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  Share:   (p: any)=>(<svg width="16" height="16" viewBox="0 0 20 20" fill="none" {...p}><path d="M10 13V3m0 0l-3.5 3.5M10 3l3.5 3.5M4 11v4a2 2 0 002 2h8a2 2 0 002-2v-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  Plus:    (p: any)=>(<svg width="18" height="18" viewBox="0 0 20 20" fill="none" {...p}><path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>),
  Chevron: (p: any)=>(<svg width="18" height="18" viewBox="0 0 20 20" fill="none" {...p}><path d="M7.5 4l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  Play:    (p: any)=>(<svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}><path d="M4 2.5L11 7l-7 4.5v-9z" fill="currentColor"/></svg>),
  Calendar:(p: any)=>(<svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><rect x="3.5" y="5" width="17" height="15" rx="3" stroke="currentColor" strokeWidth="1.8"/><path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>),
  User:    (p: any)=>(<svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.8"/><path d="M5 20c.7-3.4 3.5-5.5 7-5.5s6.3 2.1 7 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>),
  Sun:     (p: any)=>(<svg width="14" height="14" viewBox="0 0 16 16" fill="none" {...p}><circle cx="8" cy="8" r="3" fill="currentColor"/><g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M8 1.5v1.6M8 12.9v1.6M1.5 8h1.6M12.9 8h1.6"/><path d="M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M3.4 12.6l1.1-1.1M11.5 4.5l1.1-1.1"/></g></svg>),
  Moon:    (p: any)=>(<svg width="14" height="14" viewBox="0 0 16 16" fill="none" {...p}><path d="M13.5 9.4A6 6 0 016.6 2.5 6 6 0 1013.5 9.4z" fill="currentColor"/></svg>),
  X:       (p: any)=>(<svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>),
  Check:   (p: any)=>(<svg width="12" height="12" viewBox="0 0 14 14" fill="none" {...p}><path d="M3 7.5L6 10.5 11 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  Group:   (p: any)=>(<svg width="18" height="18" viewBox="0 0 20 20" fill="none" {...p}><circle cx="7" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.6"/><circle cx="13.5" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.6"/><path d="M2.5 16c.5-2.5 2.4-4 4.5-4s4 1.5 4.5 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M13 12.5c2 0 3.6 1.2 4 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>),
  Invite:  (p: any)=>(<svg width="18" height="18" viewBox="0 0 20 20" fill="none" {...p}><circle cx="9" cy="7.5" r="3" stroke="currentColor" strokeWidth="1.6"/><path d="M3 17c.6-3.3 3-5 6-5 1.2 0 2.3.3 3.2.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M15 13v6M12 16h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>),
  Globe:   (p: any)=>(<svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4"/><path d="M1.5 7h11M7 1.5c1.5 1.8 2.3 3.5 2.3 5.5S8.5 11.2 7 12.5C5.5 11.2 4.7 9 4.7 7s.8-3.7 2.3-5.5z" stroke="currentColor" strokeWidth="1.4"/></svg>),
  Lock:    (p: any)=>(<svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}><rect x="2.5" y="6" width="9" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M4.5 6V4.5a2.5 2.5 0 015 0V6" stroke="currentColor" strokeWidth="1.4"/></svg>),
  Music:   (p: any)=>(<svg width="15" height="15" viewBox="0 0 24 24" fill="none" {...p}><path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2"/><circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="2"/></svg>),
  Grid:    (p: any)=>(<svg width="15" height="15" viewBox="0 0 24 24" fill="none" {...p}><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/></svg>),
};

// ── Helpers ────────────────────────────────────────────────
const COVERS: Record<string, string> = {
  taylor: '/artists/taylor.png', sabrina: '/artists/sabrina.png',
  frankBlond: '/artists/frank-blond.png', szaSaturn: '/artists/sza-saturn.png',
  kendrick: '/artists/kendrick.png', chappell: '/artists/chappell.png',
  billie: '/artists/billie.png',
};
const resUrl = (id: string) => COVERS[id] || ('/artists/' + id + '.png');
function avatarBg(name: string) {
  const palette = ['#f97316','#ea8ce1','#71c07f','#5a6abe','#a07c00','#a13d99','#2f7d3f','#c2410c'];
  let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  return palette[h % palette.length];
}
const initials = (name: string) => name.split(' ').slice(0, 2).map(s => s[0]).join('').toUpperCase();

// ── Tag styling per category ───────────────────────────────
const TAGS: Record<string, { tag: string; tagBg: string; tagFg: string }> = {
  acappella: { tag: 'A cappella', tagBg: 'rgba(245,215,131,0.22)', tagFg: '#a07c00' },
  dance:     { tag: 'Dance',      tagBg: 'rgba(234,140,225,0.16)', tagFg: '#a13d99' },
  theatre:   { tag: 'Theatre',    tagBg: 'rgba(234,140,225,0.16)', tagFg: '#a13d99' },
  ensemble:  { tag: 'Ensemble',   tagBg: 'rgba(113,192,127,0.16)', tagFg: '#2f7d3f' },
  jazz:      { tag: 'Jazz',       tagBg: 'rgba(90,106,190,0.14)',  tagFg: '#3a4a9e' },
  live:      { tag: 'Live',       tagBg: 'rgba(249,115,22,0.12)',  tagFg: '#c2410c' },
  djset:     { tag: 'DJ set',     tagBg: 'rgba(20,17,13,0.08)',    tagFg: '#14110d' },
  greek:     { tag: 'Greek',      tagBg: 'rgba(234,140,225,0.14)', tagFg: '#a13d99' },
  culture:   { tag: 'Culture',    tagBg: 'rgba(113,192,127,0.16)', tagFg: '#2f7d3f' },
  prepro:    { tag: 'Pre-pro',    tagBg: 'rgba(90,42,138,0.12)',   tagFg: '#5a2b8a' },
  media:     { tag: 'Media',      tagBg: 'rgba(20,17,13,0.07)',    tagFg: '#14110d' },
  service:   { tag: 'Service',    tagBg: 'rgba(113,192,127,0.16)', tagFg: '#2f7d3f' },
  campus:    { tag: 'Campus',     tagBg: 'rgba(20,17,13,0.07)',    tagFg: '#14110d' },
};
const G: Record<string, string> = {
  warm:'linear-gradient(160deg,#f97316,#c2410c)', pink:'linear-gradient(160deg,#ea8ce1,#a13d99)',
  gold:'linear-gradient(160deg,#f5d783,#a07c00)', navy:'linear-gradient(160deg,#1a2a5e,#3a4a9e)',
  forest:'linear-gradient(160deg,#2a5e40,#71c07f)', plum:'linear-gradient(160deg,#3a1a5e,#7a3a9e)',
  earth:'linear-gradient(160deg,#5e3a1a,#a07c00)', smoke:'linear-gradient(160deg,#14110d,#4a3a2a)',
  cream:'linear-gradient(160deg,#f5d783,#e9bf52)', sunset:'linear-gradient(160deg,#f97316,#ea8ce1)',
  cobalt:'linear-gradient(160deg,#2a3a8e,#5a6abe)', jade:'linear-gradient(160deg,#2a8e6a,#5abe9a)',
  crimson:'linear-gradient(160deg,#7a1020,#b3303f)', buff:'linear-gradient(160deg,#0d3b66,#1f6fb2)',
};
const SCHOOLS: Record<string, { label: string; dot: string }> = {
  howard: { label: 'Shared from Howard', dot: '#b3303f' },
  gw:     { label: 'via GW', dot: '#1f6fb2' },
};

const ev = (id: any, day: any, time: any, name: any, host: any, venue: any, going: any, match: any, cat: any, color: any, extra?: any): any => ({
  id, day, time, name, host, venue, going, match, color, ...TAGS[cat], category: cat, ...(extra || {}),
});

// ── Event data — Music feed (3 sources) + Everything else ──
const EVENTS = [
  // ============ MUSIC · campus performing-arts clubs ============
  ev('dcaf', 'FRI', '7 PM', 'DCAF — DC A Cappella Festival', 'The Phantoms × The GraceNotes', 'Gaston Hall · Healy', 612, 97, 'acappella', G.warm, {
    feed: 'music', source: 'campus', flagship: true, openTo: true, becauseArtist: 'Frank Ocean',
    desc: 'The flagship. Eight collegiate groups from across DC trade sets in Gaston Hall — co-hosted by the Phantoms and GraceNotes. Doors at 6:30, festival passes at the door.',
    dj: { name: 'Festival house DJ between sets', genre: 'Pop · R&B · indie' },
  }),
  ev('grace', 'TONIGHT', '8 PM', 'GraceNotes Fall Set', 'The GraceNotes · all-women a cappella', 'McNeir Hall', 168, 93, 'acappella', G.cream, {
    feed: 'music', source: 'campus', becauseArtist: 'Phoebe Bridgers', nudgedBy: 'Maya R.',
    desc: 'Rock, oldies and pop arrangements from Georgetown\'s all-women group. New senior soloists debut tonight.',
    dj: { name: 'Curated by GraceNotes music chair', genre: 'Rock · oldies · pop' },
  }),
  ev('capg', 'TONIGHT', '9 PM', 'The Capitol G\u2019s Showcase', 'The Capitol G\u2019s · a cappella', 'Bulldog Alley', 142, 90, 'acappella', G.plum, {
    feed: 'music', source: 'campus', becauseArtist: 'SZA',
    desc: 'R&B, hip-hop and pop. The Capitol G\u2019s bring the loudest set on campus — full band energy, no instruments.',
    dj: { name: 'After-set: DJ from WGTB', genre: 'Hip-hop · R&B' },
  }),
  ev('sax', 'TODAY', '4 PM', 'Saxatones Pop-Up', 'The Saxatones · a cappella', 'Red Square', 64, 86, 'acappella', G.gold, {
    feed: 'music', source: 'campus', becauseArtist: 'Sabrina Carpenter',
    desc: 'Motown to modern pop, outdoor and free. 20 minutes between classes — no RSVP needed.',
  }),
  ev('mb', 'FRI', '8 PM', 'Mask & Bauble: Spring Studio', 'Mask & Bauble · est. 1852', 'Poulton Hall Stage III', 96, 84, 'theatre', G.smoke, {
    feed: 'music', source: 'campus', becauseArtist: 'Mitski',
    desc: 'The oldest continuously-running student theatre in the US opens its studio season. Original student work, live underscore.',
    dj: { name: 'Live score by the M&B pit', genre: 'Indie · cinematic' },
  }),
  ev('gudc', 'TONIGHT', '8:30 PM', 'GUDC Fall Showcase', 'GU Dance Company', 'Davis PAC', 188, 88, 'dance', G.sunset, {
    feed: 'music', source: 'campus', becauseArtist: 'Charli XCX',
    desc: 'Contemporary, jazz and lyrical pieces set to a pop-forward soundtrack. The biggest dance night of the semester.',
    dj: { name: 'Mixed by GUDC artistic director', genre: 'Pop · electronic' },
  }),
  ev('jawani', 'SAT', '9 PM', 'GU Jawani Bhangra Night', 'GU Jawani · Bollywood/bhangra', 'Yates Field House', 210, 82, 'dance', G.pink, {
    feed: 'music', source: 'campus', becauseArtist: 'Diljit Dosanjh',
    desc: 'Bhangra, Bollywood and the dhol until midnight. Open floor after the team set.',
    dj: { name: 'DJ Dhol Foundation', genre: 'Bhangra · Bollywood · Punjabi' },
  }),
  ev('jazz', 'TONIGHT', '9 PM', 'GU Jazz Ensemble · Late Set', 'Georgetown Jazz Ensemble', 'Sellinger Lounge', 88, 91, 'jazz', G.navy, {
    feed: 'music', source: 'campus', becauseArtist: 'Robert Glasper',
    desc: 'Standards and student arrangements in a low-lit lounge. Two sets, no cover.',
    dj: { name: 'Live · GU Jazz Ensemble', genre: 'Jazz · neo-soul' },
  }),
  ev('orch', 'SAT', '3 PM', 'University Orchestra Matinee', 'Georgetown University Orchestra', 'Gaston Hall', 120, 70, 'ensemble', G.forest, {
    feed: 'music', source: 'campus', becauseArtist: 'Max Richter',
    desc: 'Fall program: Dvořák and a new student-composed overture. Free for students.',
  }),
  // ============ MUSIC · City · DC ============
  ev('madams', 'TONIGHT', '9 PM', 'Live Blues & Soul', "Madam's Organ · Adams Morgan", '2461 18th St NW', 240, 89, 'live', G.crimson, {
    feed: 'music', source: 'city', city: true, becauseArtist: 'Leon Bridges', nudgedBy: 'Jordan K.',
    desc: 'Adams Morgan institution. House blues band downstairs, soul DJ upstairs. 21+ after 10, student ID gets you $5 off.',
    dj: { name: "Madam's Organ house band", genre: 'Blues · soul · funk' },
  }),
  ev('blues', 'FRI', '8 PM', 'Blues Alley Jazz', 'Blues Alley · Georgetown', '1073 Wisconsin Ave NW', 96, 85, 'jazz', G.smoke, {
    feed: 'music', source: 'city', city: true, becauseArtist: 'SZA',
    desc: "DC's historic supper-club jazz room, a few blocks from the front gates. Two seatings — reserve ahead.",
    dj: { name: 'Touring quartet · two sets', genre: 'Jazz · bebop' },
  }),
  ev('songbyrd', 'SAT', '8 PM', 'Local Artists Live', 'Songbyrd · Union Market', '540 Penn St NE', 180, 83, 'live', G.sunset, {
    feed: 'music', source: 'city', city: true, becauseArtist: 'Clairo',
    desc: 'Four rising DC bands, one stage. Indie, bedroom-pop and shoegaze from the DMV scene.',
    dj: { name: 'Between sets: Songbyrd resident', genre: 'Indie · bedroom pop' },
  }),
  ev('flash', 'SAT', '11 PM', 'Friday DJ Set', 'Flash · Atlas District', '645 Florida Ave NW', 320, 78, 'djset', G.plum, {
    feed: 'music', source: 'city', city: true, becauseArtist: 'Fred again..',
    desc: 'Late-night house and techno in DC\'s best sound room. Doors 11, set til close. 21+.',
    dj: { name: 'Guest: international touring DJ', genre: 'House · techno' },
  }),
  // ============ MUSIC · cross-campus (shared) ============
  ev('howard-show', 'SAT', '7 PM', 'Showtime Marching Band Jam', 'Howard "Showtime" Marching Band', 'Howard · Burr Gymnasium', 540, 81, 'ensemble', G.crimson, {
    feed: 'music', source: 'shared', origin: 'howard', becauseArtist: 'Beyoncé',
    desc: 'Howard\'s legendary marching band opens rehearsal to the DMV. Drumline battles, brass features, and the dancers. Shared with Georgetown by the Howard organizers.',
    dj: { name: 'Live · Showtime drumline', genre: 'Marching · funk · go-go' },
  }),
  ev('gw-vinyl', 'TONIGHT', '8 PM', 'Vinyl Listening Club', 'GW Records · student label', 'GW · District House', 72, 87, 'live', G.buff, {
    feed: 'music', source: 'shared', origin: 'gw', becauseArtist: 'Frank Ocean',
    desc: 'GW\'s student label spins a full album front-to-back on vinyl, then opens the floor. This week: Blonde. Shared with other campuses.',
    dj: { name: 'GW Records crew', genre: 'Soul · alt-R&B' },
  }),
  ev('howard-afro', 'SAT', '10 PM', 'Afrobeats Night', 'Howard CASCADE', 'Howard · Blackburn Center', 410, 80, 'djset', G.jade, {
    feed: 'music', source: 'shared', origin: 'howard', becauseArtist: 'Burna Boy',
    desc: 'Afrobeats, amapiano and dancehall til late. Howard\'s CASCADE opens the list to GW and Georgetown.',
    dj: { name: 'DJ from WHBC', genre: 'Afrobeats · amapiano' },
  }),
  // ============ EVERYTHING ELSE · non-music campus ============
  ev('mixer', 'TODAY', '11 AM', 'GUASFCU Member Mixer', 'GUASFCU · student credit union', 'Leavey 4', 68, null, 'prepro', G.cobalt, {
    feed: 'other', source: 'campus', invited: true,
    desc: 'Members + alums in one room. Officer Q&A, coffee + bagels from The Corp, and next semester\'s recruitment timeline.',
  }),
  ev('sae', 'TONIGHT', '9 PM', 'SAE Brotherhood Lunch', 'Sigma Alpha Epsilon', 'SAE House · O St', 44, null, 'greek', G.navy, {
    feed: 'other', source: 'campus', invited: true, inviteOnly: true,
    desc: 'Closed brotherhood dinner at the O St house. Brothers only — no plus-ones this week.',
  }),
  ev('lasa', 'TODAY', '1 PM', 'LASA Heritage Tabling', 'Latin American Student Assn.', 'Red Square', 52, null, 'culture', G.sunset, {
    feed: 'other', source: 'campus',
    desc: 'LASA officers in Red Square with flags, the heritage-seminar syllabus, and cafecito until the thermos runs out.',
  }),
  ev('hoya', 'TONIGHT', '8 PM', 'The Hoya · Newsroom Open House', 'The Hoya · student newspaper', 'Leavey 421', 30, null, 'media', G.smoke, {
    feed: 'other', source: 'campus', nudgedBy: 'Rae M.',
    desc: 'Pitch a story, meet the desk editors, see how the paper closes on a Tuesday night.',
  }),
  ev('csj', 'TODAY', '3 PM', 'DC Schools Tutoring', 'DC Schools Project · CSJ', 'CSJ · Poulton Hall', 38, null, 'service', G.forest, {
    feed: 'other', source: 'campus',
    desc: 'Weekly ESL tutoring with DC families. Training provided — drop in for the orientation.',
  }),
  ev('gusa', 'TONIGHT', '8:30 PM', 'GUSA Town Hall', 'Georgetown Student Association', 'HFSC Social Room', 64, null, 'campus', G.charcoal || G.smoke, {
    feed: 'other', source: 'campus',
    desc: 'Open mic with the exec. Budget, dining, and the dorm Wi-Fi everyone keeps complaining about.',
  }),
];

// ── time helpers (Day = before 8 PM, Night = 8 PM+) ────────
const hourOf = (t: string) => {
  const m = /(\d+)(?::(\d+))?\s*(AM|PM)/i.exec(t || '');
  if (!m) return 0;
  let h = parseInt(m[1], 10); const ap = m[3].toUpperCase();
  if (ap === 'AM') return h === 12 ? 0 : h;
  return h === 12 ? 12 : h + 12;
};
const isNight = (t: string) => hourOf(t) >= 20;

// ── Event views (same scope as data above) ──
const useStateEV = useState;

// default "club" context for the create sheet (the user hosts The Phantoms)
const MY_CLUB = {
  id: 'phantoms', name: 'The Phantoms', memberCount: 96,
  groups: [
    { id: 'g1', name: 'Officers', memberIds: ['1','2','3','4'] },
    { id: 'g2', name: 'Soprano Section', memberIds: ['1','5','6'] },
    { id: 'g3', name: 'Bass Section', memberIds: ['2','7','8'] },
    { id: 'g4', name: 'Alumni', memberIds: ['9','10','11','12','13'] },
  ],
};

// ── Card header pills ──────────────────────────────────────
function HeaderChips({ e, open }: any) {
  return (
    <div className="header-chips">
      {e.inviteOnly && <div className="invite-only-pill"><EVI.Lock style={{ width: 10, height: 10 }} /> Invite only</div>}
      {e.invited && !e.inviteOnly && <div className="invited-pill"><EVI.Invite style={{ width: 11, height: 11 }} /> Invited</div>}
      {e.nudgedBy && !e.invited && <div className="invited-pill">⚡ Nudged</div>}
      {e.city && <div className="city-pill"><span className="cd" /> City · DC</div>}
      {open && <div className="reach-pill"><EVI.Globe style={{ width: 10, height: 10 }} /> Open to GW · Howard</div>}
      {!e.invited && e.match != null && <div className="match">{e.match}% match</div>}
    </div>
  );
}

function EventCard({ e, open, myRsvp, onOpen, onRsvp }: any) {
  return (
    <div className={'event-card' + (e.source === 'shared' ? ' is-shared' : '')} onClick={onOpen}>
      <div className="header" style={{ background: e.color }}>
        <div className="when-chip">{e.day} · {e.time}</div>
        <HeaderChips e={e} open={open} />
      </div>
      {e.source === 'shared' && (
        <div className="origin-strip">
          <span className="od" style={{ background: SCHOOLS[e.origin].dot }} />
          {SCHOOLS[e.origin].label}
        </div>
      )}
      <div className="body">
        <div className="name">{e.name}</div>
        <div className="host">{e.host}</div>
        <div className="venue">{e.venue}</div>
        <div className="footer">
          <span className="tag" style={{ background: e.tagBg, color: e.tagFg }}>{e.tag} · {e.going} going</span>
          <button className={'rsvp' + (myRsvp ? ' rsvp-' + myRsvp : '')} onClick={(ev) => { ev.stopPropagation(); onRsvp(e.id); }}>
            {myRsvp === 'yes' ? <React.Fragment><EVI.Check /> Going</React.Fragment>
              : myRsvp === 'maybe' ? 'Maybe'
              : myRsvp === 'no' ? "Can't go" : 'RSVP'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── RSVP popup (Yes / Maybe / No) ──────────────────────────
function RsvpPopup({ event, current, onPick, onClose }: any) {
  return (
    <React.Fragment>
      <div className="rsvp-veil" onClick={onClose} />
      <div className="rsvp-popup">
        <div className="rsvp-popup-eyebrow">RSVP</div>
        <div className="rsvp-popup-title">{event.name}</div>
        <div className="rsvp-popup-when">{event.day} · {event.time} · {event.venue}</div>
        <div className="rsvp-options">
          <button className={'rsvp-opt yes' + (current === 'yes' ? ' on' : '')} onClick={() => onPick('yes')}>
            <span className="dot"><EVI.Check /></span><div><div className="t">Yes</div><div className="s">I'm going</div></div>
          </button>
          <button className={'rsvp-opt maybe' + (current === 'maybe' ? ' on' : '')} onClick={() => onPick('maybe')}>
            <span className="dot">?</span><div><div className="t">Maybe</div><div className="s">Get a reminder · still deciding</div></div>
          </button>
          <button className={'rsvp-opt no' + (current === 'no' ? ' on' : '')} onClick={() => onPick('no')}>
            <span className="dot"><EVI.X /></span><div><div className="t">No</div><div className="s">Can't make it</div></div>
          </button>
        </div>
        <button className="rsvp-popup-close" onClick={onClose}>Cancel</button>
      </div>
    </React.Fragment>
  );
}

// ── Member feed ────────────────────────────────────────────
const SOURCE_GROUPS = [
  { id: 'campus', label: 'On campus' },
  { id: 'city', label: 'City · DC' },
  { id: 'shared', label: 'Shared with Georgetown' },
];

function EventsMemberView({ isOpen, rsvps, onRsvp, onOpenEvent }: any) {
  const [filter, setFilter] = useStateEV('All');
  const [scope, setScope] = useStateEV('all');

  const segEvents = EVENTS;
  // categories present → filter chips, scoped to segment
  const cats: string[] = [];
  segEvents.forEach((e: any) => { if (!cats.includes(e.tag)) cats.push(e.tag); });
  const FILTERS = ['All', ...cats];

  const visibleAll = segEvents.filter(e => !e.inviteOnly || e.invited);
  const invitedSet = visibleAll.filter(e => e.invited || e.nudgedBy);
  const visible = (scope === 'invited' ? invitedSet : visibleAll)
    .filter(e => filter === 'All' || e.tag === filter)


  const renderCard = (e) => (
    <EventCard key={e.id} e={e} open={isOpen(e)} myRsvp={rsvps[e.id]} onOpen={() => onOpenEvent(e.id)} onRsvp={onRsvp} />
  );

  return (
    <div className="screen-fade">
      <div className="editorial-header" style={{ paddingTop: 'max(env(safe-area-inset-top, 56px), 56px)' }}>
        <div className="eyebrow"><span className="dot" /> Campus · Georgetown</div>
        <h1>
          <React.Fragment>Everything else<br/>on campus.</React.Fragment>
        </h1>
        <p className="sub">
          Greek, pre-pro, service, media and campus life. Same cards, no soundtrack.
        </p>
      </div>

      <div className="scope-toggle">
        <button className={scope === 'all' ? 'active' : ''} onClick={() => setScope('all')}>All events<span className="ct">{visibleAll.length}</span></button>
        <button className={scope === 'invited' ? 'active' : ''} onClick={() => setScope('invited')}>
          <EVI.Invite style={{ width: 14, height: 14 }} /> Invited<span className="ct accent">{invitedSet.length}</span>
        </button>
      </div>

      <div className="filter-row">
        {FILTERS.map(f => (
          <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      <div className="count-line">
        {visible.length} {visible.length === 1 ? 'event' : 'events'}
        {scope === 'invited' ? ' · invited & nudged' : ''}{filter !== 'All' ? ' · ' + filter : ''}
      </div>

      {/* Flat grid. */}
      <div className="event-grid">
        {visible.map(renderCard)}
        {visible.length === 0 && <EmptyState filter={filter} scope={scope} />}
      </div>
      <div style={{ height: 24 }} />
    </div>
  );
}

function EmptyState({ filter, scope }: any) {
  return (
    <div className="empty-events">
      <div className="ttl">{scope === 'invited' ? 'Nothing you’re invited to' : 'No '}{filter === 'All' ? (scope === 'invited' ? '' : 'events') : filter + ' events'} yet.</div>
      <div className="sub">{scope === 'invited' ? 'Invites and nudges from people you follow show up here.' : 'Try another filter or segment.'}</div>
    </div>
  );
}

// ── Event detail ───────────────────────────────────────────
function EventDetailView({ e, open, onToggleReach, onBack }: any) {
  const [rsvp, setRsvp] = useStateEV<any>(null);
  const sampleNames = ['Maya A.', 'Jordan P.', 'Riya S.', 'Diego R.', 'Sofia H.', 'Theo K.'];
  const canShare = !e.inviteOnly;

  return (
    <div className="screen-fade event-detail">
      <div className="ev-hero" style={{ background: e.color }}>
        <button className="ev-back icon-btn" onClick={onBack} aria-label="Back"><EVI.Back /></button>
        <div className="ev-actions">{!e.inviteOnly && <button className="icon-btn"><EVI.Share /></button>}</div>
        <div className="ev-hero-bottom">
          <div className="ev-when">{e.day} · {e.time}</div>
          <h1 className="ev-title">{e.name}</h1>
        </div>
      </div>

      <div className="ev-body">
        {/* pills */}
        <div className="ev-pill-row">
          {e.city && <span className="ev-pill city"><span className="od" style={{ background: '#a13d99' }} /> City · DC</span>}
          {e.source === 'shared' && <span className="ev-pill origin"><span className="od" style={{ background: SCHOOLS[e.origin].dot }} /> {SCHOOLS[e.origin].label}</span>}
          {open && <span className="ev-pill reach"><EVI.Globe style={{ width: 11, height: 11 }} /> Open to GW · Howard</span>}
          {e.match != null && <span className="ev-pill match">{e.match}% match</span>}
        </div>

        {e.inviteOnly && (
          <div className="ev-banner invite-only">
            <span className="ic"><EVI.Lock style={{ width: 14, height: 14 }} /></span>
            <div><div className="ttl">Invite only</div><div className="sub">Hidden from the public feed · not shareable</div></div>
          </div>
        )}
        {e.invited && !e.inviteOnly && (
          <div className="ev-banner">
            <span className="ic"><EVI.Invite style={{ width: 14, height: 14 }} /></span>
            <div><div className="ttl">You're invited</div><div className="sub">{e.host} added you to the guest list.</div></div>
          </div>
        )}
        {e.nudgedBy && !e.invited && (
          <div className="ev-banner">
            <span className="ic">⚡</span>
            <div><div className="ttl">{e.nudgedBy} nudged you</div><div className="sub">Someone you follow wants you here.</div></div>
          </div>
        )}

        <div className="ev-meta">
          <div className="row"><div className="ic"><EVI.Group /></div><div><div className="lbl">Host</div><div className="val">{e.host}</div></div></div>
          <div className="row"><div className="ic"><EVI.Calendar /></div><div><div className="lbl">When</div><div className="val">{e.day} · {e.time}</div></div></div>
          <div className="row"><div className="ic"><EVI.Globe /></div><div><div className="lbl">Where</div><div className="val">{e.venue}</div></div></div>
        </div>

        {e.desc && (
          <div className="ev-section">
            <div className="ev-section-h"><span>About</span></div>
            <p className="ev-desc">{e.desc}</p>
          </div>
        )}

        {e.dj && (
          <div className="ev-section">
            <div className="ev-section-h"><span>Soundtrack</span></div>
            <div className="ev-dj">
              <div className="ev-dj-art" style={{ background: e.color }}><EVI.Play style={{ width: 18, height: 18, color: '#fff' }} /></div>
              <div className="meta"><div className="t">{e.dj.name}</div><div className="a">{e.dj.genre}</div></div>
              <button className="ev-dj-listen">Listen</button>
            </div>
          </div>
        )}

        {/* taste-Match — when synced */}
        {e.match != null && (
          <div className="ev-section">
            <div className="ev-section-h"><span>Your taste match</span><span className="going-count">{e.match}%</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, background: 'var(--orange-soft)' }}>
              {e.becauseArtist && <div style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, backgroundImage: `url(${resUrl(e.becauseArtist === 'Frank Ocean' ? 'frankBlond' : e.becauseArtist === 'SZA' ? 'szaSaturn' : e.becauseArtist === 'Sabrina Carpenter' ? 'sabrina' : e.becauseArtist === 'Phoebe Bridgers' ? 'billie' : 'kendrick')})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />}
              <div style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.4 }}>
                Strong match — <b>because you listen to {e.becauseArtist}</b>{e.becauseArtist ? '.' : '.'} This room skews your sound.
              </div>
            </div>
          </div>
        )}

        {/* Going */}
        <div className="ev-section">
          <div className="ev-section-h"><span>Going</span><span className="going-count">{e.going}</span></div>
          <div className="ev-going">
            <div className="ev-going-stack">
              {sampleNames.map((nm, i) => (
                <div key={i} className="avatar-mini" style={{ background: avatarBg(nm), marginLeft: i === 0 ? 0 : -10, border: '2px solid #fff', zIndex: 10 - i }}>{initials(nm)}</div>
              ))}
            </div>
            <div className="ev-going-text"><b>{sampleNames[0]}</b>, <b>{sampleNames[1]}</b>, and {e.going - 2} others</div>
          </div>
        </div>

        {/* Host: cross-campus reach */}
        <div className="ev-section">
          <div className="ev-section-h"><span>Campus reach</span><span style={{ fontSize: 11, color: 'rgba(20,17,13,0.4)', fontFamily: 'var(--h-font)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Host</span></div>
          {canShare ? (
            <div className="reach-card">
              <div className={'reach-opt' + (!open ? ' on' : '')} onClick={() => onToggleReach(e, false)}>
                <span className="rdot">{!open && <EVI.Check />}</span>
                <div className="rinfo"><div className="t">This campus</div><div className="s">Georgetown only</div></div>
              </div>
              <div className={'reach-opt' + (open ? ' on' : '')} onClick={() => onToggleReach(e, true)}>
                <span className="rdot">{open && <EVI.Check />}</span>
                <div className="rinfo"><div className="t">Share with GW · Howard</div><div className="s">Shows in their Music feeds too</div></div>
              </div>
            </div>
          ) : (
            <div className="reach-note warn"><EVI.Lock style={{ width: 12, height: 12, marginTop: 1 }} /> Invite-only events can't be shared cross-campus.</div>
          )}
        </div>

        <div style={{ height: 120 }} />
      </div>

      <div className="ev-footer">
        <div className="ev-rsvp-row">
          <button className={'ev-rsvp pass' + (rsvp === 'pass' ? ' on' : '')} onClick={() => setRsvp(rsvp === 'pass' ? null : 'pass')}>Pass</button>
          <button className={'ev-rsvp maybe' + (rsvp === 'maybe' ? ' on' : '')} onClick={() => setRsvp(rsvp === 'maybe' ? null : 'maybe')}>Maybe</button>
          <button className={'ev-rsvp going' + (rsvp === 'going' ? ' on' : '')} onClick={() => setRsvp(rsvp === 'going' ? null : 'going')}>
            {rsvp === 'going' ? <React.Fragment><EVI.Check /> Going</React.Fragment> : 'Going'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Create Event sheet (with Campus reach) ─────────────────
function CreateEventSheet({ club, onClose, onPublish }: any) {
  const [title, setTitle] = useStateEV('');
  const [date, setDate] = useStateEV('');
  const [time, setTime] = useStateEV('');
  const [venue, setVenue] = useStateEV('');
  const [desc, setDesc] = useStateEV('');
  const [songIdx, setSongIdx] = useStateEV(0);
  const [privacy, setPrivacy] = useStateEV('public');
  const [reach, setReach] = useStateEV('campus'); // campus | shared
  const [allMembers, setAllMembers] = useStateEV(true);
  const [pickedGroups, setPickedGroups] = useStateEV<Record<string, any>>({});

  const songs = [
    { t: 'Pyramids', a: 'Frank Ocean', cover: 'frankBlond' },
    { t: 'Saturn', a: 'SZA', cover: 'szaSaturn' },
    { t: 'Espresso', a: 'Sabrina Carpenter', cover: 'sabrina' },
    { t: 'Not Like Us', a: 'Kendrick Lamar', cover: 'kendrick' },
  ];
  const song = songs[songIdx % songs.length];
  const valid = title.trim() && date && time && venue.trim();
  const groups = club.groups;
  const inviteOnly = privacy === 'invite';
  const canShare = !inviteOnly;
  const effectiveReach = canShare ? reach : 'campus';

  const audienceCount = allMembers ? club.memberCount : (() => {
    const ids = new Set();
    groups.forEach(g => { if (pickedGroups[g.id]) g.memberIds.forEach(id => ids.add(id)); });
    return ids.size;
  })();

  function toggleGroup(id) {
    setPickedGroups(prev => { const next = { ...prev, [id]: !prev[id] }; if (Object.values(next).some(Boolean)) setAllMembers(false); return next; });
  }
  function toggleAll() { setAllMembers(v => { const next = !v; if (next) setPickedGroups({}); return next; }); }

  return (
    <React.Fragment>
      <div className="sheet-veil" onClick={onClose} />
      <div className="sheet">
        <div className="grabber" />
        <div className="head">
          <div>
            <div className="eyebrow-row"><span className="e-dot" /> New event · {club.name}</div>
            <h2>Set the scene</h2>
          </div>
          <button className="x" onClick={onClose}><EVI.X /></button>
        </div>

        <div className="body">
          <div className="field"><label>Event title</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Phantoms Fall Concert" /></div>
          <div className="field-row">
            <div className="field"><label>Date</label><input type="text" value={date} onChange={e => setDate(e.target.value)} placeholder="Fri Nov 14" /></div>
            <div className="field"><label>Start time</label><input type="text" value={time} onChange={e => setTime(e.target.value)} placeholder="8:00 PM" /></div>
          </div>
          <div className="field"><label>Venue</label><input type="text" value={venue} onChange={e => setVenue(e.target.value)} placeholder="Gaston Hall · Healy" /></div>
          <div className="field"><label>Description</label><textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="Doors at 7:30, no late seating…" /></div>

          <div className="field" style={{ gap: 10 }}>
            <label>Featured track</label>
            <div className="featured-song">
              <div className="art" style={{ backgroundImage: `url(${resUrl(song.cover)})` }} />
              <div className="meta"><div className="t">{song.t}</div><div className="a">{song.a}</div></div>
              <button className="swap" onClick={() => setSongIdx(songIdx + 1)}>Swap</button>
            </div>
          </div>

          <div className="field" style={{ gap: 10 }}>
            <label>Who can see this</label>
            <div className="opt-row">
              <button className={privacy === 'public' ? 'sel' : ''} onClick={() => setPrivacy('public')}><EVI.Globe /> Public</button>
              <button className={privacy === 'members' ? 'sel' : ''} onClick={() => setPrivacy('members')}><EVI.User style={{ width: 13, height: 13 }} /> Members</button>
              <button className={privacy === 'invite' ? 'sel' : ''} onClick={() => { setPrivacy('invite'); setReach('campus'); }}><EVI.Lock /> Invite only</button>
            </div>
          </div>

          {/* Campus reach — the cross-campus control */}
          <div className="field" style={{ gap: 8 }}>
            <label>Campus reach</label>
            <div className="reach-card">
              <div className={'reach-opt' + (effectiveReach === 'campus' ? ' on' : '')} onClick={() => setReach('campus')}>
                <span className="rdot">{effectiveReach === 'campus' && <EVI.Check />}</span>
                <div className="rinfo"><div className="t">This campus</div><div className="s">Georgetown only · default</div></div>
              </div>
              <div className={'reach-opt' + (effectiveReach === 'shared' ? ' on' : '') + (canShare ? '' : ' disabled')} onClick={() => canShare && setReach('shared')}>
                <span className="rdot">{effectiveReach === 'shared' && <EVI.Check />}</span>
                <div className="rinfo"><div className="t">Share with other campuses</div><div className="s">GW · Howard</div></div>
              </div>
            </div>
            {canShare ? (
              <div className="reach-note"><EVI.Globe style={{ width: 12, height: 12, marginTop: 1 }} /> Sharing makes this event visible in other schools' Music feeds.</div>
            ) : (
              <div className="reach-note warn"><EVI.Lock style={{ width: 12, height: 12, marginTop: 1 }} /> Invite-only events can't be shared cross-campus.</div>
            )}
          </div>

          {/* invite block */}
          <div className="invite-block">
            <div className="head-row"><span className="lbl">Who's invited</span><span style={{ fontFamily: 'var(--h-font)', fontSize: 11, fontWeight: 700, color: 'var(--orange)' }}>{audienceCount} people</span></div>
            <div className={'all-members-toggle' + (allMembers ? ' on' : '')} onClick={toggleAll}>
              <div className="check-box"><EVI.Check /></div>
              <div className="info"><div className="ttl">All {club.name} members</div><div className="sub">Auto-include everyone · {club.memberCount} people</div></div>
            </div>
            <div className="divider-or">Or pick groups</div>
            <div className="group-grid">
              {groups.map(g => (
                <button key={g.id} className={'group-chip' + (pickedGroups[g.id] ? ' on' : '')} onClick={() => toggleGroup(g.id)}>
                  <div className="gname"><span className="check-dot"><EVI.Check /></span>{g.name}</div>
                  <div className="gcount">{g.memberIds.length} members</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="footer">
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn ghost" style={{ flex: 1 }} onClick={onClose}>Save draft</button>
            <button className="btn" style={{ flex: 1.4 }} disabled={!valid} onClick={() => onPublish({ title, reach: effectiveReach })}>Publish event</button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

// ── Orchestrator ───────────────────────────────────────────
export function EventsScreen({ onTab }: any) {
  const [eventId, setEventId] = useStateEV<any>(null);
  const [sheetOpen, setSheetOpen] = useStateEV(false);
  const [reach, setReach] = useStateEV<Record<string, any>>({});
  const [rsvps, setRsvps] = useStateEV<Record<string, any>>({});
  const [rsvpForId, setRsvpForId] = useStateEV<any>(null);
  const [toast, setToast] = useStateEV<any>(null);

  const isOpen = (e) => (reach[e.id] !== undefined ? reach[e.id] : !!e.openTo);
  const toggleReach = (e, val) => {
    setReach(s => ({ ...s, [e.id]: val }));
    flash(val ? `“${e.name}” shared to GW · Howard` : `“${e.name}” set to Georgetown only`);
  };
  function flash(msg) { setToast(msg); setTimeout(() => setToast(null), 2600); }

  const detail = eventId ? EVENTS.find(x => x.id === eventId) : null;

  function pickRsvp(choice) { if (rsvpForId) setRsvps(prev => ({ ...prev, [rsvpForId]: choice })); setRsvpForId(null); }

  return (
    <div className="screen">
      <div className="scroll" key={detail ? 'd-' + eventId : 'events-main'}>
        {detail
          ? <EventDetailView e={detail} open={isOpen(detail)} onToggleReach={toggleReach} onBack={() => setEventId(null)} />
          : <EventsMemberView isOpen={isOpen} rsvps={rsvps} onRsvp={setRsvpForId} onOpenEvent={setEventId} />}
      </div>

      {!detail && <button className="create-fab" onClick={() => setSheetOpen(true)}><EVI.Plus /> Create event</button>}

      {sheetOpen && (
        <CreateEventSheet club={MY_CLUB} onClose={() => setSheetOpen(false)} onPublish={(p) => { setSheetOpen(false); flash(p.title ? `Published “${p.title}”${p.reach === 'shared' ? ' · shared to GW · Howard' : ''}` : 'Event published'); }} />
      )}

      {rsvpForId && (
        <RsvpPopup event={EVENTS.find(e => e.id === rsvpForId)} current={rsvps[rsvpForId]} onPick={pickRsvp} onClose={() => setRsvpForId(null)} />
      )}

      {toast && <div className="toast"><span className="ok"><EVI.Check /></span>{toast}</div>}

    </div>
  );
}


