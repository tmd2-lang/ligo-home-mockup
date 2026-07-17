import React, { useState } from 'react';
import { EventItem } from '../../lib/mockEventsData';
import { EVI } from './Icons';

export function ManageEventView({ 
  event,
  onBack,
  onToast
}: { 
  event: EventItem,
  onBack: () => void,
  onToast: (msg: string) => void
}) {
  const [nudged, setNudged] = useState(false);

  const capacity = event.capacity || 200;
  const pct = Math.round((event.goingCount / capacity) * 100);
  const pending = event.pendingCount || 0;
  const declined = event.declinedCount || 0;

  return (
    <div className="screen-fade" style={{ background: 'var(--ligo-paper)', minHeight: '100%', position: 'absolute', inset: 0, zIndex: 20, overflowY: 'auto' }}>
      <div style={{ position: 'sticky', top: 0, background: 'rgba(250,250,248,0.9)', backdropFilter: 'blur(20px)', zIndex: 10, padding: 'max(env(safe-area-inset-top, 56px), 56px) 20px 24px', display: 'flex', alignItems: 'flex-start', gap: 16, borderBottom: '2px solid var(--ink)' }}>
        <button onClick={onBack} aria-label="Back" style={{ background: 'var(--ink)', color: '#fff', border: 'none', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <EVI.Back />
        </button>
        <div style={{ paddingTop: 4 }}>
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--orange)', marginBottom: 4 }}>Dashboard</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, fontFamily: 'var(--font-display)', margin: 0, lineHeight: 1, textTransform: 'uppercase' }}>{event.name}</h1>
          <div style={{ fontSize: 13, color: 'rgba(20,17,13,0.6)', marginTop: 8, fontWeight: 500 }}>{event.day} · {event.time}</div>
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        <div style={{ marginTop: 40, marginBottom: 48 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 32 }}>
            <div>
              <div style={{ fontSize: 48, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--ink)', lineHeight: 1, marginBottom: 8 }}>{event.goingCount}</div>
              <div style={{ fontSize: 13, color: 'rgba(20,17,13,0.6)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Going</div>
            </div>
            <div>
              <div style={{ fontSize: 48, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'rgba(20,17,13,0.2)', lineHeight: 1, marginBottom: 8 }}>{pending}</div>
              <div style={{ fontSize: 13, color: 'rgba(20,17,13,0.6)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pending</div>
            </div>
            <div>
              <div style={{ fontSize: 48, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'rgba(20,17,13,0.2)', lineHeight: 1, marginBottom: 8 }}>{declined}</div>
              <div style={{ fontSize: 13, color: 'rgba(20,17,13,0.6)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Declined</div>
            </div>
          </div>
          {event.capacity && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 800, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                <span>Capacity</span>
                <span>{event.goingCount} / {event.capacity}</span>
              </div>
              <div style={{ height: 16, background: 'rgba(20,17,13,0.1)', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(Math.round((event.goingCount / event.capacity) * 100), 100)}%`, height: '100%', background: 'var(--ink)' }} />
              </div>
            </>
          )}
        </div>

        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(20,17,13,0.4)', marginBottom: 20 }}>Audience Breakdown</div>
          <div>
            {(event.visibility === 'members_only' || event.visibility === 'invite_only' || (event.invitedUserIds && event.invitedUserIds.length > 0)) && (
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid rgba(20,17,13,0.1)', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink)' }}>
                    {event.visibility === 'members_only' ? `All ${event.hostName || event.host} members` : 'Invited guests'}
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(20,17,13,0.6)' }}>
                    {event.goingCount + declined} of {pending + event.goingCount + declined} responded
                  </div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink)' }}>{pending + event.goingCount + declined}</div>
              </div>
            )}
            {(event.visibility === 'public' || event.visibility === 'campus') && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid rgba(20,17,13,0.1)', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink)' }}>Georgetown public</div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink)' }}>{Math.max(event.goingCount - 5, 0)}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink)' }}>GW + Howard</div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink)' }}>{event.goingCount > 20 ? 5 : 0}</div>
                </div>
              </>
            )}
          </div>
        </div>

        {pending > 0 && (
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--orange)', marginBottom: 20 }}>Needs Attention</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid rgba(20,17,13,0.1)', marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink)' }}>{pending} people haven&apos;t responded</div>
                <div style={{ fontSize: 14, color: 'rgba(20,17,13,0.6)', marginTop: 4 }}>They might miss it.</div>
              </div>
              <button 
                disabled={nudged}
                onClick={() => { setNudged(true); onToast(`Nudge sent to ${pending} people`); }}
                style={{ padding: '8px 16px', background: nudged ? 'rgba(20,17,13,0.1)' : 'var(--orange)', color: nudged ? 'var(--ink)' : '#fff', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none', cursor: 'pointer' }}>
                {nudged ? 'Nudged' : 'Nudge'}
              </button>
            </div>
            {event.capacity && event.goingCount < (event.capacity * 0.5) && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid rgba(20,17,13,0.1)' }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink)' }}>Attendance is below the event goal</div>
                  <div style={{ fontSize: 14, color: 'rgba(20,17,13,0.6)', marginTop: 4 }}>Open it to another campus to fill the room.</div>
                </div>
                <button style={{ padding: '8px 16px', background: 'var(--ink)', color: '#fff', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none', cursor: 'pointer' }}>Open</button>
              </div>
            )}
          </div>
        )}

        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(20,17,13,0.4)', marginBottom: 20 }}>Activity</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {typeof event.id === 'string' && event.id.startsWith('new-') ? (
              <>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 12, height: 12, background: 'var(--orange)', marginTop: 4 }} />
                  <div>
                    <div style={{ fontSize: 16, color: 'var(--ink)', fontWeight: 500 }}>Event published just now.</div>
                  </div>
                </div>
                {pending > 0 && (
                  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{ width: 12, height: 12, background: 'rgba(20,17,13,0.1)', marginTop: 4 }} />
                    <div>
                      <div style={{ fontSize: 16, color: 'var(--ink)', fontWeight: 500 }}>{pending} invites sent. Waiting for first RSVP.</div>
                    </div>
                  </div>
                )}
              </>
            ) : event.id === 30 || event.id === 31 ? (
              <>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 12, height: 12, background: 'var(--orange)', marginTop: 4 }} />
                  <div>
                    <div style={{ fontSize: 16, color: 'var(--ink)', fontWeight: 500 }}>{event.goingCount > 50 ? '3' : '1'} RSVPs in the past hour.</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 12, height: 12, background: 'rgba(20,17,13,0.1)', marginTop: 4 }} />
                  <div>
                    <div style={{ fontSize: 16, color: 'var(--ink)', fontWeight: 500 }}>Event was shared by <b>Marcus T.</b> in Exec Board chat.</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 12, height: 12, background: 'rgba(20,17,13,0.1)', marginTop: 4 }} />
                  <div>
                    <div style={{ fontSize: 16, color: 'var(--ink)', fontWeight: 500 }}>4 brothers added it to their calendars.</div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 12, height: 12, background: 'var(--orange)', marginTop: 4 }} />
                  <div>
                    <div style={{ fontSize: 16, color: 'var(--ink)', fontWeight: 500 }}>14 RSVPs in the past hour.</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 12, height: 12, background: 'rgba(20,17,13,0.1)', marginTop: 4 }} />
                  <div>
                    <div style={{ fontSize: 16, color: 'var(--ink)', fontWeight: 500 }}>Event was shared by <b>Georgetown Jazz Ensemble</b>.</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 12, height: 12, background: 'rgba(20,17,13,0.1)', marginTop: 4 }} />
                  <div>
                    <div style={{ fontSize: 16, color: 'var(--ink)', fontWeight: 500 }}>6 people invited friends.</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(20,17,13,0.4)', marginBottom: 20 }}>Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <button style={{ padding: 24, background: 'var(--ink)', color: '#fff', textAlign: 'left', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', gap: 16 }}>
              <EVI.Share />
              <div style={{ fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Message attendees</div>
            </button>
            <button style={{ padding: 24, background: 'var(--ink)', color: '#fff', textAlign: 'left', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', gap: 16 }}>
              <EVI.Check />
              <div style={{ fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Start check-in</div>
            </button>
          </div>
        </div>

        <div style={{ height: 120 }} />
      </div>
    </div>
  );
}
