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
import { Icon, Eyebrow, Wordmark, ChipTag, NowPip } from "@/components/Primitives";
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

  const earned = profile.longestStreak >= trophy.days;
  const daysLeft = Math.max(0, trophy.days - profile.longestStreak);
  const isCurrentTier = earned && [...STREAK_TROPHIES].filter((x) => x.days <= profile.currentStreak).pop()?.id === trophy.id;

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
              Earned with a {profile.longestStreak}-day longest streak
            </div>
            {isCurrentTier && (
              <div style={{ fontSize: 12.5, color: 'rgba(20,17,13,0.55)', marginTop: 6, lineHeight: 1.4 }}>
                You're on a {profile.currentStreak}-day run right now — this is your active tier.
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 13, color: '#14110D' }}>
              {daysLeft} more day{daysLeft === 1 ? '' : 's'} to unlock
            </div>
            <div style={{ fontSize: 12.5, color: 'rgba(20,17,13,0.55)', marginTop: 6, lineHeight: 1.4 }}>
              Answer daily at Georgetown. Your longest streak so far is {profile.longestStreak} day{profile.longestStreak === 1 ? '' : 's'}.
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

function SettingsSheet() {
  const { toast } = usePV2();
  return (
    <div>
      <div style={{ borderRadius: 16, border: '1px solid rgba(20,17,13,0.06)', overflow: 'hidden', marginBottom: 16, background: '#FAFAF8' }}>
        <SetRow label="Music sources" value="Spotify · SoundCloud" iconBg="#1DB954" />
        <SetRow label="Edit profile" iconBg="linear-gradient(145deg,#F97316,#EA8CE1)">
          <Icon.User width={16} height={16} color="#fff" />
        </SetRow>
      </div>
      <div style={{ borderRadius: 16, border: '1px solid rgba(20,17,13,0.06)', overflow: 'hidden', marginBottom: 16 }}>
        <SetRow label="Push notifications" iconBg="#0A0907"><Toggle /></SetRow>
        <SetRow label="Show me on The Bump" iconBg="#71C07F"><Toggle /></SetRow>
        <SetRow label="Public playlist" iconBg="#EA8CE1"><Toggle /></SetRow>
      </div>
      <button type="button" onClick={() => toast('Log out — prototype')} style={{
        width: '100%', border: 0, background: 'transparent', padding: 12,
        fontFamily: DISPLAY, fontWeight: 600, fontSize: 13, color: '#C2410C', cursor: 'pointer',
      }}>Log out</button>
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
          &ldquo;{profile.hotTake}&rdquo;
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

function ProfileTabV2() {
  const profile = useActiveUserProfile();
  const activeUser = useActiveUser();
  const [activeUserId] = usePersistentState('ligo:active_user', 'jordan');
  const { loading: trailLoading, error: trailError, answerTrail } = useDailyReveal(activeUserId);
  const initials = activeUser.name.split(' ').map(n => n[0]).join('.') + '.';

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
    <div style={{ paddingBottom: 116, background: '#FAFAF8', position: 'relative', overflow: 'hidden' }}>
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
            <button type="button" aria-label="Close" onClick={onClose} style={{
              width: 40, height: 40, borderRadius: 13, border: '1px solid rgba(20,17,13,0.06)',
              background: 'rgba(20,17,13,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'transform 0.15s ease',
            }} onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'} onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <Icon.Close width={20} height={20} />
            </button>
          ) : (
            <button type="button" aria-label="Share" onClick={() => openSheet('share')} style={{
              padding: '8px 16px', borderRadius: 99, border: 0,
              background: '#14110D', color: '#fff',
              display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: DISPLAY, fontWeight: 600, fontSize: 13,
              cursor: 'pointer', transition: 'transform 0.15s ease, background 0.15s ease',
            }} onMouseEnter={(e) => e.currentTarget.style.background = '#2A2520'} onMouseLeave={(e) => { e.currentTarget.style.background = '#14110D'; e.currentTarget.style.transform = 'scale(1)'; }} onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'} onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <Icon.Share width={14} height={14} /> Share
            </button>
          )}
        </div>

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

          <VibeTicker />
          <HotTakeBanner />
          <HeavyRotationPolaroids />

        </Reveal>
      </div>

      <Reveal style={{ padding: `18px ${EDGE}px 0` }}>
        <div {...onTap(() => openSheet('archetype'))} style={{
          ...tap, ...LIQUID_GLASS_DARK, borderRadius: 26, padding: '22px', color: '#fff',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: getArchetypeById(profile.earnedArchetypeId)?.glow ?? "transparent",
          }} />
          <div style={{ position: 'relative' }}>
            <Eyebrow dark dotColor={getArchetypeById(profile.earnedArchetypeId)?.accent ?? "#F5D783"}>Sonic archetype</Eyebrow>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 12 }}>
              <h1 style={{
                fontFamily: DISPLAY, fontWeight: 600, fontSize: 40, lineHeight: 0.98,
                letterSpacing: '-0.03em', margin: 0, maxWidth: 220,
              }}>{getArchetypeById(profile.earnedArchetypeId)?.name ?? "The Hypnotist"}</h1>
              <ArchetypeSealGraphic archetype={getArchetypeById(profile.earnedArchetypeId)!} size={52} />
            </div>
            <p style={{ marginTop: 16, fontSize: 14.5, lineHeight: 1.5, color: 'rgba(255,255,255,0.72)' }}>
              {profile.archetypeSubline}
            </p>
          </div>
        </div>
      </Reveal>


      <Reveal style={{ padding: `14px ${EDGE}px 0` }}>
        <div style={{
          borderRadius: 22, padding: 20,
          background: 'linear-gradient(165deg, rgba(245,215,131,0.16), rgba(249,115,22,0.05))',
          border: '1px solid rgba(245,215,131,0.45)',
        }}>
          <Eyebrow dotColor="#C2410C">Your music horoscope</Eyebrow>
          <h2 style={{
            fontFamily: DISPLAY, fontWeight: 600, fontSize: 22, marginTop: 12,
            letterSpacing: '-0.02em', lineHeight: 1.12,
          }}>{profile.horoscope?.headline}</h2>
          <p style={{ marginTop: 10, fontSize: 14.5, lineHeight: 1.55, color: 'rgba(20,17,13,0.60)' }}>
            {profile.horoscope?.body}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 14 }}>
            {profile.horoscope?.chips.map((chip) => (
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

      <Reveal style={{ marginTop: 26 }}>
        <div style={{ padding: `0 ${EDGE}px 10px`, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 16 }}>Top artists</span>
          <span style={{ fontFamily: BODY, fontSize: 12, color: 'rgba(20,17,13,0.45)' }}>this month</span>
        </div>
        <div style={{ display: 'flex', gap: 14, overflowX: 'auto', padding: `0 ${EDGE}px`, scrollbarWidth: 'none' }}>
          {profile.artists.map((a) => (
            <div key={a.name} onClick={() => toast(`${a.name} · #${a.rank} for you`)} style={{ flexShrink: 0, width: 72, textAlign: 'center', cursor: 'pointer' }}>
              <div style={{
                width: 72, height: 72, borderRadius: 99,
                backgroundImage: `url(${a.photo})`, backgroundSize: 'cover', backgroundPosition: a.pos,
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12), 0 6px 16px -8px rgba(20,17,13,0.25)',
              }} />
              <div style={{ marginTop: 8, fontFamily: DISPLAY, fontWeight: 600, fontSize: 12.5 }}>{a.name}</div>
              <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 10, color: 'rgba(20,17,13,0.35)' }}>#{a.rank}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: `12px ${EDGE}px 0`, fontSize: 12, color: 'rgba(20,17,13,0.45)' }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 600, color: 'rgba(20,17,13,0.55)' }}>Linked:</span> Spotify · SoundCloud
        </div>
      </Reveal>

      <Reveal style={{ padding: `20px ${EDGE}px 0` }}>
        <div {...onTap(() => toast(`${profile.currentStreak}-day streak — keep it lit 🔥`))} style={{
          ...tap, background: '#fff', borderRadius: 22, padding: '16px 18px',
          border: '1px solid rgba(20,17,13,0.06)', boxShadow: CARD,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 50, height: 50, borderRadius: 16, flexShrink: 0,
            background: 'linear-gradient(160deg, rgba(249,115,22,0.16), rgba(245,215,131,0.18))',
            border: '1px solid rgba(249,115,22,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
          }}>🔥</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 17, letterSpacing: '-0.015em' }}>
              <span style={{ color: '#F97316' }}>{profile.currentStreak}-day streak</span>
            </div>
            <div style={{ fontSize: 12.5, color: 'rgba(20,17,13,0.45)', marginTop: 2 }}>Don't break it — answer today's question.</div>
          </div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 30, color: '#F97316' }}>{profile.currentStreak}</div>
        </div>
      </Reveal>



      <Reveal style={{ padding: `14px 0 14px` }}>
        <SecretTrackCard
          toast={toast}
          accentColor={profile.secretTrack?.accentColor ?? '#F5D783'}
          label={profile.secretTrack?.label ?? 'Guilty Pleasure'}
          title={profile.secretTrack?.title ?? ''}
          artist={profile.secretTrack?.artist ?? ''}
          cover={profile.secretTrack?.cover ?? ''}
        />
      </Reveal>

      <Reveal style={{ marginTop: 26 }}>
        <div style={{ padding: `0 ${EDGE}px`, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 14 }}>Playlists</span>
        </div>
        <div style={{
          display: 'flex', gap: 14, overflowX: 'auto', padding: `0 ${EDGE}px 26px`,
          scrollSnapType: 'x mandatory', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
        }}>
          {/* Main Playlist */}
          <div style={{
            flexShrink: 0, width: '85%', scrollSnapAlign: 'start',
            background: '#fff', borderRadius: 22, padding: 16, border: '1px solid rgba(20,17,13,0.06)', boxShadow: CARD
          }}>
            <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
              <div style={{
                width: 76, height: 76, borderRadius: 14, flexShrink: 0, overflow: 'hidden',
                display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 1, background: '#14110D',
              }}>
                {profile.afterHoursCover.map((src, i) => (
                  <div key={i} style={{ backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                ))}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Eyebrow>Published</Eyebrow>
                <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 21, marginTop: 8, letterSpacing: '-0.02em' }}>{profile.playlistName}</div>
                <div style={{ fontSize: 12, color: 'rgba(20,17,13,0.45)', marginTop: 5 }}>{profile.playlistTrackCount} tracks · published · 22 saves</div>
              </div>
            </div>
            {profile.playlistTracks.map((t, i) => (
              <div
                key={t.title}
                className={`pl-row ${playingIdx === i ? 'playing' : ''}`}
                onClick={() => toggleTrack(i, t.title)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '9px 8px',
                  borderTop: '1px solid rgba(20,17,13,0.06)', borderRadius: 10, cursor: 'pointer',
                }}
              >
                <span style={{ width: 22, flexShrink: 0, textAlign: 'center', fontSize: 12, color: 'rgba(20,17,13,0.35)' }}>
                  <span className="idx-num">{i + 1}</span>
                  <span className="pv2-eq"><span /><span /><span /></span>
                </span>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  backgroundImage: `url(${t.coverArt ?? t.photo})`, backgroundSize: 'cover',
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="track-title" style={{
                    fontFamily: DISPLAY, fontWeight: 600, fontSize: 14,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    transition: 'color 150ms',
                  }}>{t.title}</div>
                  <div style={{ fontSize: 12, color: 'rgba(20,17,13,0.45)', marginTop: 1 }}>{t.artist}</div>
                </div>
                <span style={{ fontFamily: 'SF Mono, ui-monospace, monospace', fontSize: 11, color: 'rgba(20,17,13,0.35)' }}>{t.dur}</span>
              </div>
            ))}
            <button type="button" onClick={() => toast(`${profile.playlistName} · ${profile.playlistTrackCount} tracks`)} style={{
              marginTop: 10, width: '100%', padding: '12px 0', border: 0,
              background: 'rgba(20,17,13,0.04)', borderRadius: 12,
              fontFamily: DISPLAY, fontWeight: 600, fontSize: 13, color: '#F97316', cursor: 'pointer',
            }}>View all {profile.playlistTrackCount} tracks</button>
          </div>

          {/* Add Playlist Card */}
          <div onClick={() => toast('Connect Spotify to add playlists')} style={{
            flexShrink: 0, width: '85%', scrollSnapAlign: 'start', cursor: 'pointer',
            borderRadius: 22, padding: 16, border: '2px dashed rgba(20,17,13,0.15)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(20,17,13,0.02)',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 99, background: '#fff', border: '1px solid rgba(20,17,13,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              marginBottom: 16, color: 'rgba(20,17,13,0.4)'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            </div>
            <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 16, color: '#14110D' }}>Add a playlist</div>
            <div style={{ fontSize: 13, color: 'rgba(20,17,13,0.45)', marginTop: 4, textAlign: 'center', padding: '0 12px' }}>
              Connect your Spotify to add your playlists here
            </div>
          </div>
        </div>
      </Reveal>
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
  const earnedCount = STREAK_TROPHIES.filter((t) => profile.longestStreak >= t.days).length;
  const next = STREAK_TROPHIES.find((t) => profile.longestStreak < t.days);

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
          const earned = profile.longestStreak >= t.days;
          const currentTier = [...STREAK_TROPHIES].filter((x) => x.days <= profile.currentStreak).pop();
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
          Next up: <b style={{ fontFamily: DISPLAY, color: '#14110D' }}>{next.label}</b> — {next.days - profile.longestStreak} more day{next.days - profile.longestStreak === 1 ? '' : 's'} at your campus.
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
        <div style={{ padding: `20px ${EDGE}px 0` }}>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { label: 'Current streak', value: String(profile.currentStreak), unit: 'days' },
              { label: 'Longest streak', value: String(profile.longestStreak), unit: 'days' },
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

