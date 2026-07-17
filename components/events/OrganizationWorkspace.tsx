import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Organization, EventItem, SIGEP_ROSTER } from '../../lib/mockEventsData';
import { USERS } from '../../lib/users';
import { EVI } from './Icons';

export function OrganizationWorkspace({ 
  org, 
  events, 
  onBack,
  onManageEvent,
  onCreateEvent,
  onInviteMembers
}: { 
  org: Organization, 
  events: EventItem[],
  onBack: () => void,
  onManageEvent: (id: string) => void,
  onCreateEvent: () => void,
  onInviteMembers: () => void
}) {
  const [tab, setTab] = useState<'overview'|'events'|'members'>('overview');
  const [selectedMember, setSelectedMember] = useState<any | null>(null);

  const orgEvents = events.filter(e => e.hostOrganizationId === org.id);
  const upcomingEvents = orgEvents.filter(e => e.visibility !== 'members_only' || e.name !== 'Winter Retreat'); // Mock logic for demo
  const draftEvents = orgEvents.filter(e => e.name === 'Winter Retreat'); // Mock logic for demo

  return (
    <div className="screen-fade" style={{ background: 'var(--ligo-paper)', minHeight: '100%', position: 'absolute', inset: 0, zIndex: 10, overflowY: 'auto' }}>
      <div style={{ position: 'sticky', top: 0, background: 'rgba(250,250,248,0.9)', backdropFilter: 'blur(20px)', zIndex: 10, padding: 'max(env(safe-area-inset-top, 56px), 56px) 20px 24px', display: 'flex', alignItems: 'flex-start', gap: 16, borderBottom: '2px solid var(--ink)' }}>
        <button onClick={onBack} aria-label="Back" style={{ background: 'var(--ink)', color: '#fff', border: 'none', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <EVI.Back />
        </button>
        <div style={{ paddingTop: 4 }}>
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--orange)', marginBottom: 4 }}>{org.campus}</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, fontFamily: 'var(--font-display)', margin: 0, lineHeight: 1, textTransform: 'uppercase' }}>{org.name}</h1>
          <div style={{ fontSize: 13, color: 'rgba(20,17,13,0.6)', marginTop: 8, fontWeight: 500 }}>{org.memberCount} members · You&apos;re {org.currentUserRole === 'admin' ? 'an' : 'a'} {org.currentUserRole?.replace('_', ' ')}</div>
        </div>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', gap: 24, marginTop: 24, marginBottom: 40, borderBottom: '1px solid rgba(20,17,13,0.1)' }}>
        <button className={tab === 'overview' ? 'active' : ''} onClick={() => setTab('overview')} style={{ paddingBottom: 12, borderBottom: tab === 'overview' ? '2px solid var(--ink)' : '2px solid transparent', background: 'none', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: tab === 'overview' ? 'var(--ink)' : 'rgba(20,17,13,0.4)', cursor: 'pointer' }}>Overview</button>
        <button className={tab === 'events' ? 'active' : ''} onClick={() => setTab('events')} style={{ paddingBottom: 12, borderBottom: tab === 'events' ? '2px solid var(--ink)' : '2px solid transparent', background: 'none', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: tab === 'events' ? 'var(--ink)' : 'rgba(20,17,13,0.4)', cursor: 'pointer' }}>Events</button>
        <button className={tab === 'members' ? 'active' : ''} onClick={() => setTab('members')} style={{ paddingBottom: 12, borderBottom: tab === 'members' ? '2px solid var(--ink)' : '2px solid transparent', background: 'none', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: tab === 'members' ? 'var(--ink)' : 'rgba(20,17,13,0.4)', cursor: 'pointer' }}>Members</button>
      </div>

      <div style={{ padding: '0 20px' }}>
        {tab === 'overview' && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(20,17,13,0.5)', marginBottom: 12 }}>At a Glance</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ background: '#fff', borderRadius: 16, padding: 16, border: '1px solid rgba(20,17,13,0.06)' }}>
                  <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--ink)', lineHeight: 1, marginBottom: 8 }}>+18%</div>
                  <div style={{ fontSize: 13, color: 'rgba(20,17,13,0.6)', fontWeight: 500, lineHeight: 1.3 }}>Attendance pacing vs last event</div>
                </div>
                <div style={{ background: '#fff', borderRadius: 16, padding: 16, border: '1px solid rgba(20,17,13,0.06)' }}>
                  <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--orange)', lineHeight: 1, marginBottom: 8 }}>{upcomingEvents.reduce((acc, e) => acc + (e.pendingCount || 0), 0)}</div>
                  <div style={{ fontSize: 13, color: 'rgba(20,17,13,0.6)', fontWeight: 500, lineHeight: 1.3 }}>Pending member RSVPs</div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(20,17,13,0.5)', marginBottom: 12 }}>Next Event</div>
              {upcomingEvents[0] && (
                <div style={{ padding: 20, background: '#fff', borderRadius: 16, border: '1px solid rgba(20,17,13,0.06)' }}>
                  <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--ink)', lineHeight: 1, marginBottom: 4 }}>{upcomingEvents[0].name}</div>
                  <div style={{ fontSize: 13, color: 'var(--orange)', fontWeight: 600, marginBottom: 16 }}>{upcomingEvents[0].day} · {upcomingEvents[0].time}</div>
                  <div style={{ display: 'flex', gap: 24, marginBottom: 20 }}>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-display)', lineHeight: 1, marginBottom: 4 }}>{upcomingEvents[0].goingCount}</div>
                      <div style={{ fontSize: 12, color: 'rgba(20,17,13,0.5)', fontWeight: 600 }}>Going</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'rgba(20,17,13,0.4)', lineHeight: 1, marginBottom: 4 }}>{upcomingEvents[0].pendingCount || 0}</div>
                      <div style={{ fontSize: 12, color: 'rgba(20,17,13,0.4)', fontWeight: 600 }}>Pending</div>
                    </div>
                  </div>
                  <button onClick={() => onManageEvent(upcomingEvents[0].id)} style={{ width: '100%', padding: '12px', background: 'var(--ink)', color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer' }}>Manage event</button>
                </div>
              )}
            </div>

            <div style={{ marginBottom: 48 }}>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--orange)', marginBottom: 20 }}>Needs Attention</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid rgba(20,17,13,0.1)' }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink)' }}>22 members haven&apos;t responded</div>
                  <div style={{ fontSize: 14, color: 'rgba(20,17,13,0.6)', marginTop: 4 }}>To {upcomingEvents[0]?.name || org.name + ' Event'}</div>
                </div>
                <button style={{ padding: '8px 16px', background: 'var(--orange)', color: '#fff', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none', cursor: 'pointer' }}>Nudge</button>
              </div>
            </div>

            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(20,17,13,0.5)', marginBottom: 12 }}>Quick Actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button onClick={onCreateEvent} style={{ padding: 16, background: '#fff', borderRadius: 16, border: '1px solid rgba(20,17,13,0.06)', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ color: 'var(--ink)' }}><EVI.Plus /></div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>Create event</div>
                </button>
                <button onClick={onInviteMembers} style={{ padding: 16, background: '#fff', borderRadius: 16, border: '1px solid rgba(20,17,13,0.06)', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ color: 'var(--ink)' }}><EVI.Invite /></div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>Invite members</div>
                </button>
                <button style={{ padding: 16, background: '#fff', borderRadius: 16, border: '1px solid rgba(20,17,13,0.06)', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ color: 'var(--ink)' }}><EVI.Share /></div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>Message attendees</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === 'events' && (
          <div>
            <div style={{ marginBottom: 48 }}>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(20,17,13,0.4)', marginBottom: 20 }}>Upcoming</div>
              {upcomingEvents.map(e => (
                <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 24, borderBottom: '1px solid rgba(20,17,13,0.1)', marginBottom: 24 }}>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--ink)', textTransform: 'uppercase', lineHeight: 1, marginBottom: 8 }}>{e.name}</div>
                    <div style={{ fontSize: 14, color: 'rgba(20,17,13,0.6)', fontWeight: 500 }}>{e.day} · {e.time}</div>
                  </div>
                  <button onClick={() => onManageEvent(e.id)} style={{ padding: '8px 16px', background: 'var(--ink)', color: '#fff', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none', cursor: 'pointer' }}>Manage</button>
                </div>
              ))}
            </div>
            
            {draftEvents.length > 0 && (
              <div style={{ marginBottom: 48 }}>
                <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(20,17,13,0.4)', marginBottom: 20 }}>Drafts</div>
                {draftEvents.map(e => (
                  <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 24, borderBottom: '1px solid rgba(20,17,13,0.1)', marginBottom: 24, opacity: 0.5 }}>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--ink)', textTransform: 'uppercase', lineHeight: 1, marginBottom: 8 }}>{e.name}</div>
                      <div style={{ fontSize: 14, color: 'rgba(20,17,13,0.6)', fontWeight: 500 }}>{e.day} · Draft</div>
                    </div>
                    <button onClick={() => onManageEvent(e.id)} style={{ padding: '8px 16px', background: 'var(--ink)', color: '#fff', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none', cursor: 'pointer' }}>Edit</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'members' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: '2px solid var(--ink)', marginBottom: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink)' }}>All Members</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink)' }}>{org.memberCount}</div>
            </div>

            {org.id === 'sigma_phi_epsilon' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {[
                  { id: 'exec-board', title: 'EXEC BOARD' },
                  { id: 'brothers', title: 'BROTHERS' },
                  { id: 'new-members', title: 'NEW MEMBERS' }
                ].map(group => {
                  const members = SIGEP_ROSTER.filter(m => m.subgroup === group.id);
                  if (members.length === 0) return null;
                  
                  return (
                    <div key={group.id}>
                      <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(20,17,13,0.4)', marginBottom: 16 }}>
                        {group.title} · {members.length}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {members.map((m, i) => {
                          const matchedUser = Object.values(USERS).find(u => {
                            if (m.email === 'marcust@georgetown.edu' && u.id === 'marcus') return true;
                            if (m.email === 'jordand@georgetown.edu' && u.id === 'jordan') return true;
                            if (m.email === 'coleb@georgetown.edu' && u.id === 'cole') return true;
                            if (m.email === 'bennettr@georgetown.edu' && u.id === 'bennett') return true;
                            return false;
                          });
                          
                          const initials = m.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                          
                          let statusBg = 'transparent';
                          let statusColor = 'var(--ink)';
                          let statusBorder = 'none';
                          let statusText = '';
                          
                          if (m.status === 'joined') {
                            statusBg = 'rgba(20,17,13,0.05)';
                            statusText = 'Joined';
                          } else if (m.status === 'invited') {
                            statusBorder = '1px solid rgba(20,17,13,0.2)';
                            statusText = 'Invited';
                          } else if (m.status === 'sms-pending') {
                            statusBg = 'rgba(20,17,13,0.05)';
                            statusColor = 'rgba(20,17,13,0.5)';
                            statusText = 'Text sent';
                          }

                          return (
                            <div key={i} onClick={() => setSelectedMember({ ...m, matchedUser })} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                              {matchedUser ? (
                                <img src={matchedUser.avatar} alt={m.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                              ) : (
                                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800 }}>
                                  {initials}
                                </div>
                              )}
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>{m.name}</div>
                                {m.title && <div style={{ fontSize: 13, color: 'rgba(20,17,13,0.5)', fontWeight: 500 }}>{m.title}</div>}
                              </div>
                              <div style={{ padding: '6px 10px', borderRadius: 12, background: statusBg, border: statusBorder, fontSize: 11, fontWeight: 700, color: statusColor }}>
                                {statusText}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(20,17,13,0.4)', marginBottom: 8 }}>
                    ALUMNI · 150
                  </div>
                  <div style={{ fontSize: 14, color: 'rgba(20,17,13,0.5)', fontWeight: 500 }}>
                    Reachable for invites · not shown here.
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {org.groups.filter(g => g.name !== 'All Members').map(g => (
                  <div key={g.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid rgba(20,17,13,0.1)', marginBottom: 16 }}>
                    <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--ink)' }}>{g.name}</div>
                    <div style={{ fontSize: 16, fontWeight: 500, color: 'rgba(20,17,13,0.5)' }}>{g.memberCount}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <div style={{ height: 120 }} />
      </div>

      {selectedMember && typeof document !== 'undefined' && createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 999999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setSelectedMember(null)} />
          <div style={{ position: 'relative', width: '100%', maxWidth: 360, background: 'var(--ligo-paper)', borderRadius: 24, padding: 32, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16, marginBottom: 32 }}>
              {selectedMember.matchedUser ? (
                <img src={selectedMember.matchedUser.avatar} alt={selectedMember.name} style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800 }}>
                  {selectedMember.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--ink)' }}>{selectedMember.name}</div>
                {selectedMember.title && <div style={{ fontSize: 16, color: 'rgba(20,17,13,0.5)', fontWeight: 500, marginTop: 4 }}>{selectedMember.title}</div>}
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32, padding: 16, background: 'rgba(20,17,13,0.03)', borderRadius: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(20,17,13,0.4)' }}>Email</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{selectedMember.email}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(20,17,13,0.4)' }}>Phone</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{selectedMember.phone}</div>
              </div>
            </div>

            <button 
              onClick={() => setSelectedMember(null)}
              style={{ width: '100%', padding: '16px', background: 'rgba(20,17,13,0.05)', color: 'var(--ink)', borderRadius: 16, fontSize: 16, fontWeight: 800, border: 'none', cursor: 'pointer' }}>
              Close
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
