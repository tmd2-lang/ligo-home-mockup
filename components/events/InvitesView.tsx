import React, { useState } from 'react';
import { EventItem } from '../../lib/mockEventsData';
import { EVI } from './Icons';

export function InvitesView({ 
  events, 
  onOpenEvent, 
  onAction
}: { 
  events: EventItem[], 
  onOpenEvent: (id: string) => void,
  onAction: (id: string, action: 'going'|'maybe'|'declined'|null) => void
}) {
  const [showPast, setShowPast] = useState(false);
  const [editingResponseId, setEditingResponseId] = useState<string | null>(null);

  // Helper to calculate days from today
  const getDaysFromToday = (d: any) => {
    if (!d) return 0;
    const diff = new Date(d).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  // Helper for context line
  const getContextLine = (e: EventItem) => {
    return e.visibility === 'private' ? e.subtitle : e.host;
  };

  const pendingEvents = events
    .filter(e => e.currentUserStatus === 'pending')
    .sort((a, b) => new Date(a.parsedDate || 0).getTime() - new Date(b.parsedDate || 0).getTime());

  const upcomingEvents = events
    .filter(e => (e.currentUserStatus === 'going' || e.currentUserStatus === 'maybe') && getDaysFromToday(e.parsedDate) >= -1)
    .sort((a, b) => new Date(a.parsedDate || 0).getTime() - new Date(b.parsedDate || 0).getTime());

  const pastAndDeclinedEvents = events
    .filter(e => e.currentUserStatus === 'declined' || ((e.currentUserStatus === 'going' || e.currentUserStatus === 'maybe') && getDaysFromToday(e.parsedDate) < -1))
    .sort((a, b) => new Date(b.parsedDate || 0).getTime() - new Date(a.parsedDate || 0).getTime()); // descending for past

  const renderEventRow = (e: EventItem, mode: 'pending' | 'upcoming' | 'past') => {
    const daysOut = getDaysFromToday(e.parsedDate);
    const showDaysOut = (mode === 'upcoming' || mode === 'pending') && daysOut >= 0;

    return (
      <div key={e.id} style={{ display: 'flex', flexDirection: 'column', padding: '16px 20px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', gap: 16, cursor: 'pointer', alignItems: 'center' }} onClick={() => onOpenEvent(e.id)}>
          {/* Thumbnail */}
          <div style={{ width: 64, height: 64, borderRadius: 12, background: e.image ? `url(${e.image}) center/cover` : (e.hostAvatarColor || '#eee'), flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20, fontWeight: 800 }}>
            {!e.image && e.hostAvatar}
          </div>
          
          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 4 }}>
              {e.title}
            </div>
            
            <div style={{ fontSize: 13, color: 'rgba(20,17,13,0.6)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {getContextLine(e)}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#444' }}>
              {e.date}
              {e.visibility === 'private' && (
                <>
                  <span style={{ color: 'rgba(20,17,13,0.3)' }}>·</span>
                  <span style={{ color: 'rgba(20,17,13,0.5)' }}>Private</span>
                </>
              )}
            </div>
          </div>
          
          {/* Right side (countdown + status chip) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            {showDaysOut && (
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ligo-orange)', whiteSpace: 'nowrap' }}>
                in {daysOut} day{daysOut !== 1 ? 's' : ''}
              </div>
            )}
            
            {mode === 'upcoming' && editingResponseId !== e.id && (
              <button 
                onClick={(e_event) => { e_event.stopPropagation(); setEditingResponseId(e.id); }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '6px 12px', borderRadius: 16,
                  background: e.currentUserStatus === 'going' ? 'rgba(249,115,22,0.1)' : 'transparent',
                  border: e.currentUserStatus === 'going' ? '1px solid rgba(249,115,22,0.2)' : '1px solid rgba(0,0,0,0.15)',
                  color: e.currentUserStatus === 'going' ? 'var(--ligo-orange)' : '#444',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer'
                }}
              >
                {e.currentUserStatus === 'going' ? 'Going ✓' : 'Maybe'}
              </button>
            )}
          </div>
        </div>

        {/* Action Controls */}
        {mode === 'pending' || editingResponseId === e.id ? (
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button onClick={() => { onAction(e.id, 'declined'); setEditingResponseId(null); }} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '1px solid rgba(0,0,0,0.1)', background: 'transparent', fontSize: 14, fontWeight: 700, color: '#444', cursor: 'pointer' }}>Decline</button>
            <button onClick={() => { onAction(e.id, 'maybe'); setEditingResponseId(null); }} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '1px solid rgba(0,0,0,0.1)', background: 'transparent', fontSize: 14, fontWeight: 700, color: '#444', cursor: 'pointer' }}>Maybe</button>
            <button onClick={() => { onAction(e.id, 'going'); setEditingResponseId(null); }} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', background: 'var(--ligo-orange)', fontSize: 14, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Going</button>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="screen-fade" style={{ paddingBottom: 120 }}>
      {/* 1. Needs Response */}
      {pendingEvents.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ padding: '24px 20px 8px', fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#111' }}>
            Needs Response
          </div>
          {pendingEvents.map(e => renderEventRow(e, 'pending'))}
        </div>
      )}

      {/* 2. Upcoming */}
      {upcomingEvents.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ padding: '24px 20px 8px', fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#111' }}>
            Upcoming
          </div>
          {upcomingEvents.map(e => renderEventRow(e, 'upcoming'))}
        </div>
      )}

      {/* 3. Past & Declined */}
      {pastAndDeclinedEvents.length > 0 && (
        <div>
          <div 
            onClick={() => setShowPast(!showPast)}
            style={{ padding: '16px 20px', fontSize: 14, fontWeight: 700, color: 'rgba(20,17,13,0.6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderTop: '1px solid rgba(0,0,0,0.05)', borderBottom: showPast ? '1px solid rgba(0,0,0,0.05)' : 'none' }}
          >
            Past & declined ({pastAndDeclinedEvents.length})
            <div style={{ transform: showPast ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</div>
          </div>
          {showPast && (
            <div className="stagger-fade-in">
              {pastAndDeclinedEvents.map(e => renderEventRow(e, 'past'))}
            </div>
          )}
        </div>
      )}
      
      {pendingEvents.length === 0 && upcomingEvents.length === 0 && pastAndDeclinedEvents.length === 0 && (
        <div style={{ padding: 40, textAlign: 'center', color: 'rgba(20,17,13,0.4)', fontSize: 15, fontWeight: 600 }}>
          No events found.
        </div>
      )}
    </div>
  );
}
