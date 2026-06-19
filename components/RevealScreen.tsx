'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ACTIVE_REVEAL_NIGHT, CN_PROFILES } from '@/lib/revealData';
import { usePersistentState } from '@/lib/usePersistentState';
import { RevealShell, REVEAL_COLORS, roman, type ShellController } from '@/components/RevealShell';
import { RevealOpeningIntro } from '@/components/reveal/RevealOpeningIntro';
import { ActConnectionIntro, ActConnectionSealed } from './RevealConnectionIntro';
import { RevealConnectionPerson } from './RevealConnectionPerson';

const FF = "'Bricolage Grotesque', sans-serif";
const EASE = 'cubic-bezier(.2,.7,.2,1)';

// ── Shared night label ────────────────────────────────────────────────
function NightLabel({ text, color, dotBg, dotGlow }: { text: string; color: string; dotBg: string; dotGlow: string }) {
  return (
    <span style={{
      fontFamily: FF, fontWeight: 700, fontSize: 11, letterSpacing: '0.18em',
      textTransform: 'uppercase', color,
      display: 'inline-flex', alignItems: 'center', gap: 8,
    } as React.CSSProperties}>
      <span style={{ width: 6, height: 6, borderRadius: 99, background: dotBg, boxShadow: dotGlow, display: 'inline-block' }} />
      {text}
    </span>
  );
}

// ── Act I: Look Up ────────────────────────────────────────────────────
function ActLookUp({ night, dayIndex, anim }: { night: any; dayIndex: number; anim: string }) {
  const streakCount = Math.min(dayIndex + 1, 7);
  const ORDINALS = ['one','two','three','four','five','six','seven','eight','nine','ten'];
  const streakWords = ORDINALS[streakCount - 1] ?? String(streakCount);

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 2,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center',
      padding: '100px 30px 150px', animation: anim,
    }}>
      <NightLabel text={night.nightLabel} color="#F5D783" dotBg="#F5D783" dotGlow="0 0 0 4px rgba(245,215,131,0.18)" />
      <h1 style={{
        fontFamily: FF, fontWeight: 600, fontSize: 50, lineHeight: 1.02,
        letterSpacing: '-0.03em', color: '#FFFFFF', margin: '18px 0 14px',
        textShadow: '0 2px 30px rgba(0,0,0,0.6)',
      } as React.CSSProperties}>
        Look up, Georgetown.
      </h1>
      <p style={{
        fontFamily: FF, fontSize: 15, lineHeight: 1.55, color: 'rgba(255,255,255,0.7)',
        margin: 0, maxWidth: 280, textShadow: '0 1px 12px rgba(0,0,0,0.6)',
      }}>
        {night.totalVotes} answers painted tonight&apos;s sky. Yours is one of them.
      </p>
      <span style={{ marginTop: 26, fontFamily: FF, fontSize: 11, letterSpacing: '0.04em', color: 'rgba(245,215,131,0.75)' }}>
        tap — the sky tells the rest
      </span>
      {/* Streak dots — absolute at bottom:118px */}
      <div style={{ position: 'absolute', bottom: 118, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {Array.from({ length: 7 }, (_, i) => {
            const lit = i < streakCount;
            const today = i === streakCount - 1;
            return (
              <span key={i} style={{
                width: 8, height: 8, borderRadius: 99, display: 'inline-block',
                background: today ? '#F97316' : lit ? '#F5D783' : 'rgba(255,255,255,0.18)',
                boxShadow: today ? '0 0 10px rgba(249,115,22,0.9)' : lit ? '0 0 7px rgba(245,215,131,0.55)' : 'none',
              }} />
            );
          })}
        </div>
        <span style={{
          fontFamily: FF, fontWeight: 700, fontSize: 9.5, letterSpacing: '0.16em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)',
        } as React.CSSProperties}>
          Your streak · {streakWords} night{streakCount !== 1 ? 's' : ''} straight
        </span>
      </div>
    </div>
  );
}

