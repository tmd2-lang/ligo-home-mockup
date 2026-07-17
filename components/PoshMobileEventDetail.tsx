import React, { useState } from 'react';
import { LigoEvents } from '../app/data/events';
import { Icon } from './Primitives';

export function PoshMobileEventDetail({ eventId, onBack }: { eventId: number; onBack: () => void }) {
  const event = LigoEvents.find(e => e.id === eventId) || LigoEvents[3];

  const [isRsvpd, setIsRsvpd] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  return (
    <div 
      style={{
        position: 'absolute',
        inset: 0,
        background: '#000000',
        color: '#ffffff',
        overflow: 'hidden',
        zIndex: 100,
        fontFamily: 'sans-serif',
      }}
    >
      {/* BLURRED BACKGROUND HERO (Fixed behind scroll) */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `url(${event.image})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'blur(80px) brightness(0.3)', transform: 'scale(1.1)', zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* INNER SCROLL CONTENT */}
      <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden', zIndex: 10 }}>
        
        {/* MAIN SINGLE-COLUMN LAYOUT */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
          
          {/* TOP POSTER */}
          <div style={{ width: '100%', height: '55vh', position: 'relative' }}>
            <img src={event.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {/* Fading gradient to blend poster into content background */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '150px', background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.8) 100%)' }} />
          </div>

          {/* CONTENT STACK */}
          <div style={{ padding: '0 16px 140px 16px', background: 'rgba(0,0,0,0.8)', flex: 1 }}>
            
            {/* HEADER INFO */}
            <div style={{ marginTop: '-40px', position: 'relative', zIndex: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: event.hostAvatarColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 700 }}>{event.hostAvatar}</div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#ccc' }}>{event.hostName}</span>
              </div>
              
              <h1 style={{ fontSize: '36px', fontWeight: 800, margin: '0 0 16px 0', lineHeight: 1.1, letterSpacing: '-1px' }}>{event.title}</h1>
              
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>{event.location}</p>
                <p style={{ margin: 0, fontSize: '15px', color: '#a0a0a0' }}>{event.timeFull}</p>
              </div>
            </div>

            {/* ABOUT THIS EVENT */}
            <div style={{ marginTop: '32px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>About this event</h2>
              <div style={{ 
                fontSize: '15px', lineHeight: 1.6, color: '#e0e0e0', display: 'flex', flexDirection: 'column', gap: '12px',
                position: 'relative',
                maxHeight: isDescriptionExpanded ? 'none' : '120px',
                overflow: 'hidden'
              }}>
                {event.description.map((paragraph, idx) => (
                  <p key={idx} style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                ))}
                
                {event.details && event.details.length > 0 && (
                  <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {event.details.map((detail, idx) => (
                      <li key={idx}><strong>{detail.label}:</strong> {detail.value}</li>
                    ))}
                  </ul>
                )}

                {/* Fading gradient when collapsed */}
                {!isDescriptionExpanded && (
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px',
                    background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.8) 100%)',
                    pointerEvents: 'none'
                  }} />
                )}
              </div>
              <button 
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                style={{
                  background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff',
                  padding: '8px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  marginTop: '12px'
                }}
              >
                {isDescriptionExpanded ? "Show Less" : "Show More"}
              </button>
            </div>

            {/* TICKETS */}
            <div style={{ marginTop: '32px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Tickets</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {event.tickets.map((tier, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 600 }}>{tier.name}</h3>
                      <p style={{ margin: 0, fontSize: '12px', color: '#a0a0a0' }}>{tier.desc}</p>
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 700 }}>{tier.price}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ACCESS RULES */}
            <div style={{ marginTop: '32px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Access rules</h2>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#e0e0e0', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {event.rules.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>

            {/* SOCIAL PROOF */}
            <div style={{ marginTop: '32px' }}>
               <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>{event.socialProof.going} people are going</h2>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                 {[1,2,3,4,5].map(i => (
                   <div key={i} style={{ width: 36, height: 36, borderRadius: '50%', background: '#333', border: '2px solid #000', marginLeft: i > 1 ? '-12px' : '0', zIndex: 10 - i }} />
                 ))}
                 <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#222', border: '2px solid #000', marginLeft: '-12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700 }}>+{event.socialProof.going - 5}</div>
               </div>
               <p style={{ margin: 0, fontSize: '13px', color: '#a0a0a0' }}>{event.socialProof.connections} of your Georgetown connections are attending.</p>
            </div>

            {/* TAGS */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '32px' }}>
              {event.tags.map((tag, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '100px', padding: '6px 12px', fontSize: '12px', fontWeight: 500 }}>
                  {tag}
                </div>
              ))}
            </div>

            {/* ORGANIZER PROFILE */}
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: event.hostAvatarColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 800 }}>{event.hostAvatar}</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700 }}>{event.organizer.name}</h3>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#888' }}>
                    <span>{event.organizer.upcoming} upcoming</span>
                    <span>•</span>
                    <span>{event.organizer.followers} followers</span>
                  </div>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '14px', color: '#a0a0a0', lineHeight: 1.5 }}>{event.organizer.desc}</p>
              <button style={{ background: '#fff', color: '#000', border: 'none', borderRadius: '100px', padding: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', width: '100%' }}>
                Follow
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* HEADER NAV (Absolute to outer container so it floats over scroll) */}
      <header style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 110, height: '80px',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '24px 16px 0 16px',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)',
        pointerEvents: 'none'
      }}>
        {/* BACK BUTTON */}
        <button 
          onClick={onBack}
          style={{ 
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', cursor: 'pointer', padding: 0, pointerEvents: 'auto'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>

        {/* RIGHT ACTIONS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', pointerEvents: 'auto' }}>
          <button style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
            View Ticket
          </button>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>TD</div>
        </div>
      </header>

      {/* BOTTOM FLOATING RSVP BAR */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '16px 16px',
        paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 60%, transparent 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 120,
        pointerEvents: 'none'
      }}>
        <button 
          onClick={() => {
            setIsRsvpd(true);
            setShowModal(true);
          }}
          style={{
            width: '100%',
            background: isRsvpd ? 'rgba(255,255,255,0.05)' : 'rgba(176, 141, 35, 0.25)', 
            color: isRsvpd ? '#aaa' : '#fff', 
            border: isRsvpd ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(176, 141, 35, 0.5)',
            borderRadius: '100px', 
            padding: '16px', 
            fontSize: '16px', 
            fontWeight: 700,
            cursor: 'pointer', 
            pointerEvents: 'auto', 
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            transition: 'all 0.2s ease',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          {isRsvpd ? "You have RSVP'd to this event" : "RSVP"}
        </button>
      </div>

      {/* TICKET MODAL */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 200
        }}>
          {/* Overlay Click to Close */}
          <div style={{ position: 'absolute', inset: 0 }} onClick={() => setShowModal(false)} />
          
          {/* Modal Container */}
          <div style={{
            position: 'relative', width: '100%', maxHeight: '85vh', background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.1)',
            borderTopLeftRadius: '24px', borderTopRightRadius: '24px', display: 'flex', flexDirection: 'column', padding: '24px', gap: '24px', 
            boxShadow: '0 -12px 40px rgba(0,0,0,0.5)', overflowY: 'auto'
          }}>
            {/* Handle bar */}
            <div style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '100px', margin: '0 auto -8px auto' }} />

            <div style={{ display: 'flex', flexDirection: 'column' }}>
               <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 12px 0' }}>{event.title}</h2>
               
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                 <div style={{ width: 16, height: 16, borderRadius: '50%', background: event.hostAvatarColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 700 }}>{event.hostAvatar}</div>
                 <span style={{ fontSize: '13px', fontWeight: 600 }}>{event.hostName}</span>
               </div>
               
               <p style={{ margin: '0 0 24px 0', fontSize: '13px', color: '#a0a0a0' }}>{event.timeFull}</p>

               {/* Buttons */}
               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                 <button style={{ width: '100%', background: '#e0e0e0', color: '#000', border: 'none', borderRadius: '100px', padding: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>View Ticket</button>
                 <button style={{ width: '100%', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px', padding: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Add to Calendar</button>
                 <button style={{ width: '100%', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px', padding: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Add to Apple Wallet</button>
               </div>

               <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column' }}>
                 {/* App unlocks more */}
                 <div style={{ display: 'flex', flexDirection: 'column', padding: '24px 0', gap: '16px' }}>
                   <p style={{ margin: 0, fontSize: '15px', fontWeight: 600, textAlign: 'center' }}>The app unlocks more</p>
                   
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
                     <span style={{ fontSize: '20px' }}>🎟</span>
                     <span style={{ fontSize: '14px', color: '#ccc' }}>Instant ticket access & transfers</span>
                   </div>
                   
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
                     <span style={{ fontSize: '20px' }}>🌐</span>
                     <span style={{ fontSize: '14px', color: '#ccc' }}>Curated feeds just For You</span>
                   </div>
                 </div>
               </div>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
