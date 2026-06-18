'use client';

import React from 'react';
import { Icon } from '@/components/Primitives';
import type { ConnectionNightPerson, ConnectionNightSong } from '@/lib/connectionNight';

const FF = "'Bricolage Grotesque', sans-serif";

const SparkIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3c.5 4 1.5 5 5.5 5.5C13.5 9 12.5 10 12 14c-.5-4-1.5-5-5.5-5.5C10.5 8 11.5 7 12 3z" />
    <path d="M18.5 14.5c.3 2 .8 2.5 2.5 2.8-1.7.3-2.2.8-2.5 2.7-.3-1.9-.8-2.4-2.5-2.7 1.7-.3 2.2-.8 2.5-2.8z" />
  </svg>
);
SparkIcon.displayName = 'SparkIcon';

const VibeIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 10v4M8 8v8M12 6v12M16 9v6M20 11v2" />
  </svg>
);
VibeIcon.displayName = 'VibeIcon';

type ArchetypeIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>;

function archetypeIconFor(key: string) {
  const map: Record<string, ArchetypeIcon> = {
    music: Icon.Music,
    spark: SparkIcon,
    vibe: VibeIcon,
    moon: Icon.Moon,
    hypnotist: Icon.Music,
    'deep-cut': SparkIcon,
    afterglow: Icon.Moon,
    'main-character': SparkIcon,
    'pop-oracle': SparkIcon,
    'southern-romantic': Icon.Music,
    'social-aux': VibeIcon,
    'pregame-menace': SparkIcon,
    'algorithm-dodger': Icon.Music,
    'culture-keeper': Icon.Music,
  };
  return map[key] ?? Icon.Music;
}

export function ActConnectionIntro({
  matchCount,
  userAnswer,
  anim,
}: {
  matchCount: number;
  userAnswer: string;
  anim: string;
}) {
  const pickLine = userAnswer.trim()
    ? `You said “${userAnswer.trim()}.” So did Georgetown.`
    : 'You locked in. So did Georgetown.';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '96px 28px 150px',
        animation: anim,
      }}
    >
      <span
        style={{
          fontFamily: FF,
          fontWeight: 700,
          fontSize: 11,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#EA8CE1',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: 99,
            background: '#EA8CE1',
            boxShadow: '0 0 0 4px rgba(234,140,225,0.18)',
          }}
        />
        Connection Night
      </span>

      <h1
        style={{
          fontFamily: FF,
          fontWeight: 600,
          fontSize: 44,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          color: '#fff',
          margin: '20px 0 14px',
          textWrap: 'balance',
          textShadow: '0 2px 30px rgba(0,0,0,0.6)',
        }}
      >
        Someone on campus gets it.
      </h1>

      <p
        style={{
          fontFamily: FF,
          fontSize: 15,
          lineHeight: 1.55,
          color: 'rgba(255,255,255,0.7)',
          margin: '0 0 12px',
          maxWidth: 300,
          textWrap: 'pretty',
        }}
      >
        {pickLine} Tonight, Ligo surfaces{' '}
        <span style={{ color: '#F5D783', fontWeight: 700 }}>{matchCount} people</span> whose taste
        rhymes with yours — not a playlist match, a{' '}
        <span style={{ color: '#EA8CE1', fontWeight: 700 }}>how-you-hear-it</span> match.
      </p>

      <p
        style={{
          fontFamily: FF,
          fontSize: 13.5,
          lineHeight: 1.5,
          color: 'rgba(255,255,255,0.42)',
          margin: 0,
          maxWidth: 280,
          textWrap: 'pretty',
        }}
      >
        No swiping. No guessing when it&apos;s coming. You&apos;ll never know it&apos;s Connection Night until
        you&apos;re already in it.
      </p>

      <div
        style={{
          marginTop: 28,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 14px',
          borderRadius: 999,
          background: 'rgba(234,140,225,0.1)',
          border: '1px solid rgba(234,140,225,0.22)',
        }}
      >
        <SparkIcon width="14" height="14" style={{ color: '#EA8CE1' }} />
        <span
          style={{
            fontFamily: FF,
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'rgba(234,140,225,0.9)',
          }}
        >
          Vibe · Spark · Pass — your call
        </span>
      </div>

      <span
        style={{
          marginTop: 30,
          fontFamily: FF,
          fontSize: 11,
          letterSpacing: '0.04em',
          color: 'rgba(234,140,225,0.75)',
        }}
      >
        tap — meet them →
      </span>
    </div>
  );
}

