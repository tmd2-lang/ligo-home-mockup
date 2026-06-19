import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@/components/Primitives';
import { ProfileV2Provider, ProfileV2Shell } from '@/components/profile/ProfileScreen';

const FF = "'Bricolage Grotesque', sans-serif";

function NightLabel({ text, color, dotBg, dotGlow }: { text: string; color: string; dotBg: string; dotGlow: string }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.1)' }}>
      <span style={{ width: 6, height: 6, borderRadius: 99, background: dotBg, boxShadow: dotGlow }} />
      <span style={{ fontFamily: FF, fontWeight: 700, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color, paddingTop: 1 }}>{text}</span>
    </div>
  );
}

export function ActConnectionDone({
  people,
  actions,
  anim,
  night,
  onRestart,
}: {
  people: any[];
  actions: Record<number, string>;
  anim: string;
  night: any;
  onRestart: () => void;
}) {
  const vibes = people.filter((p, i) => actions[i] === 'vibe');
  const sparks = people.filter((p, i) => actions[i] === 'spark');
  const passed = people.filter((p, i) => actions[i] === 'pass');

  const [expandedAction, setExpandedAction] = useState<{ profile: any, action: string } | null>(null);
  const [showFullProfile, setShowFullProfile] = useState(false);

  const vibeCount = vibes.length;
  const sparkCount = sparks.length;
  
  let summaryText = `You sent ${vibeCount} Vibe${vibeCount !== 1 ? 's' : ''} and ${sparkCount} Spark${sparkCount !== 1 ? 's' : ''} tonight.`;
  if (vibeCount === 0 && sparkCount === 0) summaryText = "You didn't send any Vibes or Sparks tonight.";

  const [now, setNow] = useState(Date.now());
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
    <div
      style={{
        position: 'absolute', inset: 0, zIndex: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '80px 24px 130px', textAlign: 'center', animation: anim,
        overflowY: 'auto', WebkitOverflowScrolling: 'touch',
      }}
      className="no-scrollbar"
    >
      <div
        style={{
          width: 56, height: 56, borderRadius: 99, background: 'rgba(113,192,127,0.13)',
          border: '1.5px solid rgba(113,192,127,0.28)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', marginBottom: 16, color: '#71C07F', flexShrink: 0
        }}
      >
        <Icon.Check width="26" height="26" />
      </div>
      <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 24, letterSpacing: '-0.025em', marginBottom: 8, lineHeight: 1.15 }}>
        That's tonight's connections.
      </div>
      <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.42)', lineHeight: 1.6, maxWidth: 280, marginBottom: 32 }}>
        If it's mutual, check your home profile. You'll be able to message them to plan a meetup for 7 days.
      </div>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 7, flexShrink: 0 }}>
        {people.map((p, i) => {
          const a = actions[i] || 'pass'; // default to pass if no action recorded
          return (
            <div
              key={p.id}
              onClick={(e) => { e.stopPropagation(); setExpandedAction({ profile: p, action: a }); setShowFullProfile(false); }}
              style={{
                background: a === 'vibe' ? 'rgba(249, 115, 22, 0.05)' : (a === 'spark' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)'),
                border: a === 'vibe' ? '1px solid rgba(249, 115, 22, 0.15)' : (a === 'spark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(255,255,255,0.03)'),
                borderRadius: 16, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
                opacity: a === 'pass' ? 0.6 : 1,
                cursor: 'pointer'
              }}
            >
              <div 
                style={{ 
                  width: 40, height: 40, borderRadius: 99, 
                  backgroundImage: `url(${p.avatar})`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0,
                  filter: a === 'pass' ? 'grayscale(100%)' : (a === 'spark' ? 'brightness(0.9)' : 'none')
                }} 
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                <div style={{ fontSize: 11, marginTop: 2 }}>
                  {a === 'vibe' && <span style={{ color: '#F97316', fontWeight: 600 }}>Sent a Vibe</span>}
                  {a === 'spark' && <span style={{ color: '#EA8CE1', fontWeight: 600 }}>Sparked · anonymous until mutual</span>}
                  {a === 'pass' && <span style={{ color: 'rgba(255,255,255,0.38)', fontWeight: 600 }}>Passed</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 24, flexShrink: 0, width: '100%' }}>
        <button
          onClick={(e) => { e.stopPropagation(); onRestart(); }}
          style={{
            width: '100%', padding: '14px 16px', borderRadius: 16, background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontFamily: FF, fontWeight: 700, fontSize: 14,
            cursor: 'pointer'
          }}
        >
          Do it again
        </button>
      </div>

      {/* Countdown Hook */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 48, flexShrink: 0 }}>
        <NightLabel text="Tomorrow · 8:00 pm" color="#F5D783" dotBg="#F5D783" dotGlow="0 0 0 4px rgba(245,215,131,0.18)" />
        <div style={{
          fontFamily: FF, fontWeight: 600, fontSize: 42, letterSpacing: '-0.03em', lineHeight: 1,
          color: '#F5D783', margin: '14px 0 6px', fontVariantNumeric: 'tabular-nums',
          textShadow: '0 0 40px rgba(245,215,131,0.35)',
        } as React.CSSProperties}>
          {countdown}
        </div>
        <span style={{ fontFamily: FF, fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>
          Answers open at 8 am. Don&apos;t break the streak.
        </span>
      </div>
      
      <div style={{ marginTop: 40, fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: FF, letterSpacing: '0.05em' }}>
        tap screen to return home →
      </div>

      {expandedAction && !showFullProfile && createPortal(
        <div 
          onClick={(e) => { e.stopPropagation(); setExpandedAction(null); }}
          style={{ position: 'absolute', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              background: '#1A1A1A', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: '32px 24px', 
              animation: 'sheetUp 400ms cubic-bezier(0.2, 0.8, 0.2, 1) both',
              borderTop: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{ width: 56, height: 56, borderRadius: 99, backgroundImage: `url(${expandedAction.profile.avatar})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: expandedAction.action === 'pass' ? 'grayscale(100%)' : 'none' }} />
              <div>
                <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 20, color: '#FFF' }}>{expandedAction.profile.name}</div>
                <div style={{ fontSize: 13, marginTop: 4, fontWeight: 600, color: expandedAction.action === 'vibe' ? '#F97316' : (expandedAction.action === 'spark' ? '#EA8CE1' : 'rgba(255,255,255,0.4)') }}>
                  {expandedAction.action === 'vibe' && "Sent a Vibe"}
                  {expandedAction.action === 'spark' && "Sent a Spark"}
                  {expandedAction.action === 'pass' && "Passed"}
                </div>
              </div>
            </div>
            
            <div style={{ fontSize: 15, lineHeight: 1.5, color: 'rgba(255,255,255,0.8)', marginBottom: 32 }}>
              {expandedAction.action === 'vibe' && "If the feeling is mutual, they'll appear on your home screen tomorrow morning. You'll have 7 days to message them and plan a meetup."}
              {expandedAction.action === 'spark' && "Sparks are secret! This stays completely anonymous unless they spark you back. If they do, you'll both find out tomorrow morning."}
              {expandedAction.action === 'pass' && "You passed. You won't see their profile again tonight."}
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setExpandedAction(null)}
                style={{ flex: 1, padding: '16px', borderRadius: 16, background: 'rgba(255,255,255,0.08)', border: 'none', color: '#FFF', fontFamily: FF, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}
              >
                Close
              </button>
              <button
                onClick={() => setShowFullProfile(true)}
                style={{ flex: 1, padding: '16px', borderRadius: 16, background: 'rgba(255,255,255,0.15)', border: 'none', color: '#FFF', fontFamily: FF, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}
              >
                View Profile
              </button>
            </div>
          </div>
        </div>,
        document.querySelector('.ios-device') || document.body
      )}

      {expandedAction && showFullProfile && createPortal(
        <div style={{ position: 'absolute', inset: 0, zIndex: 9999 }}>
          <ProfileV2Provider overrideUserId={expandedAction.profile.id} matchReason={expandedAction.profile.matchReason} onClose={(e) => { e?.stopPropagation(); setShowFullProfile(false); }}>
            <ProfileV2Shell />
          </ProfileV2Provider>
        </div>,
        document.querySelector('.ios-device') || document.body
      )}
    </div>
  );
}
