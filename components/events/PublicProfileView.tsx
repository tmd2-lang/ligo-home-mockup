"use client";
import React, { useState } from 'react';
import { EventItem } from '../../lib/mockEventsData';
import { EVI } from './Icons';
import { PoshEventCard } from './PoshEventCard';

type OrgProfile = {
  name: string;
  desc: string;
  upcoming: number;
  followers: string;
  type?: 'club' | 'artist' | 'person';
  category?: string;
  memberCount?: number;
  links?: { label: string; url: string; icon: string }[];
  coverImage?: string;
};

export function PublicProfileView({
  organizer,
  hostAvatar,
  hostAvatarColor,
  events,
  onBack,
  onOpenEvent,
}: {
  organizer: OrgProfile;
  hostAvatar?: string;
  hostAvatarColor?: string;
  events: EventItem[];
  onBack: () => void;
  onOpenEvent?: (id: string) => void;
}) {
  const [following, setFollowing] = useState(false);
  const [showFollowToast, setShowFollowToast] = useState(false);

  const orgType = organizer.type || 'club';
  const avatarColor = hostAvatarColor || '#14110D';
  const avatarText = hostAvatar || organizer.name.charAt(0);

  // Split events into upcoming and past
  const upcomingEvents = events.filter(e => e.relativeDays === undefined || e.relativeDays >= 0);
  const pastEvents = events.filter(e => e.relativeDays !== undefined && e.relativeDays < 0);

  const handleFollow = () => {
    const next = !following;
    setFollowing(next);
    setShowFollowToast(true);
    setTimeout(() => setShowFollowToast(false), 2200);
  };

  // Gradient derived from the org's avatar color
  const heroGradient = `linear-gradient(160deg, ${avatarColor}, ${adjustBrightness(avatarColor, -30)})`;

  return (
    <div className="screen-fade" style={{ position: 'absolute', inset: 0, zIndex: 10, background: '#fff', overflowY: 'auto' }}>

      {/* Hero Banner */}
      <div style={{ position: 'relative', width: '100%', height: 200, background: heroGradient }}>
        {organizer.coverImage && (
          <img src={organizer.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} />
        )}
        {/* Top gradient overlay */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 100%)' }} />
        {/* Bottom gradient overlay */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(0deg, rgba(0,0,0,0.3) 0%, transparent 100%)' }} />

        {/* Back button */}
        <div style={{ position: 'absolute', top: 'max(env(safe-area-inset-top, 20px), 20px)', left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={onBack} aria-label="Back" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', color: '#111', border: 'none', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <EVI.Back />
          </button>
          <button style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)', color: '#fff', border: 'none', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <EVI.Share />
          </button>
        </div>
      </div>

      {/* Avatar + Identity block — overlaps the hero */}
      <div style={{ position: 'relative', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
          <div style={{
            marginTop: -48,
            width: 80, height: 80, borderRadius: 20, background: avatarColor, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: avatarText.length > 3 ? 16 : 22, fontWeight: 700, letterSpacing: '-0.02em',
            border: '4px solid #fff', boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            flexShrink: 0,
          }}>
            {avatarText}
          </div>
          <div style={{ flex: 1, minWidth: 0, paddingBottom: 4 }}>
            <div style={{ fontSize: 22, fontWeight: 600, color: '#111', fontFamily: 'var(--font-display)', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
              {organizer.name}
            </div>
            <div style={{ fontSize: 13, color: '#888', fontWeight: 500, marginTop: 4 }}>
              {organizer.category || (orgType === 'artist' ? 'Artist' : orgType === 'person' ? 'Student' : 'Organization')}
            </div>
          </div>
        </div>

        {/* Stats row + Follow button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
          <div style={{ display: 'flex', gap: 16, flex: 1 }}>
            <StatPill value={organizer.followers} label={orgType === 'person' ? 'connections' : 'followers'} />
            <StatPill value={String(organizer.upcoming)} label="upcoming" />
            {orgType === 'club' && organizer.memberCount && (
              <StatPill value={String(organizer.memberCount)} label="members" />
            )}
          </div>
          <button
            onClick={handleFollow}
            style={{
              padding: '8px 20px', borderRadius: 100, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, letterSpacing: '0.02em',
              background: following ? 'rgba(20,17,13,0.06)' : 'var(--ink)',
              color: following ? 'var(--ink)' : '#fff',
              transition: 'all 0.2s ease',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            {following && <EVI.Check style={{ width: 14, height: 14 }} />}
            {following ? 'Following' : 'Follow'}
          </button>
        </div>
      </div>

      {/* Content body */}
      <div style={{ padding: '24px 20px 120px' }}>

        {/* About */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>About</div>
          <div style={{ fontSize: 15, color: '#444', lineHeight: 1.5 }}>{organizer.desc}</div>
        </div>

        {/* External Links */}
        {organizer.links && organizer.links.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {organizer.links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 14px', borderRadius: 100,
                    background: 'rgba(20,17,13,0.04)',
                    border: '1px solid rgba(20,17,13,0.08)',
                    color: '#333', fontSize: 13, fontWeight: 500,
                    textDecoration: 'none',
                    transition: 'background 0.15s ease',
                  }}
                >
                  <span style={{ fontSize: 14 }}>{link.icon}</span>
                  {link.label}
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ opacity: 0.4 }}>
                    <path d="M4.5 2H2.5C1.95 2 1.5 2.45 1.5 3V9.5C1.5 10.05 1.95 10.5 2.5 10.5H9C9.55 10.5 10 10.05 10 9.5V7.5M7 2H10M10 2V5M10 2L4.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Upcoming Events</div>
            <div style={{
              display: 'flex', gap: 12, overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              margin: '0 -20px', padding: '0 20px',
            }}>
              {upcomingEvents.map((event, index) => (
                <div key={event.id} style={{ flex: '0 0 65%', scrollSnapAlign: 'start' }}>
                  <PoshEventCard event={event} onClick={() => onOpenEvent?.(event.id)} index={index} />
                </div>
              ))}
              <div style={{ flex: '0 0 20px' }} />
            </div>
          </div>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Past Events</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pastEvents.slice(0, 5).map(event => (
                <button
                  key={event.id}
                  onClick={() => onOpenEvent?.(event.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: 12, borderRadius: 12,
                    background: 'rgba(20,17,13,0.02)',
                    border: '1px solid rgba(20,17,13,0.06)',
                    cursor: 'pointer', textAlign: 'left', width: '100%',
                  }}
                >
                  <div style={{
                    width: 48, height: 48, borderRadius: 10, overflow: 'hidden', flexShrink: 0,
                    background: event.color || '#eee',
                  }}>
                    {event.image && <img src={event.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.name}</div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{event.day} · {event.goingCount} attended</div>
                  </div>
                  <EVI.Chevron style={{ width: 16, height: 16, color: 'rgba(20,17,13,0.2)', transform: 'rotate(-90deg)', flexShrink: 0 }} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty state when no events at all */}
        {upcomingEvents.length === 0 && pastEvents.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#888' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📅</div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>No events yet</div>
            <div style={{ fontSize: 13, color: '#aaa', marginTop: 4 }}>Check back when {organizer.name} posts their next event.</div>
          </div>
        )}
      </div>

      {/* Follow toast */}
      {showFollowToast && (
        <div style={{
          position: 'fixed', bottom: 100, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--ink)', color: '#fff',
          padding: '10px 20px', borderRadius: 100,
          fontSize: 13, fontWeight: 500,
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          zIndex: 100,
          animation: 'fadeInUp 0.3s ease',
          whiteSpace: 'nowrap',
        }}>
          {following ? `Following ${organizer.name}` : `Unfollowed ${organizer.name}`}
        </div>
      )}
    </div>
  );
}

/* ---- Helpers ---- */

function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ fontSize: 16, fontWeight: 600, color: '#111', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: '#888', fontWeight: 500, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function adjustBrightness(hex: string, amount: number): string {
  // Simple brightness adjustment for gradient generation
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xFF) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xFF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xFF) + amount));
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}
