// @ts-nocheck — faithful port of the offline "Ligo Home screen" bundle
/* ============================================================
   HomeScreen — the LIGO home interface (ported from the offline
   bundle: home-shared / home-normal / home-connection /
   home-wrapped / meetup-sheet). Three states managed internally:
     • normal      — daily pick + this-week teasers + news + near you
     • connection  — "Tonight's Reveal" sealed → carousel → summary
     • wrapped      — full-screen Wrapped story
   Reached via the "This week on Ligo" cards (no top toggle).
   Album art resolves to /public/artists. Animations live in
   app/home.css. The bottom bar is Events / Home / Profile.
   ============================================================ */
/* eslint-disable react/no-unescaped-entities, react/display-name, react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import { Icon as BaseIcon, LigoMark } from "@/components/Primitives";
import { BottomNav } from "@/components/BottomNav";
import { usePersistentState } from "@/lib/usePersistentState";
import { searchJordanCatalog } from "@/lib/jordan-catalog";
import { searchCharlotteCatalog } from "@/lib/charlotte-catalog";
import { searchColeCatalog } from "@/lib/cole-catalog";
import { searchCarolineCatalog } from "@/lib/caroline-catalog";
import { searchBennettCatalog } from "@/lib/bennett-catalog";
import { searchMaddieCatalog } from "@/lib/maddie-catalog";
import { searchAlessiaCatalog } from "@/lib/alessia-catalog";
import { searchSofiaCatalog } from "@/lib/sofia-catalog";
import { searchMarcusCatalog } from "@/lib/marcus-catalog";
import { USERS } from "@/lib/users";
import { useConnectionNight } from "@/hooks/useConnectionNight";
import { useDailyReveal } from "@/hooks/useDailyReveal";

// useState/useEffect aliases the bundle used per-file
const useStateS = useState, useStateN = useState, useStateC = useState, useStateW = useState, useStateM = useState;
const useEffectS = useEffect, useEffectN = useEffect;

// extend the icon registry locally (shared adds Eye/EyeOff/Spark/Vibe)
const Icon: any = { ...BaseIcon };

// home-shared.jsx — pieces reused across the three home states
// Games icon (extends the registry), NewsStrip, AnsweredPrompt, Toast, ART map

// album art lives in ./art — single source of truth.
// In the standalone bundle these resolve to window.__resources blob URLs;
// in the live multi-file version they fall back to the on-disk path.
const ART = {
  taylor: '/artists/taylor.png',
  sabrina: '/artists/sabrina.png',
  sza: '/artists/sza-saturn.png',
  frank: '/artists/frank-blond.png',
  kendrick: '/artists/kendrick.png',
  chappell: '/artists/chappell.png',
  billie: '/artists/billie.png',
};

// Extra glyphs (2px round-stroke house style) used by the restyled home
Icon.EyeOff = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3.5-7 10-7c1.6 0 3 .3 4.2.9M22 12s-3.5 7-10 7c-1.6 0-3-.3-4.2-.9" />
    <path d="M9.5 9.6A3 3 0 0014.4 14.5M3 3l18 18" />
  </svg>
);
// Spark — romantic connection (4-point sparkle)
Icon.Spark = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3c.5 4 1.5 5 5.5 5.5C13.5 9 12.5 10 12 14c-.5-4-1.5-5-5.5-5.5C10.5 8 11.5 7 12 3z" />
    <path d="M18.5 14.5c.3 2 .8 2.5 2.5 2.8-1.7.3-2.2.8-2.5 2.7-.3-1.9-.8-2.4-2.5-2.7 1.7-.3 2.2-.8 2.5-2.8z" />
  </svg>
);
// Vibe — friendly connection (soundwave)
Icon.Vibe = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 11v2M8 8v8M12 5v14M16 8v8M20 11v2" />
  </svg>
);
// Eye — reveal
Icon.Eye = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" />
  </svg>
);

// ── "Your artists this week" — horizontal music-news strip ──
const NEWS = [
  { art: '/covers/drake-iceman-coverart.jpeg', src: 'Breaking', when: '1h', head: 'Drake dropped a 43-track, 3-album trifecta. Campus is still processing.' },
  { art: '/artists/keinemusik-spotify-propic.jpeg', src: 'Ligo Radar', when: '3h', head: 'Keinemusik just added a DC date — Echostage, two nights' },
  { art: '/covers/futuremixtapepluto-coverart.jpeg', src: 'Campus chart', when: '5h', head: "Future's surprise loosie is already #1 at Georgetown" },
  { art: '/covers/ANOTR-onatrip-coverart.jpeg', src: 'Ligo Radar', when: '1d', head: 'ANOTR is the most-added artist on campus this week' },
  { art: '/artists/prospa-profile.jpeg', src: 'Pitchfork', when: '2d', head: 'Prospa teased a B-side. Georgetown is already arguing.' },
];

const CHARLOTTE_NEWS = [
  { art: '/covers/tswift-1989-coverart.jpeg', src: 'Breaking', when: '1h', head: 'Taylor Swift announced a surprise acoustic set. Group chats are panicking.' },
  { art: '/covers/sabrinashortnsweet-coverart.jpeg', src: 'Ligo Radar', when: '3h', head: 'Sabrina Carpenter is trending at Georgetown after last night.' },
  { art: '/covers/szasos-coverart.jpeg', src: 'Campus chart', when: '5h', head: '"Snooze" re-entered the top 10 on campus this morning.' },
  { art: '/covers/frankocean-blonde.jpeg', src: 'Ligo Radar', when: '1d', head: 'Frank Ocean rumors are circulating again. Don\'t get your hopes up.' },
  { art: '/artists/beyonce-profile.jpeg', src: 'Pitchfork', when: '2d', head: 'Beyoncé Renaissance visuals teased (again). We\'re still waiting.' },
];

const COLE_NEWS = [
  { art: '/artists/travisscott-profile.jpeg', src: 'Tour', when: '1h', head: 'Travis Scott announced 4 new dates for the Utopia tour.' },
  { art: '/covers/futurewedonttrustyou-coverart.jpeg', src: 'Campus chart', when: '4h', head: "Future's WE DON'T TRUST YOU hit #1 in your network." },
  { art: '/covers/zachbryanamericanheartbreak-coverart.jpeg', src: 'Ligo Radar', when: '6h', head: '3 of your friends saved Something in the Orange.' },
  { art: '/artists/drake-profile.jpeg', src: 'Breaking', when: '8h', head: 'Drake dropped a new single, Search & Rescue.' },
  { art: '/covers/morganwallenonethingatatime-coverart.jpeg', src: 'Campus chart', when: '1d', head: "Morgan Wallen's Last Night is trending at Georgetown." },
];

const CAROLINE_NEWS = [
  { art: '/covers/meganlucky-coverart.jpeg', src: 'Tour', when: '1h', head: 'Megan Moroney announces a second night at The Anthem.' },
  { art: '/artists/zachbryan-profile.jpeg', src: 'Ligo Radar', when: '3h', head: 'Zach Bryan teased a new single on Instagram.' },
  { art: '/covers/morganwallenonethingatatime-coverart.jpeg', src: 'Campus chart', when: '5h', head: '"Last Night" is the #1 pregame song at Georgetown right now.' },
  { art: '/artists/kaceymusgraves-profile.jpeg', src: 'Breaking', when: '12h', head: 'Kacey Musgraves dropped surprise acoustic tracks.' },
  { art: '/covers/noahkahanstickseason-coverart.jpeg', src: 'Pitchfork', when: '1d', head: 'Noah Kahan named most-streamed folk artist of the semester.' },
];

const MADDIE_NEWS = [
  { art: '/covers/brat-coverart.jpeg', src: 'Tour', when: '1h', head: 'Charli XCX announces Brat fall tour dates.' },
  { art: '/artists/pinkpantheress-profile.jpeg', src: 'Ligo Radar', when: '3h', head: 'PinkPantheress surprise drops new snippet on TikTok.' },
  { art: '/artists/tameimpala-profile.jpeg', src: 'Campus chart', when: '5h', head: 'Tame Impala rumors are circulating for a new album.' },
  { art: '/artists/the1975-profile.jpeg', src: 'Breaking', when: '12h', head: 'The 1975\'s Matty Healy says something controversial again.' },
  { art: '/artists/addisonrae-profile.jpeg', src: 'Pitchfork', when: '1d', head: 'Addison Rae redefines the pop landscape. Yes, really.' },
];

const BENNETT_NEWS = [
  { art: '/covers/kencarsonagreatchaos-coverart.jpeg', src: 'Tour', when: '1h', head: 'Ken Carson adds D.C. stop to A Great Chaos tour.' },
  { art: '/covers/wholelottared-coverart.jpeg', src: 'Campus chart', when: '3h', head: 'Playboi Carti dominates Georgetown pregame playlists.' },
  { art: '/artists/gunnaprofile.jpeg', src: 'Ligo Radar', when: '5h', head: 'fukumean is trending up heading into the weekend.' },
  { art: '/covers/destroylonelynsultra-coverart.jpeg', src: 'Breaking', when: '12h', head: 'Destroy Lonely teases NS+ (ULTRA) deluxe tracks.' },
  { art: '/covers/chrislake-yuma-coverart.jpeg', src: 'Ligo Radar', when: '1d', head: 'Chris Lake at Echostage is officially sold out.' },
];

const MARCUS_NEWS = [
  { art: '/artists/tameimpala-profile.jpeg', src: 'Ligo Radar', when: '1h', head: 'Tame Impala hints at an upcoming B-sides compilation.' },
  { art: '/artists/MGMT-profile.jpeg', src: 'Campus chart', when: '3h', head: '"Electric Feel" takes over the Georgetown late night aux.' },
  { art: '/artists/freddiegibbs-profile.jpeg', src: 'Tour', when: '5h', head: 'Freddie Gibbs announces a surprise East Coast run.' },
  { art: '/artists/MK-profile.jpeg', src: 'Breaking', when: '12h', head: 'MK drops a new house anthem perfect for the pregame.' },
  { art: '/artists/fleetwoodmac-profike.jpeg', src: 'Pitchfork', when: '1d', head: 'Fleetwood Mac Rumours experiences a campus resurgence.' },
];

const ALESSIA_NEWS = [
  { art: '/covers/lanadelreyultraviolence-coverart.jpeg', src: 'Rumor', when: '2h', head: 'Lana Del Rey spotted recording in London studio.' },
  { art: '/covers/adamport-planet9-coverart.jpeg', src: 'Tour', when: '4h', head: 'Adam Port announces pop-up set in D.C. this Friday.' },
  { art: '/artists/theweekndprofile.jpeg', src: 'Breaking', when: '6h', head: 'The Weeknd teases final chapter of his trilogy.' },
  { art: '/artists/peggygou-profile.jpeg', src: 'Fashion', when: '14h', head: 'Peggy Gou launches new streetwear collaboration.' },
  { art: '/artists/chrisstussy-profile.jpeg', src: 'Ligo Radar', when: '1d', head: 'Chris Stussy tracks are trending on campus tonight.' },
];

function NewsStrip() {
  const [activeUserId] = usePersistentState('ligo:active_user', 'jordan');
  const newsItems = activeUserId === 'charlotte' ? CHARLOTTE_NEWS : activeUserId === 'cole' ? COLE_NEWS : activeUserId === 'caroline' ? CAROLINE_NEWS : activeUserId === 'bennett' ? BENNETT_NEWS : activeUserId === 'maddie' ? MADDIE_NEWS : activeUserId === 'marcus' ? MARCUS_NEWS : activeUserId === 'alessia' ? ALESSIA_NEWS : NEWS;
  return (
    <div>
      <div style={{ padding: '24px 22px 12px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <h2 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 600, fontSize: 18, letterSpacing: '-0.015em', color: '#14110D', margin: 0 }}>Your artists this week</h2>
        <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 12, fontWeight: 600, color: '#F97316' }}>See all</span>
      </div>
      <div style={{
        display: 'flex', gap: 12, overflowX: 'auto', padding: '0 22px 4px',
        scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
      }}>
        {newsItems.map((n, i) => (
          <div key={i} style={{
            flex: '0 0 auto', width: 208, background: '#fff', borderRadius: 18,
            border: '1px solid rgba(20,17,13,0.05)',
            boxShadow: '0 1px 0 rgba(20,17,13,0.02), 0 6px 18px -12px rgba(20,17,13,0.08)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: 116, backgroundImage: `url(${n.art})`, backgroundSize: 'cover', backgroundPosition: 'center',
              position: 'relative',
            }}>
              <span style={{
                position: 'absolute', top: 10, left: 10,
                fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 9, fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase', color: '#fff',
                background: 'rgba(10,9,7,0.55)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                padding: '4px 8px', borderRadius: 99,
              }}>{n.src}</span>
            </div>
            <div style={{ padding: '12px 14px 14px' }}>
              <div style={{
                fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 600, fontSize: 14,
                lineHeight: 1.25, letterSpacing: '-0.01em', color: '#14110D', textWrap: 'pretty',
              }}>{n.head}</div>
              <div style={{ fontSize: 11, color: 'rgba(20,17,13,0.45)', marginTop: 8 }}>{n.when} ago</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Compact answered-prompt strip (today's locked text answer) ──
function AnsweredPrompt({ answer = 'Drake — What Did I Miss? (strictly Iceman)' }) {
  return (
    <div style={{ margin: '14px 22px 0' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14, padding: 14,
        borderRadius: 18, background: '#fff', border: '1px solid rgba(20,17,13,0.05)',
        boxShadow: '0 1px 0 rgba(20,17,13,0.02), 0 6px 18px -12px rgba(20,17,13,0.08)',
      }}>
        <span style={{ width: 44, height: 44, borderRadius: 99, flexShrink: 0, background: 'rgba(113,192,127,0.16)', color: '#2F7D3F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon.Check width="20" height="20" />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 10, fontWeight: 700,
            letterSpacing: '0.14em', textTransform: 'uppercase', color: '#2F7D3F',
          }}>Today's answer · locked in</div>
          <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 600, fontSize: 16, letterSpacing: '-0.015em', color: '#14110D', marginTop: 3, textWrap: 'balance' }}>
            "{answer}"
          </div>
          <div style={{ fontSize: 12, color: 'rgba(20,17,13,0.5)', marginTop: 2 }}>Reveal at 8pm · 1,204 Hoyas in</div>
        </div>
      </div>
    </div>
  );
}

// ── Toast (confirmation after sending a meetup invite) ──
function Toast({ show, children }) {
  return (
    <div style={{
      position: 'absolute', left: 22, right: 22, bottom: 104, zIndex: 80,
      transform: show ? 'translateY(0)' : 'translateY(20px)',
      opacity: show ? 1 : 0, pointerEvents: 'none',
      transition: 'opacity 220ms cubic-bezier(.2,.7,.2,1), transform 220ms cubic-bezier(.2,.7,.2,1)',
    }}>
      <div style={{
        background: '#14110D', color: '#fff', borderRadius: 16, padding: '14px 16px',
        display: 'flex', alignItems: 'center', gap: 10,
        boxShadow: '0 12px 30px -12px rgba(20,17,13,0.5)',
        fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 600, fontSize: 14,
      }}>
        <span style={{ width: 22, height: 22, borderRadius: 99, background: '#71C07F', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon.Check width="12" height="12" />
        </span>
        {children}
      </div>
    </div>
  );
}



// home-normal.jsx — Daily pick: open question + lockable answer + reveal flow

// ── Real-time countdowns — aligned to the clock in EASTERN TIME ──
// Everything is scheduled in America/New_York (campus is in DC), so every
// viewer sees the same countdown regardless of their device timezone.
// Daily reveal is 8:00 PM ET (the big countdown). The answer cutoff is 3 PM ET
// (a separate "lock yours before 3pm" note). Connections drop Fri 8 PM ET;
// wrapped drops Sun 12 PM ET. (Change these to reschedule.) 0 = Sun … 5 = Fri.
const REVEAL_HOUR = 20, REVEAL_MIN = 0;
const CONNECTION_DAY = 5, CONNECTION_HOUR = 20;
const WRAPPED_DAY = 0, WRAPPED_HOUR = 12;

const ET = "America/New_York";
const WD = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

// the current wall-clock in Eastern + ET's UTC offset right now (handles EST/EDT)
function easternParts(now) {
  const m = {};
  for (const p of new Intl.DateTimeFormat("en-US", {
    timeZone: ET, hour12: false, weekday: "short",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).formatToParts(now)) {
    if (p.type === "weekday") m.weekday = p.value;
    else if (p.type !== "literal") m[p.type] = parseInt(p.value, 10);
  }
  // ms ET is ahead of UTC (negative for the US): treat ET wall numbers as if
  // UTC, the gap from the real instant is the offset.
  m.offset = Date.UTC(m.year, m.month - 1, m.day, m.hour, m.minute, m.second) - now.getTime();
  return m;
}
// UTC timestamp for "ET date + addDays, at hour:minute"
function easternTarget(m, addDays, hour, minute) {
  return Date.UTC(m.year, m.month - 1, m.day + addDays, hour, minute, 0) - m.offset;
}
// next ET daily time (today, or tomorrow if already passed)
function nextDaily(hour, minute) {
  const now = new Date(), m = easternParts(now);
  let t = easternTarget(m, 0, hour, minute);
  if (t <= now.getTime()) t = easternTarget(m, 1, hour, minute);
  return t;
}
// next ET weekly day + time
function nextWeekly(weekday, hour, minute) {
  const now = new Date(), m = easternParts(now);
  let add = (weekday - WD[m.weekday] + 7) % 7;
  let t = easternTarget(m, add, hour, minute);
  if (t <= now.getTime()) t = easternTarget(m, add + 7, hour, minute);
  return t;
}
// live ms remaining to a target — resolved on the client only (no hydration
// mismatch) and recomputed every second so it tracks the real clock.
function useCountdown(makeTarget) {
  const [now, setNow] = useStateN(null);
  const target = React.useRef(0);
  useEffectN(() => {
    target.current = makeTarget();
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return now == null ? null : Math.max(0, target.current - now);
}
function fmtHMS(ms) {
  if (ms == null) return '··';
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return `${h}h ${String(m).padStart(2, '0')}m ${String(sec).padStart(2, '0')}s`;
}
function fmtDHM(ms) {
  if (ms == null) return '··';
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60);
  return d > 0 ? `${d}d ${h}h ${String(m).padStart(2, '0')}m` : `${h}h ${String(m).padStart(2, '0')}m`;
}
// reveal countdown → the big number in the daily-pick card (h m s, live)
function useReveal() {
  return fmtHMS(useCountdown(() => nextDaily(REVEAL_HOUR, REVEAL_MIN)));
}

const SUGGESTIONS = [
  'Mr. Brightside — non-negotiable',
  'Outkast raised me',
  'Stevie Wonder, every Sunday',
  'Linkin Park, no notes',
];

// the user's synced library is now powered by JORDAN_CATALOG

// ever-present, pulsing reveal countdown — recolors when you answer
function CountdownBar({ answered, time }) {
  const t = answered
    ? { card: 'cd-breathe-g', dot: 'cd-dot-g', dotBg: '#71C07F', bg: 'linear-gradient(160deg, rgba(113,192,127,0.18), rgba(245,215,131,0.10))', border: 'rgba(113,192,127,0.30)', accent: '#2F7D3F', big: '#1E6B33', eyebrow: "You're in · everyone reveals in", sub: '41 friends already locked in' }
    : { card: 'cd-breathe-o', dot: 'cd-dot-o', dotBg: '#F97316', bg: 'linear-gradient(160deg, rgba(249,115,22,0.16), rgba(245,215,131,0.12))', border: 'rgba(249,115,22,0.28)', accent: '#C2410C', big: '#9A3412', eyebrow: 'Everyone reveals in', sub: '847 answered · lock yours before 3pm' };
  return (
    <div style={{ margin: '14px 22px 0' }}>
      <div className={t.card} style={{ borderRadius: 22, padding: '18px 20px', background: t.bg, border: `1px solid ${t.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: t.accent }}>
            <span className={t.dot} style={{ width: 8, height: 8, borderRadius: 99, background: t.dotBg }} />
            {t.eyebrow}
          </span>
          {answered && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#2F7D3F' }}>
              <Icon.Check width="13" height="13" /> Locked
            </span>
          )}
        </div>
        <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 600, fontSize: 42, letterSpacing: '-0.03em', color: t.big, lineHeight: 1, margin: '10px 0 12px', fontVariantNumeric: 'tabular-nums' }}>{time}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <AvatarStack />
          <span style={{ fontSize: 12.5, color: t.accent, fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 600 }}>{t.sub}</span>
        </div>
      </div>
    </div>
  );
}

// two weekly-event teasers: this week's connections + last week's wrapped
function WeekTeasers({ onOpen }) {
  const conn = fmtDHM(useCountdown(() => nextWeekly(CONNECTION_DAY, CONNECTION_HOUR, 0)));
  const wrap = fmtDHM(useCountdown(() => nextWeekly(WRAPPED_DAY, WRAPPED_HOUR, 0)));
  const cards = [
    { key: 'connection', icon: Icon.Users, eyebrow: 'Connections', cta: "View this week's connections", drop: `Next drops in ${conn}`, accent: '#A13D99', dotBg: '#EA8CE1', bg: 'linear-gradient(160deg, rgba(234,140,225,0.16), rgba(234,140,225,0.05))', border: 'rgba(234,140,225,0.3)' },
    { key: 'wrapped', icon: Icon.Spark, eyebrow: 'Wrapped', cta: 'View last week’s wrapped', drop: `Next drops in ${wrap}`, accent: '#A07C00', dotBg: '#E9BF52', bg: 'linear-gradient(160deg, rgba(245,215,131,0.22), rgba(245,215,131,0.06))', border: 'rgba(245,215,131,0.45)' },
  ];
  return (
    <div>
      <div style={{ padding: '26px 22px 12px' }}>
        <h2 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 600, fontSize: 18, letterSpacing: '-0.015em', color: '#14110D', margin: 0 }}>This week on Ligo</h2>
      </div>
      <div style={{ padding: '0 22px', display: 'flex', gap: 12 }}>
        {cards.map(c => {
          const I = c.icon;
          return (
            <button key={c.key} onClick={() => onOpen(c.key)} style={{
              flex: 1, textAlign: 'left', cursor: 'pointer', border: `1px solid ${c.border}`, borderRadius: 20,
              padding: 16, background: c.bg, display: 'flex', flexDirection: 'column', transition: 'transform 0.12s ease',
            }} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: c.accent }}>
                <I width="14" height="14" /> {c.eyebrow}
              </span>
              <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 600, fontSize: 16, letterSpacing: '-0.015em', color: '#14110D', lineHeight: 1.2, margin: '12px 0 14px', textWrap: 'balance', flex: 1 }}>
                {c.cta}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 12, borderTop: `1px solid ${c.border}` }}>
                <span className="cd-tick" style={{ width: 7, height: 7, borderRadius: 99, background: c.dotBg, animation: 'ligo-pulse 1.8s ease-in-out infinite', flexShrink: 0 }} />
                <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 600, fontSize: 12, color: c.accent, fontVariantNumeric: 'tabular-nums' }}>{c.drop}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// progress timeline: Opens · Answered · Reveal
function Timeline({ answered }) {
  const node = (label, time, state) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, flexShrink: 0, width: 64 }}>
      <span style={{
        width: 16, height: 16, borderRadius: 99,
        background: state === 'done' ? '#F97316' : '#fff',
        border: state === 'done' ? '0' : '2px solid ' + (state === 'next' ? '#F97316' : 'rgba(20,17,13,0.2)'),
        boxShadow: state === 'done' ? '0 0 0 4px rgba(249,115,22,0.16)' : 'none',
      }} />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 12.5, color: '#14110D', letterSpacing: '-0.01em' }}>{time}</div>
        <div style={{ fontSize: 11, color: 'rgba(20,17,13,0.45)', marginTop: 1 }}>{label}</div>
      </div>
    </div>
  );
  const seg = (fill) => (
    <div style={{ flex: 1, height: 3, borderRadius: 99, background: 'rgba(20,17,13,0.1)', margin: '8px -6px 0', overflow: 'hidden' }}>
      <i style={{ display: 'block', height: '100%', width: fill ? '100%' : '0%', background: '#F97316', borderRadius: 99 }} />
    </div>
  );
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', padding: '22px 26px 0' }}>
      {node('Opens', '8:00a', 'done')}
      {seg(true)}
      {node('Answered', 'You', answered ? 'done' : 'next')}
      {seg(false)}
      {node('Reveal', '8:00p', 'pending')}
    </div>
  );
}

function DailyPick() {
  // persisted: your lock-in survives refreshes & revisits
  const [answered, setAnswered] = usePersistentState('ligo:daily:answered', false);
  const [answer, setAnswer] = usePersistentState('ligo:daily:answer', '');
  const [draft, setDraft] = useStateN('');
  const [focused, setFocused] = useStateN(false);
  const [activeUserId] = usePersistentState('ligo:active_user', 'jordan');
  const reveal = useReveal();
  const { loading, error, currentQuestion } = useDailyReveal(activeUserId);

  function lockIn() {
    if (!draft.trim()) return;
    setAnswer(draft.trim());
    setAnswered(true);
    setFocused(false);
  }

  function changeAnswer() {
    setDraft(answer || '');
    setAnswered(false);
    setFocused(true);
  }

  function pickSynced(row) {
    setDraft(`${row.title} — ${row.artist}`);
    setFocused(false);
  }

  const synced = activeUserId === 'charlotte' 
    ? searchCharlotteCatalog(draft, 8) 
    : activeUserId === 'cole'
    ? searchColeCatalog(draft, 8)
    : activeUserId === 'caroline'
    ? searchCarolineCatalog(draft, 8)
    : activeUserId === 'bennett'
    ? searchBennettCatalog(draft, 8)
    : activeUserId === 'alessia'
    ? searchAlessiaCatalog(draft, 8)
    : activeUserId === 'maddie'
    ? searchMaddieCatalog(draft, 8)
    : activeUserId === 'marcus'
    ? searchMarcusCatalog(draft, 8)
    : activeUserId === 'sofia'
    ? searchSofiaCatalog(draft, 8)
    : searchJordanCatalog(draft, 8);
  const showSynced = focused && !answered;

  return (
    <div>
      {/* ever-present, pulsing reveal countdown — changes when you answer */}
      <CountdownBar answered={answered} time={reveal} />

      {/* question card */}
      <div style={{ margin: '14px 22px 0' }}>
        <div style={{
          background: '#fff', borderRadius: 22, padding: '20px 20px 22px',
          border: '1px solid rgba(20,17,13,0.05)',
          boxShadow: '0 1px 0 rgba(20,17,13,0.02), 0 8px 24px -12px rgba(20,17,13,0.10)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{
              background: '#14110D', color: '#fff', fontFamily: 'Bricolage Grotesque, sans-serif',
              fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '5px 10px', borderRadius: 8,
            }}>Today</span>
            <span style={{
              fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 11,
              letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(20,17,13,0.4)',
            }}>Everyone answers</span>
          </div>
          {loading ? (
            <p style={{
              fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 500, fontSize: 17,
              lineHeight: 1.4, color: 'rgba(20,17,13,0.45)', margin: 0,
            }}>Loading today&apos;s question…</p>
          ) : error ? (
            <p style={{
              fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 500, fontSize: 17,
              lineHeight: 1.4, color: 'rgba(200,50,50,0.85)', margin: 0,
            }}>{error}</p>
          ) : (
            <h2 style={{
              fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 500, fontSize: 29,
              lineHeight: 1.12, letterSpacing: '-0.025em', color: '#14110D', textWrap: 'balance',
            }}>
              {currentQuestion?.question_text ?? 'Today\u2019s question is unavailable.'}
            </h2>
          )}

          {/* answer entry — only before locking */}
          {!answered && (
            <div style={{ marginTop: 18, position: 'relative', zIndex: 40 }}>
              <div className="answer-pill" style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 14,
                background: 'rgba(20,17,13,0.04)', border: '1px solid rgba(20,17,13,0.06)',
              }}>
                <Icon.Music width="18" height="18" style={{ color: 'rgba(20,17,13,0.35)', flexShrink: 0 }} />
                <input
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setTimeout(() => setFocused(false), 200)}
                  onKeyDown={e => e.key === 'Enter' && lockIn()}
                  placeholder="Name the artist or song…"
                  style={{
                    flex: 1, minWidth: 0, border: 0, outline: 0, background: 'transparent',
                    fontFamily: '-apple-system, sans-serif', fontSize: 15, color: '#14110D',
                  }}
                />
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, flexShrink: 0, padding: '4px 8px', borderRadius: 99, background: 'rgba(113,192,127,0.14)', color: '#2F7D3F', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  <span style={{ width: 5, height: 5, borderRadius: 99, background: '#44A96A' }} /> Synced
                </span>
              </div>

              {/* autofill from synced music */}
              {showSynced && (
                <div
                  role="listbox"
                  onMouseDown={(e) => e.preventDefault()}
                  style={{
                    marginTop: 10, background: '#fff', border: '1px solid rgba(20,17,13,0.07)', borderRadius: 14,
                    boxShadow: '0 8px 24px -12px rgba(20,17,13,0.14)', maxHeight: 280, overflowY: 'auto',
                    overflowX: 'hidden',
                  }}
                >
                  <div style={{ padding: '9px 13px 7px', display: 'flex', alignItems: 'center', gap: 7 }}>
                    <Icon.Music width="12" height="12" style={{ color: '#C2410C' }} />
                    <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(20,17,13,0.4)' }}>From your synced music</span>
                  </div>
                  {synced.length ? synced.map((row) => (
                    <button key={`${row.artist}-${row.title}-${row.album}`} type="button" onMouseDown={() => pickSynced(row)} style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 11, padding: '9px 13px', cursor: 'pointer',
                      border: 0, borderTop: '1px solid rgba(20,17,13,0.04)', background: 'transparent', textAlign: 'left',
                    }}>
                      <div style={{ width: 34, height: 34, borderRadius: 8, flexShrink: 0, backgroundImage: `url(${row.cover})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 600, fontSize: 14, color: '#14110D', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.title}</div>
                        <div style={{ fontSize: 12, color: 'rgba(20,17,13,0.5)', marginTop: 1 }}>{row.artist}</div>
                      </div>
                      <Icon.Plus width="16" height="16" style={{ color: '#F97316', flexShrink: 0 }} />
                    </button>
                  )) : (
                    <div style={{ padding: '4px 13px 12px', fontSize: 12.5, color: 'rgba(20,17,13,0.5)' }}>Not in your library — “{draft}” works too.</div>
                  )}
                </div>
              )}

              <button onClick={lockIn} disabled={!draft.trim()} style={{
                marginTop: 16, width: '100%', height: 50, border: 0, borderRadius: 14,
                cursor: draft.trim() ? 'pointer' : 'not-allowed',
                background: '#F97316', color: '#fff', opacity: draft.trim() ? 1 : 0.4,
                fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 600, fontSize: 16, letterSpacing: '-0.005em',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: draft.trim() ? '0 10px 22px -10px rgba(249,115,22,0.6)' : 'none',
                transition: 'opacity 0.2s ease',
              }}>Lock in your answer</button>
            </div>
          )}
        </div>
      </div>

      {/* answered → reveal flow */}
      {answered && (
        <div className="phase-fade">
          <Timeline answered={answered} />

          {/* locked answer */}
          <div style={{ margin: '12px 22px 0' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: 16, borderRadius: 18,
              background: '#fff', border: '1px solid rgba(20,17,13,0.05)',
              boxShadow: '0 1px 0 rgba(20,17,13,0.02), 0 6px 18px -12px rgba(20,17,13,0.08)',
            }}>
              <span style={{ width: 40, height: 40, borderRadius: 99, flexShrink: 0, background: 'rgba(113,192,127,0.16)', color: '#2F7D3F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon.Check width="18" height="18" />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(20,17,13,0.4)' }}>Your answer is locked in</div>
                <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 600, fontSize: 17, letterSpacing: '-0.015em', color: '#14110D', marginTop: 3, textWrap: 'balance' }}>"{answer}"</div>
              </div>
              <button type="button" onClick={changeAnswer} style={{
                border: 0, background: 'transparent', cursor: 'pointer', flexShrink: 0,
                fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 600, fontSize: 12.5, color: '#F97316',
              }}>Edit</button>
            </div>
          </div>

          {/* come back placeholder */}
          <div style={{ margin: '12px 22px 0' }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '20px 18px',
              borderRadius: 18, border: '1.5px dashed rgba(249,115,22,0.4)', background: 'rgba(249,115,22,0.03)',
              color: '#C2410C', textAlign: 'center',
            }}>
              <Icon.EyeOff width="18" height="18" style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 600, fontSize: 15, letterSpacing: '-0.01em', textWrap: 'balance' }}>Come back at 8pm to see everyone</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// overlapping avatar stack + "+38"
function AvatarStack() {
  const people = [
    { i: 'A', bg: '#E0584B' }, { i: 'J', bg: '#6C5CE0' }, { i: 'S', bg: '#3FA76B' }, { i: 'K', bg: '#E0A53F' },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {people.map((p, idx) => (
        <span key={idx} style={{
          width: 30, height: 30, borderRadius: 99, background: p.bg, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 12,
          border: '2px solid #FBEFDC', marginLeft: idx === 0 ? 0 : -10, position: 'relative', zIndex: idx,
        }}>{p.i}</span>
      ))}
      <span style={{
        width: 30, height: 30, borderRadius: 99, background: '#14110D', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 11,
        border: '2px solid #FBEFDC', marginLeft: -10, position: 'relative', zIndex: 5,
      }}>+38</span>
    </div>
  );
}

// ── Near you — small local-shows block ──
const SHOWS = [
  { name: 'Drake "Iceman" listening party', venue: 'Midnight Mug · on campus', when: 'Tonight 8:00', tag: 'Free', tagCls: 'green', art: '/covers/drake-iceman-coverart.jpeg' },
  { name: 'Deep house basement set', venue: 'Off campus', when: 'Fri 9:30', tag: '$5', tagCls: 'orange', art: '/artists/keinemusik-spotify-propic.jpeg' },
];
const CHARLOTTE_SHOWS = [
  { name: 'Taylor Swift Eras Tour Watch Party', venue: 'Leavey Center · on campus', when: 'Tonight 8:00', tag: 'Free', tagCls: 'green', art: '/covers/tswift-1989-coverart.jpeg' },
  { name: 'Sabrina Carpenter pre-game', venue: 'Off campus', when: 'Fri 9:30', tag: '$5', tagCls: 'orange', art: '/covers/sabrinashortnsweet-coverart.jpeg' },
];
const COLE_SHOWS = [
  { name: 'Travis Scott Utopia Tour', venue: 'Capital One Arena', when: 'Thu 8:00', tag: '$120', tagCls: 'orange', art: '/covers/travisscott-utopia.jpeg' },
  { name: 'Morgan Wallen Tailgate', venue: 'Off campus', when: 'Sat 2:00', tag: 'Free', tagCls: 'green', art: '/covers/morganwallenonethingatatime-coverart.jpeg' },
];
const CAROLINE_SHOWS = [
  { name: 'Zach Bryan "Quittin Time" Tour', venue: 'Nationals Park', when: 'Fri 7:30', tag: '$95', tagCls: 'orange', art: '/covers/zachbryangreatamericanbarscene-coverart.jpeg' },
  { name: 'Country Singalong Night', venue: 'The Tombs', when: 'Sat 10:00', tag: 'Free', tagCls: 'green', art: '/covers/meganlucky-coverart.jpeg' },
];
const MADDIE_SHOWS = [
  { name: 'The Dare DJ Set', venue: 'Flash DC', when: 'Fri 11:00', tag: '$25', tagCls: 'orange', art: '/artists/thedare-profile.jpeg' },
  { name: 'Charli XCX Sweat Tour', venue: 'The Anthem', when: 'Sat 8:00', tag: '$80', tagCls: 'orange', art: '/covers/brat-coverart.jpeg' },
];

const BENNETT_SHOWS = [
  { name: 'Ken Carson Chaos Tour', venue: 'The Anthem', when: 'Sat 8:00', tag: '$65', tagCls: 'orange', art: '/covers/kencarsonagreatchaos-coverart.jpeg' },
  { name: 'Late Night House Set', venue: 'Flash DC', when: 'Sat 11:30', tag: '$20', tagCls: 'orange', art: '/covers/chrislake-morebaby-coverart.jpeg' },
];
const MARCUS_SHOWS = [
  { name: 'Tame Impala Listening Party', venue: 'Leavey Center', when: 'Tonight 9:00', tag: 'Free', tagCls: 'green', art: '/artists/tameimpala-profile.jpeg' },
  { name: 'MK Deep House Basement', venue: 'Off campus', when: 'Fri 10:30', tag: '$10', tagCls: 'orange', art: '/artists/MK-profile.jpeg' },
];

const ALESSIA_SHOWS = [
  { name: 'Adam Port & Keinemusik Open Air', venue: 'Echostage', when: 'Fri 10:00', tag: '$40', tagCls: 'orange', art: '/covers/adamport-planet9-coverart.jpeg' },
  { name: 'Lana Del Rey Listening Party', venue: 'The Tombs', when: 'Sat 9:00', tag: 'Free', tagCls: 'green', art: '/covers/lanadelreyultraviolence-coverart.jpeg' },
];
const TAG_STYLE = {
  green: { background: 'rgba(113,192,127,0.14)', color: '#2F7D3F' },
  orange: { background: 'rgba(249,115,22,0.12)', color: '#C2410C' },
};

function NearYou() {
  const [activeUserId] = usePersistentState('ligo:active_user', 'jordan');
  const showsItems = activeUserId === 'charlotte' ? CHARLOTTE_SHOWS : activeUserId === 'cole' ? COLE_SHOWS : activeUserId === 'caroline' ? CAROLINE_SHOWS : activeUserId === 'bennett' ? BENNETT_SHOWS : activeUserId === 'alessia' ? ALESSIA_SHOWS : activeUserId === 'marcus' ? MARCUS_SHOWS : activeUserId === 'maddie' ? MADDIE_SHOWS : SHOWS;
  return (
    <div>
      <div style={{ padding: '24px 22px 12px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <h2 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 600, fontSize: 18, letterSpacing: '-0.015em', color: '#14110D', margin: 0 }}>Near you</h2>
        <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 12, fontWeight: 600, color: '#F97316' }}>All shows</span>
      </div>
      <div style={{ padding: '0 22px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {showsItems.map((s, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: 10, borderRadius: 18,
            background: '#fff', border: '1px solid rgba(20,17,13,0.05)',
            boxShadow: '0 1px 0 rgba(20,17,13,0.02), 0 6px 18px -12px rgba(20,17,13,0.08)',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12, flexShrink: 0,
              backgroundImage: `url(${s.art})`, backgroundSize: 'cover', backgroundPosition: 'center',
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 600, fontSize: 14.5, letterSpacing: '-0.01em', color: '#14110D', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
              <div style={{ fontSize: 12, color: 'rgba(20,17,13,0.5)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Icon.Pin width="12" height="12" style={{ opacity: 0.6 }} /> {s.venue}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <span style={{
                ...TAG_STYLE[s.tagCls], fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 10, fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase', padding: '4px 8px', borderRadius: 99,
              }}>{s.tag}</span>
              <div style={{ fontSize: 11, color: 'rgba(20,17,13,0.5)', marginTop: 6, fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 600 }}>{s.when}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HomeNormal({ onOpen }) {
  return (
    <div style={{ paddingBottom: 124 }}>
      <DailyPick />
      <WeekTeasers onOpen={onOpen} />
      <NewsStrip />
      <NearYou />
    </div>
  );
}



// home-connection.jsx — Connection day IS the reveal: sealed moment → story carousel → summary

function archetypeIconFor(key) {
  const map = {
    "mood-curator": Icon.Moon,
    "deep-cut": Icon.Spark,
    "afterglow": Icon.Moon,
    "hypnotist": Icon.Music,
    "main-character": Icon.Spark,
    "pop-oracle": Icon.Spark,
    "southern-romantic": Icon.Music,
    "social-aux": Icon.Vibe,
    "pregame-menace": Icon.Spark,
    "algorithm-dodger": Icon.Music,
    "culture-keeper": Icon.Music,
  };
  return map[key] ?? Icon.Music;
}

const FALLBACK_SONG = { name: 'Self Control', artist: 'Frank Ocean', art: ART.frank };
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

function ConnectionReveal({ onMeetup, onNav }) {
  const [activeUserId] = usePersistentState('ligo:active_user', 'jordan');
  const { loading, error, people, song } = useConnectionNight(activeUserId);
  const peopleData = people;
  const songData = song ?? FALLBACK_SONG;

  const [phase, setPhase] = useStateC('sealed');
  const [cur, setCur] = useStateC(0);
  // persisted: your Vibe/Spark/Pass choices are remembered
  const [actions, setActions] = usePersistentState('ligo:reveal:actions', {});   // idx -> 'vibe' | 'spark' | 'pass'
  const TOTAL = peopleData.length + 1;                // + done slide
  const ringPeople = peopleData.slice(0, 3);

  useEffect(() => {
    setCur(0);
    setPhase('sealed');
  }, [activeUserId, peopleData.length]);

  if (loading) {
    return (
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0907', color: 'rgba(255,255,255,0.5)', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 600, fontSize: 14 }}>
        Loading tonight&apos;s reveal…
      </div>
    );
  }

  if (error || !peopleData.length) {
    return (
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, background: '#0A0907', color: '#fff', padding: 24, textAlign: 'center' }}>
        <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 18 }}>Connection Night unavailable</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', maxWidth: 280 }}>{error || 'No matches surfaced for this profile yet.'}</div>
        <button onClick={() => onNav && onNav('home')} style={{ marginTop: 8, padding: '10px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: '#fff', cursor: 'pointer', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 13 }}>Back to home</button>
      </div>
    );
  }

  function next() { setCur(c => Math.min(c + 1, TOTAL - 1)); }
  function prev() { setCur(c => Math.max(c - 1, 0)); }
  function act(idx, kind) {
    setActions(a => ({ ...a, [idx]: kind }));
    setTimeout(next, 420);
  }
  function replay() { setActions({}); setCur(0); setPhase('sealed'); }

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0A0907', color: '#fff' }}>

      {/* top-left home button */}
      <button onClick={() => onNav && onNav('home')} aria-label="Home" style={{
        position: 'absolute', top: 52, left: 16, zIndex: 60, width: 38, height: 38, borderRadius: 99,
        border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff',
      }}>
        <Icon.Home width="18" height="18" />
      </button>

      {/* ───── SEALED LAYER ───── */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 10,
        background: '#0A0907', overflow: 'hidden',
        opacity: phase === 'carousel' ? 0 : 1,
        transform: phase === 'carousel' ? 'scale(1.05)' : 'scale(1)',
        pointerEvents: phase === 'carousel' ? 'none' : 'auto',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}>
        {/* ambient blooms */}
        <div style={{ position: 'absolute', width: 340, height: 340, top: -60, left: -80, background: 'radial-gradient(circle, rgba(249,115,22,0.18), transparent 70%)', animation: 'cn-drift1 7s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 280, height: 280, bottom: 120, right: -60, background: 'radial-gradient(circle, rgba(234,140,225,0.14), transparent 70%)', animation: 'cn-drift2 9s ease-in-out infinite', pointerEvents: 'none' }} />

        <div style={{ padding: '102px 24px 0', position: 'relative', zIndex: 2 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999,
            background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.22)', color: '#F97316',
            fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: '#F97316', animation: 'cn-blink 1.4s ease-in-out infinite' }} />
            Tonight's reveal · Georgetown
          </span>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 28px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          {/* floating rings */}
          <div style={{ position: 'relative', width: 180, height: 84, marginBottom: 34 }}>
            {[
              { p: ringPeople[0], style: { left: 0, top: 10, width: 64, height: 64, animation: 'cn-ringfloat 3.2s ease-in-out infinite' } },
              { p: ringPeople[2], style: { right: 0, top: 12, width: 64, height: 64, animation: 'cn-ringfloat 4.1s ease-in-out infinite 0.8s' } },
              { p: ringPeople[1], style: { left: '50%', top: 0, width: 72, height: 72, animation: 'cn-ringfloat-c 3.8s ease-in-out infinite 0.4s' } },
            ].filter((r) => r.p).map((r, i) => (
              <div key={i} style={{
                position: 'absolute', borderRadius: 99, background: r.p.grad, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: r.style.width > 64 ? 22 : 20,
                border: '2.5px solid #0A0907', boxShadow: '0 8px 24px rgba(0,0,0,0.5)', ...r.style,
              }}>{r.p.initials}</div>
            ))}
          </div>

          <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 72, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 6, color: '#fff' }}>{peopleData.length}</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.45)', marginBottom: 12 }}>connections surfaced tonight</div>
          <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 26, letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: 10, textWrap: 'balance' }}>
            matched to your taste.
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, maxWidth: 250 }}>You'll never know it's coming. That's the point.</div>

          {/* your pick chip */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 11, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '10px 14px', marginTop: 22 }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, backgroundImage: `url(${songData.art})`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0 }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 13.5, lineHeight: 1.2 }}>{songData.name}</div>
              <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{songData.artist}</div>
            </div>
            <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F97316', background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 6, padding: '4px 7px' }}>Your pick</span>
          </div>
        </div>

        <div style={{ padding: '0 20px 36px', position: 'relative', zIndex: 2 }}>
          <button onClick={() => setPhase('carousel')} style={{
            width: '100%', height: 56, border: 0, borderRadius: 18, cursor: 'pointer', background: '#F97316', color: '#fff',
            fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 16, letterSpacing: '-0.005em',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            boxShadow: '0 12px 32px -6px rgba(249,115,22,0.55), inset 0 1px 0 rgba(255,255,255,0.15)',
            transition: 'transform 0.15s ease',
          }} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            <Icon.Eye width="18" height="18" /> See who they are
          </button>
          <div style={{ textAlign: 'center', marginTop: 14, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.25)' }}>Disappears at midnight</div>
        </div>
      </div>

      {/* ───── CAROUSEL LAYER ───── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 5,
        opacity: phase === 'carousel' ? 1 : 0, pointerEvents: phase === 'carousel' ? 'auto' : 'none',
        transform: phase === 'carousel' ? 'scale(1)' : 'scale(0.97)',
        transition: 'opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s',
      }}>
        {/* story bars */}
        <div style={{ position: 'absolute', top: 56, left: 64, right: 16, display: 'flex', gap: 4, zIndex: 50 }}>
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: 2.5, borderRadius: 2, background: 'rgba(255,255,255,0.2)', overflow: 'hidden' }}>
              <i style={{ display: 'block', height: '100%', borderRadius: 2, background: '#fff', width: i <= cur ? '100%' : '0%', transition: 'width 0.3s ease' }} />
            </div>
          ))}
        </div>

        {/* tap zones */}
        <div onClick={prev} style={{ position: 'absolute', top: 64, bottom: 232, left: 0, width: '36%', zIndex: 30, cursor: 'pointer' }} />
        <div onClick={next} style={{ position: 'absolute', top: 64, bottom: 232, right: 0, width: '36%', zIndex: 30, cursor: 'pointer' }} />

        {/* slides */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 74 }}>
          {peopleData.map((p, i) => (
            <PersonSlide key={p.id} p={p} idx={i} cur={cur} total={peopleData.length} song={songData} action={actions[i]} onAct={act} />
          ))}
          <DoneSlide idx={peopleData.length} cur={cur} actions={actions} peopleData={peopleData} onReplay={replay} onMeetup={onMeetup} />
        </div>

        <BottomNav active="home" dark onChange={onNav || (() => {})} />
      </div>
    </div>
  );
}

function slideStyle(i, cur) {
  const x = i < cur ? '-100%' : i > cur ? '100%' : '0%';
  return {
    position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
    transform: `translateX(${x})`, transition: 'transform 0.4s cubic-bezier(.25,.46,.45,.94)',
  };
}

function WeekPips({ week }) {
  return (
    <div style={{ display: 'flex', gap: 5, position: 'relative', zIndex: 2 }}>
      {week.map((st, i) => {
        const c = st === 'today' ? { bg: 'rgba(249,115,22,0.18)', bd: 'rgba(249,115,22,0.3)', fg: '#F97316' }
          : st === 'match' ? { bg: 'rgba(113,192,127,0.13)', bd: 'rgba(113,192,127,0.22)', fg: 'rgba(113,192,127,0.85)' }
          : { bg: 'rgba(255,255,255,0.04)', bd: 'rgba(255,255,255,0.07)', fg: 'rgba(255,255,255,0.28)' };
        return (
          <div key={i} style={{ flex: 1, height: 34, borderRadius: 8, background: c.bg, border: `1px solid ${c.bd}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 8, textTransform: 'uppercase', color: c.fg, opacity: 0.7 }}>{DAYS[i]}</span>
            <span style={{ fontSize: 11, color: c.fg, fontWeight: 700 }}>{st === 'miss' ? '–' : '✓'}</span>
          </div>
        );
      })}
    </div>
  );
}

