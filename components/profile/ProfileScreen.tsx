// @ts-nocheck — faithful port of profile-tab-v2.jsx
/* eslint-disable react/no-unescaped-entities */
"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { Icon, Eyebrow, Wordmark, ChipTag, NowPip, Button } from "@/components/Primitives";
import { useProfileGate } from "@/lib/profileGate";
import {
  getArchetypeById,
  parseArchetypeSheet,
  ArchetypeSealGraphic,
  ArchetypeDetailSheetBody,
  ArchetypeGalleryScreen,
} from "@/components/profile/archetypes";
import { usePersistentState } from "@/lib/usePersistentState";
import { USERS, PROFILE_PRESENTATION_DEFAULTS, USER_IDENTITY_DEFAULTS } from "@/lib/users";
import { useDailyReveal } from "@/hooks/useDailyReveal";
import { searchCatalog, UNIFIED_CATALOG, searchArtists, UNIFIED_ARTISTS } from "@/lib/catalog";

const EDGE = 22;
const DISPLAY = "Bricolage Grotesque, sans-serif";
const BODY = '-apple-system, "SF Pro Display", "Helvetica Neue", Arial, sans-serif';
const CARD = "0 1px 0 rgba(20,17,13,0.02), 0 6px 18px -12px rgba(20,17,13,0.08)";
const ARTIST_IMG = "/assets/artists/";
const PROFILE_PHOTO = "/assets/Jordan-profile.png";
const EASE = 'cubic-bezier(.2,.7,.2,1)';

const LIQUID_GLASS = {
  background: 'rgba(250, 250, 248, 0.65)',
  backdropFilter: 'blur(24px) saturate(180%)',
  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  border: '1px solid rgba(20, 17, 13, 0.08)',
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(255, 255, 255, 0.6)'
};

const LIQUID_GLASS_DARK = {
  background: 'rgba(10, 9, 7, 0.45)',
  backdropFilter: 'blur(24px) saturate(180%)',
  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.05)'
};

const ProfileV2Ctx = createContext<any>(null);
export function usePV2() { return useContext(ProfileV2Ctx) || {}; }

export function useActiveUserProfile() {
  const ctx = usePV2();
  const overrideUserId = ctx?.overrideUserId;
  const [activeUserId] = usePersistentState('ligo:active_user', 'jordan');
  const user = USERS[overrideUserId || activeUserId] || USERS['jordan'];
  return { ...PROFILE_PRESENTATION_DEFAULTS, ...user.profile };
}

export function useActiveUser() {
  const ctx = usePV2();
  const overrideUserId = ctx?.overrideUserId;
  const [activeUserId] = usePersistentState('ligo:active_user', 'jordan');
  const user = USERS[overrideUserId || activeUserId] || USERS['jordan'];
  return { ...USER_IDENTITY_DEFAULTS, ...user };
}

const RECEIPTS_DOT_HISTORY = [
  1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,
];

const STREAK_TROPHIES = [
  { id: 'd1', label: '1 day', short: '1d', days: 1, accent: '#71C07F', icon: '✓', title: 'First Spark', blurb: "You showed up. That's literally the whole game — one answer, one song, one vote. The streak begins here." },
  { id: 'd3', label: '3 days', short: '3d', days: 3, accent: '#71C07F', icon: '✓', title: 'Three-Peat', blurb: 'Three days in a row. Your roommate thinks you have a problem. You call it consistency.' },
  { id: 'd5', label: '5 days', short: '5d', days: 5, accent: '#F97316', icon: '🔥', title: 'On Fire', blurb: 'Five straight nights of picking bangers. The campus chart is starting to know your name.' },
  { id: 'w1', label: '1 week', short: '7d', days: 7, accent: '#F5D783', icon: '★', title: 'Full Rotation', blurb: "Seven days. A full lap around the sun spent being right about music. That's not luck — that's a habit." },
  { id: 'm1', label: '1 month', short: '30d', days: 30, accent: '#EA8CE1', icon: '◆', title: 'Campus Regular', blurb: "30 days of daily picks. You've outlasted half the feed. This isn't a phase — it's a personality." },
  { id: 'm3', label: '3 months', short: '90d', days: 90, accent: '#C2410C', icon: '◎', title: 'Semester Deep', blurb: '90 days straight. You were here before it was cool, and still here after everyone else ghosted.' },
  { id: 'h6', label: '180 days', short: '180', days: 180, accent: '#14110D', icon: '♛', title: 'Hall of Fame', blurb: "Half a year of never missing a day. Legends aren't born — they're streaked into existence." },
];

export function ProfileV2Provider({ children, overrideUserId, matchReason, onClose }: { children: ReactNode, overrideUserId?: string, matchReason?: string, onClose?: () => void }) {
  const [screen, setScreen] = useState('profile');
  const [sheet, setSheet] = useState(null);
  const [sheetOrigin, setSheetOrigin] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [toastOn, setToastOn] = useState(false);
  const [notifUnread, setNotifUnread] = useState(true);
  const [playingIdx, setPlayingIdx] = useState(null);
  const [meterOn, setMeterOn] = useState(false);
  const toastTimer = useRef(null);

  const toast = useCallback((msg) => {
    setToastMsg(msg);
    setToastOn(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastOn(false), 1900);
  }, []);

  const openSheet = useCallback((id) => {
    setSheet(id);
    if (id === 'notif') setNotifUnread(false);
  }, []);

  const closeSheet = useCallback(() => {
    setSheet(null);
    if (sheetOrigin === 'gallery') {
      setScreen('archetype-gallery');
      setSheetOrigin(null);
    }
  }, [sheetOrigin]);

  const openArchetypeGallery = useCallback(() => {
    setSheet(null);
    setScreen("archetype-gallery");
  }, []);

  const closeArchetypeGallery = useCallback(() => {
    setScreen('profile');
    setSheet('archetype');
  }, []);

  const openArchetypeFromGallery = useCallback((id) => {
    setSheet(`archetype:${id}`);
    setSheetOrigin('gallery');
  }, []);

  const toggleTrack = useCallback((idx, title) => {
    setPlayingIdx((prev) => {
      if (prev === idx) {
        toast('Paused');
        return null;
      }
      toast('Now playing · ' + title);
      return idx;
    });
  }, [toast]);

  const runMeterAnim = useCallback(() => {
    setMeterOn(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setMeterOn(true));
    });
  }, []);

  const openReceipts = useCallback(() => {
    setSheet(null);
    setScreen('receipts');
  }, []);

  const closeReceipts = useCallback(() => setScreen('profile'), []);

  return (
    <ProfileV2Ctx.Provider value={{
      screen, setScreen, sheet, openSheet, closeSheet, sheetOrigin,
      toastMsg, toastOn, toast, notifUnread,
      openArchetypeGallery, closeArchetypeGallery, openArchetypeFromGallery,
      playingIdx, toggleTrack, meterOn, overrideUserId, matchReason, onClose,
      openReceipts, closeReceipts, runMeterAnim
    }}>
      {children}
    </ProfileV2Ctx.Provider>
  );
}

function Reveal({ children, className = '', style = {}, onInView }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    const root = document.getElementById('profile-scroll');
    if (!el || !root) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setInView(true);
        onInView?.();
        io.disconnect();
      }
    }, { root, threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, [onInView]);
  return (
    <div ref={ref} className={`pv2-reveal ${inView ? 'in' : ''} ${className}`} style={style}>
      {children}
    </div>
  );
}

function ProfileToast() {
  const { toastMsg, toastOn } = usePV2();
  return (
    <div className={`profile-toast ${toastOn ? 'show' : ''}`}>
      <span className="tdot" /><span>{toastMsg}</span>
    </div>
  );
}

function trophySheetId(id) { return `trophy-${id}`; }
function parseTrophySheetId(sheet) {
  if (!sheet || !sheet.startsWith('trophy-')) return null;
  return sheet.slice(7);
}

