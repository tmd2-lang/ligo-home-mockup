import React, { useState, useEffect } from 'react';
import { LigoEvents } from '../app/data/events';

interface Props {
  eventId: number;
  onBack: () => void;
}

export function PoshEventDetail({ eventId, onBack }: Props) {
  const event = LigoEvents.find(e => e.id === eventId) || LigoEvents[3]; // fallback to SigEp

  const [scrollY, setScrollY] = useState(0);
  const [isRsvpd, setIsRsvpd] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleScroll = (e: any) => {
      setScrollY(e.target.scrollTop);
    };
    const container = document.getElementById('detail-scroll-container');
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const titleOpacity = Math.min(1, Math.max(0, (scrollY - 200) / 200));

  return (
    <div 
      id="detail-scroll-container"
      style={{ 
        width: '100%', height: '100%', background: '#000000', color: '#ffffff', 
        fontFamily: 'sans-serif', overflowY: 'auto', position: 'relative' 
      }}
    >
      {/* HEADER NAV */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50, height: '64px', background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px'
      }}>
        {/* LOGO (Acts as Back Button) */}
        <div 
          onClick={onBack}
          style={{ fontSize: '24px', fontWeight: 900, fontStyle: 'italic', letterSpacing: '-1px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <span style={{ fontSize: '16px', color: '#a0a0a0' }}>←</span>
          ligo
        </div>

        {/* RIGHT ACTIONS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button style={{ background: '#333', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px', padding: '6px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            View your ticket
          </button>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>TD</div>
        </div>
      </header>

      {/* BLURRED BACKGROUND HERO */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '600px',
        backgroundImage: `url(${event.image})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'blur(80px) brightness(0.3)', transform: 'scale(1.1)', zIndex: 0,
      }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '600px', background: 'linear-gradient(to bottom, transparent 40%, #000000 100%)', zIndex: 1 }} />

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '64px', padding: '40px 24px 120px 24px' }}>
        
        {/* LEFT COLUMN (Scrollable Content) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '48px', paddingTop: '24px' }}>
          
          {/* HEADER INFO */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: event.hostAvatarColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700 }}>{event.hostAvatar}</div>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>{event.hostName}</span>
            </div>
            
            <h1 style={{ fontSize: '48px', fontWeight: 800, margin: '0 0 24px 0', lineHeight: 1.1 }}>{event.title}</h1>
            
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '24px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{event.day}, {event.date?.split('·')[1]?.trim() || ''}</div>
              <div style={{ fontSize: 14, color: '#a0a0a0' }}>{event.timeFull || event.time}</div>
            </div>
          </div>

          {/* ABOUT THIS EVENT */}
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>About this event</h2>
            <div style={{ fontSize: '16px', lineHeight: 1.6, color: '#e0e0e0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {event.description.map((paragraph, idx) => (
                <p key={idx} style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              ))}
              
              {event.details && event.details.length > 0 && (
                <ul style={{ margin: '16px 0', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {event.details.map((detail, idx) => (
                    <li key={idx}><strong>{detail.label}:</strong> {detail.value}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* TICKETS */}
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>Tickets</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {event.tickets.map((tier, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600 }}>{tier.name}</h3>
                    <p style={{ margin: 0, fontSize: '13px', color: '#a0a0a0' }}>{tier.desc}</p>
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 700 }}>{tier.price}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ACCESS RULES */}
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>Access rules</h2>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '15px', color: '#e0e0e0', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {event.rules.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
          </div>

          {/* SOCIAL PROOF */}
          <div>
             <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>{event.socialProof.going} people are going</h2>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
               {[1,2,3,4,5,6].map(i => (
                 <div key={i} style={{ width: 40, height: 40, borderRadius: '50%', background: '#333', border: '2px solid #000', marginLeft: i > 1 ? '-16px' : '0', zIndex: 10 - i }} />
               ))}
               <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#222', border: '2px solid #000', marginLeft: '-16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>+{event.socialProof.going - 6}</div>
             </div>
             <p style={{ margin: 0, fontSize: '14px', color: '#a0a0a0' }}>{event.socialProof.connections} of your Georgetown connections are attending.</p>
          </div>

          {/* TAGS */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {event.tags.map((tag, idx) => (
              <div key={idx} style={{ background: '#222', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '100px', padding: '8px 16px', fontSize: '13px', fontWeight: 500 }}>
                {tag}
              </div>
            ))}
          </div>

          {/* ORGANIZER PROFILE */}
          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '24px', marginTop: '32px' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: event.hostAvatarColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 800 }}>{event.hostAvatar}</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 700 }}>{event.organizer.name}</h3>
              <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#a0a0a0' }}>{event.organizer.desc}</p>
              <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#888' }}>
                <span>{event.organizer.upcoming} upcoming events</span>
                <span>•</span>
                <span>{event.organizer.followers} followers</span>
              </div>
            </div>
            <button style={{ background: '#fff', color: '#000', border: 'none', borderRadius: '100px', padding: '8px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
              Follow
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN (Sticky Poster) */}
        <div style={{ width: '340px', flexShrink: 0, position: 'relative' }}>
          <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', aspectRatio: '4/5', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 24px 48px rgba(0,0,0,0.6)' }}>
              <img src={event.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            
            {/* Fading Title below poster on scroll */}
            <div style={{ marginTop: '24px', textAlign: 'center', opacity: titleOpacity, transition: 'opacity 0.1s', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>{event.title}</h2>
              <p style={{ margin: 0, fontSize: '15px', color: '#a0a0a0' }}>
                {event.timeFull.split(' at ')[0]}<br />
                {event.timeFull.split(' at ')[1]}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM FLOATING RSVP BAR */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, height: '120px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 60%, transparent 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        pointerEvents: 'none'
      }}>
        <button 
          onClick={() => {
            setIsRsvpd(true);
            setShowModal(true);
          }}
          style={{
            background: isRsvpd ? '#222' : '#B08D23', 
            color: '#fff', 
            border: isRsvpd ? '1px solid rgba(255,255,255,0.2)' : 'none',
            borderRadius: '100px', 
            padding: '16px 48px', 
            fontSize: '16px', 
            fontWeight: 700,
            cursor: 'pointer', 
            pointerEvents: 'auto', 
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            transition: '0.2s',
            backdropFilter: 'blur(10px)',
            marginTop: '20px'
          }}
        >
          {isRsvpd ? "You have RSVP'd to this event" : "RSVP"}
        </button>
      </div>

      {/* TICKET MODAL */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200
        }}>
          {/* Overlay Click to Close */}
          <div style={{ position: 'absolute', inset: 0 }} onClick={() => setShowModal(false)} />
          
          {/* Modal Container */}
          <div style={{
            position: 'relative', width: '900px', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px', display: 'flex', padding: '24px', gap: '32px', boxShadow: '0 32px 100px rgba(0,0,0,0.8)'
          }}>
            
            {/* Left: Poster */}
            <div style={{ width: '400px', flexShrink: 0, borderRadius: '12px', overflow: 'hidden' }}>
               <img src={event.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* Right: Info */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
               <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 16px 0' }}>{event.title}</h2>
               
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                 <div style={{ width: 20, height: 20, borderRadius: '50%', background: event.hostAvatarColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 700 }}>{event.hostAvatar}</div>
                 <span style={{ fontSize: '14px', fontWeight: 600 }}>{event.hostName}</span>
               </div>
               
               <p style={{ margin: '0 0 32px 0', fontSize: '14px', color: '#a0a0a0' }}>{event.timeFull}</p>

               {/* Buttons */}
               <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
                 <button style={{ background: '#e0e0e0', color: '#000', border: 'none', borderRadius: '100px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>View Ticket</button>
                 <button style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Add to Calendar</button>
                 <button style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Add to Apple Wallet</button>
               </div>

               <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', flex: 1, display: 'flex' }}>
                 {/* QR Section */}
                 <div style={{ flex: 1, borderRight: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                   <div style={{ fontSize: '20px', fontWeight: 800, fontStyle: 'italic', marginBottom: '16px', letterSpacing: '-1px' }}>ligo</div>
                   <div style={{ width: '120px', height: '120px', background: '#fff', padding: '8px', borderRadius: '8px', marginBottom: '16px' }}>
                     {/* Mock QR Code Pattern */}
                     <div style={{ width: '100%', height: '100%', background: 'repeating-linear-gradient(45deg, #000 0, #000 10%, #fff 10%, #fff 20%)' }} />
                   </div>
                   <p style={{ margin: 0, fontSize: '13px', color: '#a0a0a0' }}>Get the app</p>
                 </div>

                 {/* App unlocks more */}
                 <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px', gap: '24px' }}>
                   <p style={{ margin: 0, fontSize: '15px', fontWeight: 600, textAlign: 'center' }}>The app unlocks more</p>
                   
                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textAlign: 'center' }}>
                     <span style={{ fontSize: '16px' }}>🎟</span>
                     <span style={{ fontSize: '12px', color: '#a0a0a0' }}>Instant ticket access</span>
                   </div>
                   
                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textAlign: 'center' }}>
                     <span style={{ fontSize: '16px' }}>⇄</span>
                     <span style={{ fontSize: '12px', color: '#a0a0a0' }}>Easy ticket transfers</span>
                   </div>
                   
                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textAlign: 'center' }}>
                     <span style={{ fontSize: '16px' }}>🌐</span>
                     <span style={{ fontSize: '12px', color: '#a0a0a0' }}>Curated For you</span>
                   </div>
                 </div>
               </div>

            </div>
            
            {/* Close X */}
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#fff', fontSize: '28px', cursor: 'pointer', lineHeight: 1 }}>×</button>

          </div>
        </div>
      )}

    </div>
  );
}