function PersonSlide({ p, idx, cur, total, song, action, onAct }) {
  const A = archetypeIconFor(p.aIconKey);
  return (
    <div style={slideStyle(idx, cur)}>
      {/* hero */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '78px 22px 12px', position: 'relative', overflowY: 'auto', scrollbarWidth: 'none' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(460px 460px at 82% 10%, rgba(234,140,225,0.16), transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, position: 'relative', zIndex: 2 }}>
          <span style={{ width: 5, height: 5, borderRadius: 99, background: '#F97316' }} /> {idx + 1} of {total} · {p.matchType} · {p.score}
        </div>

        {/* header: avatar + name + archetype */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative', zIndex: 2 }}>
          <div style={{ width: 60, height: 60, borderRadius: 99, background: p.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 22, color: '#fff', flexShrink: 0, boxShadow: '0 10px 30px rgba(0,0,0,0.45)' }}>{p.initials}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 24, letterSpacing: '-0.03em', lineHeight: 1.05 }}>{p.name}</div>
            <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.45)', fontWeight: 600, marginTop: 3 }}>{p.meta}</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, padding: '4px 10px', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 7 }}>
              <A width="12" height="12" /> {p.archetype}
            </div>
          </div>
        </div>

        {/* connection horoscope — personalized to their taste + week answers */}
        <div style={{ position: 'relative', overflow: 'hidden', marginTop: 16, padding: '14px 15px', borderRadius: 16, background: 'linear-gradient(160deg, rgba(234,140,225,0.16), rgba(255,255,255,0.02))', border: '1px solid rgba(234,140,225,0.24)', zIndex: 2 }}>
          <span style={{ position: 'absolute', top: 13, right: 16, width: 3, height: 3, borderRadius: 99, background: '#EA8CE1', opacity: 0.8 }} />
          <span style={{ position: 'absolute', bottom: 16, right: 34, width: 2, height: 2, borderRadius: 99, background: '#EA8CE1', opacity: 0.7 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
            <Icon.Spark width="13" height="13" style={{ color: '#EA8CE1' }} />
            <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#EA8CE1' }}>Your connection reading</span>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.55, color: 'rgba(255,255,255,0.8)', textWrap: 'pretty' }}>{p.horoscope}</p>
        </div>

        {/* shared song */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginTop: 10, padding: '10px 12px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', position: 'relative', zIndex: 2 }}>
          <div style={{ width: 38, height: 38, borderRadius: 9, backgroundImage: `url(${song.art})`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0, boxShadow: '0 6px 16px rgba(0,0,0,0.4)' }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Your pick tonight</div>
            <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 14.5, letterSpacing: '-0.01em', marginTop: 2 }}>{song.name} · <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>{song.artist}</span></div>
          </div>
        </div>

        {(p.headlineOverlap || p.sharedLane) && (
          <div style={{ marginTop: 14, position: 'relative', zIndex: 2 }}>
            <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>Overlap signal</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {p.headlineOverlap && (
                <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.72)', background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.22)', borderRadius: 999, padding: '6px 10px' }}>{p.headlineOverlap}</span>
              )}
              {p.sharedLane && (
                <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.55)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 999, padding: '6px 10px' }}>{p.sharedLane}</span>
              )}
            </div>
          </div>
        )}

        {p.week && (
          <div style={{ marginTop: 14, position: 'relative', zIndex: 2 }}>
            <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>Their answers this week</div>
            <WeekPips week={p.week} />
          </div>
        )}
      </div>

      {/* cta sheet */}
      <div style={{ flexShrink: 0, padding: '14px 18px 18px', background: 'rgba(10,9,7,0.88)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderTop: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 40 }}>
        <div style={{ fontSize: 11.5, fontWeight: 600, color: 'rgba(255,255,255,0.38)', textAlign: 'center', marginBottom: 11 }}>{p.prompt}</div>
        <div style={{ display: 'flex', gap: 9, marginBottom: 8 }}>
          <button onClick={() => onAct(idx, 'vibe')} disabled={!!action} style={{
            flex: 1, padding: '12px 8px', borderRadius: 14, cursor: action ? 'default' : 'pointer',
            border: action === 'vibe' ? '1.5px solid rgba(113,192,127,0.4)' : '1.5px solid rgba(255,255,255,0.1)',
            background: action === 'vibe' ? 'rgba(113,192,127,0.18)' : 'rgba(255,255,255,0.07)',
            color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            opacity: action && action !== 'vibe' ? 0.4 : 1, transition: 'all 0.18s ease',
          }}>
            {action === 'vibe' ? <Icon.Check width="16" height="16" /> : <Icon.Vibe width="17" height="17" />}
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 14, lineHeight: 1 }}>{action === 'vibe' ? 'Vibed' : 'Vibe'}</span>
              {action !== 'vibe' && <span style={{ fontSize: 10, fontWeight: 600, opacity: 0.6, marginTop: 2, lineHeight: 1 }}>Friends energy</span>}
            </span>
          </button>
          <button onClick={() => onAct(idx, 'spark')} disabled={!!action} style={{
            flex: 1, padding: '12px 8px', borderRadius: 14, cursor: action ? 'default' : 'pointer', border: 0,
            background: action === 'spark' ? 'rgba(234,140,225,0.5)' : '#EA8CE1',
            color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            opacity: action && action !== 'spark' ? 0.4 : 1,
            boxShadow: action ? 'none' : '0 8px 22px -6px rgba(234,140,225,0.5)', transition: 'all 0.18s ease',
          }}>
            {action === 'spark' ? <Icon.Check width="16" height="16" /> : <Icon.Spark width="17" height="17" />}
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 14, lineHeight: 1 }}>{action === 'spark' ? 'Sparked' : 'Spark'}</span>
              {action !== 'spark' && <span style={{ fontSize: 10, fontWeight: 600, opacity: 0.7, marginTop: 2, lineHeight: 1 }}>Something more</span>}
            </span>
          </button>
        </div>
        <button onClick={() => onAct(idx, 'pass')} style={{ display: 'block', width: '100%', textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.25)', cursor: 'pointer', padding: 4, background: 'none', border: 0, fontFamily: 'Bricolage Grotesque, sans-serif' }}>Not right now</button>
      </div>
    </div>
  );
}