function TrophySheet({ trophyId }) {
  const profile = useActiveUserProfile();
  const trophy = STREAK_TROPHIES.find((t) => t.id === trophyId);
  if (!trophy) return null;

  const earned = currentProfile.longestStreak >= trophy.days;
  const daysLeft = Math.max(0, trophy.days - currentProfile.longestStreak);
  const isCurrentTier = earned && [...STREAK_TROPHIES].filter((x) => x.days <= currentProfile.currentStreak).pop()?.id === trophy.id;

  return (
    <div style={{ paddingBottom: 24 }}>
      <div style={{
        width: 88, height: 88, margin: '4px auto 0', borderRadius: 24,
        background: earned
          ? `linear-gradient(155deg, ${trophy.accent}22, ${trophy.accent}55)`
          : 'rgba(20,17,13,0.05)',
        border: `2px solid ${isCurrentTier ? '#F97316' : earned ? `${trophy.accent}55` : 'rgba(20,17,13,0.08)'}`,
        boxShadow: isCurrentTier ? '0 0 0 4px rgba(249,115,22,0.14)' : (earned ? CARD : 'none'),
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
        filter: earned ? 'none' : 'grayscale(1)',
      }}>
        <span style={{
          fontFamily: DISPLAY, fontWeight: 700, fontSize: 28,
          color: earned ? trophy.accent : 'rgba(20,17,13,0.35)', lineHeight: 1,
        }}>{earned ? trophy.icon : '·'}</span>
        <span style={{
          fontFamily: DISPLAY, fontWeight: 700, fontSize: 11, letterSpacing: '0.06em',
          color: earned ? '#14110D' : 'rgba(20,17,13,0.35)',
        }}>{trophy.short}</span>
      </div>

      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <div style={{
          fontFamily: DISPLAY, fontWeight: 600, fontSize: 24, letterSpacing: '-0.02em', color: '#14110D',
        }}>{trophy.title}</div>
        <div style={{
          marginTop: 6, fontFamily: DISPLAY, fontWeight: 600, fontSize: 13, color: 'rgba(20,17,13,0.45)',
        }}>{trophy.label} streak · {trophy.days} day{trophy.days === 1 ? '' : 's'}</div>
      </div>

      <div style={{
        marginTop: 18, padding: '12px 14px', borderRadius: 14, textAlign: 'center',
        background: earned ? 'rgba(113,192,127,0.12)' : 'rgba(20,17,13,0.04)',
        border: `1px solid ${earned ? 'rgba(113,192,127,0.25)' : 'rgba(20,17,13,0.06)'}`,
      }}>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
          fontFamily: DISPLAY, color: earned ? '#71C07F' : 'rgba(20,17,13,0.40)',
        }}>{earned ? 'Unlocked' : 'Locked'}</span>
      </div>

      <p style={{
        fontSize: 15, lineHeight: 1.55, color: '#14110D', marginTop: 18, textAlign: 'center',
      }}>{trophy.blurb}</p>

      <div style={{
        marginTop: 16, padding: '14px 16px', borderRadius: 16,
        background: '#fff', border: '1px solid rgba(20,17,13,0.06)', boxShadow: CARD,
      }}>
        {earned ? (
          <>
            <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 13, color: '#14110D' }}>
              Earned with a {currentProfile.longestStreak}-day longest streak
            </div>
            {isCurrentTier && (
              <div style={{ fontSize: 12.5, color: 'rgba(20,17,13,0.55)', marginTop: 6, lineHeight: 1.4 }}>
                You're on a {currentProfile.currentStreak}-day run right now — this is your active tier.
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 13, color: '#14110D' }}>
              {daysLeft} more day{daysLeft === 1 ? '' : 's'} to unlock
            </div>
            <div style={{ fontSize: 12.5, color: 'rgba(20,17,13,0.55)', marginTop: 6, lineHeight: 1.4 }}>
              Answer daily at Georgetown. Your longest streak so far is {currentProfile.longestStreak} day{currentProfile.longestStreak === 1 ? '' : 's'}.
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ProfileV2Sheets() {
  const profile = useActiveUserProfile();
  const { sheet, closeSheet, openArchetypeGallery } = usePV2();

  const trophyId = parseTrophySheetId(sheet);
  const parsedArch = parseArchetypeSheet(sheet);
  
  const sheets = {
    settings: { title: 'Settings', dark: false, body: <SettingsSheet /> },
    notif: { title: 'Activity', dark: false, body: <NotifSheet /> },
    pastreads: { title: 'Past reads', dark: false, body: <PastReadsSheet /> },
    share: { title: 'Share Profile', dark: false, body: <ShareSheet /> },
  };
  
  let active = trophyId
    ? { title: 'Streak trophy', dark: false, body: <TrophySheet trophyId={trophyId} /> }
    : sheets[sheet];
    
  if (parsedArch) {
    const isEarned = parsedArch.mode === 'earned';
    const aId = isEarned ? profile.earnedArchetypeId : parsedArch.id;
    active = { 
      title: 'Sonic Archetype', dark: true, 
      body: (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <ArchetypeDetailSheetBody
            archetypeId={aId}
            earnedId={profile.earnedArchetypeId}
            traits={profile.traits}
            heldWeeks={profile.heldWeeks}
            earnedBlurb={profile.earnedBlurb}
          />
          <button type="button" onClick={openArchetypeGallery} style={{
            marginTop: 24, width: '100%', padding: '16px', borderRadius: 99, border: 0,
            background: 'rgba(255,255,255,0.1)', color: '#fff',
            fontFamily: DISPLAY, fontWeight: 600, fontSize: 14, cursor: 'pointer'
          }}>View all archetypes &rarr;</button>
        </div>
      ) 
    };
  }

  return (
    <>
      <div className={`profile-scrim ${sheet ? 'open' : ''}`} onClick={closeSheet} role="presentation" />
      {active && (
        <div className={`profile-sheet ${active.dark ? 'dark' : ''} open`} role="dialog">
          <div className="grip" />
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 22px 10px', flexShrink: 0,
          }}>
            <div style={{
              fontFamily: DISPLAY, fontWeight: 600, fontSize: active.dark ? 13 : 21,
              letterSpacing: active.dark ? '0.14em' : '-0.02em',
              textTransform: active.dark ? 'uppercase' : 'none',
              color: active.dark ? '#F5D783' : 'inherit',
            }}>{active.title}</div>
            <button type="button" onClick={closeSheet} aria-label="Close" style={{
              width: 30, height: 30, borderRadius: 99, border: 0, cursor: 'pointer',
              background: active.dark ? 'rgba(255,255,255,0.1)' : 'rgba(20,17,13,0.06)',
              color: active.dark ? 'rgba(255,255,255,0.7)' : 'rgba(20,17,13,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><Icon.Close width={13} height={13} /></button>
          </div>
          <div style={{ overflowY: 'auto', padding: '4px 16px 8px', flex: 1 }}>{active.body}</div>
        </div>
      )}
    </>
  );
}

function Toggle({ defaultOn = true }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button type="button" onClick={() => setOn(!on)} style={{
      width: 46, height: 28, borderRadius: 99, border: 0, padding: 0, cursor: 'pointer',
      background: on ? '#71C07F' : 'rgba(20,17,13,0.12)', position: 'relative',
      transition: `background 220ms ${EASE}`,
    }}>
      <span style={{
        position: 'absolute', top: 3, left: on ? 21 : 3,
        width: 22, height: 22, borderRadius: 99, background: '#fff',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        transition: `left 220ms ${EASE}`,
      }} />
    </button>
  );
}

function SetRow({ label, value, iconBg, children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 13, padding: '13px 15px',
      background: '#fff', position: 'relative', cursor: 'pointer',
    }}>
      {iconBg && (
        <div style={{
          width: 30, height: 30, borderRadius: 8, background: iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>{children}</div>
      )}
      <span style={{ flex: 1, fontFamily: DISPLAY, fontWeight: 500, fontSize: 15, color: '#14110D' }}>{label}</span>
      {value && <span style={{ fontSize: 13, color: 'rgba(20,17,13,0.45)', fontFamily: DISPLAY }}>{value}</span>}
    </div>
  );
}



function ShareSheet() {
  const { toast, closeSheet } = usePV2();
  const activeUser = useActiveUser();
  const profile = useActiveUserProfile();
  const archetypeName = getArchetypeById(profile.earnedArchetypeId)?.name ?? activeUser.archetype;
  return (
    <div>
      {/* Share Preview Card */}
      <div style={{ 
        display: 'flex', gap: 16, alignItems: 'center', 
        padding: 16, background: 'rgba(20,17,13,0.03)', 
        borderRadius: 16, marginBottom: 20 
      }}>
        <div style={{ 
          width: 64, height: 64, borderRadius: 12, 
          background: 'linear-gradient(145deg, #1A1815, #2C2822)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, overflow: 'hidden', position: 'relative',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.2, backgroundImage: 'radial-gradient(circle at center, #F5D783 0%, transparent 70%)' }} />
          <span style={{ fontSize: 28, zIndex: 1 }}>🌀</span>
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 16, color: '#14110D', marginBottom: 4 }}>{archetypeName}</div>
          <div style={{ fontFamily: BODY, fontSize: 13, color: 'rgba(20,17,13,0.6)', lineHeight: 1.3 }}>
            Ligo Sonic Archetype<br/>
            <span style={{ color: '#F97316' }}>ligo.app/@{activeUser.firstName.toLowerCase()}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, textAlign: 'center', marginBottom: 24, marginTop: 12 }}>
        
        <div style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }} onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.92)'} onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} onClick={() => { toast('Opening Instagram...'); closeSheet(); }}>
          <div style={{ width: 56, height: 56, borderRadius: 18, background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', color: '#fff', boxShadow: '0 4px 12px rgba(214,36,159,0.2)' }}>
            <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22 }}>IG</span>
          </div>
          <span style={{ fontSize: 11, fontFamily: DISPLAY, fontWeight: 600, color: 'rgba(20,17,13,0.7)' }}>Instagram</span>
        </div>

        <div style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }} onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.92)'} onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} onClick={() => { toast('Opening Snapchat...'); closeSheet(); }}>
          <div style={{ width: 56, height: 56, borderRadius: 18, background: '#FFFC00', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', color: '#14110D', boxShadow: '0 4px 12px rgba(255,252,0,0.3)' }}>
            <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22 }}>SC</span>
          </div>
          <span style={{ fontSize: 11, fontFamily: DISPLAY, fontWeight: 600, color: 'rgba(20,17,13,0.7)' }}>Snapchat</span>
        </div>

        <div style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }} onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.92)'} onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} onClick={() => { toast('Opening Messages...'); closeSheet(); }}>
          <div style={{ width: 56, height: 56, borderRadius: 18, background: '#34C759', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', color: '#fff', boxShadow: '0 4px 12px rgba(52,199,89,0.3)' }}>
            <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22 }}>M</span>
          </div>
          <span style={{ fontSize: 11, fontFamily: DISPLAY, fontWeight: 600, color: 'rgba(20,17,13,0.7)' }}>Messages</span>
        </div>

        <div style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }} onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.92)'} onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} onClick={() => { toast('Link copied!'); closeSheet(); }}>
          <div style={{ width: 56, height: 56, borderRadius: 18, background: 'rgba(20,17,13,0.05)', border: '1px solid rgba(20,17,13,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', color: '#14110D' }}>
            <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 20 }}>🔗</span>
          </div>
          <span style={{ fontSize: 11, fontFamily: DISPLAY, fontWeight: 600, color: 'rgba(20,17,13,0.7)' }}>Copy Link</span>
        </div>

      </div>
      
      <div style={{ borderRadius: 16, border: '1px solid rgba(20,17,13,0.06)', overflow: 'hidden', background: '#FAFAF8' }}>
        <SetRow label="Save QR Code" iconBg="rgba(20,17,13,0.06)">
          <span style={{ fontSize: 16 }}>🔲</span>
        </SetRow>
      </div>
    </div>
  );
}

function NotifSheet() {
  const profile = useActiveUserProfile();
  const items = profile.notifications ?? [];
  return (
    <div>
      {items.map((n, i) => (
        <div key={i} style={{
          display: 'flex', gap: 13, padding: '13px 8px', borderRadius: 14,
          background: n.unread ? 'rgba(249,115,22,0.05)' : 'transparent',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, background: n.bg, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: DISPLAY, fontWeight: 700, fontSize: n.ic.length > 1 ? 16 : 18,
          }}>{n.ic}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, lineHeight: 1.4, color: '#14110D' }}>{n.text}</div>
            <div style={{
              fontSize: 11, color: 'rgba(20,17,13,0.35)', marginTop: 3,
              fontFamily: DISPLAY, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
            }}>{n.time}</div>
          </div>
          {n.unread && <span style={{ width: 7, height: 7, borderRadius: 99, background: '#F97316', marginTop: 6 }} />}
        </div>
      ))}
    </div>
  );
}

