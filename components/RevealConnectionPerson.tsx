import { useState } from 'react';
import { Icon } from '@/components/Primitives';
import { ProfileV2Provider, ProfileV2Shell } from '@/components/profile/ProfileScreen';

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

export function RevealConnectionPerson({
  p,
  idx,
  total,
  song,
  onAct,
  anim,
}: {
  p: any;
  idx: number;
  total: number;
  song: any;
  onAct: (kind: 'vibe' | 'spark' | 'pass') => void;
  anim: string;
}) {
  const A = archetypeIconFor(p.aIconKey || 'music');
  const [expanded, setExpanded] = useState(false);

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

        <div 
          onClick={() => setExpanded(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 99,
              backgroundImage: `url(${p.avatar})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: '#333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
            }}
          />
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
            {p.matchReason}
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
            onClick={(e) => { e.stopPropagation(); onAct('vibe'); }}
            style={{
              flex: 1,
              padding: '12px 8px',
              borderRadius: 14,
              cursor: 'pointer',
              border: '1.5px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.07)',
              color: '#fff',
              fontFamily: FF,
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            Vibe
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onAct('spark'); }}
            style={{
              flex: 1,
              padding: '12px 8px',
              borderRadius: 14,
              cursor: 'pointer',
              border: 0,
              background: '#EA8CE1',
              color: '#fff',
              fontFamily: FF,
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            Spark
          </button>
        </div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onAct('pass'); }}
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

      {expanded && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#FAFAF8', animation: 'slideUp 300ms cubic-bezier(0.2, 0.7, 0.2, 1)' }}>
          <ProfileV2Provider overrideUserId={p.id} matchReason={p.matchReason} onClose={() => setExpanded(false)}>
            <ProfileV2Shell />
          </ProfileV2Provider>
        </div>
      )}
    </div>
  );
}