function DoneSlide({ idx, cur, actions, peopleData, onReplay, onMeetup }) {
  return (
    <div style={slideStyle(idx, cur)}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '72px 24px 0', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(500px at 50% 22%, rgba(113,192,127,0.1), transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ width: 68, height: 68, borderRadius: 99, background: 'rgba(113,192,127,0.13)', border: '1.5px solid rgba(113,192,127,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, color: '#71C07F', position: 'relative', zIndex: 2 }}>
          <Icon.Check width="30" height="30" />
        </div>
        <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 24, letterSpacing: '-0.025em', marginBottom: 8, lineHeight: 1.15, position: 'relative', zIndex: 2 }}>That's tonight's reveal.</div>
        <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.42)', lineHeight: 1.6, maxWidth: 260, marginBottom: 22, position: 'relative', zIndex: 2 }}>
          Sparks stay anonymous until they send one back. Vibes can plan a hang right now.
        </div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 7, position: 'relative', zIndex: 2 }}>
          {peopleData.map((p, i) => {
            const a = actions[i];
            return (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 13, padding: '11px 13px', display: 'flex', alignItems: 'center', gap: 11, textAlign: 'left' }}>
                <div style={{ width: 36, height: 36, borderRadius: 99, background: p.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 12, color: '#fff', flexShrink: 0 }}>{p.initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 13 }}>{p.name}</div>
                  <div style={{ fontSize: 11, marginTop: 2, color: 'rgba(255,255,255,0.38)' }}>
                    {a === 'vibe' && <span style={{ color: '#F97316', fontWeight: 700 }}>Sent a Vibe</span>}
                    {a === 'spark' && <span style={{ color: '#EA8CE1', fontWeight: 700 }}>Sparked · anonymous until mutual</span>}
                    {(!a || a === 'pass') && <span style={{ color: 'rgba(255,255,255,0.28)', fontWeight: 700 }}>Passed</span>}
                  </div>
                </div>
                {(a === 'vibe' || a === 'spark') && (
                  <button onClick={() => onMeetup(p, a)} style={{
                    flexShrink: 0, border: 0, cursor: 'pointer', padding: '8px 12px', borderRadius: 10,
                    background: a === 'spark' ? 'rgba(234,140,225,0.16)' : 'rgba(249,115,22,0.14)',
                    color: a === 'spark' ? '#EA8CE1' : '#F97316',
                    fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 12,
                  }}>Plan a hang</button>
                )}
              </div>
            );
          })}
        </div>
        <button onClick={onReplay} style={{ width: '100%', padding: 13, borderRadius: 13, border: '1.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', cursor: 'pointer', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 13.5, color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12, position: 'relative', zIndex: 2 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
          Replay
        </button>
      </div>
    </div>
  );
}

