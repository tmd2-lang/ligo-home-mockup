'use client';

import React, { useEffect, useRef, useState } from 'react';
import { LigoMark } from '@/components/Primitives';

const FF = "'Bricolage Grotesque', sans-serif";
const EASE = 'cubic-bezier(.2,.7,.2,1)';

const CURTAINS = [
  { color: '#71C07F', left: '-8%', delay: '0ms' },
  { color: '#EA8CE1', left: '22%', delay: '120ms' },
  { color: '#F97316', left: '48%', delay: '240ms' },
  { color: '#F5D783', left: '70%', delay: '360ms' },
];

type Props = {
  onComplete: () => void;
};

/**
 * Cinematic handoff when Marcus's countdown hits zero — aurora rises,
 * copy blooms, then fades into Act I. Skipped on manual replay.
 */
export function RevealOpeningIntro({ onComplete }: Props) {
  const [phase, setPhase] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setPhase(1), 350),
      window.setTimeout(() => setPhase(2), 1050),
      window.setTimeout(() => setPhase(3), 1850),
      window.setTimeout(() => onCompleteRef.current(), 2650),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const finish = () => onCompleteRef.current();

  const exiting = phase >= 3;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={finish}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') finish();
      }}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #050608 0%, #0A0907 55%, #0D0B08 100%)',
        opacity: exiting ? 0 : 1,
        transition: exiting ? `opacity 850ms ${EASE}` : 'none',
        pointerEvents: exiting ? 'none' : 'auto',
        cursor: exiting ? 'default' : 'pointer',
      }}
    >
      {/* Stars */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: phase >= 1 ? 1 : 0.35,
          transition: `opacity 900ms ${EASE}`,
          backgroundImage: [
            'radial-gradient(1.3px 1.3px at 23px 31px, rgba(255,255,255,0.8), transparent 60%)',
            'radial-gradient(1px 1px at 131px 109px, rgba(255,255,255,0.55), transparent 60%)',
            'radial-gradient(1.5px 1.5px at 81px 187px, rgba(255,255,255,0.65), transparent 60%)',
          ].join(', '),
          backgroundSize: '210px 230px',
          animation: 'twinkleReveal 3.4s ease-in-out infinite alternate',
        }}
      />

      {/* Aurora curtains rise */}
      {CURTAINS.map((c, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: phase >= 1 ? '-18%' : '55%',
            bottom: '-12%',
            left: c.left,
            width: '52%',
            opacity: phase >= 1 ? (phase >= 2 ? 0.72 : 0.42) : 0,
            transform: phase >= 1 ? 'translateY(0)' : 'translateY(28%)',
            transition: `top 1100ms ${EASE} ${c.delay}, opacity 900ms ${EASE} ${c.delay}, transform 1100ms ${EASE} ${c.delay}`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(185deg, transparent 6%, ${c.color} 36%, transparent 76%)`,
              filter: 'blur(38px)',
              animation: `auroraSway ${11 + i * 2}s ease-in-out infinite alternate`,
              transformOrigin: '50% 0%',
            }}
          />
        </div>
      ))}

      {/* Flare sweep on bloom */}
      {phase >= 2 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, transparent 10%, rgba(113,192,127,0.45) 45%, rgba(234,140,225,0.3) 60%, transparent 90%)',
            filter: 'blur(20px)',
            animation: `veilSweep 900ms ${EASE} both`,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Top mark */}
      <div
        style={{
          position: 'absolute',
          top: 64,
          left: 22,
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'translateY(0)' : 'translateY(-12px)',
          transition: `opacity 600ms ${EASE}, transform 600ms ${EASE}`,
        }}
      >
        <LigoMark size={24} reversed />
        <div>
          <div
            style={{
              fontFamily: FF,
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: '-0.01em',
              color: '#FFFFFF',
              lineHeight: 1,
            }}
          >
            The Reveal
          </div>
          <div
            style={{
              fontFamily: FF,
              fontWeight: 600,
              fontSize: 8.5,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.45)',
              marginTop: 3,
            }}
          >
            Georgetown · under the lights
          </div>
        </div>
      </div>

      {/* Center copy */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '100px 30px 150px',
        }}
      >
        {phase < 2 ? (
          <>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 99,
                background: '#F97316',
                boxShadow: '0 0 0 6px rgba(249,115,22,0.2), 0 0 24px rgba(249,115,22,0.55)',
                animation: 'ligo-pulse 1.4s ease-in-out infinite',
                opacity: phase >= 1 ? 1 : 0.7,
                transition: `opacity 500ms ${EASE}`,
              }}
            />
            <p
              style={{
                margin: '22px 0 0',
                fontFamily: FF,
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(245,215,131,0.8)',
                opacity: phase >= 1 ? 1 : 0,
                transform: phase >= 1 ? 'translateY(0)' : 'translateY(16px)',
                transition: `opacity 650ms ${EASE} 150ms, transform 650ms ${EASE} 150ms`,
              }}
            >
              Tonight&apos;s sky is opening
            </p>
          </>
        ) : (
          <div
            style={{
              animation: `enterRise 750ms ${EASE} both`,
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: FF,
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#F5D783',
              }}
            >
              Act I · Look up
            </p>
            <h1
              style={{
                fontFamily: FF,
                fontWeight: 600,
                fontSize: 46,
                lineHeight: 1.02,
                letterSpacing: '-0.03em',
                color: '#FFFFFF',
                margin: '16px 0 0',
                textShadow: '0 2px 30px rgba(0,0,0,0.6)',
              }}
            >
              Look up, Georgetown.
            </h1>
          </div>
        )}
      </div>

      {/* Bottom hint */}
      <p
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 118,
          margin: 0,
          textAlign: 'center',
          fontFamily: FF,
          fontSize: 11,
          letterSpacing: '0.04em',
          color: 'rgba(255,255,255,0.35)',
          opacity: phase >= 2 ? 1 : 0,
          transition: `opacity 500ms ${EASE}`,
        }}
      >
        tap — the sky tells the rest
      </p>
    </div>
  );
}
