import React from 'react';
import { EventItem } from '../../lib/mockEventsData';
import { EVI } from './Icons';

function HorizontalRow({ title, events, onOpen }: { title: string, events: EventItem[], onOpen: (id: string) => void }) {
  if (events.length === 0) return null;

  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ padding: '0 20px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1 }}>{title}</h3>
        <button style={{ background: 'none', border: 'none', fontSize: 13, fontWeight: 700, color: 'var(--orange)', cursor: 'pointer' }}>See All</button>
      </div>

      <div style={{ display: 'flex', gap: 16, overflowX: 'auto', padding: '0 20px', paddingBottom: 24, WebkitOverflowScrolling: 'touch' }} className="no-scrollbar">
        {events.map(e => (
          <div key={e.id} onClick={() => onOpen(e.id)} style={{ flexShrink: 0, width: 240, background: '#fff', borderRadius: 16, border: '1px solid rgba(20,17,13,0.06)', overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: 120, background: e.color || 'var(--ink)', display: 'flex', alignItems: 'flex-end', padding: 12 }}>
              <div style={{ background: '#fff', color: 'var(--ink)', padding: '4px 8px', borderRadius: 12, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {e.day}
              </div>
            </div>
            <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--ink)', lineHeight: 1.1, textTransform: 'uppercase', marginBottom: 4 }}>{e.name}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(20,17,13,0.6)', marginBottom: 12 }}>{e.host}</div>
              
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'rgba(20,17,13,0.5)' }}>
                <EVI.MapPin style={{ width: 12, height: 12 }} /> {e.venue}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExploreView({ events, onOpenEvent }: { events: EventItem[], onOpenEvent: (id: string) => void }) {
  const exploreEvents = events.filter(e => e.visibility === 'public' || e.visibility === 'campus');
  
  // Sort them by attendance to simulate the algorithm Will mentioned
  const sortedByAttendance = [...exploreEvents].sort((a, b) => (b.goingCount || 0) - (a.goingCount || 0));

  const trending = sortedByAttendance.slice(0, 4);
  const music = sortedByAttendance.filter(e => e.category === 'Music' || e.category === 'A cappella' || e.category === 'Jazz');
  const social = sortedByAttendance.filter(e => e.category === 'Social' || e.category === 'Party');

  return (
    <div className="screen-fade">
      <HorizontalRow title="Trending on Campus" events={trending} onOpen={onOpenEvent} />
      <HorizontalRow title="Music & Performances" events={music} onOpen={onOpenEvent} />
      <HorizontalRow title="Socials & Parties" events={social} onOpen={onOpenEvent} />
      
      <div style={{ height: 120 }} />
    </div>
  );
}