function HomeConnection({ onMeetup, onNav }) {
  return <ConnectionReveal onMeetup={onMeetup} onNav={onNav} />;
}



// home-wrapped.jsx — Wrapped IS a full-screen story: sealed open → stat slides → share

function wSlide(i, cur) {
  const x = i < cur ? '-100%' : i > cur ? '100%' : '0%';
  return {
    position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
    transform: `translateX(${x})`, transition: 'transform 0.4s cubic-bezier(.25,.46,.45,.94)',
  };
}


const WRAPPED_DATA = {
  maddie: {
    meshClass: "cyan-purple-mesh",
    starsColor: "#14B8A6",
    sealedText: "Six answers, three shows, twelve twins and one sign — no listening required.",
    theme: {
      horoscopeIconColor: "#14B8A6",
      slide2Glow: "radial-gradient(460px 460px at 18% 14%, rgba(20,184,166,0.15), transparent 62%)",
      slide2Eyebrow: "#A78BFA",
      slide3Glow: "radial-gradient(460px 460px at 82% 16%, rgba(167,139,250,0.20), transparent 62%)",
      slide3Eyebrow: "#A78BFA",
      slide3Borders: ['#14B8A6', '#A78BFA', '#2DD4BF'],
      slide4Glow: "radial-gradient(460px 460px at 20% 18%, rgba(20,184,166,0.15), transparent 62%)",
      slide4Eyebrow: "#14B8A6",
      slide5Glow: "radial-gradient(460px 460px at 50% 18%, rgba(167,139,250,0.15), transparent 62%)",
    },
    slide1: {
      title: "The Alt\nSocialite",
      subtitle: "Season of the pregame",
      text: "You make weird taste feel playable. Your week jumped from Charli to The 1975, proving you can be early without making it your entire personality. The people who matched you aren't a coincidence. Reach out before the week resets."
    },
    slide2: {
      big: "6", unit: "answers",
      sub: "A perfect week — 5-day streak, no skips.",
      cover: "/covers/brat-coverart.jpeg",
      song: "\"360\"", artist: "Charli XCX",
      blurb: "The ultimate alt-social anthem. 12 Hoyas matched the vibe."
    },
    slide3: {
      big: "3", unit: "shows",
      sub: "You showed up for the scene.",
      events: ['The Dare DJ Set', 'Charli XCX at The Anthem', 'Off-campus Basement']
    },
    slide4: {
      big: "12", unit: "answer twins",
      sub: "Your most-matched week yet.",
      twins: [
        { i: 'M', g: 'linear-gradient(140deg,#3F3F46,#18181B)' },
        { i: 'C', g: 'linear-gradient(140deg,#FFB6C1,#FF69B4)' },
        { i: 'S', g: 'linear-gradient(140deg,#71C07F,#2F7D3F)' }
      ],
      twinsPlus: "+9",
    },
    slide5: {
      title: "That's your week,\nThe Alt Socialite.",
      sub: "6 answers · 3 shows · 12 twins. Post it and see who answered like you."
    }
  },
  jordan: {
    meshClass: "deep-purple-mesh",
    starsColor: "#F5D783",
    sealedText: "{d.sealedText}",
    theme: {
      horoscopeIconColor: "#EA8CE1",
      slide2Glow: "radial-gradient(460px 460px at 18% 14%, rgba(138,43,226,0.15), transparent 62%)",
      slide2Eyebrow: "#D8B4E2",
      slide3Glow: "radial-gradient(460px 460px at 82% 16%, rgba(75,0,130,0.20), transparent 62%)",
      slide3Eyebrow: "#9D4EDD",
      slide3Borders: ['#C77DFF', '#9D4EDD', '#7B2CBF'],
      slide4Glow: "radial-gradient(460px 460px at 20% 18%, rgba(138,43,226,0.15), transparent 62%)",
      slide4Eyebrow: "#C77DFF",
      slide5Glow: "radial-gradient(460px 460px at 50% 18%, rgba(138,43,226,0.15), transparent 62%)",
    },
    slide1: {
      title: "The\nHypnotist",
      subtitle: "{d.slide1.subtitle}",
      text: "{d.slide1.text}"
    },
    slide2: {
      big: "6", unit: "answers",
      sub: "A perfect week — 5-day streak, no skips.",
      cover: "/covers/drake-iceman-coverart.jpeg",
      song: "\"Make Them Pay\"", artist: "Drake",
      blurb: "{d.slide2.blurb}"
    },
    slide3: {
      big: "3", unit: "shows",
      sub: "You became a regular in the scene.",
      events: ['Drake Listening Party', 'Echostage VIP', 'Off-campus Basement']
    },
    slide4: {
      big: "12", unit: "answer twins",
      sub: "Your most-matched week yet.",
      twins: [
        { i: 'A', g: 'linear-gradient(140deg,#F5D783,#F97316)' },
        { i: 'M', g: 'linear-gradient(140deg,#3F3F46,#18181B)' },
        { i: 'S', g: 'linear-gradient(140deg,#9CA3AF,#4B5563)' }
      ],
      twinsPlus: "+9",
    },
    slide5: {
      title: "That's your week,\nThe Hypnotist.",
      sub: "6 answers · 3 shows · 12 twins. Post it and see who answered like you."
    }
  },
  charlotte: {
    meshClass: "pink-silver-mesh",
    starsColor: "#FFB6C1",
    sealedText: "Six answers, two shows, twenty-four twins and one sign — no listening required.",
    theme: {
      horoscopeIconColor: "#FF69B4",
      slide2Glow: "radial-gradient(460px 460px at 18% 14%, rgba(255,105,180,0.15), transparent 62%)",
      slide2Eyebrow: "#FFB6C1",
      slide3Glow: "radial-gradient(460px 460px at 82% 16%, rgba(219,112,147,0.20), transparent 62%)",
      slide3Eyebrow: "#DB7093",
      slide3Borders: ['#FF69B4', '#DB7093', '#FFB6C1'],
      slide4Glow: "radial-gradient(460px 460px at 20% 18%, rgba(255,105,180,0.15), transparent 62%)",
      slide4Eyebrow: "#FF69B4",
      slide5Glow: "radial-gradient(460px 460px at 50% 18%, rgba(255,105,180,0.15), transparent 62%)",
    },
    slide1: {
      title: "The Main\nPop Girl",
      subtitle: "Season of the bridge",
      text: "You know all the lyrics and aren't afraid to scream them. Your taste this week was heavy on the pop anthems and heartbreak ballads. Reach out to your matches before the week resets."
    },
    slide2: {
      big: "6", unit: "answers",
      sub: "A perfect week — 5-day streak, no skips.",
      cover: "/covers/taylorswift-lover-coverart.jpeg",
      song: "\"Cruel Summer\"", artist: "Taylor Swift",
      blurb: "The ultimate summer anthem. 24 Hoyas matched the vibe."
    },
    slide3: {
      big: "2", unit: "shows",
      sub: "You showed up for the main events.",
      events: ['Eras Tour Watch Party', 'Sabrina Carpenter pre-game']
    },
    slide4: {
      big: "24", unit: "answer twins",
      sub: "Your most-matched week yet.",
      twins: [
        { i: 'E', g: 'linear-gradient(140deg,#FFB6C1,#FF69B4)' },
        { i: 'L', g: 'linear-gradient(140deg,#FFDAB9,#FFA07A)' },
        { i: 'K', g: 'linear-gradient(140deg,#E6E6FA,#D8BFD8)' }
      ],
      twinsPlus: "+21",
    },
    slide5: {
      title: "That's your week,\nThe Main Pop Girl.",
      sub: "6 answers · 2 shows · 24 twins. Post it and see who answered like you."
    }
  },
  cole: {
    meshClass: "deep-purple-mesh",
    starsColor: "#60A5FA",
    sealedText: "A tailgate, three matches, and the auxiliary cord fully secured.",
    theme: {
      horoscopeIconColor: "#3B82F6",
      slide2Glow: "radial-gradient(460px 460px at 18% 14%, rgba(59,130,246,0.15), transparent 62%)",
      slide2Eyebrow: "#93C5FD",
      slide3Glow: "radial-gradient(460px 460px at 82% 16%, rgba(37,99,235,0.20), transparent 62%)",
      slide3Eyebrow: "#60A5FA",
      slide3Borders: ['#93C5FD', '#60A5FA', '#3B82F6'],
      slide4Glow: "radial-gradient(460px 460px at 20% 18%, rgba(59,130,246,0.15), transparent 62%)",
      slide4Eyebrow: "#60A5FA",
      slide5Glow: "radial-gradient(460px 460px at 50% 18%, rgba(59,130,246,0.15), transparent 62%)",
    },
    slide1: {
      title: "The\nSocial Aux",
      subtitle: "88% more mainstream",
      text: "You didn't overthink it. This week, your picks were crowd-pleasers built for a room full of people. You kept the aux cord tightly guarded."
    },
    slide2: {
      big: "5", unit: "answers",
      sub: "Consistently on aux.",
      cover: "/covers/drakepassionfruitandmorelife-coverart.jpeg",
      song: "\"Passionfruit\"", artist: "Drake",
      blurb: "A timeless classic. 18 Hoyas were on the same wavelength."
    },
    slide3: {
      big: "2", unit: "shows",
      sub: "You pulled up to the big ones.",
      events: ['Travis Scott Utopia Tour', 'Morgan Wallen Tailgate']
    },
    slide4: {
      big: "18", unit: "answer twins",
      sub: "You share taste with the campus.",
      twins: [
        { i: 'B', g: 'linear-gradient(140deg,#93C5FD,#60A5FA)' },
        { i: 'T', g: 'linear-gradient(140deg,#60A5FA,#3B82F6)' },
        { i: 'J', g: 'linear-gradient(140deg,#3B82F6,#2563EB)' }
      ],
      twinsPlus: "+15",
    },
    slide5: {
      title: "That's your week,\nThe Social Aux.",
      sub: "5 answers · 2 shows · 18 twins. Post it and see who answered like you."
    }
  },
  caroline: {
    meshClass: "orange-yellow-mesh",
    starsColor: "#F5D783",
    sealedText: "Tailgate anthems, five answers, sixteen twins, and a whole lot of heartbreak.",
    theme: {
      horoscopeIconColor: "#F5D783",
      slide2Glow: "radial-gradient(460px 460px at 18% 14%, rgba(245,215,131,0.15), transparent 62%)",
      slide2Eyebrow: "#F5D783",
      slide3Glow: "radial-gradient(460px 460px at 82% 16%, rgba(249,115,22,0.20), transparent 62%)",
      slide3Eyebrow: "#F97316",
      slide3Borders: ['#F5D783', '#F97316', '#C2410C'],
      slide4Glow: "radial-gradient(460px 460px at 20% 18%, rgba(245,215,131,0.15), transparent 62%)",
      slide4Eyebrow: "#F5D783",
      slide5Glow: "radial-gradient(460px 460px at 50% 18%, rgba(245,215,131,0.15), transparent 62%)",
    },
    slide1: {
      title: "The Southern\nRomantic",
      subtitle: "72% more mainstream",
      text: "You didn't overthink it. This week, your picks were tailgate anthems and soft country after midnight. You kept the aux cord tightly guarded."
    },
    slide2: {
      big: "5", unit: "answers",
      sub: "Consistently country.",
      cover: "/covers/meganlucky-coverart.jpeg",
      song: "\"Tennessee Orange\"", artist: "Megan Moroney",
      blurb: "A modern country classic. 16 Hoyas were on the same wavelength."
    },
    slide3: {
      big: "2", unit: "shows",
      sub: "You pulled up to the big ones.",
      events: ['Zach Bryan Tour', 'Country Singalong Night']
    },
    slide4: {
      big: "16", unit: "answer twins",
      sub: "You share taste with the campus.",
      twins: [
        { i: 'C', g: 'linear-gradient(140deg,#F5D783,#F97316)' },
        { i: 'M', g: 'linear-gradient(140deg,#F97316,#C2410C)' },
        { i: 'S', g: 'linear-gradient(140deg,#D97706,#9A3412)' }
      ],
      twinsPlus: "+13",
    },
    slide5: {
      title: "That's your week,\nThe Southern Romantic.",
      sub: "5 answers · 2 shows · 16 twins. Post it and see who answered like you."
    }
  },
  bennett: {
    meshClass: "orange-yellow-mesh",
    starsColor: "#EF4444",
    sealedText: "Rage anthems, low-end bass, and an absolutely menacing presence on the aux.",
    theme: {
      horoscopeIconColor: "#EF4444",
      slide2Glow: "radial-gradient(460px 460px at 18% 14%, rgba(239,68,68,0.15), transparent 62%)",
      slide2Eyebrow: "#FCA5A5",
      slide3Glow: "radial-gradient(460px 460px at 82% 16%, rgba(239,68,68,0.20), transparent 62%)",
      slide3Eyebrow: "#EF4444",
      slide3Borders: ['#FCA5A5', '#EF4444', '#B91C1C'],
      slide4Glow: "radial-gradient(460px 460px at 20% 18%, rgba(239,68,68,0.15), transparent 62%)",
      slide4Eyebrow: "#FCA5A5",
      slide5Glow: "radial-gradient(460px 460px at 50% 18%, rgba(239,68,68,0.15), transparent 62%)",
    },
    slide1: {
      title: "The Pregame\nMenace",
      subtitle: "61% more mainstream",
      text: "You didn't overthink it. This week, your picks were pure energy and rage anthems. You kept the aux cord tightly guarded."
    },
    slide2: {
      big: "6", unit: "answers",
      sub: "Consistently chaotic.",
      cover: "/covers/kencarsonagreatchaos-coverart.jpeg",
      song: "\"Yale\"", artist: "Ken Carson",
      blurb: "A modern trap classic. 14 Hoyas were on the same wavelength."
    },
    slide3: {
      big: "2", unit: "shows",
      sub: "You pulled up to the big ones.",
      events: ['Ken Carson Chaos Tour', 'Late Night House Set']
    },
    slide4: {
      big: "14", unit: "answer twins",
      sub: "You share taste with the campus.",
      twins: [
        { i: 'R', g: 'linear-gradient(140deg,#FCA5A5,#EF4444)' },
        { i: 'D', g: 'linear-gradient(140deg,#EF4444,#B91C1C)' },
        { i: 'T', g: 'linear-gradient(140deg,#DC2626,#991B1B)' }
      ],
      twinsPlus: "+11",
    },
    slide5: {
      title: "That's your week,\nThe Pregame Menace.",
      sub: "6 answers · 2 shows · 14 twins. Post it and see who answered like you."
    }
  },
  marcus: {
    heroAccent: '#3B82F6', heroGrad: 'linear-gradient(140deg, #10B981, #3B82F6)',
    topPct: 38,
    label: 'The Deep Cut Generalist',
    statLabel: 'more niche at Georgetown',
    sub: 'Tame Impala, MGMT, Fleetwood Mac, MK — you share a different lane with almost everyone.',
    storyPicks: ['Tame Impala', 'MGMT', 'Fleetwood Mac'],
    song: { title: 'Electric Feel', artist: 'MGMT' },
    friends: [
      { n: 'Maddie R.', t: 'Matched 3x', p: 'MR', c: '#F97316' },
      { n: 'Cole B.', t: 'Matched 2x', p: 'CB', c: '#3B82F6' },
    ],
  },
  alessia: {
    meshClass: "pink-purple-mesh",
    starsColor: "#EA8CE1",
    sealedText: "A perfect split between the floor and the feelings. You peak then melt.",
    theme: {
      horoscopeIconColor: "#EA8CE1",
      slide2Glow: "radial-gradient(460px 460px at 18% 14%, rgba(234,140,225,0.15), transparent 62%)",
      slide2Eyebrow: "#F9A8D4",
      slide3Glow: "radial-gradient(460px 460px at 82% 16%, rgba(234,140,225,0.20), transparent 62%)",
      slide3Eyebrow: "#EA8CE1",
      slide3Borders: ['#F9A8D4', '#EA8CE1', '#BE185D'],
      slide4Glow: "radial-gradient(460px 460px at 20% 18%, rgba(234,140,225,0.15), transparent 62%)",
      slide4Eyebrow: "#F9A8D4",
      slide5Glow: "radial-gradient(460px 460px at 50% 18%, rgba(234,140,225,0.15), transparent 62%)",
    },
    slide1: {
      title: "The\nAfterglow",
      subtitle: "31% more mainstream",
      text: "You needed the party to be loud, but the afters to be devastating. Your picks were built for emotional afters."
    },
    slide2: {
      big: "7", unit: "answers",
      sub: "Always setting the mood.",
      cover: "/covers/lanadelreyultraviolence-coverart.jpeg",
      song: "\"Brooklyn Baby\"", artist: "Lana Del Rey",
      blurb: "The ultimate mood shift. 8 others shared this feeling tonight."
    },
    slide3: {
      big: "2", unit: "shows",
      sub: "You showed up for the deep cuts.",
      events: ['Adam Port Open Air', 'Lana Del Rey Listening Party']
    },
    slide4: {
      big: "8", unit: "answer twins",
      sub: "You share taste with the campus.",
      twins: [
        { i: 'J', g: 'linear-gradient(140deg,#F97316,#EA8CE1)' },
        { i: 'S', g: 'linear-gradient(140deg,#71C07F,#2F7D3F)' },
        { i: 'M', g: 'linear-gradient(140deg,#EA8CE1,#A13D99)' }
      ],
      twinsPlus: "+5",
    },
    slide5: {
      title: "That's your week,\nThe Afterglow.",
      sub: "7 answers · 2 shows · 8 twins. Post it and see who answered like you."
    }
  }
};

