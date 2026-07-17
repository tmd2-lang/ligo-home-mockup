"use client";
import React, { useEffect, useState } from "react";
import { getEvent } from "@/lib/eventStore";
import { LigoEvent } from "@/components/PracticeEventsScreenV2";

const THEMES: Record<string, { bg: string; surface: string }> = {
  cream: { bg: '#FAFAF8', surface: '#FFFFFF' },
  dark: { bg: '#14110D', surface: '#221F1A' },
  blue: { bg: '#F0F4FA', surface: '#FFFFFF' },
};

const RSVP_SETS = {
  emojis: { label: 'Emojis', going: '👍', maybe: '🤔', cantGo: '😢' },
  icons: { label: 'Icons', going: '✓', maybe: '?', cantGo: '✕' },
  bloom: { label: 'Bloom', going: '💐', maybe: '🌷', cantGo: '🌱' },
  hearts: { label: 'Hearts', going: '❤️', maybe: '❤️‍🩹', cantGo: '💔' },
  flirty: { label: 'Flirty', going: '😘', maybe: '💋', cantGo: '🤐' },
} as const;

export default function GuestEventPage({ params }: { params: { slug: string } }) {
  const [event, setEvent] = useState<LigoEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app this would be SSR. We do it client-side for the localStorage mock.
    const fetchedEvent = getEvent(params.slug);
    setEvent(fetchedEvent);
    setLoading(false);
  }, [params.slug]);

  if (loading) return <div style={{ height: '100vh', background: '#FAFAF8' }} />;

  if (!event) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAF8', color: '#14110D', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800 }}>This event doesn't exist</h2>
        <p style={{ color: 'rgba(20, 17, 13, 0.5)' }}>The link may be broken or the event was deleted.</p>
      </div>
    );
  }

  const themeVars = THEMES[event.theme] || THEMES.cream;
  const isDark = event.theme === 'dark';
  
  const cssVars = {
    '--bg': themeVars.bg,
    '--surface': themeVars.surface,
    '--accent': '#0055FF',
    '--ink': isDark ? '#FFFFFF' : '#14110D',
    '--ink-muted': isDark ? 'rgba(255,255,255,0.5)' : 'rgba(20, 17, 13, 0.5)',
    '--border': isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
  } as React.CSSProperties;

  // Derive display values
  const dateStr = event.date.start ? `${event.date.start} · 8:00pm` : "Date TBD"; // Hardcoded time for mockup since we only stored date string
  
  // Custom Fields
  const playlistField = event.customFields.find(f => f.kind === 'playlist' || f.url.includes('spotify') || f.url.includes('apple'));
  const otherFields = event.customFields.filter(f => f !== playlistField);

  return (
    <div className="screen" style={{ ...cssVars, position: 'relative', width: '100%', minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'sans-serif', paddingBottom: '160px' }}>
      
      {/* COVER MEDIA */}
      <div style={{ width: '100%', aspectRatio: '1', background: event.coverMedia.src ? `url(${event.coverMedia.src}) center/cover` : 'linear-gradient(135deg, #FFD194 0%, #70E1F5 100%)', position: 'relative' }}>
         {event.coverMedia.kind === 'video' && (
           <div style={{ position: 'absolute', bottom: 16, right: 16, background: 'rgba(0,0,0,0.5)', color: '#fff', padding: '4px 8px', borderRadius: '100px', fontSize: '12px', fontWeight: 600 }}>🔇</div>
         )}
      </div>

      <div style={{ padding: '24px 20px' }}>
        
        {/* TITLE */}
        <h1 style={{ 
          fontSize: '42px', fontWeight: 800, margin: '0 0 24px 0', lineHeight: 1.1, textAlign: 'center',
          fontFamily: event.titleFont === 'eclectic' ? 'monospace' : event.titleFont === 'fancy' ? 'cursive' : event.titleFont === 'literary' ? 'serif' : 'sans-serif'
        }}>
          {event.title}
        </h1>

        {/* DATE & TIME */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
           <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'var(--surface)', border: `1px solid var(--border)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>📅</div>
           <div style={{ fontSize: '18px', fontWeight: 600 }}>{dateStr}</div>
        </div>

        {/* HOST ROW */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid var(--border)` }}>
           <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--surface)', border: `1px solid var(--border)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700 }}>{event.hosts[0]?.avatar}</div>
           <div>
              <div style={{ fontSize: '14px', color: 'var(--ink-muted)', marginBottom: '2px' }}>Hosted by</div>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>{event.hosts[0]?.name} {event.hostNickname ? `(${event.hostNickname})` : ''}</div>
           </div>
        </div>

        {/* APPROX LOCATION */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
           <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'var(--surface)', border: `1px solid var(--border)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>📍</div>
           <div>
              <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>{event.location.displayName || 'Location TBD'}</div>
              {event.location.displayName && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--ink-muted)' }}>
                  <span>🔒</span> Exact address shared after you RSVP
                </div>
              )}
           </div>
        </div>

        {/* PLAYLIST EMBED */}
        {playlistField && (
           <div style={{ background: 'var(--surface)', borderRadius: '16px', padding: '24px', textAlign: 'center', border: `1px solid var(--border)`, marginBottom: '32px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink-muted)', marginBottom: '12px' }}>{playlistField.label}</div>
              <div style={{ background: 'var(--bg)', borderRadius: '12px', padding: '24px', border: `1px dashed var(--border)` }}>
                🎵 Embedded {playlistField.url.includes('spotify') ? 'Spotify' : 'Apple Music'} Player Mock<br/>
                <span style={{fontSize:'12px', opacity:0.5}}>{playlistField.url}</span>
              </div>
           </div>
        )}

        {/* OTHER CUSTOM FIELDS */}
        {otherFields.length > 0 && (
          <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {otherFields.map((field, i) => (
              <div key={i} style={{ background: 'var(--surface)', borderRadius: '16px', border: `1px solid var(--border)`, padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '20px' }}>{field.icon}</span>
                <div style={{ fontWeight: 600 }}>{field.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* DESCRIPTION */}
        {event.description && (
          <div style={{ fontSize: '16px', lineHeight: 1.6, marginBottom: '32px', whiteSpace: 'pre-wrap' }}>
            {event.description}
          </div>
        )}
        
        {event.extraSections.map((sec, i) => (
          <div key={i} style={{ marginBottom: '32px' }}>
             <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{sec.title}</h3>
             <div style={{ fontSize: '16px', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{sec.body}</div>
          </div>
        ))}

        {/* GUEST LIST */}
        <div style={{ background: 'var(--surface)', borderRadius: '24px', border: `1px solid var(--border)`, padding: '24px', marginBottom: '32px' }}>
           <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 700 }}>Guest List</h3>
           {/* Static empty state for now */}
           <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--ink-muted)' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>👀</div>
              <div style={{ fontSize: '15px', fontWeight: 600 }}>Be the first to RSVP</div>
           </div>
        </div>

      </div>

      {/* STICKY RSVP BAR */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--surface)', borderTop: `1px solid var(--border)`, padding: '20px 20px max(env(safe-area-inset-bottom, 20px), 20px)', zIndex: 100 }}>
        {event.advanced.requireApproval ? (
          <button style={{ width: '100%', background: 'var(--ink)', color: 'var(--bg)', padding: '16px', borderRadius: '100px', fontSize: '18px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            Get on the list
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
            <button style={{ flex: 1, aspectRatio: '1', borderRadius: '50%', background: 'var(--bg)', border: `1px solid var(--border)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <span style={{ fontSize: '28px', marginBottom: '4px' }}>{RSVP_SETS[event.rsvpOptions.setId].going}</span><span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink-muted)' }}>Going</span>
            </button>
            {event.rsvpOptions.allowMaybe && (
              <button style={{ flex: 1, aspectRatio: '1', borderRadius: '50%', background: 'var(--bg)', border: `1px solid var(--border)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <span style={{ fontSize: '28px', marginBottom: '4px' }}>{RSVP_SETS[event.rsvpOptions.setId].maybe}</span><span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink-muted)' }}>Maybe</span>
              </button>
            )}
            <button style={{ flex: 1, aspectRatio: '1', borderRadius: '50%', background: 'var(--bg)', border: `1px solid var(--border)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <span style={{ fontSize: '28px', marginBottom: '4px' }}>{RSVP_SETS[event.rsvpOptions.setId].cantGo}</span><span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink-muted)' }}>Can't Go</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
