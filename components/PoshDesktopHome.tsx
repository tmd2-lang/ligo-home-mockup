import React, { useState, useEffect } from 'react';

import { LigoEvents } from '../app/data/events';


const FEATURED_EVENT_IDS = [12, 8, 10, 2, 4];
const FEATURED_EVENTS = FEATURED_EVENT_IDS.map(id => LigoEvents.find(e => e.id === id)!);

export function PoshDesktopHome({ onEventClick }: { onEventClick?: (id: number) => void }) {
  const [heroIndex, setHeroIndex] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const [filterTrending, setFilterTrending] = useState('Trending');
  const [filterTime, setFilterTime] = useState('This Weekend');
  const [filterLocation, setFilterLocation] = useState('Georgetown');

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % FEATURED_EVENTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeHero = FEATURED_EVENTS[heroIndex];
  return (
    <div style={{ width: '100%', height: '100%', background: '#000000', color: '#ffffff', fontFamily: 'sans-serif', overflowY: 'auto' }}>
      
      {/* HEADER NAV */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: '64px',
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px'
      }}>
        {/* LOGO */}
        <div style={{ fontSize: '24px', fontWeight: 900, fontStyle: 'italic', letterSpacing: '-1px' }}>
          ligo
        </div>

        {/* FULL SCREEN OVERLAY TO CLOSE DROPDOWN */}
        {activeDropdown && (
          <div 
            style={{ position: 'fixed', inset: 0, zIndex: 40 }} 
            onClick={() => setActiveDropdown(null)} 
          />
        )}

        {/* FILTER PILL */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: '#222222',
          borderRadius: '100px',
          padding: '4px',
          gap: '4px',
          fontSize: '14px',
          fontWeight: 500,
          position: 'relative',
          zIndex: 50
        }}>
          {/* Trending Dropdown */}
          <div style={{ position: 'relative' }}>
            <div onClick={() => setActiveDropdown(activeDropdown === 'trending' ? null : 'trending')} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: activeDropdown === 'trending' ? '#fff' : '#e0e0e0', padding: '8px 16px', borderRadius: '100px', cursor: 'pointer', background: activeDropdown === 'trending' ? 'rgba(255,255,255,0.1)' : 'transparent', transition: '0.2s' }}>
              {filterTrending} <span style={{fontSize: '10px'}}>{activeDropdown === 'trending' ? '▲' : '▼'}</span>
            </div>
            {activeDropdown === 'trending' && (
              <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '12px', background: '#fff', color: '#000', borderRadius: '12px', padding: '8px', minWidth: '160px', boxShadow: '0 12px 48px rgba(0,0,0,0.6)', zIndex: 60 }}>
                {['Trending', 'Newest', 'Largest'].map(opt => (
                  <div key={opt} onClick={() => { setFilterTrending(opt); setActiveDropdown(null); }} style={{ padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '15px', backgroundColor: filterTrending === opt ? '#f4f4f4' : 'transparent', transition: '0.1s' }}>
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Time Dropdown */}
          <div style={{ position: 'relative' }}>
            <div onClick={() => setActiveDropdown(activeDropdown === 'time' ? null : 'time')} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: activeDropdown === 'time' ? '#fff' : '#e0e0e0', padding: '8px 16px', borderRadius: '100px', cursor: 'pointer', background: activeDropdown === 'time' ? 'rgba(255,255,255,0.1)' : 'transparent', transition: '0.2s' }}>
              {filterTime} <span style={{fontSize: '10px'}}>{activeDropdown === 'time' ? '▲' : '▼'}</span>
            </div>
            {activeDropdown === 'time' && (
              <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '12px', background: '#fff', color: '#000', borderRadius: '12px', padding: '8px', minWidth: '160px', boxShadow: '0 12px 48px rgba(0,0,0,0.6)', zIndex: 60 }}>
                {['This Weekend', 'Tonight', 'Tomorrow'].map(opt => (
                  <div key={opt} onClick={() => { setFilterTime(opt); setActiveDropdown(null); }} style={{ padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '15px', backgroundColor: filterTime === opt ? '#f4f4f4' : 'transparent', transition: '0.1s' }}>
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Location Dropdown */}
          <div style={{ position: 'relative' }}>
            <div onClick={() => setActiveDropdown(activeDropdown === 'location' ? null : 'location')} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: activeDropdown === 'location' ? '#fff' : '#e0e0e0', padding: '8px 16px', borderRadius: '100px', cursor: 'pointer', background: activeDropdown === 'location' ? 'rgba(255,255,255,0.1)' : 'transparent', transition: '0.2s' }}>
              {filterLocation === 'Georgetown' ? <>at <strong>Georgetown</strong></> : filterLocation} <span style={{fontSize: '10px'}}>{activeDropdown === 'location' ? '▲' : '▼'}</span>
            </div>
            {activeDropdown === 'location' && (
              <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '12px', background: '#fff', color: '#000', borderRadius: '12px', padding: '8px', minWidth: '180px', boxShadow: '0 12px 48px rgba(0,0,0,0.6)', zIndex: 60 }}>
                {['Georgetown', 'On Campus', 'Burleith', 'West Village', 'Off-Campus'].map(opt => (
                  <div key={opt} onClick={() => { setFilterLocation(opt); setActiveDropdown(null); }} style={{ padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '15px', backgroundColor: filterLocation === opt ? '#f4f4f4' : 'transparent', transition: '0.1s' }}>
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT ACTIONS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
          <div style={{ fontSize: '20px' }}>🔔</div>
          <div style={{ fontSize: '20px' }}>≡</div>
        </div>
      </header>

      {/* HERO SLIDER SECTION */}
      <div style={{ position: 'relative', width: '100%', height: '650px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', paddingTop: '40px' }}>
         
         {/* BLURRED BACKGROUND */}
         <div style={{
           position: 'absolute', inset: 0,
           backgroundImage: `url(${activeHero.image})`,
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           filter: 'blur(80px) brightness(0.3)',
           transform: 'scale(1.2)', // prevent blur white edges
           zIndex: 0,
           transition: 'background-image 0.5s ease-in-out'
         }} />
         <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, #000000 100%)', zIndex: 1 }} />

         {/* CONTENT ROW */}
         <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: '80px', maxWidth: '1000px', width: '100%' }}>
            
            {/* POSTER */}
            <div onClick={() => onEventClick?.(activeHero.id)} style={{ width: '380px', aspectRatio: '3/4', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 32px 64px rgba(0,0,0,0.8)', cursor: 'pointer' }}>
              <img src={activeHero.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* DETAILS */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
               <h1 style={{ fontSize: '42px', fontWeight: 800, margin: '0 0 8px 0', lineHeight: 1.1 }}>{activeHero.title}</h1>
               <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 8px 0' }}>{activeHero.subtitle}</h2>
               <p style={{ fontSize: '18px', color: '#e0e0e0', margin: '0 0 32px 0' }}>{activeHero.date}</p>
               
               {/* HOST PILL */}
               <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px', padding: '6px 20px 6px 6px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', marginBottom: '24px' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#111', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>{activeHero.hostAvatar}</div>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>{activeHero.hostName}</span>
               </button>

               {/* ACTION BUTTON */}
               <button onClick={() => onEventClick?.(activeHero.id)} style={{ background: '#fff', color: '#000', border: 'none', borderRadius: '100px', padding: '14px 36px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', transition: '0.2s' }}>
                 Get Tickets
               </button>
            </div>
         </div>

         {/* PAGINATION DOTS */}
         <div style={{ position: 'relative', zIndex: 10, display: 'flex', gap: '10px', marginTop: '64px' }}>
           {FEATURED_EVENTS.map((_, i) => (
              <div key={i} onClick={() => setHeroIndex(i)} style={{
                width: 10, height: 10, borderRadius: '50%', cursor: 'pointer',
                border: i === heroIndex ? 'none' : '1px solid rgba(255,255,255,0.4)',
                background: i === heroIndex ? '#fff' : 'transparent',
                transition: '0.2s'
              }} />
           ))}
         </div>
      </div>

      {/* MAIN CONTAINER (GRID) */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px', paddingBottom: '120px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px', letterSpacing: '-0.5px' }}>Discover</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px'
        }}>
          {LigoEvents.map(event => (
            <div key={event.id} onClick={() => onEventClick?.(event.id)} style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '3/4',
              borderRadius: '16px',
              overflow: 'hidden',
              cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.05)',
              backgroundColor: '#111'
            }}>
              
              {/* BACKGROUND IMAGE */}
              <img 
                src={event.image} 
                alt={event.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* GRADIENT OVERLAY */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 30%, transparent 60%)'
              }} />

              {/* HOST AVATAR (Top Left) */}
              <div style={{
                position: 'absolute',
                top: 12,
                left: 12,
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#000',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700,
                color: '#fff'
              }}>
                {event.hostAvatar}
              </div>

              {/* MORE DATES PILL (Top Right) */}
              {(event as any).moreDates && (
                <div style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  background: '#fff',
                  color: '#000',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  📅 More Dates
                </div>
              )}

              {/* CONTENT (Bottom) */}
              <div style={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                right: 16,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}>
                <div style={{
                  background: 'rgba(0,0,0,0.4)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  marginBottom: '10px'
                }}>
                  {event.date}
                </div>
                
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  lineHeight: 1.2,
                  margin: '0 0 4px 0',
                  color: '#ffffff',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {event.title}
                </h3>
                
                <p style={{
                  fontSize: '13px',
                  color: '#a0a0a0',
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '100%'
                }}>
                  {event.subtitle}
                </p>
              </div>

            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
