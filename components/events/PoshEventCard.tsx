import React from "react";
import { EventItem } from "../../lib/mockEventsData";

export function PoshEventCard({ event, onClick, layout = "carousel", index = 0 }: { event: EventItem, onClick: () => void, layout?: "carousel" | "grid", index?: number }) {
  const isGrid = layout === "grid";

  return (
    <div 
      className="stagger-fade-in"
      onClick={onClick}
      style={{ 
        animationDelay: `${Math.min(index, 6) * 0.06}s`,
        flex: isGrid ? 'none' : '0 0 75%',  
        width: isGrid ? '100%' : 'auto',
        scrollSnapAlign: 'start', 
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        breakInside: 'avoid',
        marginBottom: isGrid ? '16px' : '0',
        minWidth: 0,
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
    >
      <div style={{ position: 'relative', width: '100%', paddingTop: '133.33%', borderRadius: '12px', overflow: 'hidden', marginBottom: '8px', background: '#f5f5f5', border: '1px solid #eee' }}>
        {event.image ? (
          <img draggable={false} src={event.image} alt={event.name} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
        ) : (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: event.color }} />
        )}
        
        {/* Org Badge Top Left */}
        {event.hostAvatar && (
          <div style={{ position: 'absolute', top: 12, left: 12, background: event.hostAvatarColor || '#000', color: '#fff', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
            {event.hostAvatar}
          </div>
        )}

        {/* Date/Time Chip Bottom Left */}
        <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', color: '#000', padding: '4px 8px', borderRadius: '6px', fontSize: 11, fontWeight: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          {event.day} · {event.time}
        </div>
      </div>
      
      <div style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 2px 0', letterSpacing: '-0.3px', lineHeight: 1.2, color: '#111' }}>
        {event.name}
      </div>
      <div style={{ fontSize: '13px', color: '#444', margin: '0 0 2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>
        {event.host}
      </div>
      <div style={{ fontSize: '13px', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {event.tickets?.[0]?.price || 'Free'} · {event.venue}
      </div>
    </div>
  );
}
