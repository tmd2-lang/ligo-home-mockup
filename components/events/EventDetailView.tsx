import React, { useState } from 'react';
import { EventItem } from '../../lib/mockEventsData';
import { EVI } from './Icons';

export function EventDetailView({ e, onBack, onRsvpAction }: { e: EventItem, onBack: () => void, onRsvpAction: (action: 'going'|'maybe'|'declined'|null) => void }) {
  const [showFullAbout, setShowFullAbout] = useState(false);
  const sampleNames = ['Maya A.', 'Jordan P.', 'Riya S.', 'Diego R.', 'Sofia H.', 'Theo K.'];
  const connections = e.socialProof?.connections || Math.floor(Math.random() * 20) + 5;
  
  const renderTextWithBold = (text: string) => {
    return text.split(/(\*\*.*?\*\*)/g).map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ color: '#111', fontWeight: 800 }}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };
  
  const isPastEvent = e.relativeDays !== undefined && e.relativeDays < 0;
  const isPersonHost = e.organizer?.name === 'Maya Thompson' || e.organizer?.name === 'Caroline Lee';
  
  return (
    <div className="screen-fade event-detail" style={{ position: 'absolute', inset: 0, zIndex: 10, background: '#fff', overflowY: 'auto' }}>
      
      {/* Immersive Hero */}
      <div style={{ position: 'relative', width: '100%', height: '50vh', background: e.color }}>
        {e.image && (
          <img src={e.image} alt={e.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
        
        {/* Gradient Overlay for Top Nav */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 100%)' }} />

        {/* Top Nav Buttons */}
        <div style={{ position: 'absolute', top: 'max(env(safe-area-inset-top, 24px), 24px)', left: 20, right: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={onBack} aria-label="Back" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', color: '#111', border: 'none', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <EVI.Back />
          </button>
          <button style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', color: '#fff', border: 'none', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <EVI.Share />
          </button>
        </div>

        {/* Badge Overlay */}
        {e.hostAvatar && (
          <div style={{ position: 'absolute', bottom: -24, left: 20, background: e.hostAvatarColor || '#000', color: '#fff', width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, boxShadow: '0 4px 16px rgba(0,0,0,0.2)', border: '4px solid #fff' }}>
            {e.hostAvatar}
          </div>
        )}
      </div>

      <div style={{ padding: '40px 20px 24px' }}>
        {/* Title */}
        <h1 style={{ fontSize: 40, fontWeight: 800, fontFamily: 'var(--font-display)', color: '#111', lineHeight: 1, letterSpacing: '-1px', marginBottom: 24 }}>
          {e.name}
        </h1>

        {/* Key Info Strip */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111' }}>
              <EVI.Calendar />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>{e.day}, {e.date?.split('·')[1]?.trim() || ''}</div>
              <div style={{ fontSize: 14, color: '#666' }}>{e.timeFull || e.time}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111' }}>
              <EVI.MapPin />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>{e.venue}</div>
              <div style={{ fontSize: 14, color: '#666' }}>Georgetown, Washington, DC</div>
            </div>
          </div>
          {e.tickets && e.tickets.length > 0 && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111' }}>
                <div style={{ fontSize: 18, fontWeight: 800 }}>$</div>
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>{e.tickets[0].price}</div>
                <div style={{ fontSize: 14, color: '#666' }}>{e.tickets[0].name}</div>
              </div>
            </div>
          )}
        </div>

        {/* About Section */}
        {e.description && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#111', marginBottom: 12 }}>About</div>
            <div style={{ fontSize: 16, lineHeight: 1.5, color: '#444' }}>
              {showFullAbout ? (
                e.description.split('\\n\\n').map((p, i) => <p key={i} style={{ margin: '0 0 16px 0' }}>{renderTextWithBold(p)}</p>)
              ) : (
                <>
                  {e.description.split('\\n\\n').slice(0, 3).map((p, i) => (
                    <p key={i} style={{ margin: '0 0 16px 0' }}>{renderTextWithBold(p)}</p>
                  ))}
                  {e.description.split('\\n\\n').length > 3 && (
                    <button onClick={() => setShowFullAbout(true)} style={{ background: 'none', border: 'none', color: 'var(--ligo-orange)', fontSize: 16, fontWeight: 700, padding: 0, cursor: 'pointer' }}>
                      Show more
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Access Rules */}
        <div style={{ marginBottom: 32, padding: 20, background: 'rgba(0,0,0,0.03)', borderRadius: 12 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#111', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <EVI.Lock style={{ width: 16, height: 16 }} /> Access Rules
          </div>
          <ul style={{ margin: 0, paddingLeft: 20, color: '#444', fontSize: 15, lineHeight: 1.5 }}>
            {e.rules ? e.rules.map((r, i) => <li key={i} style={{ marginBottom: 4 }}>{r}</li>) : (
              <li>{e.visibility === 'public' ? 'Open to the public.' : 'Open to Georgetown students.'}</li>
            )}
          </ul>
        </div>

        {/* Attendee Count */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#111', marginBottom: 16 }}>
            {isPastEvent ? `${e.socialProof?.going || e.goingCount} attended` : `${e.goingCount || e.socialProof?.going} people are going`}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex' }}>
              {[1, 2, 3].map((_, i) => (
                <div key={i} style={{ width: 40, height: 40, borderRadius: '50%', background: '#eee', border: '2px solid #fff', marginLeft: i === 0 ? 0 : -16, zIndex: 10 - i, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#888' }}>
                  {sampleNames[i].charAt(0)}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 15, color: '#666', fontWeight: 500 }}>
              <b>{connections}</b> of your Georgetown connections {isPastEvent ? 'attended' : 'are attending'}
            </div>
          </div>
        </div>

        {/* Category Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 40 }}>
          {e.tags ? e.tags.map(tag => (
            <div key={tag} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(0,0,0,0.06)', color: '#444', fontSize: 13, fontWeight: 600, borderRadius: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              {tag}
            </div>
          )) : (
            <div style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(0,0,0,0.06)', color: '#444', fontSize: 13, fontWeight: 600, borderRadius: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              {e.category}
            </div>
          )}
        </div>

        {/* Org Card */}
        <div style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 16, padding: 20, cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: e.hostAvatarColor || '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, flexShrink: 0 }}>
            {e.hostAvatar || e.host.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#111', marginBottom: 4 }}>{e.organizer?.name || e.host}</div>
            <div style={{ fontSize: 13, color: '#888', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {e.organizer?.upcoming || 0} upcoming · {e.organizer?.followers || '0'} {isPersonHost ? 'connections' : 'followers'}
            </div>
            <div style={{ fontSize: 14, color: '#666', lineHeight: 1.4 }}>
              {e.organizer?.desc || 'Student organization at Georgetown University.'}
            </div>
          </div>
        </div>

        <div style={{ height: 120 }} />
      </div>

      {/* Fixed Footer RSVP */}
      {!isPastEvent && (
        <div style={{ position: 'sticky', bottom: 0, left: 0, right: 0, padding: '20px', background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderTop: '1px solid rgba(0,0,0,0.08)', zIndex: 11 }}>
          <div style={{ display: 'flex', gap: 12, maxWidth: 600, margin: '0 auto' }}>
            <button 
              onClick={() => onRsvpAction(e.currentUserStatus === 'declined' ? null : 'declined')}
              style={{ flex: 1, padding: '16px 0', background: e.currentUserStatus === 'declined' ? 'var(--ink)' : 'rgba(0,0,0,0.05)', color: e.currentUserStatus === 'declined' ? '#fff' : '#111', fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none', borderRadius: 12, cursor: 'pointer' }}>
              Pass
            </button>
            <button 
              onClick={() => onRsvpAction(e.currentUserStatus === 'maybe' ? null : 'maybe')}
              style={{ flex: 1, padding: '16px 0', background: e.currentUserStatus === 'maybe' ? 'var(--ink)' : 'rgba(0,0,0,0.05)', color: e.currentUserStatus === 'maybe' ? '#fff' : '#111', fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none', borderRadius: 12, cursor: 'pointer' }}>
              Maybe
            </button>
            <button 
              onClick={() => onRsvpAction(e.currentUserStatus === 'going' ? null : 'going')}
              style={{ flex: 1.5, padding: '16px 0', background: (e.currentUserStatus === 'going' || e.currentUserStatus === 'hosting') ? 'var(--orange)' : 'var(--ink)', color: '#fff', fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {(e.currentUserStatus === 'going' || e.currentUserStatus === 'hosting') && <EVI.Check />}
              Going
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