// one star field per slide
function Stars({ color = '#F5D783' }) {

  const pts = [
    { t: 60, l: 40, s: 3 }, { t: 110, r: 50, s: 2 }, { t: 200, l: '52%', s: 2 },
    { b: 220, l: 56, s: 2 }, { b: 150, r: 70, s: 3 }, { t: 150, l: 90, s: 2 },
  ];
  return pts.map((p, i) => (
    <span key={i} style={{ position: 'absolute', width: p.s, height: p.s, borderRadius: 99, background: color, opacity: 0.55, top: p.t, bottom: p.b, left: p.l, right: p.r, pointerEvents: 'none' }} />
  ));
}

function StatSlide({ idx, cur, glow, eyebrow, eyebrowColor, big, unit, sub, meshClass = 'deep-purple-mesh', children }) {
  return (
    <div style={wSlide(idx, cur)}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '90px 28px 20px', position: 'relative', overflow: 'hidden' }}>
        <div className={meshClass} style={{ opacity: 0.5 }} />
        <div style={{ position: 'absolute', inset: 0, background: glow, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className={cur === idx ? "anim-slide-up" : ""} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: eyebrowColor, boxShadow: `0 0 8px ${eyebrowColor}` }} />
            <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: eyebrowColor, textShadow: `0 0 12px ${eyebrowColor}80` }}>{eyebrow}</span>
          </div>
          <div className={cur === idx ? "anim-slide-up delay-1" : ""} style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 96, letterSpacing: '-0.05em', lineHeight: 0.9, color: '#fff', textShadow: '0 8px 16px rgba(0,0,0,0.5)' }}>{big}</span>
            <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 600, fontSize: 20, letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.55)' }}>{unit}</span>
          </div>
          <div className={cur === idx ? "anim-slide-up delay-2" : ""} style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 600, fontSize: 22, letterSpacing: '-0.02em', color: '#fff', marginTop: 16, textWrap: 'balance', lineHeight: 1.2, textShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>{sub}</div>
          <div className={cur === idx ? "anim-slide-up delay-3" : ""} style={{ marginTop: 24 }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function WrappedExperience({ onNav }) {
  const [activeUserId] = usePersistentState('ligo:active_user', 'jordan');
  const d = WRAPPED_DATA[activeUserId] || WRAPPED_DATA.jordan;

  const [phase, setPhase] = useStateW('sealed');
  const [cur, setCur] = useStateW(0);
  const TOTAL = 5;
  const next = () => setCur(c => Math.min(c + 1, TOTAL - 1));
  const prev = () => setCur(c => Math.max(c - 1, 0));
  const replay = () => { setCur(0); setPhase('sealed'); };

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0A0907', color: '#fff' }}>
      <style>{`
        @keyframes mesh-drift {
          0% { transform: scale(1.1) rotate(0deg); }
          50% { transform: scale(1.3) rotate(15deg); }
          100% { transform: scale(1.1) rotate(0deg); }
        }
        @keyframes slide-up-fade {
          from { opacity: 0; transform: translateY(40px); filter: blur(12px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0px); }
        }
        @keyframes pop-in {
          0% { opacity: 0; transform: scale(0.85) translateY(20px); filter: blur(12px); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0px); }
        }
        .anim-slide-up {
          opacity: 0;
          animation: slide-up-fade 1.6s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
        .anim-pop {
          opacity: 0;
          animation: pop-in 1.6s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
        .delay-1 { animation-delay: 0.25s; }
        .delay-2 { animation-delay: 0.5s; }
        .delay-3 { animation-delay: 0.75s; }
        .delay-4 { animation-delay: 1.0s; }
        .delay-5 { animation-delay: 1.25s; }
                .pink-silver-mesh {
          position: absolute; inset: -20%; pointer-events: none;
          background: 
            radial-gradient(circle at 20% 30%, rgba(255,105,180,0.25) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(192,192,192,0.3) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 60%);
          animation: mesh-drift 20s ease-in-out infinite;
          mix-blend-mode: screen;
        }
                .cyan-purple-mesh {
          position: absolute; inset: -20%; pointer-events: none;
          background: 
            radial-gradient(circle at 20% 30%, rgba(20,184,166,0.25) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(167,139,250,0.3) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 60%);
          animation: mesh-drift 20s ease-in-out infinite;
          mix-blend-mode: screen;
        }
        .deep-purple-mesh {
          position: absolute; inset: -20%; pointer-events: none;
          background: 
            radial-gradient(circle at 20% 30%, rgba(138,43,226,0.25) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(75,0,130,0.3) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 60%);
          animation: mesh-drift 20s ease-in-out infinite;
          mix-blend-mode: screen;
        }
        .orange-yellow-mesh {
          position: absolute; inset: -20%; pointer-events: none;
          background: 
            radial-gradient(circle at 20% 30%, rgba(245,215,131,0.25) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(249,115,22,0.3) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 60%);
          animation: mesh-drift 20s ease-in-out infinite;
          mix-blend-mode: screen;
        }
        .glass-card {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 16px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
          border-radius: 20px;
        }
      `}</style>
      {/* top-left home */}
      <button onClick={() => onNav && onNav('home')} aria-label="Home" style={{
        position: 'absolute', top: 52, left: 16, zIndex: 60, width: 38, height: 38, borderRadius: 99,
        border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff',
      }}>
        <Icon.Home width="18" height="18" />
      </button>

      {/* ── SEALED ── */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 10, overflow: 'hidden',
        background: `
          radial-gradient(340px 300px at 88% 6%, rgba(234,140,225,0.28), transparent 62%),
          radial-gradient(420px 340px at 6% 98%, rgba(249,115,22,0.30), transparent 62%),
          radial-gradient(300px 240px at 70% 96%, rgba(245,215,131,0.16), transparent 66%),
          #0A0907`,
        opacity: phase === 'carousel' ? 0 : 1,
        transform: phase === 'carousel' ? 'scale(1.05)' : 'scale(1)',
        pointerEvents: phase === 'carousel' ? 'none' : 'auto',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}>
        <div className={d.meshClass} />
        <Stars color={d.starsColor} />
        <div style={{ padding: '102px 28px 0', position: 'relative', zIndex: 2 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999,
            background: 'rgba(245,215,131,0.14)', border: '1px solid rgba(245,215,131,0.28)', color: '#F5D783',
            fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
          }}>Last week · Jun 2–8</span>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 28px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 20 }}>
            <LigoMark size={26} />
            <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#F5D783' }}>Wrapped</span>
          </div>
          <h2 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 48, letterSpacing: '-0.04em', lineHeight: 0.98, textWrap: 'balance' }}>Your week,<br />decoded.</h2>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(255,255,255,0.5)', marginTop: 16, maxWidth: 280 }}>{d.sealedText}</p>
        </div>

        <div style={{ padding: '0 20px 36px', position: 'relative', zIndex: 2 }}>
          <button onClick={() => setPhase('carousel')} style={{
            width: '100%', height: 56, border: 0, borderRadius: 18, cursor: 'pointer', background: d.starsColor, color: '#14110D',
            fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 16, letterSpacing: '-0.005em',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            boxShadow: '0 12px 32px -6px rgba(245,215,131,0.4), inset 0 1px 0 rgba(255,255,255,0.4)',
            transition: 'transform 0.15s ease',
          }} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            <Icon.Spark width="18" height="18" /> Open my Wrapped
          </button>
          <div style={{ textAlign: 'center', marginTop: 14, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.25)' }}>A new wrap drops every Sunday</div>
        </div>
      </div>

      {/* ── CAROUSEL ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 5,
        opacity: phase === 'carousel' ? 1 : 0, pointerEvents: phase === 'carousel' ? 'auto' : 'none',
        transform: phase === 'carousel' ? 'scale(1)' : 'scale(0.97)',
        transition: 'opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s',
      }}>
        {/* story bars */}
        <div style={{ position: 'absolute', top: 56, left: 64, right: 16, display: 'flex', gap: 4, zIndex: 50 }}>
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: 2.5, borderRadius: 2, background: 'rgba(255,255,255,0.2)', overflow: 'hidden' }}>
              <i style={{ display: 'block', height: '100%', borderRadius: 2, background: '#fff', width: i <= cur ? '100%' : '0%', transition: 'width 0.3s ease' }} />
            </div>
          ))}
        </div>

        {/* tap zones */}
        <div onClick={prev} style={{ position: 'absolute', top: 64, bottom: 74, left: 0, width: '36%', zIndex: 30, cursor: 'pointer' }} />
        <div onClick={next} style={{ position: 'absolute', top: 64, bottom: 74, right: 0, width: '36%', zIndex: 30, cursor: 'pointer' }} />

        {/* slides */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 74 }}>

          {/* 1 — horoscope */}
          <div style={wSlide(0, cur)}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '90px 28px 20px', position: 'relative', overflow: 'hidden' }}>
              <div className={d.meshClass} style={{ opacity: 0.5 }} />
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(460px 460px at 80% 12%, rgba(138,43,226,0.15), transparent 62%)', pointerEvents: 'none' }} />
              <Stars color={d.starsColor} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div className={cur === 0 ? "anim-slide-up" : ""} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
                  <Icon.Spark width="14" height="14" style={{ color: d.theme.horoscopeIconColor }} />
                  <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: d.theme.horoscopeIconColor }}>Your music horoscope</span>
                </div>
                <div className={cur === 0 ? "anim-pop delay-1" : ""} style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 52, letterSpacing: '-0.04em', lineHeight: 0.95 }}>{d.slide1.title.split('\n').map((l,i)=><React.Fragment key={i}>{l}{i===0&&<br/>}</React.Fragment>)}</div>
                <div className={cur === 0 ? "anim-slide-up delay-2" : ""} style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 600, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#F5D783', marginTop: 12 }}>{d.slide1.subtitle}</div>
                <p className={cur === 0 ? "anim-slide-up delay-3" : ""} style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(255,255,255,0.72)', marginTop: 16, textWrap: 'pretty' }}>
                  {d.slide1.text}
                </p>
              </div>
            </div>
          </div>

          {/* 2 — answers */}
          <StatSlide idx={1} cur={cur} meshClass={d.meshClass}
            glow={d.theme.slide2Glow}
            eyebrow="Your week in answers" eyebrowColor={d.theme.slide2Eyebrow} big={d.slide2.big} unit={d.slide2.unit} sub={d.slide2.sub}>
            <div className="glass-card" style={{ padding: '16px', display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: 12, backgroundImage: `url(${d.slide2.cover})`, backgroundSize: 'cover', boxShadow: '0 8px 16px rgba(0,0,0,0.4)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#D8B4E2', marginBottom: 4 }}>Your defining answer</div>
                <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 600, fontSize: 16, letterSpacing: '-0.015em', lineHeight: 1.2 }}>{d.slide2.song}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{d.slide2.artist}</div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 14, lineHeight: 1.4, padding: '0 8px' }}>{d.slide2.blurb}</div>
          </StatSlide>

          {/* 3 — events */}
          <StatSlide idx={2} cur={cur} meshClass={d.meshClass}
            glow={d.theme.slide3Glow}
            eyebrow="Where you showed up" eyebrowColor={d.theme.slide3Eyebrow} big={d.slide3.big} unit={d.slide3.unit} sub={d.slide3.sub}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {d.slide3.events.map((v, i) => (
                <div key={v} className={cur === 2 ? `glass-card anim-slide-up delay-${i + 1}` : "glass-card"} style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: `4px solid ${d.theme.slide3Borders[i] || d.theme.slide3Borders[0]}` }}>
                  <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 600, fontSize: 15, color: '#fff' }}>{v}</span>
                </div>
              ))}
            </div>
          </StatSlide>

          {/* 4 — twins */}
          <StatSlide idx={3} cur={cur} meshClass={d.meshClass}
            glow={d.theme.slide4Glow}
            eyebrow="Your people" eyebrowColor={d.theme.slide4Eyebrow} big={d.slide4.big} unit={d.slide4.unit} sub={d.slide4.sub}>
            <div style={{ display: 'flex', marginTop: 10, paddingLeft: 10 }}>
              {d.slide4.twins.map((a, k) => (
                <div key={k} className={cur === 3 ? `glass-card anim-pop delay-${k + 1}` : "glass-card"} style={{ width: 64, height: 80, marginLeft: k === 0 ? 0 : -24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: a.g, zIndex: 10 - k, transform: `rotate(${(k - 1) * 6}deg) translateY(${Math.abs(k - 1) * 4}px)` }}>
                  <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 24, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>{a.i}</span>
                </div>
              ))}
              <div className={cur === 3 ? "glass-card anim-pop delay-4" : "glass-card"} style={{ width: 64, height: 80, marginLeft: -24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.3)', zIndex: 5, transform: `rotate(12deg) translateY(8px)` }}>
                <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 16, color: 'rgba(255,255,255,0.8)' }}>{d.slide4.twinsPlus}</span>
              </div>
            </div>
            <div style={{ fontSize: 14, color: '#C77DFF', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 600, marginTop: 32, display: 'flex', alignItems: 'center', gap: 6 }}>See them on Connection night →</div>
          </StatSlide>

          {/* 5 — share */}
          <div style={wSlide(4, cur)}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '90px 28px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div className={d.meshClass} style={{ opacity: 0.5 }} />
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(460px 460px at 50% 18%, rgba(138,43,226,0.15), transparent 62%)', pointerEvents: 'none' }} />
              <Stars color={d.starsColor} />
              <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className={cur === 4 ? "anim-slide-up" : ""} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                  <LigoMark size={24} />
                  <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F5D783' }}>Wrapped</span>
                </div>
                <h2 className={cur === 4 ? "anim-pop delay-1" : ""} style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 34, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 10 }}>{d.slide5.title.split('\n').map((l,i)=><React.Fragment key={i}>{l}{i===0&&<br/>}</React.Fragment>)}</h2>
                <p className={cur === 4 ? "anim-slide-up delay-2" : ""} style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, maxWidth: 260, marginBottom: 26 }}>{d.slide5.sub}</p>
                <div className={cur === 4 ? "anim-slide-up delay-3" : ""} style={{ width: '100%' }}>
                  <button style={{
                    width: '100%', height: 54, border: 0, borderRadius: 16, cursor: 'pointer', background: d.starsColor, color: '#14110D',
                    fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 16, letterSpacing: '-0.005em',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    boxShadow: '0 12px 30px -8px rgba(245,215,131,0.45)', transition: 'transform 0.12s ease',
                  }} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                    <Icon.Share width="18" height="18" /> Share to your story
                  </button>
                  <button onClick={replay} style={{
                    width: '100%', padding: 13, borderRadius: 14, border: '1.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', cursor: 'pointer',
                    fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 13.5, color: 'rgba(255,255,255,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 10,
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                    Replay
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        <BottomNav active="home" dark onChange={onNav || (() => {})} />
      </div>
    </div>
  );
}

