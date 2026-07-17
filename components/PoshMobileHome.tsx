import React, { useMemo } from 'react';
import { LigoEvents } from '../app/data/events';
type LigoEvent = typeof LigoEvents[0];

// Helper to filter events by tags
const filterByTags = (events: LigoEvent[], tags: string[]) => {
  return events.filter(e => e.tags.some(t => tags.map(tgt => tgt.toLowerCase()).includes(t.toLowerCase())));
};

// Full-width category banners
const CATEGORY_BANNERS = [
  { id: 1, title: 'Arts & Culture', color: 'linear-gradient(90deg, #A100FF, #4D00FF)', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80' },
  { id: 2, title: 'Nightlife', color: 'linear-gradient(90deg, #FF0055, #FF00A2)', image: 'https://images.unsplash.com/photo-1572116469696-ed70ca8817a7?auto=format&fit=crop&q=80' },
  { id: 3, title: 'Live Music', color: 'linear-gradient(90deg, #FF8C00, #FF0055)', image: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f22eb0?auto=format&fit=crop&q=80' },
  { id: 4, title: 'Professional', color: 'linear-gradient(90deg, #00A2FF, #0055FF)', image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80' },
];

export function PoshMobileHome({ onEventClick }: { onEventClick?: (id: number) => void }) {
  // Categorize events organically
  const nightlifeEvents = useMemo(() => filterByTags(LigoEvents, ['Nightlife', 'Dance', 'Party', 'DJ']), []);
  
  const liveMusicEvents = useMemo(() => filterByTags(LigoEvents, ['A Cappella', 'Live Music', 'Orchestra', 'Concert', 'Jazz']), []);
  
  const cultureEvents = useMemo(() => filterByTags(LigoEvents, ['Culture', 'Performance', 'Theatre', 'Fashion', 'Art', 'South Asian', 'Latin America']), []);
  
  const campusEvents = useMemo(() => {
    // Events that didn't fit neatly into the others, or specific tags
    const capturedIds = new Set([
      ...nightlifeEvents.map(e => e.id),
      ...liveMusicEvents.map(e => e.id),
      ...cultureEvents.map(e => e.id)
    ]);
    return LigoEvents.filter(e => !capturedIds.has(e.id));
  }, [nightlifeEvents, liveMusicEvents, cultureEvents]);

  return (
    <div style={{ width: '100%', height: '100%', background: '#000000', color: '#ffffff', fontFamily: 'sans-serif', overflowY: 'auto', overflowX: 'hidden' }}>
      
      {/* HEADER */}
      <div style={{ padding: '24px 16px 16px 16px', position: 'sticky', top: 0, zIndex: 50, background: 'linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 70%, transparent 100%)', backdropFilter: 'blur(8px)' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 4px 0', letterSpacing: '-1px' }}>
          Find your world
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '32px', fontWeight: 800, margin: '0 0 16px 0', letterSpacing: '-1px' }}>
          Nearby <span style={{ fontSize: '20px', marginLeft: '8px', color: '#888' }}>▼</span>
        </div>

        {/* PILLS */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ padding: '8px 16px', borderRadius: '100px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: '14px', fontWeight: 600 }}>Date</button>
            <button style={{ padding: '8px 16px', borderRadius: '100px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: '14px', fontWeight: 600 }}>Price</button>
          </div>
          <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontSize: '20px', color: '#fff' }}>
            🔍
          </div>
        </div>
      </div>

      <div style={{ paddingBottom: '40px' }}>
        
        {/* SECTION: NIGHTLIFE */}
        <CarouselSection title="Late Night" subtitle="for the dancefloor" events={nightlifeEvents} onEventClick={onEventClick} />
        


        {/* SECTION: LIVE MUSIC */}
        <CarouselSection title="Live & Loud" subtitle="the best vocal & instrumental acts" events={liveMusicEvents} onEventClick={onEventClick} />
        
        {/* SECTION: ARTS & CULTURE */}
        <CarouselSection title="Arts & Culture" subtitle="performances and presentations" events={cultureEvents} onEventClick={onEventClick} />
        
        {/* SECTION: CAMPUS LIFE */}
        <CarouselSection title="On Campus" subtitle="get involved on the hilltop" events={campusEvents} onEventClick={onEventClick} />

        {/* DISCOVER MORE / CATEGORY BANNERS */}
        <div style={{ padding: '0 16px', marginTop: '32px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 600, margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>Discover More</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 16px', marginBottom: '32px' }}>
          {CATEGORY_BANNERS.map(banner => (
            <div key={banner.id} style={{ 
              position: 'relative', 
              width: '100%', 
              height: '80px', 
              borderRadius: '8px', 
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ position: 'absolute', inset: 0, background: banner.color, opacity: 0.8, zIndex: 1 }} />
              <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${banner.image})`, backgroundSize: 'cover', backgroundPosition: 'center', mixBlendMode: 'overlay', opacity: 0.5, zIndex: 0 }} />
              <div style={{ position: 'relative', zIndex: 10, fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px' }}>{banner.title}</div>
              {/* Fake little P logo on edges */}
              <div style={{ position: 'absolute', left: '16px', fontSize: '10px', fontWeight: 800, opacity: 0.6, zIndex: 10 }}>(P)</div>
              <div style={{ position: 'absolute', right: '16px', fontSize: '10px', fontWeight: 800, opacity: 0.6, zIndex: 10 }}>0{banner.id}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

// Reusable Carousel Component
function CarouselSection({ title, subtitle, events, onEventClick }: { title: string, subtitle: string, events: LigoEvent[], onEventClick?: (id: number) => void }) {
  if (!events || events.length === 0) return null;

  return (
    <div style={{ marginTop: '32px' }}>
      {/* Section Header */}
      <div style={{ padding: '0 16px', marginBottom: '16px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 600, margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>{title}</h2>
          <p style={{ fontSize: '14px', color: '#888', margin: 0 }}>{subtitle}</p>
        </div>
        <div style={{ fontSize: '14px', color: '#fff', fontWeight: 500 }}>all →</div>
      </div>

      {/* Horizontal Scroller */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        padding: '0 16px', 
        overflowX: 'auto', 
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none'  // IE/Edge
      }}>
        {/* Webkit scrollbar hidden via inline style not fully possible without global CSS, but we can do our best. NextJS projects usually have globals.css where ::-webkit-scrollbar is hidden for specific classes. We'll just rely on the above properties for now. */}
        {events.map(event => (
          <div 
            key={event.id} 
            onClick={() => onEventClick?.(event.id)}
            style={{ 
              flex: '0 0 80%', 
              scrollSnapAlign: 'start', 
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ width: '100%', aspectRatio: '3/4', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px', background: '#222' }}>
              <img src={event.image} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {event.title}
            </div>
            <div style={{ fontSize: '13px', color: '#aaa', margin: '0 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {event.tickets[0]?.price || 'Free'} at {event.location.split(',')[0]}
            </div>
            <div style={{ fontSize: '13px', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {event.date}
            </div>
          </div>
        ))}
        {/* Spacer for right padding at the end of the scroll */}
        <div style={{ flex: '0 0 16px' }} />
      </div>
    </div>
  );
}