export function ActConnectionSealed({
  people,
  song,
  anim,
}: {
  people: ConnectionNightPerson[];
  song: ConnectionNightSong;
  anim: string;
}) {
  const ringPeople = people.slice(0, 3);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '100px 28px 150px',
        animation: anim,
      }}
    >
      <span
        style={{
          fontFamily: FF,
          fontWeight: 700,
          fontSize: 11,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#EA8CE1',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: 99,
            background: '#EA8CE1',
            boxShadow: '0 0 0 4px rgba(234,140,225,0.18)',
          }}
        />
        Connection Night · Georgetown
      </span>

      <div style={{ position: 'relative', width: 180, height: 84, margin: '28px 0 24px' }}>
        {[
          { p: ringPeople[0], style: { left: 0, top: 10, width: 64, height: 64 } },
          { p: ringPeople[2], style: { right: 0, top: 12, width: 64, height: 64 } },
          { p: ringPeople[1], style: { left: '50%', top: 0, width: 72, height: 72, marginLeft: -36 } },
        ]
          .filter((r) => r.p)
          .map((r, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                borderRadius: 99,
                background: r.p!.grad,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: FF,
                fontWeight: 700,
                fontSize: typeof r.style.width === 'number' && r.style.width > 64 ? 22 : 20,
                border: '2.5px solid #0A0907',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                ...r.style,
              }}
            >
              {r.p!.initials}
            </div>
          ))}
      </div>

      <div
        style={{
          fontFamily: FF,
          fontWeight: 700,
          fontSize: 56,
          letterSpacing: '-0.04em',
          lineHeight: 1,
          marginBottom: 8,
          color: '#fff',
        }}
      >
        {people.length}
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.45)', marginBottom: 14 }}>
        connections surfaced tonight
      </div>
      <div
        style={{
          fontFamily: FF,
          fontWeight: 700,
          fontSize: 24,
          letterSpacing: '-0.03em',
          lineHeight: 1.2,
          marginBottom: 10,
          textWrap: 'balance',
        }}
      >
        matched to your taste.
      </div>
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, maxWidth: 260, marginBottom: 20 }}>
        You&apos;ll never know it&apos;s coming. That&apos;s the point.
      </div>

      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 11,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 14,
          padding: '10px 14px',
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 9,
            backgroundImage: `url(${song.art})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            flexShrink: 0,
          }}
        />
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 13.5, lineHeight: 1.2 }}>{song.name}</div>
          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{song.artist}</div>
        </div>
        <span
          style={{
            fontFamily: FF,
            fontWeight: 700,
            fontSize: 9,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#F97316',
            background: 'rgba(249,115,22,0.12)',
            border: '1px solid rgba(249,115,22,0.2)',
            borderRadius: 6,
            padding: '4px 7px',
          }}
        >
          Your pick
        </span>
      </div>

      <span
        style={{
          marginTop: 26,
          fontFamily: FF,
          fontSize: 11,
          letterSpacing: '0.04em',
          color: 'rgba(234,140,225,0.75)',
        }}
      >
        tap — see who they are
      </span>
    </div>
  );
}

export function ActConnectionPerson({
  p,
  idx,
  total,
  song,
  action,
  onAct,
  anim,
}: {
  p: ConnectionNightPerson;
  idx: number;
  total: number;
  song: ConnectionNightSong;
  action?: string;
  onAct: (kind: 'vibe' | 'spark' | 'pass') => void;
  anim: string;
}) {
  const A = archetypeIconFor(p.aIconKey);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        animation: anim,
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '78px 22px 12px',
          position: 'relative',
          overflowY: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        <div
          style={{
            fontFamily: FF,
            fontWeight: 700,
            fontSize: 10,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: 99, background: '#F97316' }} /> {idx + 1} of {total} ·{' '}
          {p.matchType} · {p.score}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 99,
              background: p.grad,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FF,
              fontWeight: 700,
              fontSize: 22,
              color: '#fff',
              flexShrink: 0,
              boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
            }}
          >
            {p.initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 24, letterSpacing: '-0.03em', lineHeight: 1.05 }}>
              {p.name}
            </div>
            <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.45)', fontWeight: 600, marginTop: 3 }}>{p.meta}</div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 999,
                padding: '4px 10px',
                fontFamily: FF,
                fontWeight: 700,
                fontSize: 11,
                color: 'rgba(255,255,255,0.7)',
                marginTop: 7,
              }}
            >
              <A width="12" height="12" /> {p.archetype}
            </div>
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            marginTop: 16,
            padding: '14px 15px',
            borderRadius: 16,
            background: 'linear-gradient(160deg, rgba(234,140,225,0.16), rgba(255,255,255,0.02))',
            border: '1px solid rgba(234,140,225,0.24)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
            <SparkIcon width="13" height="13" style={{ color: '#EA8CE1' }} />
            <span
              style={{
                fontFamily: FF,
                fontWeight: 700,
                fontSize: 9.5,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#EA8CE1',
              }}
            >
              Your connection reading
            </span>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.55, color: 'rgba(255,255,255,0.8)', textWrap: 'pretty', margin: 0 }}>
            {p.horoscope}
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 11,
            marginTop: 10,
            padding: '10px 12px',
            borderRadius: 14,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.09)',
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 9,
              backgroundImage: `url(${song.art})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: FF,
                fontWeight: 700,
                fontSize: 9,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              Your pick tonight
            </div>
            <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 14.5, letterSpacing: '-0.01em', marginTop: 2 }}>
              {song.name} · <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>{song.artist}</span>
            </div>
          </div>
        </div>

        {p.sharedPickCard ? (
          <div
            style={{
              marginTop: 14,
              padding: '12px 14px',
              borderRadius: 14,
              background: 'rgba(249,115,22,0.1)',
              border: '1px solid rgba(249,115,22,0.24)',
            }}
          >
            <div
              style={{
                fontFamily: FF,
                fontWeight: 700,
                fontSize: 9,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#F97316',
                marginBottom: 6,
              }}
            >
              Shared pick
            </div>
            <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 15, color: 'rgba(255,255,255,0.92)' }}>
              {p.sharedPickCard.label}
            </div>
            {p.sharedPickCard.detail && (
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 6, lineHeight: 1.45 }}>
                {p.sharedPickCard.detail}
              </div>
            )}
          </div>
        ) : p.sharedLane ? (
          <div style={{ marginTop: 14 }}>
            <div
              style={{
                fontFamily: FF,
                fontWeight: 700,
                fontSize: 9,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)',
                marginBottom: 8,
              }}
            >
              Shared lane
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.55)',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 999,
                padding: '6px 10px',
              }}
            >
              {p.sharedLane}
            </span>
          </div>
        ) : null}
      </div>

      <div
        style={{
          flexShrink: 0,
          padding: '14px 18px 110px',
          background: 'rgba(10,9,7,0.88)',
          backdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: 11.5, fontWeight: 600, color: 'rgba(255,255,255,0.38)', textAlign: 'center', marginBottom: 11 }}>
          {p.prompt}
        </div>
        <div style={{ display: 'flex', gap: 9, marginBottom: 8 }}>
          <button
            type="button"
            onClick={() => onAct('vibe')}
            disabled={!!action}
            style={{
              flex: 1,
              padding: '12px 8px',
              borderRadius: 14,
              cursor: action ? 'default' : 'pointer',
              border: action === 'vibe' ? '1.5px solid rgba(113,192,127,0.4)' : '1.5px solid rgba(255,255,255,0.1)',
              background: action === 'vibe' ? 'rgba(113,192,127,0.18)' : 'rgba(255,255,255,0.07)',
              color: '#fff',
              fontFamily: FF,
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            {action === 'vibe' ? 'Vibed' : 'Vibe'}
          </button>
          <button
            type="button"
            onClick={() => onAct('spark')}
            disabled={!!action}
            style={{
              flex: 1,
              padding: '12px 8px',
              borderRadius: 14,
              cursor: action ? 'default' : 'pointer',
              border: 0,
              background: action === 'spark' ? 'rgba(234,140,225,0.5)' : '#EA8CE1',
              color: '#fff',
              fontFamily: FF,
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            {action === 'spark' ? 'Sparked' : 'Spark'}
          </button>
        </div>
        <button
          type="button"
          onClick={() => onAct('pass')}
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'center',
            fontSize: 12,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.25)',
            cursor: 'pointer',
            padding: 4,
            background: 'none',
            border: 0,
            fontFamily: FF,
          }}
        >
          Not right now
        </button>
      </div>
    </div>
  );
}

