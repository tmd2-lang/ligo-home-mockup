import React, { useState } from 'react';
import { EventItem } from '../../lib/mockEventsData';
import { EVI } from './Icons';

export function SwipeableInvites({ 
  invites, 
  onComplete, 
  onRsvp 
}: { 
  invites: EventItem[], 
  onComplete: () => void,
  onRsvp: (id: string, action: 'going'|'declined') => void
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (invites.length === 0 || currentIndex >= invites.length) {
    onComplete();
    return null;
  }

  const currentInvite = invites[currentIndex];

  const handleAction = (action: 'going' | 'declined') => {
    onRsvp(currentInvite.id, action);
    if (currentIndex === invites.length - 1) {
      setTimeout(onComplete, 300);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      padding: 'max(env(safe-area-inset-top, 40px), 40px) 20px max(env(safe-area-inset-bottom, 40px), 40px)',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ color: '#fff', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Pending Invites
        </div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 500, marginTop: 4 }}>
          {currentIndex + 1} of {invites.length}
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative' }}>
        {invites.slice(currentIndex).reverse().map((invite, reverseIndex) => {
          const isTop = reverseIndex === invites.length - 1 - currentIndex;
          const scale = isTop ? 1 : 0.95 - (reverseIndex * 0.05);
          const yOffset = isTop ? 0 : 20 + (reverseIndex * 10);
          
          if (!isTop && reverseIndex > 2) return null; // Only render top 3 for perf

          return (
            <div 
              key={invite.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 40,
                background: invite.color || '#fff',
                borderRadius: 24,
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transform: `scale(${scale}) translateY(${yOffset}px)`,
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                boxShadow: isTop ? '0 24px 48px rgba(0,0,0,0.4)' : 'none',
                opacity: isTop ? 1 : 0.6,
                zIndex: isTop ? 10 : 1,
                overflow: 'hidden'
              }}
            >
              {/* Inner card content - only visible on top card for cleaner look */}
              <div style={{ opacity: isTop ? 1 : 0, transition: 'opacity 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: 20, color: '#fff', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <EVI.Invite style={{ width: 12, height: 12 }} /> Invite
                  </div>
                  <div style={{ background: '#fff', color: 'var(--ink)', padding: '6px 12px', borderRadius: 20, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {invite.day}
                  </div>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: 80 }}>
                  <h2 style={{ fontSize: 48, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--ink)', lineHeight: 0.9, letterSpacing: '-0.04em', textTransform: 'uppercase', marginBottom: 12 }}>
                    {invite.name}
                  </h2>
                  <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'rgba(20,17,13,0.8)', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: 8 }}>
                    {invite.host}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'rgba(20,17,13,0.6)' }}>
                    {invite.time} · {invite.venue}
                  </div>

                  {invite.currentUserAccessReason && (
                    <div style={{ marginTop: 24, padding: 16, background: 'rgba(255,255,255,0.4)', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                        <EVI.Invite />
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', flex: 1 }}>
                        {invite.currentUserAccessReason}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 16, marginTop: 'auto' }}>
        <button 
          onClick={() => handleAction('declined')}
          style={{ flex: 1, padding: 20, borderRadius: 24, background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 16, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <EVI.Close /> Pass
        </button>
        <button 
          onClick={() => handleAction('going')}
          style={{ flex: 1, padding: 20, borderRadius: 24, background: 'var(--orange)', color: '#fff', fontSize: 16, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 24px rgba(249,115,22,0.4)' }}
        >
          <EVI.Check /> I'm In
        </button>
      </div>
    </div>
  );
}