// ── Act II: The Answer ────────────────────────────────────────────────
function ActTheAnswer({ night, anim }: { night: any; anim: string }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 2,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center', gap: 0,
      padding: '100px 30px 140px', animation: anim,
    }}>
      <NightLabel text="The answer" color="#F5D783" dotBg="#F5D783" dotGlow="0 0 0 4px rgba(245,215,131,0.18)" />
      <p style={{
        fontFamily: FF, fontSize: 14, lineHeight: 1.45, color: 'rgba(255,255,255,0.6)',
        margin: '10px 0 24px', maxWidth: 270, textShadow: '0 1px 10px rgba(0,0,0,0.6)',
      }}>
        &ldquo;{night.question}&rdquo;
      </p>
      <Image
        src={night.topArt}
        alt="Album art"
        width={124}
        height={124}
        style={{
          borderRadius: 16, objectFit: 'cover',
          boxShadow: '0 0 70px rgba(249,115,22,0.4), 0 18px 40px -12px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.1)',
        } as React.CSSProperties}
      />
      <div style={{
        fontFamily: FF, fontWeight: 600, fontSize: 31, letterSpacing: '-0.025em',
        lineHeight: 1.05, color: '#FFFFFF', marginTop: 16,
        textShadow: '0 2px 20px rgba(0,0,0,0.6)',
      }}>
        {night.topSong}
      </div>
      <div style={{ fontFamily: FF, fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
        {night.topArtist}
      </div>
      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 300 }}>
        <span style={{ fontFamily: FF, fontWeight: 600, fontSize: 21, lineHeight: 1.2, letterSpacing: '-0.02em', color: '#FFFFFF', textShadow: '0 1px 16px rgba(0,0,0,0.6)' } as React.CSSProperties}>
          {night.totalVotes} answered. Barely an argument.
        </span>
        <span style={{ fontFamily: FF, fontWeight: 600, fontSize: 17, letterSpacing: '-0.015em', color: '#F5D783' }}>
          Georgetown made up its mind by lunch.
        </span>
        <span style={{ fontFamily: FF, fontSize: 12.5, lineHeight: 1.5, color: 'rgba(255,255,255,0.55)' }}>
          Consensus {night.consensusPct}% · seniors locked it in early · the vote was decisive.
        </span>
      </div>
      <span style={{ marginTop: 26, fontFamily: FF, fontSize: 11, letterSpacing: '0.04em', color: 'rgba(245,215,131,0.75)' }}>
        you&apos;re in this picture →
      </span>
    </div>
  );
}