export function ActConnectionDone({
  people,
  actions,
  anim,
}: {
  people: ConnectionNightPerson[];
  actions: Record<number, string>;
  anim: string;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '90px 24px 130px',
        textAlign: 'center',
        animation: anim,
      }}
    >
      <div
        style={{
          width: 68,
          height: 68,
          borderRadius: 99,
          background: 'rgba(113,192,127,0.13)',
          border: '1.5px solid rgba(113,192,127,0.28)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
          color: '#71C07F',
        }}
      >
        <Icon.Check width="30" height="30" />
      </div>
      <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 24, letterSpacing: '-0.025em', marginBottom: 8, lineHeight: 1.15 }}>
        That&apos;s tonight&apos;s connections.
      </div>
      <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.42)', lineHeight: 1.6, maxWidth: 280, marginBottom: 22 }}>
        Sparks stay anonymous until they send one back. Vibes can plan a hang right now.
      </div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 7 }}>
        {people.map((p, i) => {
          const a = actions[i];
          return (
            <div
              key={p.id}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 13,
                padding: '11px 13px',
                display: 'flex',
                alignItems: 'center',
                gap: 11,
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 99,
                  background: p.grad,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: FF,
                  fontWeight: 700,
                  fontSize: 12,
                  color: '#fff',
                  flexShrink: 0,
                }}
              >
                {p.initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 13 }}>{p.name}</div>
                <div style={{ fontSize: 11, marginTop: 2, color: 'rgba(255,255,255,0.38)' }}>
                  {a === 'vibe' && <span style={{ color: '#F97316', fontWeight: 700 }}>Sent a Vibe</span>}
                  {a === 'spark' && <span style={{ color: '#EA8CE1', fontWeight: 700 }}>Sparked · anonymous until mutual</span>}
                  {(!a || a === 'pass') && <span style={{ color: 'rgba(255,255,255,0.28)', fontWeight: 700 }}>Passed</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <span style={{ marginTop: 24, fontFamily: FF, fontSize: 11, letterSpacing: '0.04em', color: 'rgba(245,215,131,0.75)' }}>
        tap — back to home →
      </span>
    </div>
  );
}
