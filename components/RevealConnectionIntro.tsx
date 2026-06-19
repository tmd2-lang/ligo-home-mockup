import React from 'react';
import { Icon } from '@/components/Primitives';

const FF = "'Bricolage Grotesque', sans-serif";

const SparkIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3c.5 4 1.5 5 5.5 5.5C13.5 9 12.5 10 12 14c-.5-4-1.5-5-5.5-5.5C10.5 8 11.5 7 12 3z" />
    <path d="M18.5 14.5c.3 2 .8 2.5 2.5 2.8-1.7.3-2.2.8-2.5 2.7-.3-1.9-.8-2.4-2.5-2.7 1.7-.3 2.2-.8 2.5-2.8z" />
  </svg>
);
SparkIcon.displayName = 'SparkIcon';

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
          Vibe · Pass — your call
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
  people: any[];
  song: any;
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
