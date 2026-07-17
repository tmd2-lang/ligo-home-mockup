import React, { useState, useMemo } from 'react';
import { EventItem, MockUser, Organization } from '../../lib/mockEventsData';
import { PoshEventCard } from './PoshEventCard';
import { EVI } from './Icons';

// Helper to filter events by tags
const filterByTags = (events: EventItem[], tags: string[]) => {
  return events.filter(e => {
    const eventTags = e.tags || [e.category];
    return eventTags.some(t => tags.map(tgt => tgt.toLowerCase()).includes(t.toLowerCase()));
  });
};

export function HomeFeedView({ 
  events, 
  user, 
  orgs, 
  onOpenEvent, 
  onOpenOrgWorkspace
}: { 
  events: EventItem[], 
  user: MockUser, 
  orgs: Record<string, Organization>,
  onOpenEvent: (id: string) => void,
  onOpenOrgWorkspace: (orgId: string) => void
}) {
  const [activeCategory, setActiveCategory] = useState<{ title: string, events: EventItem[] } | null>(null);

  const managedOrgs = user.organizations
    .filter(o => ['officer', 'social_chair', 'admin'].includes(o.role))
    .map(o => orgs[o.organizationId])
    .filter(Boolean);

  const publicEvents = events.filter(e => e.visibility === 'public' || e.visibility === 'campus');
  
  // 1. This Week
  const thisWeekEvents = [...publicEvents].sort((a, b) => (b.goingCount || 0) - (a.goingCount || 0));

  // 2. Free This Week (max 8)
  const freeEvents = thisWeekEvents
    .filter(e => !e.tickets || e.tickets.some((t: any) => t.price.toLowerCase().includes('free')))
    .slice(0, 8);

  // 3. Late Night
  const nightlifeEvents = filterByTags(publicEvents, ['Nightlife', 'Dance', 'Party', 'DJ']);
  
  // 4. Live & Loud
  const liveMusicEvents = filterByTags(publicEvents, ['A Cappella', 'Live Music', 'Orchestra', 'Concert', 'Jazz']);
  
  // 5. Arts & Culture
  const cultureEvents = filterByTags(publicEvents, ['Culture', 'Performance', 'Theatre', 'Fashion', 'Art', 'South Asian', 'Latin America']);
  
  // 6. On Campus
  const campusEvents = useMemo(() => {
    const capturedIds = new Set([
      ...nightlifeEvents.map(e => e.id),
      ...liveMusicEvents.map(e => e.id),
      ...cultureEvents.map(e => e.id)
    ]);
    return publicEvents.filter(e => !capturedIds.has(e.id));
  }, [publicEvents, nightlifeEvents, liveMusicEvents, cultureEvents]);

  // Construct Category Rows
  const categoryRows = [
    { title: "Free This Week", subtitle: "No cover, just pull up", events: freeEvents, forceRender: false },
    { title: "Late Night", subtitle: "for the dancefloor", events: nightlifeEvents, forceRender: false },
    { title: "Live & Loud", subtitle: "the best vocal & instrumental acts", events: liveMusicEvents, forceRender: false },
    { title: "Arts & Culture", subtitle: "performances and presentations", events: cultureEvents, forceRender: false },
    { title: "On Campus", subtitle: "get involved on the hilltop", events: campusEvents, forceRender: false }
  ].filter(row => row.events.length >= 4);

  if (activeCategory) {
    return (
      <div className="screen-fade" style={{ background: '#fff', minHeight: '100vh', padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 12 }}>
          <button onClick={() => setActiveCategory(null)} style={{ background: 'none', border: 'none', padding: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <EVI.Chevron style={{ width: 24, height: 24, transform: 'rotate(90deg)' }} />
          </button>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, fontFamily: 'var(--font-display)', letterSpacing: '-0.5px' }}>{activeCategory.title}</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {activeCategory.events.map((e, index) => (
            <PoshEventCard key={e.id} event={e} layout="grid" onClick={() => onOpenEvent(e.id)} index={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="screen-fade" style={{ paddingBottom: 120, paddingTop: 16 }}>

      {/* This Week Row (Never filtered out) */}
      <CarouselSection 
        title="This Week" 
        subtitle="All campus events, ordered by popularity" 
        events={thisWeekEvents} 
        onEventClick={onOpenEvent} 
        onViewAll={() => setActiveCategory({ title: "This Week", events: thisWeekEvents })}
      />

      {/* Conditional Category Rows */}
      {categoryRows.map(row => (
        <CarouselSection 
          key={row.title}
          title={row.title} 
          subtitle={row.subtitle} 
          events={row.events} 
          onEventClick={onOpenEvent} 
          onViewAll={() => setActiveCategory({ title: row.title, events: row.events })}
        />
      ))}
    </div>
  );
}

function CarouselSection({ title, subtitle, events, onEventClick, onViewAll }: { title: string, subtitle: string, events: EventItem[], onEventClick: (id: string) => void, onViewAll?: () => void }) {
  if (!events || events.length === 0) return null;

  return (
    <div style={{ marginTop: 24 }}> {/* Tightened from 32 */}
      <div style={{ padding: '0 20px', marginBottom: 12, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px 0', letterSpacing: '-0.5px', color: '#111', fontFamily: 'var(--font-display)' }}>{title}</h2>
          <p style={{ fontSize: 14, color: '#666', margin: 0, fontWeight: 500 }}>{subtitle}</p>
        </div>
        {onViewAll && (
          <div onClick={onViewAll} style={{ fontSize: 14, color: 'var(--orange)', fontWeight: 700, cursor: 'pointer' }}>all →</div>
        )}
      </div>

      <div style={{ 
        display: 'flex', 
        alignItems: 'flex-start',
        gap: 12, 
        padding: '0 20px', 
        overflowX: 'auto', 
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none'
      }}>
        {events.map((event, index) => (
          <PoshEventCard key={event.id} event={event} onClick={() => onEventClick(event.id)} index={index} />
        ))}
        {/* Spacer to prevent clipping on the right edge */}
        <div style={{ flex: '0 0 20px' }} />
      </div>
    </div>
  );
}