function PastReadsSheet() {
  const profile = useActiveUserProfile();
  return (
    <div>
      {profile.pastReads.map((r, i) => (
        <div key={i} style={{
          borderRadius: 18, padding: '16px 17px', marginBottom: 12,
          background: r.type === 'honest' ? 'rgba(249,115,22,0.05)' : r.type === 'time-machine' ? 'linear-gradient(165deg, rgba(20,17,13,0.02), rgba(20,17,13,0.05))' : '#FAFAF8',
          border: '1px solid ' + (r.type === 'honest' ? 'rgba(249,115,22,0.1)' : 'rgba(20,17,13,0.06)'),
        }}>
          <div style={{
            fontFamily: DISPLAY, fontWeight: 700, fontSize: 10,
            letterSpacing: '0.14em', textTransform: 'uppercase', color: r.type === 'honest' ? '#F97316' : '#C2410C',
          }}>
            {r.type === 'time-machine' && <span style={{ marginRight: 6 }}>🕰️</span>}
            {r.type === 'honest' && <span style={{ marginRight: 6 }}>🎯</span>}
            {r.date}
          </div>
          <div style={{
            marginTop: 8, fontFamily: DISPLAY, fontWeight: 600, fontSize: 17,
            letterSpacing: '-0.02em', lineHeight: 1.18, color: r.type === 'honest' ? '#C2410C' : '#14110D',
          }}>{r.head}</div>
          <p style={{ marginTop: 6, fontSize: 13, lineHeight: 1.5, color: 'rgba(20,17,13,0.60)' }}>{r.body}</p>
        </div>
      ))}
    </div>
  );
}

function HotTakeBanner() {
  const { toast } = usePV2();
  const profile = useActiveUserProfile();
  return (
    <div style={{
      ...LIQUID_GLASS, borderRadius: 20, padding: '16px 20px', 
      display: 'flex', alignItems: 'center', gap: 12, marginTop: 20,
      cursor: 'pointer', transition: 'transform 150ms ease',
    }} onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'} onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} onClick={() => toast('Hot take interactions coming soon!')}>
      <div style={{ flex: 1, textAlign: 'left' }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#F97316', marginBottom: 4 }}>Hot Take</div>
        <div style={{ fontFamily: BODY, fontSize: 14, color: '#14110D', lineHeight: 1.4, fontStyle: 'italic', fontWeight: 500 }}>
          &ldquo;{currentProfile.hotTake}&rdquo;
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
        <button style={{ width: 40, height: 40, borderRadius: 99, border: '1px solid rgba(20,17,13,0.1)', background: '#fff', fontSize: 18, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>🔥</button>
      </div>
    </div>
  );
}

function VibeTicker() {
  const activeUser = useActiveUser();
  const profile = useActiveUserProfile();
  return (
    <div style={{
      ...LIQUID_GLASS, borderRadius: 99, padding: '10px 18px',
      display: 'inline-flex', alignItems: 'center', gap: 10, maxWidth: '100%', overflow: 'hidden',
      marginTop: 16,
    }}>
      <span style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 10, color: '#F97316', transform: 'translateY(-1px)' }}>
        <span className="ligo-eq-bar" /><span className="ligo-eq-bar" /><span className="ligo-eq-bar" />
      </span>
      <div style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 13, color: '#14110D', display: 'inline-block' }}>
          {activeUser.firstName} is currently listening to {profile.nowListening?.artist ?? 'music'}
        </div>
      </div>
    </div>
  );
}

