import React from 'react';
import { EVI } from './Icons';
import { EventItem } from '../../lib/mockEventsData';

export function EventCard({ e, onOpen, onRsvp }: { e: EventItem, onOpen: () => void, onRsvp: (id: string, action: 'going'|'maybe'|'declined'|null) => void }) {
  // Top: Access badge logic
  let accessBadge = null;
  if (e.visibility === 'members_only') {
    accessBadge = <div className="reach-pill" style={{ background: 'rgba(20,17,13,0.06)', color: 'var(--ink)' }}><EVI.Lock style={{ width: 10, height: 10 }} /> Members only</div>;
  } else if (e.visibility === 'invite_only' && e.currentUserStatus === 'invited') {
    accessBadge = <div className="reach-pill" style={{ background: 'var(--orange)', color: '#fff' }}><EVI.Invite style={{ width: 10, height: 10 }} /> Invited</div>;
  } else if (e.openTo && e.openTo.includes('gw')) {
    accessBadge = <div className="reach-pill" style={{ background: 'rgba(20,17,13,0.06)', color: 'var(--ink)' }}><EVI.Globe style={{ width: 10, height: 10 }} /> GW + Howard</div>;
  } else if (e.visibility === 'public') {
    accessBadge = <div className="reach-pill" style={{ background: 'rgba(20,17,13,0.06)', color: 'var(--ink)' }}>Public</div>;
  } else if (e.visibility === 'campus') {
    accessBadge = <div className="reach-pill" style={{ background: 'rgba(20,17,13,0.06)', color: 'var(--ink)' }}>Georgetown</div>;
  }

  let socialSignal = null;
  if (e.currentUserAccessReason && e.visibility !== 'public') {
    socialSignal = e.currentUserAccessReason;
  } else if (e.nudgedBy) {
    socialSignal = `⚡ Nudged by ${e.nudgedBy}`;
  } else if (e.goingCount > 0) {
    socialSignal = `${e.goingCount} going`;
  }

  return (
    <div className={'event-card' + (e.source === 'shared' ? ' is-shared' : '')} onClick={onOpen} style={{ cursor: 'pointer', background: '#fff', borderRadius: 16, border: '1px solid rgba(20,17,13,0.06)', overflow: 'hidden', marginBottom: 16 }}>
      <div className="header" style={{ background: e.color, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '16px 16px 32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
          <div className="when-chip">{e.day} · {e.time}</div>
        </div>
        {accessBadge}
      </div>
      
      {e.source === 'shared' && e.origin === 'howard' && (
        <div className="origin-strip">
          <span className="od" style={{ background: '#b3303f' }} /> Shared from Howard
        </div>
      )}
      
      <div className="body" style={{ padding: 16 }}>
        <div className="name" style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>{e.name}</div>
        <div className="host" style={{ fontSize: 14, fontWeight: 500, color: 'rgba(20,17,13,0.6)', marginTop: 4 }}>{e.host}</div>
        <div className="venue" style={{ fontSize: 14, fontWeight: 500, color: 'rgba(20,17,13,0.6)' }}>{e.venue}</div>
        
        <div className="footer" style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span className="tag" style={{ background: e.tagBg, color: e.tagFg, width: 'fit-content', padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>{e.tag}</span>
            {socialSignal && <span style={{ fontSize: 12, color: 'rgba(20,17,13,0.6)', fontWeight: 500 }}>{socialSignal}</span>}
          </div>
          
          <button 
            className={'rsvp' + (e.currentUserStatus ? ' rsvp-' + (e.currentUserStatus === 'going' || e.currentUserStatus === 'hosting' ? 'yes' : e.currentUserStatus) : '')} 
            onClick={(ev) => { 
              ev.stopPropagation(); 
              if (e.currentUserStatus === 'going' || e.currentUserStatus === 'hosting') {
                onRsvp(e.id, null);
              } else {
                onRsvp(e.id, 'going');
              }
            }}
            style={{ padding: '8px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: (e.currentUserStatus === 'going' || e.currentUserStatus === 'hosting') ? 'rgba(20,17,13,0.05)' : 'var(--ink)', color: (e.currentUserStatus === 'going' || e.currentUserStatus === 'hosting') ? 'var(--ink)' : '#fff' }}
          >
            {(e.currentUserStatus === 'going' || e.currentUserStatus === 'hosting') ? <React.Fragment><EVI.Check /> Going</React.Fragment> : 'RSVP'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function InviteCard({ e, onOpen, onAction }: { e: EventItem, onOpen: () => void, onAction: (id: string, action: 'going'|'maybe'|'declined') => void }) {
  return (
    <div className="event-card invite-card" onClick={onOpen} style={{ padding: 16, background: '#fff', borderRadius: 16, border: '1px solid rgba(20,17,13,0.06)', cursor: 'pointer', marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: e.color, flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>{e.name}</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--orange)', marginTop: 2 }}>{e.day} · {e.time}</div>
          <div style={{ fontSize: 13, color: 'rgba(20,17,13,0.6)' }}>{e.venue}</div>
        </div>
      </div>
      
      {e.currentUserAccessReason && (
        <div style={{ fontSize: 12, color: 'var(--ink)', background: 'rgba(20,17,13,0.04)', padding: '6px 10px', borderRadius: 8, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <EVI.Invite style={{ width: 12, height: 12 }} />
          {e.currentUserAccessReason}
        </div>
      )}
      
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={(ev) => { ev.stopPropagation(); onAction(e.id, 'declined'); }} style={{ flex: 1, padding: '8px 0', borderRadius: 8, background: 'rgba(20,17,13,0.05)', color: 'rgba(20,17,13,0.7)', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>Decline</button>
        <button onClick={(ev) => { ev.stopPropagation(); onAction(e.id, 'maybe'); }} style={{ flex: 1, padding: '8px 0', borderRadius: 8, background: 'rgba(20,17,13,0.05)', color: 'rgba(20,17,13,0.7)', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>Maybe</button>
        <button onClick={(ev) => { ev.stopPropagation(); onAction(e.id, 'going'); }} style={{ flex: 1.5, padding: '8px 0', borderRadius: 8, background: 'var(--orange)', color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>Going</button>
      </div>
    </div>
  );
}
