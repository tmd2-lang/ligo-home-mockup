import React, { useState } from 'react';
import { Icon } from '@/components/Primitives';
import { USERS } from '@/lib/users';

const FF = "'Bricolage Grotesque', sans-serif";

export function ChatScreen({
  match,
  onClose
}: {
  match: any;
  onClose: () => void;
}) {
  const user = match;
  const [msg, setMsg] = useState("");
  const [history, setHistory] = useState<{ id: number; text: string; time: string }[]>([]);

  if (!user) return null;

  const handleSend = () => {
    if (msg.trim().length === 0) return;
    
    // Format current time like "8:05 AM"
    const time = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    
    setHistory([...history, { id: Date.now(), text: msg, time }]);
    setMsg("");
  };

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 9999, background: '#14110D', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', alignItems: 'center', padding: '16px 20px', 
        borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(20,17,13,0.95)', backdropFilter: 'blur(10px)',
        position: 'relative', paddingTop: 'max(env(safe-area-inset-top, 20px), 20px)'
      }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', padding: 8, marginLeft: -8, cursor: 'pointer' }}>
          <Icon.ChevronLeft width={24} height={24} />
        </button>
        <div style={{ width: 36, height: 36, borderRadius: 99, backgroundImage: `url(${user.avatar})`, backgroundSize: 'cover', backgroundPosition: 'center', marginLeft: 8 }} />
        <div style={{ marginLeft: 12, flex: 1 }}>
          <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 16, color: '#fff' }}>{user.name}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginTop: 2 }}>{match.daysLeft}d 23h left to plan meetup</div>
        </div>
        <button style={{ background: 'none', border: 'none', color: '#fff', padding: 8, marginRight: -8, cursor: 'pointer' }}>
          <Icon.MoreHorizontal width={24} height={24} />
        </button>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, padding: '24px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        
        {/* Match Announcement */}
        <div style={{ alignSelf: 'center', background: match.matchType === 'spark' ? 'rgba(234, 140, 225, 0.1)' : 'rgba(249, 115, 22, 0.1)', border: match.matchType === 'spark' ? '1px solid rgba(234, 140, 225, 0.3)' : '1px solid rgba(249, 115, 22, 0.3)', borderRadius: 16, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, maxWidth: '85%' }}>
          <div style={{ width: 32, height: 32, borderRadius: 99, background: match.matchType === 'spark' ? '#EA8CE1' : '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
            {match.matchType === 'spark' ? '✨' : '🍊'}
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.4, color: 'rgba(255,255,255,0.9)' }}>
            You both sent a <span style={{ color: match.matchType === 'spark' ? '#EA8CE1' : '#F97316', fontWeight: 600 }}>{match.matchType === 'spark' ? 'Spark' : 'Vibe'}</span>. You have 7 days to message {user.name.split(' ')[0]} and plan a meetup.
          </div>
        </div>

        {/* Date line */}
        <div style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: 24 }}>
          TODAY 8:02 AM
        </div>

        {/* Render Sent Messages */}
        {history.map((m) => (
          <div key={m.id} style={{ alignSelf: 'flex-end', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginBottom: 12, maxWidth: '80%' }}>
            <div style={{ background: '#F97316', color: '#fff', padding: '10px 14px', borderRadius: 20, borderBottomRightRadius: 4, fontSize: 15, lineHeight: 1.4 }}>
              {m.text}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4, fontWeight: 500 }}>
              {m.time}
            </div>
          </div>
        ))}

      </div>

      {/* Input Area */}
      <div style={{ padding: '12px 20px', paddingBottom: 'max(env(safe-area-inset-bottom, 24px), 24px)', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(20,17,13,0.95)' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: 24, padding: '4px 4px 4px 16px' }}>
          <input 
            type="text" 
            placeholder="Message..." 
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: 15, outline: 'none' }} 
          />
          <button 
            onClick={handleSend}
            style={{ width: 36, height: 36, borderRadius: 99, background: msg.trim().length > 0 ? '#F97316' : 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', cursor: 'pointer' }}
          >
            <Icon.ArrowUp width={18} height={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