// ── Act III: Your Light ───────────────────────────────────────────────
function ActYourLight({ night, userAnswer, anim }: { night: any; userAnswer: string; anim: string }) {
  const matched = !!userAnswer && (
    userAnswer.toLowerCase().includes(night.topSong.toLowerCase()) ||
    userAnswer.toLowerCase().includes(night.topArtist.toLowerCase())
  );
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 2,
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      padding: '100px 30px 140px', animation: anim,
    }}>
      <NightLabel text="Your light" color="#EA8CE1" dotBg="#EA8CE1" dotGlow="0 0 0 4px rgba(234,140,225,0.18)" />
      <h2 style={{
        fontFamily: FF, fontWeight: 600, fontSize: 32, lineHeight: 1.08,
        letterSpacing: '-0.025em', color: '#FFFFFF', margin: '14px 0 26px',
        textShadow: '0 2px 24px rgba(0,0,0,0.6)',
      } as React.CSSProperties}>
        {matched ? 'You called it. Exactly.' : 'You went against the grain. Again.'}
      </h2>
      {/* Timeline bar */}
      <div style={{ position: 'relative', height: 2, borderRadius: 99, background: 'rgba(255,255,255,0.14)', margin: '8px 6px 50px' }}>
        <span style={{ position: 'absolute', left: '14%', top: '50%', transform: 'translate(-50%,-50%)', width: 12, height: 12, borderRadius: 99, background: '#EA8CE1', boxShadow: '0 0 14px rgba(234,140,225,0.9)' }} />
        <span style={{ position: 'absolute', left: '14%', top: 14, transform: 'translateX(-50%)', fontFamily: FF, fontWeight: 600, fontSize: 11, color: '#EA8CE1', whiteSpace: 'nowrap' } as React.CSSProperties}>
          you · early
        </span>
        <span style={{ position: 'absolute', left: '82%', top: '50%', transform: 'translate(-50%,-50%)', width: 12, height: 12, borderRadius: 99, background: '#F5D783', boxShadow: '0 0 14px rgba(245,215,131,0.8)' }} />
        <span style={{ position: 'absolute', left: '82%', top: 14, transform: 'translateX(-50%)', fontFamily: FF, fontWeight: 600, fontSize: 11, color: '#F5D783', whiteSpace: 'nowrap' } as React.CSSProperties}>
          campus · by lunch
        </span>
      </div>
      <p style={{
        fontFamily: FF, fontSize: 15, lineHeight: 1.55, color: 'rgba(255,255,255,0.75)',
        margin: '18px 0 22px', textShadow: '0 1px 12px rgba(0,0,0,0.6)',
      }}>
        {matched
          ? <>You matched the {night.consensusPct}% consensus — in the <b style={{ color: '#EA8CE1', fontWeight: 600 }}>top 12% most consistent</b> listeners on campus.</>
          : <>Only a few of {night.totalVotes} picked this — rarer than 96% of campus. And somehow you&apos;re still in the <b style={{ color: '#EA8CE1', fontWeight: 600 }}>top 4% most consistent</b>, with the majority.</>
        }
      </p>
      <span style={{ fontFamily: FF, fontSize: 11, letterSpacing: '0.04em', color: 'rgba(245,215,131,0.75)' }}>
        what {night.totalVotes} answers did to the sky →
      </span>
    </div>
  );
}

// ── Act IV: The Sky Tonight ───────────────────────────────────────────
function ActSkies({ night, anim }: { night: any; anim: string }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 2,
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      padding: '100px 30px 140px', animation: anim,
    }}>
      <NightLabel text="The sky tonight" color="#F5D783" dotBg="#F5D783" dotGlow="0 0 0 4px rgba(245,215,131,0.18)" />
      <h2 style={{
        fontFamily: FF, fontWeight: 600, fontSize: 36, lineHeight: 1.08,
        letterSpacing: '-0.025em', color: '#FFFFFF', margin: '14px 0 28px',
        textShadow: '0 2px 28px rgba(0,0,0,0.65)',
      } as React.CSSProperties}>
        Georgetown is homesick for a place it&apos;s standing in.
      </h2>
      <div style={{ fontFamily: FF, fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 14 }}>
        It was in the answers — all {night.totalVotes} of them, 8 am to 6:30 pm.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        <span style={{ fontFamily: FF, fontWeight: 600, fontSize: 19, lineHeight: 1.18, letterSpacing: '-0.015em', color: '#FFFFFF', textShadow: '0 1px 12px rgba(0,0,0,0.6)' } as React.CSSProperties}>
          Not one person picked something fast.
        </span>
        <span style={{ fontFamily: FF, fontWeight: 600, fontSize: 19, lineHeight: 1.18, letterSpacing: '-0.015em', color: 'rgba(255,255,255,0.55)' }}>
          Six answers with &ldquo;night&rdquo; in the title.
        </span>
        <span style={{ fontFamily: FF, fontWeight: 600, fontSize: 19, lineHeight: 1.18, letterSpacing: '-0.015em', color: '#F5D783' }}>
          One word kept coming back: home.
        </span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        {night.wordCloud.map((item: any, i: number) => {
          const sizes: Record<string, { fontSize: number; fontWeight: number; opacity: number }> = {
            xl: { fontSize: 17, fontWeight: 700, opacity: 1 },
            lg: { fontSize: 14, fontWeight: 600, opacity: 0.8 },
            md: { fontSize: 12, fontWeight: 600, opacity: 0.6 },
            sm: { fontSize: 11, fontWeight: 500, opacity: 0.4 },
          };
          const s = sizes[item.size] ?? sizes.md;
          return (
            <span key={i} style={{
              fontFamily: FF, fontWeight: s.fontWeight, fontSize: s.fontSize,
              color: `rgba(255,255,255,${s.opacity})`,
              display: 'inline-flex', alignItems: 'baseline', gap: 6,
              padding: '6px 11px', borderRadius: 999,
              background: 'rgba(245,215,131,0.10)',
              border: '1px solid rgba(245,215,131,0.25)',
              animation: `enterFade ${300 + i * 80}ms ${i * 60}ms ease both`,
            }}>
              {item.word}
            </span>
          );
        })}
      </div>
      <span style={{ fontFamily: FF, fontSize: 11, letterSpacing: '0.04em', color: 'rgba(245,215,131,0.75)' }}>
        tomorrow&apos;s storm is already forming →
      </span>
    </div>
  );
}

