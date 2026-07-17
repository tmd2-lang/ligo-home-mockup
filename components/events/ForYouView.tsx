import React from 'react';
import { EventItem, MockUser, Organization } from '../../lib/mockEventsData';
import { EventCard } from './Cards';
import { EVI } from './Icons';

export function ForYouView({ 
  events, 
  user, 
  orgs, 
  onOpenEvent, 
  onRsvp,
  onOpenOrgWorkspace
}: { 
  events: EventItem[], 
  user: MockUser, 
  orgs: Record<string, Organization>,
  onOpenEvent: (id: string) => void,
  onRsvp: (id: string, action: 'going'|'maybe'|'declined'|null) => void,
  onOpenOrgWorkspace: (orgId: string) => void
}) {
  const forYouEvents = events.filter(e => 
    e.currentUserStatus === 'hosting' || 
    e.currentUserStatus === 'going' || 
    e.visibility === 'members_only' ||
    e.currentUserStatus === 'invited' ||
    (e.visibility === 'public' && e.flagship)
  );

  const managedOrgs = user.organizations.filter(o => ['officer', 'social_chair', 'admin'].includes(o.role)).map(o => orgs[o.organizationId]).filter(Boolean);

  return (
    <div className="screen-fade">
      {managedOrgs.map(org => (
        <div key={org.id} onClick={() => onOpenOrgWorkspace(org.id)} style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(20,17,13,0.06)', padding: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--orange)', marginBottom: 4 }}>Managing</div>
            <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--ink)', lineHeight: 1 }}>{org.name}</div>
          </div>
          <div style={{ color: 'rgba(20,17,13,0.4)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Workspace <EVI.Chevron style={{ width: 14, height: 14, transform: 'rotate(-90deg)' }} />
          </div>
        </div>
      ))}

      <div>
        {forYouEvents.length === 0 ? (
          <div style={{ padding: 20 }}>
            <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>Nothing for you right now.</div>
            <div style={{ fontSize: 14, color: 'rgba(20,17,13,0.6)', marginTop: 8 }}>Check the Explore tab to find campus events.</div>
          </div>
        ) : (
          forYouEvents.map(e => (
            <EventCard key={e.id} e={e} onOpen={() => onOpenEvent(e.id)} onRsvp={onRsvp} />
          ))
        )}
      </div>
      <div style={{ height: 120 }} />
    </div>
  );
}