function HeavyRotationPolaroids() {
  const profile = useActiveUserProfile();
  const [activeItem, setActiveItem] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const { toast } = usePV2();

  useEffect(() => {
    if (activeItem?.audioSrc && audioRef.current) {
      audioRef.current.src = activeItem.audioSrc;
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(e => console.log('Audio play blocked:', e));
    } else if (!activeItem && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else if (activeItem && !activeItem.audioSrc) {
      setIsPlaying(false);
    }
  }, [activeItem]);

  const rotation = profile.onRepeat ?? [];

  return (
    <div style={{ marginTop: 32 }}>
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
      <style>{`
        @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
        @keyframes flipInZoom {
          0% { transform: rotateY(0deg) scale(0.3) translateY(100px); }
          100% { transform: rotateY(180deg) scale(1) translateY(0); }
        }
      `}</style>

      <div style={{ padding: `0 4px`, marginBottom: 12 }}>
        <Eyebrow dark={false}>On Repeat</Eyebrow>
      </div>
      
      <div style={{ width: '100%', overflowX: 'auto', display: 'flex', gap: 16, paddingBottom: 16, paddingLeft: 4, scrollbarWidth: 'none' }}>
        {rotation.map((r, i) => (
          <div key={i} onClick={() => {
            if (r.audioSrc) setActiveItem(r);
            else toast(`${r.title} · ${r.artist}`);
          }} style={{
            ...LIQUID_GLASS, padding: 12, borderRadius: 16, width: 140, flexShrink: 0,
            transform: `rotate(${i === 1 ? '2deg' : '-2deg'})`, cursor: 'pointer', transition: 'transform 150ms ease'
          }} onMouseDown={(e) => e.currentTarget.style.transform = `rotate(${i === 1 ? '2deg' : '-2deg'}) scale(0.95)`} onMouseUp={(e) => e.currentTarget.style.transform = `rotate(${i === 1 ? '2deg' : '-2deg'}) scale(1)`} onMouseLeave={(e) => e.currentTarget.style.transform = `rotate(${i === 1 ? '2deg' : '-2deg'}) scale(1)`}>
             <div style={{ width: '100%', aspectRatio: '1', borderRadius: 10, backgroundImage: `url(${r.photo})`, backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: 12 }} />
             <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, textAlign: 'center', color: '#14110D' }}>{r.artist}</div>
          </div>
        ))}
      </div>

      {activeItem && (
        <div 
          onClick={() => setActiveItem(null)}
          style={{
            position: 'absolute', inset: 0, zIndex: 1000,
            background: 'rgba(10, 9, 7, 0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'fadeInOverlay 0.3s ease forwards'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ width: 280, height: 380, perspective: 1200 }}
          >
             <div style={{
                width: '100%', height: '100%', position: 'relative',
                transformStyle: 'preserve-3d',
                animation: 'flipInZoom 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
             }}>
                {/* The "Back" of the card which faces the user after a 180deg flip */}
                <div style={{
                  ...LIQUID_GLASS_DARK, padding: 24, borderRadius: 24,
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                  color: '#fff', overflow: 'hidden', boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
                  transform: 'rotateY(180deg)'
                }}>
                  <div style={{ backgroundImage: `url(${activeItem.coverArt ?? activeItem.photo})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'absolute', inset: 0, opacity: 0.45 }} />
                  <div style={{ zIndex: 1, position: 'relative' }}>
                    {activeItem.audioSrc && (
                    <div onClick={() => {
                        if (audioRef.current) {
                           if (audioRef.current.paused) {
                               audioRef.current.play();
                               setIsPlaying(true);
                           } else {
                               audioRef.current.pause();
                               setIsPlaying(false);
                           }
                        }
                    }} style={{ width: 64, height: 64, borderRadius: 99, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '1px solid rgba(255,255,255,0.5)', cursor: 'pointer', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}>
                       {isPlaying ? (
                          <span className="pv2-eq" style={{ display: 'flex', transform: 'scale(1.4)' }}>
                            <span style={{ background: '#fff' }} />
                            <span style={{ background: '#fff' }} />
                            <span style={{ background: '#fff' }} />
                          </span>
                       ) : (
                          <span style={{ fontSize: 28, transform: 'translateX(3px)' }}>▶️</span>
                       )}
                    </div>
                    )}
                    <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22, marginBottom: 6, textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>{activeItem.title}</div>
                    <div style={{ fontFamily: BODY, fontSize: 16, color: 'rgba(255,255,255,0.9)', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>{activeItem.artist}</div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SecretTrackCard({ toast, accentColor = '#F97316', label = 'Late Night Anthem', title = 'Nightcrawler', artist = 'Travis Scott', cover = '/assets/artists/nightcrawlerbside.jpeg' }) {
  const [revealed, setRevealed] = useState(false);
  const pressTimer = useRef(null);

  const startPress = () => {
    pressTimer.current = setTimeout(() => {
      setRevealed(true);
      if (window.ReactNativeWebView) {
         window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'HAPTIC', style: 'heavy' }));
      } else if (navigator.vibrate) {
         navigator.vibrate(50);
      }
    }, 300);
  };

  const endPress = () => {
    clearTimeout(pressTimer.current);
    setRevealed(false);
  };

  return (
    <div 
      onMouseDown={startPress} onMouseUp={endPress} onMouseLeave={endPress}
      onTouchStart={startPress} onTouchEnd={endPress}
      style={{
        marginTop: 18, margin: `0 22px`, borderRadius: 22, overflow: 'hidden', position: 'relative',
        background: '#0A0907', color: '#fff', padding: 16, cursor: 'pointer',
        boxShadow: '0 8px 24px -8px rgba(20,17,13,0.3)', userSelect: 'none', WebkitUserSelect: 'none',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, opacity: 0.15, backgroundImage: `radial-gradient(circle at right, ${accentColor}, transparent 60%)` }} />
      <div style={{ 
        display: 'flex', gap: 14, alignItems: 'center', 
        opacity: revealed ? 1 : 0, transform: revealed ? 'scale(1)' : 'scale(0.95)',
        transition: 'opacity 0.2s, transform 0.2s',
      }}>
        <div style={{ width: 48, height: 48, borderRadius: 10, background: accentColor, backgroundImage: `url(${cover})`, backgroundSize: 'cover' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: accentColor, marginBottom: 2 }}>{label}</div>
        {isEditing && <div style={{ position: 'absolute', top: 24, right: 20, background: labelColor, color: bg, padding: '4px 8px', borderRadius: 99, fontSize: 10, fontWeight: 700 }}>EDIT</div>}
          <div style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 600, fontSize: 16 }}>{title}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{artist}</div>
        </div>
      </div>
      <div style={{
        position: 'absolute', inset: 0, backdropFilter: 'blur(12px) saturate(1.5)', WebkitBackdropFilter: 'blur(12px) saturate(1.5)',
        background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px',
        opacity: revealed ? 0 : 1, transition: 'opacity 0.2s', pointerEvents: 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>🤫</span>
          <span style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 600, fontSize: 15 }}>The B-Side</span>
        </div>
        <span style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 600, fontSize: 12, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: 99 }}>Press & hold to reveal</span>
      </div>
    </div>
  );
}


const PROMPT_LIBRARY = [
  { id: 'hot-take-1', category: 'Hot Takes', stem: 'My most controversial music opinion is', placeholder: 'that Nickelback actually slaps and I will not apologize', deprecated: false },
  { id: 'hot-take-2', category: 'Hot Takes', stem: 'An artist everyone loves that I just don\'t get is', placeholder: 'Drake. The monotone just puts me to sleep.', deprecated: false },
  { id: 'hot-take-3', category: 'Hot Takes', stem: 'The most overrated song of all time is', placeholder: 'Don\'t Stop Believin\' — skip immediately.', deprecated: false },
  { id: 'hot-take-4', category: 'Hot Takes', stem: 'Aux cord privileges revoked immediately if you play', placeholder: 'anything by Imagine Dragons. Instant ban.', deprecated: false },

  { id: 'music-dealbreaker', category: 'Compatibility', stem: 'Music dealbreaker', placeholder: 'you only listen to the Spotify Top 50 playlist', deprecated: false },
  { id: 'compat-2', category: 'Compatibility', stem: 'We\'ll get along if your playlist has', placeholder: 'an embarrassing amount of 2010s Kesha', deprecated: false },
  { id: 'compat-3', category: 'Compatibility', stem: 'I\'ll fall for you if you send me a song that', placeholder: 'sounds like driving down PCH at midnight', deprecated: false },
  { id: 'compat-4', category: 'Compatibility', stem: 'We can\'t be friends if your most-played song is', placeholder: 'Mr. Brightside. I just can\'t do it anymore.', deprecated: false },

  { id: 'confess-1', category: 'Confessions', stem: 'My guilty pleasure song is', placeholder: 'Party In The U.S.A. and I know every word.', deprecated: false },
  { id: 'confess-2', category: 'Confessions', stem: 'A song I know every word to but will deny it is', placeholder: 'Baby by Justin Bieber.', deprecated: false },
  { id: 'confess-3', category: 'Confessions', stem: 'The last song that made me cry was', placeholder: 'Sparks by Coldplay. It gets me every time.', deprecated: false },
  { id: 'confess-4', category: 'Confessions', stem: 'My 2am on-repeat song right now is', placeholder: 'something embarrassing by The 1975.', deprecated: false },
  { id: 'confess-5', category: 'Confessions', stem: 'The first album I ever truly loved was', placeholder: 'Demon Days by Gorillaz. A masterpiece.', deprecated: false },

  { id: 'main-1', category: 'Main Character', stem: 'My walk-to-class soundtrack is', placeholder: 'exclusively 90s hip-hop to make me feel cool', deprecated: false },
  { id: 'main-2', category: 'Main Character', stem: 'If my life had a theme song this semester it would be', placeholder: 'Survival by Eminem because exams are killing me', deprecated: false },
  { id: 'main-3', category: 'Main Character', stem: 'The artist that basically raised me is', placeholder: 'Taylor Swift. I grew up with every era.', deprecated: false },
  { id: 'main-4', category: 'Main Character', stem: 'Dating my playlist is like', placeholder: 'getting whiplash between techno and country', deprecated: false },
  { id: 'main-5', category: 'Main Character', stem: 'A lyric I think about way too much is', placeholder: '\"Real G\'s move in silence like lasagna\"', deprecated: false },

  { id: 'irl-1', category: 'IRL', stem: 'The concert I\'d sell my textbooks for is', placeholder: 'Frank Ocean if he ever actually performs again', deprecated: false },
  { id: 'irl-2', category: 'IRL', stem: 'My go-to karaoke song is', placeholder: 'Mr. Brightside. Yes, I am that guy.', deprecated: false },
  { id: 'irl-3', category: 'IRL', stem: 'Best live show I\'ve ever been to was', placeholder: 'Fred again.. at the Coliseum. Life changing.', deprecated: false },
  { id: 'irl-4', category: 'IRL', stem: 'Together, we could split two tickets to see', placeholder: 'Odesza because their visuals are insane', deprecated: false },
  { id: 'irl-5', category: 'IRL', stem: 'The song I need to hear live before I graduate is', placeholder: 'Losing It by Fisher at a massive festival', deprecated: false },
];


const defaultEdits = {};

function ProfileTabV2() {
  const profile = useActiveUserProfile();
  const activeUser = useActiveUser();
  const { overrideUserId } = usePV2();
  const [activeUserId] = usePersistentState('ligo:active_user', 'jordan');
  
  const viewerUser = USERS[activeUserId] || USERS['jordan'];
  const viewerProfile = { ...PROFILE_PRESENTATION_DEFAULTS, ...viewerUser.profile };
  
  const isOwnProfile = !overrideUserId || overrideUserId === activeUserId;
  
  const { loading: trailLoading, error: trailError, answerTrail } = useDailyReveal(activeUser.id);
  const initials = activeUser.name.split(' ').map(n => n[0]).join('.') + '.';
  const [isEditingState, setIsEditing] = useState(false);
  const [previewMode, setPreviewMode] = useState(false); // Edit/Preview toggle
  const isEditing = isOwnProfile && isEditingState && !previewMode; // force false on public view or preview
  const isInEditFlow = isOwnProfile && isEditingState; // true even in preview mode, for showing the toggle
  const isSelfView = isOwnProfile && !previewMode; // use this to gate personal UI elements
  
  const [edits, setEdits] = usePersistentState('ligo:profile_edits_v4', defaultEdits);
  const [activeEditSheet, setActiveEditSheet] = useState(null); // { type: 'anthem' | 'text' | 'genres', key?: string, initialValue?: any }
  
  const currentProfile = { ...profile, ...edits };

  const handleClearPrompt = (idx) => {
    if (window.confirm('Remove this prompt and your answer?')) {
      setEdits(prev => {
        const newPrompts = [...(prev.prompts || [])];
        newPrompts[idx] = null;
        // Compact: remove trailing nulls
        while (newPrompts.length > 0 && !newPrompts[newPrompts.length - 1]) newPrompts.pop();
        return { ...prev, prompts: newPrompts };
      });
    }
  };

  const renderSlot = (idx, variant) => {
    const promptData = userPrompts[idx];
    if (!promptData || !promptData.answer) {
      if (isEditing) return <EmptyPromptSlot key={`empty-${idx}`} onClick={() => setActiveEditSheet({ type: 'prompt', slotIndex: idx })} />;
      return null;
    }
    const libraryDef = PROMPT_LIBRARY.find(p => p.id === promptData.id) || { stem: 'Missing Prompt' };
    return (
      <PromptCard 
        key={`prompt-${idx}`}
        label={libraryDef.stem} 
        text={promptData.answer} 
        variant={variant} 
        isEditing={isEditing} 
        onClick={() => setActiveEditSheet({ type: 'prompt', slotIndex: idx })}
        onClear={() => handleClearPrompt(idx)}
      />
    );
  };



  const userPrompts = currentProfile.prompts || [];



  const gate = useProfileGate();
  const {
    openReceipts, openSheet, toast, notifUnread, playingIdx, toggleTrack, meterOn, runMeterAnim, matchReason, onClose
  } = usePV2();

  const onScoreInView = useCallback(() => {
    setTimeout(runMeterAnim, 400);
  }, [runMeterAnim]);

  const nowPlayingDefault = profile.nowListening
    ? { title: profile.nowListening.title, artist: profile.nowListening.artist, photo: profile.nowListening.coverArt ?? profile.nowListening.photo ?? profile.playlistTracks[0]?.coverArt ?? profile.playlistTracks[0]?.photo }
    : { title: profile.playlistTracks[0]?.title ?? '', artist: profile.playlistTracks[0]?.artist ?? '', photo: profile.playlistTracks[0]?.coverArt ?? profile.playlistTracks[0]?.photo ?? '' };
  const nowPlaying = playingIdx != null
    ? { title: profile.playlistTracks[playingIdx].title, artist: profile.playlistTracks[playingIdx].artist, photo: profile.playlistTracks[playingIdx].coverArt ?? profile.playlistTracks[playingIdx].photo }
    : nowPlayingDefault;

  const tap = { cursor: 'pointer', transition: `transform 150ms ${EASE}` };
  const onTap = (fn) => ({
    onClick: fn,
    onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } },
    role: 'button',
    tabIndex: 0,
  });

  return (
    <div style={{ paddingBottom: isOwnProfile ? 116 : 180, background: '#FAFAF8', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient background for Hypnotist */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 600, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse at 50% -20%, rgba(245,215,131,0.15) 0%, transparent 70%)',
        animation: 'ligo-mesh-breathe 8s ease-in-out infinite alternate',
      }} />

      <div style={{ padding: `${onClose ? 40 : 76}px ${EDGE}px 0`, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {!onClose ? (
            <button type="button" aria-label="Settings" onClick={() => openSheet('settings')} style={{
              width: 40, height: 40, borderRadius: 13, border: '1px solid rgba(20,17,13,0.06)',
              background: 'rgba(20,17,13,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'transform 0.15s ease',
            }} onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'} onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <Icon.Settings width={20} height={20} />
            </button>
          ) : <div style={{ width: 40 }} />}
          
          <div style={{ color: '#F97316' }}>
            <Wordmark size={24} />
          </div>

          {onClose ? (
            <button type="button" aria-label="Close" onClick={(e) => { e.stopPropagation(); onClose(); }} style={{
              width: 40, height: 40, borderRadius: 13, border: '1px solid rgba(20,17,13,0.06)',
              background: 'rgba(20,17,13,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'transform 0.15s ease',
            }} onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'} onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <Icon.Close width={20} height={20} />
            </button>
          ) : (
            <button type="button" onClick={() => { if (isInEditFlow) { setIsEditing(false); setPreviewMode(false); } else { setIsEditing(true); setPreviewMode(false); } }} style={{
              padding: '8px 16px', borderRadius: 99, border: 0,
              background: isInEditFlow ? '#F97316' : '#14110D', color: '#fff',
              display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: DISPLAY, fontWeight: 600, fontSize: 13,
              cursor: 'pointer', transition: 'transform 0.15s ease, background 0.15s ease',
            }}>
              {isInEditFlow ? 'Done' : 'Edit Profile'}
            </button>
          )}
        </div>

        {/* Edit / Preview toggle — only visible when in edit flow */}
        {isInEditFlow && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.04)', borderRadius: 99, padding: 3 }}>
              <button onClick={() => setPreviewMode(false)} style={{
                padding: '8px 24px', borderRadius: 99, border: 0, cursor: 'pointer',
                fontFamily: DISPLAY, fontWeight: 600, fontSize: 13,
                background: !previewMode ? '#14110D' : 'transparent',
                color: !previewMode ? '#fff' : 'rgba(0,0,0,0.45)',
                transition: 'all 0.2s ease',
              }}>Edit</button>
              <button onClick={() => setPreviewMode(true)} style={{
                padding: '8px 24px', borderRadius: 99, border: 0, cursor: 'pointer',
                fontFamily: DISPLAY, fontWeight: 600, fontSize: 13,
                background: previewMode ? '#14110D' : 'transparent',
                color: previewMode ? '#fff' : 'rgba(0,0,0,0.45)',
                transition: 'all 0.2s ease',
              }}>Preview</button>
            </div>
          </div>
        )}

        {matchReason && (
          <div style={{
            marginTop: 24,
            padding: '16px 20px',
            borderRadius: 16,
            background: 'linear-gradient(160deg, rgba(234,140,225,0.2), rgba(255,255,255,0.4))',
            border: '1px solid rgba(234,140,225,0.4)',
            boxShadow: '0 4px 20px rgba(234,140,225,0.1)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <span style={{ color: '#D946C2' }}>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
                </svg>
              </span>
              <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#D946C2' }}>Why you matched</span>
            </div>
            <p style={{ fontFamily: BODY, fontSize: 14, color: 'rgba(20,17,13,0.85)', lineHeight: 1.5, margin: 0, textWrap: 'pretty' }}>
              {matchReason}
            </p>
          </div>
        )}

        <Reveal style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: 24 }}>
          <div style={{ position: 'relative' }}>
            {/* Main Avatar Circle */}
            <div style={{
              width: 96, height: 96, borderRadius: 99,
              border: '2px solid #FAFAF8',
              boxShadow: '0 0 0 2px rgba(249,115,22,0.2)',
              backgroundImage: (gate.tier === 't2' && gate.identityVisible) ? `url(${activeUser.avatar})` : 'none', backgroundColor: (gate.tier !== 't2' || !gate.identityVisible) ? '#EAE8E3' : 'transparent', backgroundSize: 'cover', backgroundPosition: 'center'
            }} />

            {/* Green online dot overlay */}
            <div style={{
              position: 'absolute', bottom: 2, right: 2, width: 18, height: 18, borderRadius: 99,
              background: '#71C07F', border: '3px solid #FAFAF8',
            }} />
          </div>
          
          {gate.isConnectionNight && !gate.identityVisible ? <div style={{ marginTop: 16, fontFamily: DISPLAY, fontWeight: 600, fontSize: 24, color: '#14110D', letterSpacing: '-0.02em' }}>Anonymous</div> : gate.isConnectionNight && gate.tier !== 't2' ? <div style={{ marginTop: 16, fontFamily: DISPLAY, fontWeight: 600, fontSize: 24, color: '#14110D', letterSpacing: '-0.02em' }}>{initials}</div> : <div style={{ marginTop: 16, fontFamily: DISPLAY, fontWeight: 600, fontSize: 24, color: '#14110D', letterSpacing: '-0.02em' }}>{activeUser.name}</div>}
          {gate.isConnectionNight && gate.tier === 't2' && (
             <button style={{ marginTop: 24, background: '#14110D', color: '#fff', padding: '16px 24px', borderRadius: 99, fontFamily: DISPLAY, fontWeight: 600, fontSize: 16, border: 'none', cursor: 'pointer' }}>Mutual! Plan a hang</button>
          )}
    
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <span style={{ ...LIQUID_GLASS, padding: '6px 12px', borderRadius: 99, fontFamily: 'Bricolage Grotesque', fontWeight: 600, fontSize: 12, color: '#14110D' }}>{activeUser.yearLevel}</span>
            <span style={{ ...LIQUID_GLASS, padding: '6px 12px', borderRadius: 99, fontFamily: 'Bricolage Grotesque', fontWeight: 600, fontSize: 12, color: '#14110D' }}>{activeUser.pronouns}</span>
            <span style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 600, fontSize: 12, color: 'rgba(20,17,13,0.40)', marginLeft: 4 }}>{activeUser.school}</span>
          </div>


        </Reveal>
      </div>





      {!isOwnProfile && <InCommonCard viewer={viewerProfile} viewed={currentProfile} />}
      <AnthemCard anthem={currentProfile.anthem} toast={toast} isEditing={isEditing} onClick={() => setActiveEditSheet({ type: 'anthem' })} />
      {renderSlot(0, 'dark')}
      <TasteBlock 
        artists={currentProfile.artists} 
        genres={currentProfile.favoriteGenres} 
        isEditing={isEditing} 
        onEditGenres={() => setActiveEditSheet({ type: 'genres', initialValue: currentProfile.favoriteGenres })} 
        onEditArtists={() => setActiveEditSheet({ type: 'artists', initialValue: currentProfile.artists })}
      />
      {renderSlot(1, 'accent')}
      {isSelfView && (
        <Reveal style={{ padding: `10px ${EDGE}px 0` }}>
          <div style={{
            borderRadius: 22, padding: 20,
            background: 'linear-gradient(165deg, rgba(245,215,131,0.16), rgba(249,115,22,0.05))',
            border: '1px solid rgba(245,215,131,0.45)',
          }}>
            <Eyebrow dotColor="#C2410C">Your Ligo horoscope</Eyebrow>
            <h2 style={{
              fontFamily: DISPLAY, fontWeight: 600, fontSize: 22, marginTop: 12,
              letterSpacing: '-0.02em', lineHeight: 1.12,
            }}>{currentProfile.horoscope?.headline}</h2>
            <p style={{ marginTop: 10, fontSize: 14.5, lineHeight: 1.55, color: 'rgba(20,17,13,0.60)' }}>
              {currentProfile.horoscope?.body}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 14 }}>
              {currentProfile.horoscope?.chips.map((chip) => (
                <ChipTag key={chip.label} tone={chip.tone}>{chip.label}</ChipTag>
              ))}
            </div>
            <button type="button" onClick={() => openSheet('pastreads')} style={{
              marginTop: 14, border: 0, background: 'none', padding: 0, cursor: 'pointer',
              fontFamily: DISPLAY, fontWeight: 600, fontSize: 12.5, color: '#F97316',
              display: 'inline-flex', alignItems: 'center', gap: 5,
            }}>Past reads <Icon.Chev width={14} height={14} /></button>
          </div>
        </Reveal>
      )}

      {renderSlot(2, 'light')}
      {!isOwnProfile && <CountdownBanner />}
      {/* Edit Sheets Overlay */}
      {activeEditSheet && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} onClick={() => setActiveEditSheet(null)} />
          <div style={{ background: '#FAFAF8', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: '24px', position: 'relative', minHeight: '60vh', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: 40, height: 4, background: 'rgba(0,0,0,0.1)', borderRadius: 99, margin: '0 auto 20px' }} />
            
            {activeEditSheet.type === 'anthem' && (
              <EditAnthemView onClose={() => setActiveEditSheet(null)} onSave={(track) => {
                setEdits(prev => ({ ...prev, anthem: track }));
                setActiveEditSheet(null);
              }} />
            )}

            {activeEditSheet.type === 'prompt' && (
              <EditPromptView 
                slotIndex={activeEditSheet.slotIndex} 
                currentPrompts={currentProfile.prompts || []}
                onClose={() => setActiveEditSheet(null)} 
                onSave={(slotIndex, promptData) => {
                  setEdits(prev => {
                    const newPrompts = [...(prev.prompts || [])];
                    newPrompts[slotIndex] = promptData;
                    return { ...prev, prompts: newPrompts };
                  });
                  setActiveEditSheet(null);
                }} 
              />
            )}
            
            {activeEditSheet.type === 'text' && (
              <EditTextPromptView 
                label={activeEditSheet.label} 
                initialValue={activeEditSheet.initialValue} 
                onClose={() => setActiveEditSheet(null)} 
                onSave={(text) => {
                  setEdits(prev => ({ ...prev, [activeEditSheet.key]: text }));
                  setActiveEditSheet(null);
                }} 
              />
            )}
            
            {activeEditSheet.type === 'artists' && (
              <EditArtistsView 
                initialValue={activeEditSheet.initialValue} 
                onClose={() => setActiveEditSheet(null)} 
                onSave={(artists) => {
                  setEdits(prev => ({ ...prev, artists: artists }));
                  setActiveEditSheet(null);
                }} 
              />
            )}
            {activeEditSheet.type === 'genres' && (
              <EditGenresView 
                initialValue={activeEditSheet.initialValue} 
                onClose={() => setActiveEditSheet(null)} 
                onSave={(genres) => {
                  setEdits(prev => ({ ...prev, favoriteGenres: genres }));
                  setActiveEditSheet(null);
                }} 
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ReceiptsSection({ title, children }) {
  return (
    <section style={{ padding: `0 ${EDGE}px`, marginTop: 28 }}>
      <h2 style={{
        fontFamily: DISPLAY, fontWeight: 600, fontSize: 18, letterSpacing: '-0.015em', color: '#14110D',
      }}>{title}</h2>
      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
    </section>
  );
}

function StreakTrophyRail() {
  const profile = useActiveUserProfile();
  const { openSheet } = usePV2();
  const earnedCount = STREAK_TROPHIES.filter((t) => currentProfile.longestStreak >= t.days).length;
  const next = STREAK_TROPHIES.find((t) => currentProfile.longestStreak < t.days);

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{
        padding: `0 ${EDGE}px`, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        marginBottom: 10,
      }}>
        <span style={{
          fontFamily: DISPLAY, fontWeight: 600, fontSize: 11, color: 'rgba(20,17,13,0.45)',
        }}>Streak trophies</span>
        <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 11, color: '#F97316' }}>
          {earnedCount}/{STREAK_TROPHIES.length} unlocked
        </span>
      </div>
      <div style={{
        display: 'flex', gap: 10, overflowX: 'auto', padding: `2px ${EDGE}px 4px`,
        scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
      }}>
        {STREAK_TROPHIES.map((t) => {
          const earned = currentProfile.longestStreak >= t.days;
          const currentTier = [...STREAK_TROPHIES].filter((x) => x.days <= currentProfile.currentStreak).pop();
          const highlight = earned && currentTier && t.id === currentTier.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => openSheet?.(trophySheetId(t.id))}
              aria-label={`${t.title} · ${earned ? 'unlocked' : 'locked'}`}
              style={{
                flexShrink: 0, width: 76, border: 0, padding: 0, cursor: 'pointer',
                background: 'transparent', textAlign: 'center',
                opacity: earned ? 1 : 0.42,
              }}
            >
              <div style={{
                width: 64, height: 64, margin: '0 auto', borderRadius: 20,
                background: earned
                  ? `linear-gradient(155deg, ${t.accent}22, ${t.accent}55)`
                  : 'rgba(20,17,13,0.05)',
                border: `2px solid ${highlight ? '#F97316' : earned ? `${t.accent}55` : 'rgba(20,17,13,0.08)'}`,
                boxShadow: highlight ? '0 0 0 4px rgba(249,115,22,0.14)' : (earned ? CARD : 'none'),
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
                filter: earned ? 'none' : 'grayscale(1)',
              }}>
                <span style={{
                  fontFamily: DISPLAY, fontWeight: 700, fontSize: 18,
                  color: earned ? t.accent : 'rgba(20,17,13,0.35)',
                  lineHeight: 1,
                }}>{earned ? t.icon : '·'}</span>
                <span style={{
                  fontFamily: DISPLAY, fontWeight: 700, fontSize: 10, letterSpacing: '0.06em',
                  color: earned ? '#14110D' : 'rgba(20,17,13,0.35)',
                }}>{t.short}</span>
              </div>
              <div style={{
                marginTop: 8, fontFamily: DISPLAY, fontWeight: 600, fontSize: 11,
                color: earned ? '#14110D' : 'rgba(20,17,13,0.40)', lineHeight: 1.15,
              }}>{t.label}</div>
              {earned && (
                <div style={{
                  marginTop: 3, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: '#71C07F', fontFamily: DISPLAY,
                }}>Earned</div>
              )}
            </button>
          );
        })}
      </div>
      {next && (
        <p style={{
          padding: `10px ${EDGE}px 0`, fontSize: 12, color: 'rgba(20,17,13,0.45)', lineHeight: 1.4,
        }}>
          Next up: <b style={{ fontFamily: DISPLAY, color: '#14110D' }}>{next.label}</b> — {next.days - currentProfile.longestStreak} more day{next.days - currentProfile.longestStreak === 1 ? '' : 's'} at your campus.
        </p>
      )}
    </div>
  );
}

function ReceiptRow({ stat, label, sub }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, padding: '14px 16px',
      border: '1px solid rgba(20,17,13,0.06)', boxShadow: CARD,
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{
        fontFamily: DISPLAY, fontWeight: 700, fontSize: stat.length > 4 ? 20 : 26,
        color: '#F97316', letterSpacing: '-0.03em', minWidth: 56, flexShrink: 0,
      }}>{stat}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 14, color: '#14110D', lineHeight: 1.25 }}>{label}</div>
        {isEditing && <div style={{ position: 'absolute', top: 24, right: 20, background: labelColor, color: bg, padding: '4px 8px', borderRadius: 99, fontSize: 10, fontWeight: 700 }}>EDIT</div>}
        {sub && <div style={{ fontSize: 12.5, color: 'rgba(20,17,13,0.55)', marginTop: 4, lineHeight: 1.4 }}>{sub}</div>}
      </div>
    </div>
  );
}

export function TheReceiptsScreen({ onClose }: { onClose: () => void }) {
  const profile = useActiveUserProfile();

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 50, background: '#FAFAF8',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <header style={{
        padding: '56px 12px 12px', display: 'flex', alignItems: 'center', gap: 8,
        borderBottom: '1px solid rgba(20,17,13,0.06)', flexShrink: 0, background: '#FAFAF8',
      }}>
        <button type="button" onClick={onClose} aria-label="Back" style={{
          width: 40, height: 40, borderRadius: 13, border: '1px solid rgba(20,17,13,0.06)',
          background: 'rgba(20,17,13,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#14110D',
        }}><Icon.Back width={22} height={22} /></button>
        <h1 style={{
          fontFamily: DISPLAY, fontWeight: 600, fontSize: 20, letterSpacing: '-0.02em', margin: 0,
        }}>The Receipts</h1>
      </header>

      <div id="receipts-scroll" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingBottom: 40, scrollbarWidth: 'none' }}>
        {/* Streak summary */}
        <div style={{ padding: `14px 0 0` }}>
          <div style={{ display: 'flex', gap: 10, padding: `0 ${EDGE}px` }}>
            {[
              { label: 'Current streak', value: String(currentProfile.currentStreak), unit: 'days' },
              { label: 'Longest streak', value: String(currentProfile.longestStreak), unit: 'days' },
            ].map((s) => (
              <div key={s.label} style={{
                flex: 1, background: '#fff', borderRadius: 18, padding: '16px 14px',
                border: '1px solid rgba(20,17,13,0.06)', boxShadow: CARD,
              }}>
                <div style={{
                  fontFamily: DISPLAY, fontWeight: 700, fontSize: 10, letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: 'rgba(20,17,13,0.45)',
                }}>{s.label}</div>
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{
                    fontFamily: DISPLAY, fontWeight: 600, fontSize: 34, color: '#F97316', letterSpacing: '-0.03em',
                  }}>{s.value}</span>
                  <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 14, color: 'rgba(20,17,13,0.50)' }}>{s.unit}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <div style={{
              fontFamily: DISPLAY, fontWeight: 600, fontSize: 11, color: 'rgba(20,17,13,0.45)', marginBottom: 10,
            }}>Last 30 days</div>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)', gap: 5,
            }}>
              {RECEIPTS_DOT_HISTORY.map((filled, i) => (
                <div key={i} style={{
                  aspectRatio: 1, borderRadius: 99,
                  background: filled ? '#F97316' : 'rgba(20,17,13,0.08)',
                  boxShadow: filled ? '0 0 0 2px rgba(249,115,22,0.12)' : 'none',
                }} title={filled ? 'Answered' : 'Missed'} />
              ))}
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between', marginTop: 8,
              fontSize: 10, color: 'rgba(20,17,13,0.35)', fontFamily: DISPLAY, fontWeight: 600,
            }}>
              <span>30d ago</span><span>Today</span>
            </div>
          </div>
          <StreakTrophyRail />
        </div>

      </div>
    </div>
  );
}






function AnthemCard({ anthem, toast, isEditing, onClick }) {
  if (!anthem) return null;
  return (
    <Reveal style={{ padding: `10px ${EDGE}px 0` }}>
      <div onClick={isEditing ? onClick : () => toast(`Playing 30s preview of ${anthem.title}`)} style={{
        position: 'relative', borderRadius: 24, overflow: 'hidden', cursor: 'pointer',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)', transition: 'transform 0.15s ease',
        aspectRatio: '1 / 1'
      }} onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'} onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${anthem.coverArt})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,9,7,0.9) 0%, rgba(10,9,7,0.4) 40%, rgba(10,9,7,0) 100%)' }} />
        <div style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(10,9,7,0.4)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', padding: '6px 12px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: 99, background: '#F97316' }} />
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff' }}>Profile Anthem</span>
        </div>
        {isEditing && <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(249,115,22,0.9)', color: '#fff', padding: '6px 12px', borderRadius: 99, fontSize: 10, fontWeight: 700, backdropFilter: 'blur(4px)' }}>EDIT</div>}
        <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
            <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 28, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{anthem.title}</div>
            <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{anthem.artist}</div>
          </div>
          <div style={{ width: 52, height: 52, borderRadius: 99, background: '#fff', color: '#14110D', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 3 }}><path d="M8 5v14l11-7z" /></svg>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function TasteBlock({ artists, genres, isEditing, onEditGenres, onEditArtists }) {
  if (!artists || !genres) return null;
  return (
    <Reveal style={{ marginTop: 10 }}>
      <div onClick={isEditing ? onEditArtists : undefined} style={{ cursor: isEditing ? 'pointer' : 'default', position: 'relative' }}>
        <div style={{ padding: `0 ${EDGE}px 12px` }}>
           <Eyebrow dark={false}>Heavy rotation</Eyebrow>
           {isEditing && <div style={{ position: 'absolute', top: 0, right: 24, background: '#F97316', color: '#fff', padding: '4px 8px', borderRadius: 99, fontSize: 10, fontWeight: 700 }}>EDIT ARTISTS</div>}
        </div>
        <div style={{ display: 'flex', gap: 14, overflowX: 'auto', padding: `0 ${EDGE}px 8px`, scrollbarWidth: 'none' }}>
        {artists.map((a) => (
          <div key={a.name} style={{ flexShrink: 0, width: 84, textAlign: 'center' }}>
            <div style={{
              width: 84, height: 84, borderRadius: 99,
              backgroundImage: `url(${a.photo})`, backgroundSize: 'cover', backgroundPosition: a.pos || 'center',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12), 0 4px 12px rgba(20,17,13,0.1)',
            }} />
            <div style={{ marginTop: 10, fontFamily: DISPLAY, fontWeight: 600, fontSize: 13, color: '#14110D' }}>{a.name}</div>
          </div>
        ))}
      </div>
      </div>
      <div onClick={isEditing ? onEditGenres : undefined} style={{ padding: `16px ${EDGE}px 0`, cursor: isEditing ? 'pointer' : 'default', position: 'relative' }}>
        <div style={{ marginBottom: 12 }}>
          <Eyebrow dark={false}>Favorite Genres</Eyebrow>
        </div>
        {isEditing && <div style={{ position: 'absolute', top: 16, right: 24, background: '#F97316', color: '#fff', padding: '4px 8px', borderRadius: 99, fontSize: 10, fontWeight: 700 }}>EDIT GENRES</div>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {genres.map(g => (
            <div key={g} style={{ ...LIQUID_GLASS, padding: '8px 14px', borderRadius: 99, fontFamily: DISPLAY, fontWeight: 600, fontSize: 13, color: '#14110D' }}>{g}</div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}


function EmptyPromptSlot({ onClick }) {
  return (
    <Reveal style={{ padding: `10px ${EDGE}px 0` }}>
      <div onClick={onClick} style={{ 
        border: '2px dashed rgba(249,115,22,0.3)', borderRadius: 16, padding: '24px 20px', 
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
        cursor: 'pointer', background: 'rgba(249,115,22,0.02)'
      }}>
        <div style={{ width: 40, height: 40, borderRadius: 99, background: 'rgba(249,115,22,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F97316' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
        </div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 600, color: '#F97316', fontSize: 14 }}>Tap to add a prompt</div>
      </div>
    </Reveal>
  );
}

function PromptCard({ label, text, variant = 'light', isEditing, onClick, onClear }) {
  if (!text) return null;
  
  let bg = 'linear-gradient(160deg, rgba(255,255,255,0.9), rgba(250,250,248,0.95))';
  let color = '#14110D';
  let labelColor = '#F97316';
  let border = '1px solid rgba(249,115,22,0.15)';
  let clearBg = 'rgba(0,0,0,0.08)';
  let clearColor = 'rgba(0,0,0,0.5)';
  
  if (variant === 'dark') {
    bg = '#14110D';
    color = '#fff';
    labelColor = '#F5D783';
    border = '1px solid rgba(255,255,255,0.1)';
    clearBg = 'rgba(255,255,255,0.15)';
    clearColor = 'rgba(255,255,255,0.6)';
  } else if (variant === 'accent') {
    bg = 'linear-gradient(160deg, rgba(249,115,22,0.1), rgba(245,215,131,0.15))';
    border = '1px solid rgba(249,115,22,0.2)';
    labelColor = '#C2410C';
  }

  return (
    <Reveal style={{ padding: `10px ${EDGE}px 0` }}>
      <div onClick={isEditing ? onClick : undefined} style={{ cursor: isEditing ? 'pointer' : 'default', position: 'relative',
        borderRadius: 24, padding: '24px 20px', border, background: bg, boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
      }}>
        {/* ✕ clear button — edit mode only */}
        {isEditing && onClear && (
          <button onClick={(e) => { e.stopPropagation(); onClear(); }} style={{
            position: 'absolute', top: 12, right: 12, width: 28, height: 28, borderRadius: 99,
            background: clearBg, border: 0, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: clearColor,
            fontSize: 16, fontWeight: 700, lineHeight: 1,
          }}>✕</button>
        )}
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: labelColor, marginBottom: 12 }}>{label}</div>
        {isEditing && <div style={{ position: 'absolute', top: 24, right: onClear ? 48 : 20, background: labelColor, color: variant === 'dark' ? '#14110D' : '#fff', padding: '4px 8px', borderRadius: 99, fontSize: 10, fontWeight: 700 }}>EDIT</div>}
        <div style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 500, color, lineHeight: 1.25, letterSpacing: '-0.02em' }}>
          {text}
        </div>
      </div>
    </Reveal>
  );
}
export function ProfileV2Shell() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <ProfileScreenRouter />
      <ProfileV2Sheets />
      <ProfileToast />
    </div>
  );
}

function ProfileScreenRouter() {
  const activeUser = useActiveUser();
  const profile = activeUser.profile;
  const { screen, closeArchetypeGallery, openArchetypeFromGallery } = usePV2();

  return (
    <div key={activeUser.id} style={{ position: 'absolute', inset: 0, animation: 'profileFadeIn 0.35s cubic-bezier(0.2, 0.7, 0.2, 1)' }}>
      <style>{`
        @keyframes profileFadeIn {
          0% { opacity: 0; transform: scale(0.98) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      {screen === "archetype-gallery" && (
        <ArchetypeGalleryScreen
          earnedId={profile.earnedArchetypeId}
          edge={EDGE}
          onBack={closeArchetypeGallery}
          onSelectArchetype={openArchetypeFromGallery}
        />
      )}
      
      {screen === "profile" && (
        <div id="profile-scroll" style={{
          position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none',
        }}>
          <ProfileTabV2 />
        </div>
      )}
    </div>
  );
}

function NowPlayingStrip({ track, isPlaying }) {
  return (
    <div style={{
      marginTop: 14, width: '100%', maxWidth: 280,
      padding: '8px 12px 8px 8px', borderRadius: 999,
      background: 'rgba(20,17,13,0.04)', border: '1px solid rgba(20,17,13,0.06)',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        backgroundImage: `url(${track.photo})`, backgroundSize: 'cover', backgroundPosition: 'center',
      }} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
        {isPlaying && <NowPip size={5} />}
        <span style={{
          fontFamily: BODY, fontSize: 12, color: 'rgba(20,17,13,0.55)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 600, color: 'rgba(20,17,13,0.70)' }}>now playing</span>
          {' — '}{track.title} · {track.artist}
        </span>
      </div>
    </div>
  );
}



function EditAnthemView({ onClose, onSave }) {
  const [query, setQuery] = useState('');
  const results = query ? searchCatalog(query) : UNIFIED_CATALOG.slice(0, 50);
  
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ fontFamily: DISPLAY, fontSize: 24, fontWeight: 600, margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>Search Anthem</h3>
      <input 
        autoFocus
        type="text" 
        placeholder="Search for a song..." 
        value={query} 
        onChange={e => setQuery(e.target.value)}
        style={{ width: '100%', padding: '16px', borderRadius: 16, border: '1px solid rgba(0,0,0,0.1)', background: '#fff', fontSize: 16, outline: 'none', fontFamily: 'Inter' }}
      />
      <div style={{ flex: 1, overflowY: 'auto', marginTop: 16 }}>
        {results.map((track, i) => (
          <div key={i} onClick={() => onSave(track)} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0', cursor: 'pointer', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
            <img src={track.coverArt} style={{ width: 48, height: 48, borderRadius: 8 }} />
            <div>
              <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 16 }}>{track.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)' }}>{track.artist}</div>
            </div>
          </div>
        ))}
        {query && results.length === 0 && <div style={{ color: 'rgba(0,0,0,0.4)', marginTop: 20 }}>No results found in mock catalog.</div>}
      </div>
    </div>
  );
}


function EditPromptView({ slotIndex, currentPrompts, onClose, onSave }) {
  // If editing an existing slot, default to its data; else start fresh
  const existingPrompt = currentPrompts[slotIndex];
  const [step, setStep] = useState(existingPrompt ? 'answer' : 'picker');
  const [selectedPromptId, setSelectedPromptId] = useState(existingPrompt?.id || null);
  const [answer, setAnswer] = useState(existingPrompt?.answer || '');

  // Pre-calculate categories for the picker
  const activePrompts = PROMPT_LIBRARY.filter(p => !p.deprecated);
  const categories = [...new Set(activePrompts.map(p => p.category))];
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const handleSelectPrompt = (id) => {
    setSelectedPromptId(id);
    setStep('answer');
  };

  const handleSave = () => {
    const trimmed = answer.trim();
    if (!trimmed) return;
    onSave(slotIndex, { id: selectedPromptId, answer: trimmed });
  };

  if (step === 'picker') {
    // Group active library by category
    const byCategory = activePrompts.reduce((acc, p) => {
      if (!acc[p.category]) acc[p.category] = [];
      acc[p.category].push(p);
      return acc;
    }, {});
    
    // used prompt IDs and categories across ALL slots
    const usedIds = currentPrompts.filter(p => p && p.id).map(p => p.id);
    const usedCategories = usedIds.map(id => PROMPT_LIBRARY.find(p => p.id === id)?.category).filter(Boolean);

    // Track which category pill is selected (default: first one)
    const activeCategoryPrompts = byCategory[activeCategory] || [];
    const categoryAlreadyCovered = usedCategories.includes(activeCategory);

    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontFamily: DISPLAY, fontSize: 24, fontWeight: 600, margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>Prompts</h3>
        
        {/* Horizontal pill carousel */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 16, flexShrink: 0, scrollbarWidth: 'none' }}>
          {categories.map(cat => {
            const isActive = cat === activeCategory;
            const isCovered = usedCategories.includes(cat);
            return (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                padding: '8px 16px', borderRadius: 99, border: isActive ? 0 : '1px solid rgba(0,0,0,0.12)',
                background: isActive ? '#14110D' : '#fff', color: isActive ? '#fff' : '#14110D',
                fontFamily: DISPLAY, fontWeight: 600, fontSize: 13, cursor: 'pointer',
                whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6,
                transition: 'all 0.15s ease', flexShrink: 0,
              }}>
                {isCovered && <span style={{ fontSize: 12 }}>✓</span>}
                {cat}
              </button>
            );
          })}
        </div>

        {/* Category nudge bubble */}
        {categoryAlreadyCovered && (
          <div style={{
            background: 'rgba(0,0,0,0.04)', borderRadius: 12, padding: '12px 16px',
            marginBottom: 16, fontSize: 14, color: 'rgba(0,0,0,0.55)', lineHeight: 1.4,
          }}>
            You've got '{activeCategory}' covered. Why not try another category?
          </div>
        )}

        {/* Flat list for the active category */}
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 24 }}>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            {activeCategoryPrompts.map((p, i) => {
              const isUsed = usedIds.includes(p.id) && p.id !== existingPrompt?.id;
              return (
                <div 
                  key={p.id} 
                  onClick={() => !isUsed && handleSelectPrompt(p.id)}
                  style={{ 
                    padding: 16, 
                    borderBottom: i < activeCategoryPrompts.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                    fontSize: 16, 
                    color: isUsed ? 'rgba(0,0,0,0.3)' : '#14110D', 
                    fontWeight: 500,
                    cursor: isUsed ? 'not-allowed' : 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}
                >
                  <span style={{ paddingRight: 16 }}>{p.stem}</span>
                  {isUsed ? (
                    <span style={{ fontSize: 14, color: 'rgba(0,0,0,0.25)' }}>✓</span>
                  ) : (
                    <Icon.ChevronRight width={16} height={16} color="rgba(0,0,0,0.3)" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Answer step
  const activePrompt = PROMPT_LIBRARY.find(p => p.id === selectedPromptId);
  const isValid = answer.trim().length > 0;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <h3 style={{ fontFamily: DISPLAY, fontSize: 24, fontWeight: 600, margin: 0, letterSpacing: '-0.02em', flex: 1, paddingRight: 16 }}>{activePrompt?.stem}</h3>
        <button onClick={() => setStep('picker')} style={{ padding: '6px 12px', background: 'rgba(0,0,0,0.05)', borderRadius: 99, border: 0, fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.6)', cursor: 'pointer', flexShrink: 0 }}>Change</button>
      </div>
      <textarea 
        autoFocus
        value={answer}
        onChange={e => setAnswer(e.target.value.slice(0, 150))}
        placeholder={activePrompt?.placeholder}
        style={{ 
          width: '100%', minHeight: 120, padding: 16, borderRadius: 16,
          border: '1px solid rgba(249,115,22,0.3)', background: '#fff',
          fontFamily: BODY, fontSize: 16, color: '#14110D', resize: 'none',
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.02)'
        }} 
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8, fontSize: 12, color: answer.length >= 150 ? '#ef4444' : 'rgba(0,0,0,0.4)', fontWeight: 600 }}>
        {answer.length} / 150
      </div>
      <div style={{ marginTop: 'auto', paddingTop: 24, display: 'flex', gap: 12 }}>
        <Button variant="ghost" onClick={onClose} style={{ flex: 1 }}>Cancel</Button>
        <Button onClick={handleSave} style={{ flex: 2, opacity: isValid ? 1 : 0.5, pointerEvents: isValid ? 'auto' : 'none' }}>Save</Button>
      </div>
    </div>
  );
}

function EditTextPromptView({ label, initialValue, onClose, onSave }) {
  const [text, setText] = useState(initialValue || '');
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ fontFamily: DISPLAY, fontSize: 24, fontWeight: 600, margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>{label}</h3>
      <textarea 
        autoFocus
        value={text} 
        onChange={e => setText(e.target.value)}
        style={{ width: '100%', height: 160, padding: '16px', borderRadius: 16, border: '1px solid rgba(0,0,0,0.1)', background: '#fff', fontSize: 18, outline: 'none', fontFamily: DISPLAY, resize: 'none' }}
      />
      <button onPointerDown={(e) => { e.preventDefault(); onSave(text); }} style={{ marginTop: 'auto', padding: '18px', background: '#F97316', color: '#fff', borderRadius: 99, border: 0, fontFamily: DISPLAY, fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>
        Save
      </button>
    </div>
  );
}

const ALL_GENRES = ["Organic House", "Indie Dance", "Minimal Techno", "Amapiano", "Dancehall", "Shoegaze", "R&B", "Jazz", "Hip Hop", "Alt Pop", "Hyperpop", "Drum & Bass", "UK Garage", "Afrobeats", "Midwest Emo"];
function EditGenresView({ initialValue, onClose, onSave }) {
  const [selected, setSelected] = useState(initialValue || []);
  
  const toggle = (g) => {
    if (selected.includes(g)) setSelected(selected.filter(x => x !== g));
    else if (selected.length < 5) setSelected([...selected, g]);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ fontFamily: DISPLAY, fontSize: 24, fontWeight: 600, margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>Favorite Genres</h3>
      <p style={{ color: 'rgba(0,0,0,0.5)', margin: '0 0 20px 0', fontSize: 14 }}>Select up to 5 ({selected.length}/5)</p>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {ALL_GENRES.map(g => {
          const isSel = selected.includes(g);
          return (
            <div key={g} onClick={() => toggle(g)} style={{
              padding: '12px 18px', borderRadius: 99, fontFamily: DISPLAY, fontWeight: 600, fontSize: 14, cursor: 'pointer',
              background: isSel ? '#14110D' : '#fff', color: isSel ? '#fff' : '#14110D',
              border: isSel ? '1px solid #14110D' : '1px solid rgba(0,0,0,0.1)'
            }}>
              {g}
            </div>
          );
        })}
      </div>
      <button onPointerDown={(e) => { e.preventDefault(); onSave(selected); }} style={{ marginTop: 'auto', padding: '18px', background: '#F97316', color: '#fff', borderRadius: 99, border: 0, fontFamily: DISPLAY, fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>
        Save
      </button>
    </div>
  );
}

function EditArtistsView({ initialValue, onClose, onSave }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(initialValue || []);
  const results = query ? searchArtists(query) : UNIFIED_ARTISTS.slice(0, 50);

  const toggle = (artist) => {
    setSelected(prev => {
      const idx = prev.findIndex(a => a.name === artist.name);
      if (idx >= 0) return prev.filter((_, i) => i !== idx);
      if (prev.length >= 4) return prev;
      return [...prev, artist];
    });
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ fontFamily: DISPLAY, fontSize: 24, fontWeight: 600, margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>Heavy Rotation</h3>
      <p style={{ color: 'rgba(0,0,0,0.5)', margin: '0 0 16px 0', fontSize: 14 }}>Select up to 4 ({selected.length}/4)</p>
      
      <input 
        autoFocus
        type="text" 
        placeholder="Search artists..." 
        value={query} 
        onChange={e => setQuery(e.target.value)}
        style={{ width: '100%', padding: '16px', borderRadius: 16, border: '1px solid rgba(0,0,0,0.1)', background: '#fff', fontSize: 16, outline: 'none', fontFamily: 'Inter' }}
      />
      <div style={{ flex: 1, overflowY: 'auto', marginTop: 16 }}>
        {results.map((artist, i) => {
          const isSel = selected.some(a => a.name === artist.name);
          return (
            <div key={i} onClick={() => toggle(artist)} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0', cursor: 'pointer', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
              <img src={artist.photo} style={{ width: 48, height: 48, borderRadius: 99, opacity: isSel ? 0.5 : 1 }} />
              <div style={{ flex: 1, fontFamily: DISPLAY, fontWeight: 600, fontSize: 16, color: isSel ? '#F97316' : '#14110D' }}>{artist.name}</div>
              {isSel && <div style={{ color: '#F97316' }}>✓</div>}
            </div>
          );
        })}
      </div>
      <button onClick={(e) => { e.preventDefault(); onSave(selected); }} style={{ marginTop: 'auto', padding: '18px', background: '#F97316', color: '#fff', borderRadius: 99, border: 0, fontFamily: DISPLAY, fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>
        Save
      </button>
    </div>
  );
}

function StatsRow({ nights = 12, connections = 8, clubs = 3, publicFlags = { nights: false, connections: false, clubs: false }, isOwnProfile }) {
  const stats = [
    { label: 'nights', value: nights, show: isOwnProfile || publicFlags.nights },
    { label: 'connections', value: connections, show: isOwnProfile || publicFlags.connections },
    { label: 'clubs', value: clubs, show: isOwnProfile || publicFlags.clubs }
  ].filter(s => s.show);
  
  if (stats.length === 0) return null;
  
  return (
    <Reveal style={{ padding: `0 ${EDGE}px`, marginTop: 24 }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', background: 'rgba(20,17,13,0.03)', borderRadius: 12, padding: '12px 16px' }}>
        {stats.map((s, i) => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {i > 0 && <div style={{ width: 4, height: 4, borderRadius: 2, background: 'rgba(20,17,13,0.15)' }} />}
            <div style={{ fontSize: 14, color: 'rgba(20,17,13,0.7)' }}>
              <span style={{ fontWeight: 600, color: '#14110D' }}>{s.value}</span> {s.label}
            </div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

function InCommonCard({ viewer, viewed }) {
  const norm = s => (s||'').toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  const matchPhrase = (text, phrase) => {
    if (!phrase) return false;
    const normText = norm(text);
    const normPhrase = norm(phrase);
    if (!normPhrase) return false;
    const regex = new RegExp(`\\b${normPhrase}\\b`, 'i');
    return regex.test(normText);
  };

  const viewerGenres = viewer.favoriteGenres || [];
  const viewedGenres = viewed.favoriteGenres || [];
  const sharedGenres = viewedGenres.filter(g => viewerGenres.some(vg => norm(g) === norm(vg)));

  const viewerArtists = [
    viewer.anthem?.artist, 
    ...(viewer.onRepeat?.map(a => a.name) || []),
    ...(viewer.artists?.map(a => a.name) || [])
  ].filter(Boolean);
  
  const viewedArtists = [
    viewed.anthem?.artist,
    ...(viewed.onRepeat?.map(a => a.name) || []),
    ...(viewed.artists?.map(a => a.name) || [])
  ].filter(Boolean);
  
  const sharedArtists = Array.from(new Set(viewedArtists.filter(a => viewerArtists.some(va => norm(a) === norm(va)))));

  const allShared = Array.from(new Set([...sharedGenres, ...sharedArtists]));
  
  if (allShared.length === 0) return null;
  
  return (
    <Reveal style={{ padding: `0 ${EDGE}px 0`, marginBottom: 16 }}>
      <div style={{ background: '#E1F5EE', borderRadius: 16, padding: '16px 20px' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, color: '#085041', fontWeight: 600, fontSize: 13, fontFamily: DISPLAY }}>
           <Icon.Sparkles width={16} height={16} /> In common
         </div>
         <div style={{ fontSize: 15, color: '#0F6E56', lineHeight: 1.4 }}>
            You both like {allShared.join(', ')}
         </div>
      </div>
    </Reveal>
  );
}

function CountdownBanner({ expiresAt }) {
  // Mock '4 days left'
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 22px 32px', background: 'linear-gradient(to top, #FAFAF8 60%, rgba(250,250,248,0))', zIndex: 100 }}>
      <div style={{ background: '#E1F5EE', borderRadius: 24, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 8px 32px rgba(8,80,65,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#085041', fontFamily: DISPLAY, fontWeight: 600, fontSize: 15 }}>
          <Icon.Clock width={18} height={18} /> 4 days left to chat
        </div>
        <button style={{ background: '#1D9E75', color: '#fff', border: 0, borderRadius: 99, padding: '8px 16px', fontFamily: DISPLAY, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
          Message
        </button>
      </div>
    </div>
  );
}

function SettingsSheet({ onClose }) {
  const sections = [
    { title: 'Account', items: [{ label: 'School Email', value: 'marcus@georgetown.edu', readOnly: true }, { label: 'Edit Identity', action: true }, { label: 'Log Out', action: true }, { label: 'Delete Account', action: true, danger: true }] },
    { title: 'Notifications', items: [{ label: 'Connection Night Reminder', toggle: true }, { label: 'New Connection', toggle: true }, { label: 'Message Received', toggle: true }, { label: 'Streak Reminder', toggle: true }] },
    { title: 'Privacy', items: [{ label: "Hide my profile tonight", toggle: true, desc: "Pause your profile without deleting your account." }] },
    { title: 'About & Support', items: [{ label: 'Terms of Service', action: true }, { label: 'Privacy Policy', action: true }, { label: 'Contact Support', action: true }] }
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} onClick={onClose} />
      <div style={{ background: '#FAFAF8', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: '24px', position: 'relative', height: '85vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ width: 40, height: 4, background: 'rgba(0,0,0,0.1)', borderRadius: 2, margin: '0 auto 24px' }} />
        <h3 style={{ fontFamily: DISPLAY, fontSize: 24, fontWeight: 600, margin: '0 0 24px 0', letterSpacing: '-0.02em' }}>Settings</h3>
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 40 }}>
          {sections.map((sec, i) => (
            <div key={i} style={{ marginBottom: 32 }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>{sec.title}</div>
              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                {sec.items.map((item, j) => (
                  <div key={j} style={{ padding: '16px', borderBottom: j < sec.items.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 16, color: item.danger ? '#ef4444' : '#14110D', fontWeight: 500 }}>{item.label}</div>
                      {item.desc && <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)', marginTop: 4 }}>{item.desc}</div>}
                    </div>
                    {item.readOnly && <div style={{ color: 'rgba(0,0,0,0.4)', fontSize: 14 }}>{item.value}</div>}
                    {item.toggle && (
                      <div style={{ width: 44, height: 24, background: '#F97316', borderRadius: 99, position: 'relative' }}>
                        <div style={{ width: 20, height: 20, background: '#fff', borderRadius: '50%', position: 'absolute', right: 2, top: 2 }} />
                      </div>
                    )}
                    {item.action && !item.danger && <Icon.ChevronRight width={16} height={16} color="rgba(0,0,0,0.3)" />}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PublicOverflowSheet({ onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} onClick={onClose} />
      <div style={{ background: '#FAFAF8', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: '24px', position: 'relative', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ width: 40, height: 4, background: 'rgba(0,0,0,0.1)', borderRadius: 2, margin: '0 auto 12px' }} />
        <button onClick={onClose} style={{ padding: '16px', background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 16, fontSize: 16, fontWeight: 600, color: '#14110D', fontFamily: DISPLAY }}>Share Profile</button>
        <button onClick={onClose} style={{ padding: '16px', background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 16, fontSize: 16, fontWeight: 600, color: '#14110D', fontFamily: DISPLAY }}>Report User</button>
        <button onClick={onClose} style={{ padding: '16px', background: '#fee2e2', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 16, fontSize: 16, fontWeight: 600, color: '#ef4444', fontFamily: DISPLAY }}>Block User</button>
      </div>
    </div>
  );
}