// ── Act V: Tomorrow ───────────────────────────────────────────────────
function ActTomorrow({ night, anim }: { night: any; anim: string }) {
  const [now, setNow] = useState(Date.now());
  const [reminded, setReminded] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const nextReveal = (() => {
    const d = new Date(now);
    d.setHours(20, 0, 0, 0);
    if (d.getTime() <= now) d.setDate(d.getDate() + 1);
    return d.getTime();
  })();
  const ms = Math.max(0, nextReveal - now);
  const h  = Math.floor(ms / 3600000);
  const m  = Math.floor((ms % 3600000) / 60000);
  const s  = Math.floor((ms % 60000) / 1000);
  const countdown = `${h}h ${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`;

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 2,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center',
      padding: '100px 30px 150px', animation: anim,
    }}>
      <NightLabel text="Tomorrow · 8:00 pm" color="#F5D783" dotBg="#F5D783" dotGlow="0 0 0 4px rgba(245,215,131,0.18)" />
      <div style={{
        fontFamily: FF, fontWeight: 600, fontSize: 58, letterSpacing: '-0.03em', lineHeight: 1,
        color: '#F5D783', margin: '18px 0 6px', fontVariantNumeric: 'tabular-nums',
        textShadow: '0 0 40px rgba(245,215,131,0.35)',
      } as React.CSSProperties}>
        {countdown}
      </div>
      <span style={{ fontFamily: FF, fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
        until the sky changes again
      </span>
      <h2 style={{
        fontFamily: FF, fontWeight: 600, fontSize: 27, lineHeight: 1.12,
        letterSpacing: '-0.02em', color: '#FFFFFF', margin: '32px 0 10px', maxWidth: 300,
        textShadow: '0 2px 20px rgba(0,0,0,0.6)',
      } as React.CSSProperties}>
        {night.tomorrowTeaser}
      </h2>
      <p style={{ fontFamily: FF, fontSize: 14.5, lineHeight: 1.5, color: 'rgba(255,255,255,0.65)', margin: '0 0 28px', maxWidth: 280 }}>
        That&apos;s all you&apos;re getting. Answers open at 8 am. Don&apos;t break the streak.
      </p>
      {!reminded ? (
        <button onClick={() => setReminded(true)} style={{
          height: 50, border: 0, borderRadius: 16, background: '#F5D783', color: '#14110D',
          fontFamily: FF, fontWeight: 600, fontSize: 15, cursor: 'pointer',
          width: '100%', maxWidth: 280, boxShadow: '0 0 40px rgba(245,215,131,0.25)',
        }}>
          Remind me at 8 am
        </button>
      ) : (
        <button onClick={() => setReminded(false)} style={{
          height: 50, border: '1px solid rgba(113,192,127,0.45)', borderRadius: 16,
          background: 'rgba(113,192,127,0.12)', color: '#71C07F',
          fontFamily: FF, fontWeight: 600, fontSize: 15, cursor: 'pointer',
          width: '100%', maxWidth: 280,
        }}>
          ✓ Reminder set
        </button>
      )}
    </div>
  );
}