function HomeWrapped({ onNav }) {
  return <WrappedExperience onNav={onNav} />;
}



// meetup-sheet.jsx — bottom sheet to plan a hang (no messaging, just plan + send)

const HANGS = [
  { id: 'coffee', label: 'Coffee', icon: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8h13v5a5 5 0 01-5 5H9a5 5 0 01-5-5V8z"/><path d="M17 9h2a2.5 2.5 0 010 5h-2"/><path d="M8 2v2.5M12 2v2.5"/></svg> },
  { id: 'study', label: 'Study sesh', icon: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5a2 2 0 012-2h6v16H6a2 2 0 00-2 2V5z"/><path d="M20 5a2 2 0 00-2-2h-6v16h6a2 2 0 012 2V5z"/></svg> },
  { id: 'listen', label: 'Listening', icon: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg> },
  { id: 'show', label: 'Show', icon: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 6l1 13a1 1 0 001 1h12a1 1 0 001-1l1-13M9 3h6M9 11v5M15 11v5"/></svg> },
];
const TIMES = [{ id: 'today', label: 'Today' }, { id: 'tomorrow', label: 'Tomorrow' }, { id: 'weekend', label: 'This weekend' }];
const VENUES = [
  { id: 'mug', name: 'Midnight Mug', meta: 'On campus · Leavey Center', perk: 'Ligo pays the first one', perkCls: 'orange' },
  { id: 'gray', name: 'Gray Street Coffee', meta: 'Off campus · 0.4 mi', perk: '15% off with Ligo', perkCls: 'pink' },
  { id: 'corp', name: 'The Corp · Uncommon Grounds', meta: 'On campus · student-run', perk: null, perkCls: null },
];
const PERK = {
  orange: { background: 'rgba(249,115,22,0.12)', color: '#C2410C' },
  pink: { background: 'rgba(234,140,225,0.15)', color: '#A13D99' },
};

function MeetupSheet({ match, mode = 'vibe', onClose, onSend }) {
  const [hang, setHang] = useStateM('coffee');
  const [time, setTime] = useStateM('today');
  const [venue, setVenue] = useStateM('mug');
  const name = match?.name || 'them';
  const spark = mode === 'spark';
  // accent: vibe = orange (friendly), spark = pink (romantic)
  const A = spark ? '#EA8CE1' : '#F97316';
  const Adeep = spark ? '#A13D99' : '#C2410C';
  const Asoft = spark ? 'rgba(234,140,225,0.12)' : 'rgba(249,115,22,0.10)';
  const Aglow = spark ? 'rgba(234,140,225,0.30)' : 'rgba(249,115,22,0.18)';
  const Ashadow = spark ? '0 12px 28px -8px rgba(234,140,225,0.6), 0 0 0 1px rgba(234,140,225,0.25)' : '0 12px 28px -8px rgba(249,115,22,0.55), 0 0 0 1px rgba(249,115,22,0.2)';

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 70, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      {/* scrim */}
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(10,9,7,0.5)',
        backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)',
        animation: 'mt-fade 220ms ease',
      }} />

      {/* sheet */}
      <div style={{
        position: 'relative', background: '#FAFAF8', borderRadius: '28px 28px 0 0',
        boxShadow: '0 -20px 50px rgba(0,0,0,0.25)', maxHeight: '88%', display: 'flex', flexDirection: 'column',
        animation: 'mt-sheet 360ms cubic-bezier(.2,.7,.2,1)',
      }}>
        {/* grabber */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
          <div style={{ width: 40, height: 5, borderRadius: 99, background: 'rgba(20,17,13,0.15)' }} />
        </div>

        <div style={{ overflowY: 'auto', padding: '8px 22px 0', scrollbarWidth: 'none' }}>
          {/* header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{
              fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 11,
              letterSpacing: '0.18em', textTransform: 'uppercase', color: A,
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 99, background: A, boxShadow: `0 0 0 4px ${Aglow}` }} />
              {spark ? 'Plan a spark' : 'Plan a vibe'}
            </span>
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 99, border: 0, cursor: 'pointer', background: 'rgba(20,17,13,0.05)', color: '#14110D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon.Close width="16" height="16" />
            </button>
          </div>
          <h2 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 600, fontSize: 24, letterSpacing: '-0.02em', color: '#14110D', margin: '4px 0 2px' }}>
            {spark ? `Make a little spark with ${name}` : `Something low-key with ${name}`}
          </h2>
          <p style={{ fontSize: 13, color: 'rgba(20,17,13,0.55)', marginBottom: 18 }}>We'll send {name} the invite — {spark ? 'a little spark, no pressure.' : 'friendly, no pressure.'} No DMs.</p>

          {/* hang type */}
          <SheetLabel>What's the vibe</SheetLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 22 }}>
            {HANGS.map(h => {
              const sel = hang === h.id; const I = h.icon;
              return (
                <button key={h.id} onClick={() => setHang(h.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', cursor: 'pointer',
                  borderRadius: 16, textAlign: 'left',
                  background: sel ? Asoft : '#fff',
                  border: `1.5px solid ${sel ? A : 'rgba(20,17,13,0.08)'}`,
                  color: sel ? Adeep : '#14110D', transition: 'all 0.15s cubic-bezier(.2,.7,.2,1)',
                }}>
                  <I width="20" height="20" style={{ flexShrink: 0 }} />
                  <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 600, fontSize: 15, letterSpacing: '-0.01em' }}>{h.label}</span>
                </button>
              );
            })}
          </div>

          {/* timing */}
          <SheetLabel>When</SheetLabel>
          <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
            {TIMES.map(t => {
              const sel = time === t.id;
              return (
                <button key={t.id} onClick={() => setTime(t.id)} style={{
                  flex: 1, padding: '12px 8px', cursor: 'pointer', borderRadius: 14,
                  background: sel ? '#14110D' : '#fff',
                  border: `1.5px solid ${sel ? '#14110D' : 'rgba(20,17,13,0.08)'}`,
                  color: sel ? '#fff' : '#14110D',
                  fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 600, fontSize: 14, letterSpacing: '-0.01em',
                  transition: 'all 0.15s cubic-bezier(.2,.7,.2,1)',
                }}>{t.label}</button>
              );
            })}
          </div>

          {/* venues */}
          <SheetLabel>Where</SheetLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
            {VENUES.map(v => {
              const sel = venue === v.id;
              return (
                <button key={v.id} onClick={() => setVenue(v.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', cursor: 'pointer', textAlign: 'left',
                  borderRadius: 16, background: sel ? Asoft : '#fff',
                  border: `1.5px solid ${sel ? A : 'rgba(20,17,13,0.08)'}`,
                  transition: 'all 0.15s cubic-bezier(.2,.7,.2,1)',
                }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: 99, flexShrink: 0,
                    border: `1.5px solid ${sel ? A : 'rgba(20,17,13,0.18)'}`,
                    background: sel ? A : 'transparent', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{sel && <Icon.Check width="13" height="13" />}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 600, fontSize: 15, letterSpacing: '-0.01em', color: '#14110D' }}>{v.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(20,17,13,0.5)', marginTop: 2 }}>{v.meta}</div>
                  </div>
                  {v.perk && (
                    <span style={{
                      ...PERK[v.perkCls], flexShrink: 0, fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 10, fontWeight: 700,
                      letterSpacing: '0.04em', textTransform: 'uppercase', padding: '5px 9px', borderRadius: 99, maxWidth: 96, lineHeight: 1.2, textAlign: 'center',
                    }}>{v.perk}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* sticky send */}
        <div style={{ padding: '14px 22px 28px', paddingBottom: 'max(28px, env(safe-area-inset-bottom))', background: 'linear-gradient(180deg, rgba(250,250,248,0), #FAFAF8 30%)' }}>
          <button onClick={onSend} style={{
            width: '100%', height: 56, border: 0, borderRadius: 18, cursor: 'pointer',
            background: A, color: '#fff',
            fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 600, fontSize: 17, letterSpacing: '-0.005em',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            boxShadow: Ashadow,
            transition: 'transform 0.12s ease',
          }} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            {spark ? 'Send your spark' : 'Send meetup invite'} →
          </button>
        </div>
      </div>
    </div>
  );
}

function SheetLabel({ children }) {
  return <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(20,17,13,0.45)', marginBottom: 10 }}>{children}</div>;
}



// ── Top bar (shown on the normal home) ──────────────────────
function TopBar({ activeUser, activeUserId, setActiveUserId }) {
  const [menuOpen, setMenuOpen] = useStateN(false);
  return (
    <div style={{ padding: '56px 22px 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 9, height: 9, borderRadius: 99, background: '#F97316', boxShadow: '0 0 0 4px rgba(249,115,22,0.16)' }} />
        <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 26, letterSpacing: '-0.03em', color: '#14110D', lineHeight: 1 }}>Ligo</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button style={{ width: 38, height: 38, borderRadius: 99, background: 'rgba(20,17,13,0.05)', border: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#14110D', position: 'relative' }}>
          <Icon.Bell width="18" height="18" />
          <span style={{ position: 'absolute', top: 8, right: 9, width: 7, height: 7, borderRadius: 99, background: '#F97316', boxShadow: '0 0 0 2px #FAFAF8' }} />
        </button>
        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ width: 38, height: 38, borderRadius: 99, flexShrink: 0, backgroundImage: `url(${activeUser.avatar})`, backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer' }} 
          />
          {menuOpen && (
            <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, width: 180, background: '#fff', borderRadius: 16, boxShadow: '0 12px 30px rgba(0,0,0,0.15)', border: '1px solid rgba(20,17,13,0.05)', padding: '6px', display: 'flex', flexDirection: 'column', gap: 4, zIndex: 200, maxHeight: 300, overflowY: 'auto' }}>
              <div style={{ padding: '6px 10px 4px', fontSize: 11, fontWeight: 700, color: 'rgba(20,17,13,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Switch User</div>
              {Object.values(USERS).map(u => (
                <button
                  key={u.id}
                  onClick={() => { setActiveUserId(u.id); setMenuOpen(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: u.id === activeUserId ? 'rgba(20,17,13,0.05)' : 'transparent', border: 0, borderRadius: 10, cursor: 'pointer', textAlign: 'left', color: '#14110D' }}
                >
                  <div style={{ width: 24, height: 24, borderRadius: 99, backgroundImage: `url(${u.avatar})`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0 }} />
                  <div style={{ flex: 1, fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 600, fontSize: 14 }}>{u.name}</div>
                  {u.id === activeUserId && <Icon.Check width={14} height={14} style={{ color: '#F97316' }} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



// ── Orchestrator — the home interface ───────────────────────
// `state`/`setState` (normal|connection|wrapped) are lifted to the page so
// it can darken the device status bar. `onNav` routes the bottom bar.
export function HomeScreen({ state, setState, onNav }) {
  const [activeUserId, setActiveUserId] = usePersistentState('ligo:active_user', 'jordan');
  const activeUser = USERS[activeUserId] || USERS['jordan'];

  const [sheet, setSheet] = useState(null);   // { match, mode } for the meetup sheet
  const [toast, setToast] = useState(null);   // { name, mode }
  const scrollRef = React.useRef(null);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [state]);

  function sendInvite() {
    setToast({ name: sheet?.match?.name || 'They', mode: sheet?.mode || 'vibe' });
    setSheet(null);
    setTimeout(() => setToast(null), 2800);
  }

  return (
    <>
      {state === 'connection' ? (
        <HomeConnection key="conn" onMeetup={(match, mode) => setSheet({ match, mode })} onNav={onNav} />
      ) : state === 'wrapped' ? (
        <HomeWrapped key="wrap" onNav={onNav} />
      ) : (
        <>
          <div ref={scrollRef} className="no-scrollbar" style={{ position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden' }}>
            <TopBar activeUser={activeUser} activeUserId={activeUserId} setActiveUserId={setActiveUserId} />
            <div key={state} className="phase-fade">
              <HomeNormal onOpen={setState} />
            </div>
          </div>
          <BottomNav active="home" onChange={onNav} />
        </>
      )}

      <Toast show={!!toast}>
        {toast && (toast.mode === 'spark'
          ? `Spark sent — ${toast.name} will get a heads up`
          : `Vibe sent — ${toast.name} will get a heads up`)}
      </Toast>

      {sheet && <MeetupSheet match={sheet.match} mode={sheet.mode} onClose={() => setSheet(null)} onSend={sendInvite} />}
    </>
  );
}