// ── Share sheet ───────────────────────────────────────────────────────
function ShareSheet({ act, night, onClose }: { act: number; night: any; onClose: () => void }) {
  const CARDS = [
    { title: 'Six nights straight on the reveal.', sub: 'streak · Georgetown' },
    { title: `Georgetown picked ${night.topArtist} tonight.`, sub: `${night.topSong} · consensus ${night.consensusPct}%` },
    { title: 'Top 4% most consistent on campus.', sub: 'your light · tonight\'s reveal' },
    { title: 'Georgetown is homesick tonight.', sub: 'campus mood · the answers' },
    { title: night.tomorrowTeaser, sub: '8:00 pm · tomorrow' },
  ];
  const card = CARDS[act] ?? CARDS[0];
  return (
    <>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.55)', animation: 'fadeIn 220ms cubic-bezier(.2,.7,.2,1) both' }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 61,
        background: '#181614', borderRadius: '28px 28px 0 0',
        border: '1px solid rgba(255,255,255,0.07)',
        padding: '10px 22px 36px',
        animation: `sheetUp 320ms ${EASE} both`,
        boxShadow: '0 -20px 50px rgba(0,0,0,0.25)',
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.18)', margin: '0 auto 14px' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontFamily: FF, fontWeight: 600, fontSize: 17, letterSpacing: '-0.015em', color: '#FFFFFF' }}>Share this card</span>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 99, border: 0, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>
        {/* Share card preview */}
        <div style={{ background: 'linear-gradient(135deg, #07090C, #0D0B08)', borderRadius: 20, padding: '24px 20px', marginBottom: 18, border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 16, color: '#FFFFFF', letterSpacing: '-0.01em', marginBottom: 6 }}>{card.title}</div>
          <div style={{ fontFamily: FF, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>Georgetown · under the lights</div>
          <div style={{ fontFamily: FF, fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{card.sub}</div>
        </div>
        <button onClick={onClose} style={{ width: '100%', height: 48, border: 0, borderRadius: 14, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.85)', fontFamily: FF, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
          Done
        </button>
      </div>
    </>
  );
}

// ── Main RevealScreen ─────────────────────────────────────────────────
type Props = {
  onBack: () => void;
  activeUserId: string;
  /** Marcus auto-open: play cinematic intro before Act I. Replay skips this. */
  playIntro?: boolean;
  isCN?: boolean;
};

export function RevealScreen({ onBack, activeUserId, playIntro = false, isCN = false }: Props) {
  const night = ACTIVE_REVEAL_NIGHT;
  const dayIndex = 0;
  const [answer] = usePersistentState(`ligo:daily:${activeUserId}:answer`, '');
  const shouldPlayIntro = playIntro;
  const [introDone, setIntroDone] = useState(!shouldPlayIntro);
  const handleIntroComplete = useCallback(() => setIntroDone(true), []);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareAct, setShareAct] = useState(0);
  const [vibeToast, setVibeToast] = useState<string | null>(null);
  const shell = useRef<ShellController | null>(null);

  const handleVibe = (name: string) => {
    setVibeToast(`Vibe sent to ${name}!`);
    shell.current?.go(1); // advance on vibe
    setTimeout(() => setVibeToast(null), 2500);
  };

  const handlePass = () => {
    shell.current?.go(1); // advance on pass
  };

  const standardSteps = [
    ({ anim }: { anim: string }) => <ActLookUp night={night} dayIndex={dayIndex} anim={anim} />,
    ({ anim }: { anim: string }) => <ActTheAnswer night={night} anim={anim} />,
    ({ anim }: { anim: string }) => <ActYourLight night={night} userAnswer={answer} anim={anim} />,
    ({ anim }: { anim: string }) => <ActSkies night={night} anim={anim} />,
    ({ anim }: { anim: string }) => <ActTomorrow night={night} anim={anim} />,
  ];

  const cnSequence = [
    ({ anim }: { anim: string }) => <ActConnectionIntro matchCount={CN_PROFILES.length} userAnswer={answer} anim={anim} />,
    ({ anim }: { anim: string }) => (
      <ActConnectionSealed 
        people={CN_PROFILES} 
        song={{ name: CN_PROFILES[0]?.answer || "Your Pick", artist: night.topArtist, art: night.topArt }} 
        anim={anim} 
      />
    ),
    ...CN_PROFILES.map((profile, i) => {
      const Step = ({ anim }: { anim: string }) => (
        <RevealConnectionPerson 
          p={{...profile, meta: `${profile.major} · ${profile.school} ${profile.year}`}} 
          idx={i}
          total={CN_PROFILES.length}
          song={{ name: profile.answer, artist: night.topArtist, art: night.topArt }}
          anim={anim} 
          onAct={(kind) => {
            if (kind === 'vibe' || kind === 'spark') {
              handleVibe(profile.name);
            } else {
              handlePass();
            }
          }} 
        />
      );
      Step.displayName = `ActCNPerson_${profile.id}`;
      return Step;
    }),
    ({ anim }: { anim: string }) => <ActTomorrow night={night} anim={anim} />,
  ];

  const steps = isCN ? cnSequence : standardSteps;

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: introDone ? 1 : 0,
          transform: introDone ? 'scale(1)' : 'scale(1.05)',
          filter: introDone ? 'blur(0)' : 'blur(8px)',
          transition: `opacity 900ms ${EASE}, transform 900ms ${EASE}, filter 900ms ${EASE}`,
        }}
      >
        <RevealShell
          steps={steps}
          colors={REVEAL_COLORS}
          controllerRef={shell}
          title="The Reveal"
          subtitle="Georgetown · under the lights"
          stepLabel={(cur) => `Act ${roman(cur + 1)} of ${roman(steps.length)}`}
          onBack={onBack}
          tapDisabled={shareOpen || !introDone || !!vibeToast}
          bottom={() => isCN ? null : (
            <button
              onClick={() => { setShareAct(shell.current?.cur ?? 0); setShareOpen(true); }}
              style={{
                pointerEvents: 'auto',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                height: 42, padding: '0 20px', borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.14)',
                background: 'rgba(10,9,7,0.45)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                color: '#FFFFFF',
                fontFamily: FF, fontWeight: 600, fontSize: 13.5, cursor: 'pointer',
              } as React.CSSProperties}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                <path d="M9 11l6-4M9 13l6 4" />
              </svg>
              Share tonight&apos;s sky
            </button>
          )}
        />
      </div>

      {shouldPlayIntro && !introDone && (
        <RevealOpeningIntro onComplete={handleIntroComplete} />
      )}

      {shareOpen && (
        <ShareSheet act={shareAct} night={night} onClose={() => setShareOpen(false)} />
      )}



      {vibeToast && (
        <div style={{
          position: 'absolute', top: 60, left: 24, right: 24, zIndex: 100,
          background: '#EA8CE1', borderRadius: 16, padding: '16px 20px',
          boxShadow: '0 8px 30px rgba(234,140,225,0.4)',
          fontFamily: FF, fontWeight: 700, fontSize: 15, color: '#000',
          textAlign: 'center', animation: 'fadeInDown 300ms ease both'
        }}>
          {vibeToast}
        </div>
      )}
    </div>
  );
}
