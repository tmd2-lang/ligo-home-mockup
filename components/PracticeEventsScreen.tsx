"use client";
import React, { useState } from "react";

// --- REUSABLE COMPONENTS ---

const Divider = () => (
  <div style={{ height: '1px', background: 'rgba(0,0,0,0.05)', marginLeft: '40px' }} />
);

const GlassRow = ({ icon, label, right, children, style }: any) => (
  <div style={{ 
    display: 'flex', alignItems: 'center', padding: '16px', gap: '12px', ...style 
  }}>
    <span style={{ fontSize: '18px', opacity: 0.6, width: '24px', textAlign: 'center' }}>{icon}</span>
    <div style={{ flex: 1, fontSize: '15px', color: 'rgba(0,0,0,0.4)', fontWeight: 500 }}>
      {label || children}
    </div>
    {right && <div>{right}</div>}
  </div>
);

const PillBtn = ({ icon, label, primary }: any) => (
  <button style={{
    background: primary ? '#2563EB' : 'rgba(255,255,255,0.5)',
    color: primary ? '#fff' : '#000',
    border: '1px solid rgba(255,255,255,0.4)',
    padding: '8px 16px',
    borderRadius: '100px',
    fontSize: '13px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
    whiteSpace: 'nowrap'
  }}>
    {icon} {label}
  </button>
);

// --- MAIN SCREEN ---

export function PracticeEventsScreen({ onTab }: any) {
  const [title, setTitle] = useState("");
  const [font, setFont] = useState("Classic");
  
  const glassStyle = {
    background: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.03)'
  };

  return (
    <div className="screen" style={{ 
      position: 'relative', width: '100%', height: '100%', overflowY: 'auto', 
      background: 'linear-gradient(140deg, #FBE1EE 0%, #E5E0F8 25%, #D8F2F6 50%, #E3E9F9 75%, #F0E6FA 100%)', 
      color: '#000' 
    }}>
      
      {/* Sticky Header */}
      <div style={{ 
        position: 'sticky', top: 0, zIndex: 50, padding: '16px 20px', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: 'max(env(safe-area-inset-top, 40px), 40px)'
      }}>
        <button style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#000' }}>
          ✕
        </button>
        <button style={{ ...glassStyle, padding: '8px 16px', borderRadius: '100px', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
          🌎 Make it public &gt;
        </button>
        <button style={{ background: '#000', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '100px', fontSize: '14px', fontWeight: 700 }}>
          Save
        </button>
      </div>

      <div style={{ padding: '0 20px 140px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Title & Font Selector */}
        <div style={{ ...glassStyle, padding: '24px 16px' }}>
          <input 
            type="text"
            placeholder="Untitled Event"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%', background: 'transparent', border: 'none', outline: 'none',
              textAlign: 'center', fontSize: '36px', fontWeight: 700, color: '#000',
              fontFamily: font === 'Classic' ? 'sans-serif' : font === 'Eclectic' ? 'monospace' : font === 'Fancy' ? 'cursive' : 'serif'
            }}
          />
          
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginTop: '20px', paddingBottom: '4px' }}>
            {['Classic', 'Eclectic', 'Fancy', 'Literary'].map(f => (
              <button 
                key={f}
                onClick={() => setFont(f)}
                style={{
                  background: font === f ? 'rgba(0,0,0,0.05)' : 'transparent',
                  border: font === f ? '1px solid rgba(0,0,0,0.1)' : '1px solid transparent',
                  padding: '6px 12px', borderRadius: '100px', fontSize: '14px', fontWeight: 600,
                  whiteSpace: 'nowrap'
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Flyer Preview Square */}
        <div style={{ 
          width: '100%', aspectRatio: '1', borderRadius: '24px', 
          background: 'linear-gradient(135deg, #A8E6CF 0%, #FFD3B6 100%)',
          position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.05)'
        }}>
          <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(10px)', padding: '16px 24px', borderRadius: '24px' }}>
             <div style={{ fontSize: '48px', marginBottom: '8px' }}>📁</div>
             <div style={{ fontSize: '16px', fontWeight: 700 }}>partysongs 4<br/>bday</div>
          </div>
          <button style={{ position: 'absolute', bottom: '16px', right: '16px', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.6)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
            ✏️
          </button>
        </div>

        {/* The Details Block */}
        <div style={{ ...glassStyle, padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '20px', fontWeight: 600, color: '#000' }}>Set a date...</span>
          <span style={{ opacity: 0.3 }}>▼</span>
        </div>

        <div style={{ textAlign: 'center', fontSize: '14px', color: 'rgba(0,0,0,0.6)' }}>
          Can't decide when? <span style={{ color: '#2563EB', fontWeight: 600 }}>Poll your guests →</span>
        </div>

        <div style={{ ...glassStyle, overflow: 'hidden' }}>
          <div style={{ padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
             <span style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}>👑</span>
             <div style={{ flex: 1 }}>
               <div style={{ fontSize: '14px', color: 'rgba(0,0,0,0.5)', marginBottom: '8px' }}>Hosted by <span style={{ fontWeight: 400 }}>(optional) host nickname</span></div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #ff9a9e, #fecfef)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, position: 'relative' }}>
                    TD
                    <div style={{ position: 'absolute', bottom: -2, right: -2, background: '#000', color: '#fff', fontSize: '8px', padding: '2px', borderRadius: '50%' }}>👑</div>
                 </div>
                 <span style={{ fontWeight: 700, fontSize: '16px' }}>TJ Dozier</span>
                 <div style={{ flex: 1 }} />
                 <PillBtn label="+ Add cohosts" />
               </div>
             </div>
          </div>
          <Divider />
          <GlassRow icon="📍" label="Location" />
          <Divider />
          <GlassRow icon="👥" label="Unlimited spots" />
          <Divider />
          <GlassRow icon="🎟" label="Cost per person" right={<PillBtn label="Sell tickets!" primary={true} />} />
          <Divider />
          <GlassRow icon="⌛" label="RSVP Deadline" />
        </div>

        {/* Add-ons Row */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '4px 0' }}>
          <PillBtn icon="+" label="Link" />
          <PillBtn icon="+" label="Playlist" />
          <PillBtn icon="+" label="Registry" />
          <PillBtn icon="+" label="Dress code" />
        </div>

        {/* Description Block */}
        <div style={{ ...glassStyle, padding: '16px', minHeight: '120px' }}>
          <textarea 
            placeholder="Add a description of your event"
            style={{ width: '100%', height: '100%', background: 'transparent', border: 'none', outline: 'none', resize: 'none', fontSize: '15px', color: '#000', fontFamily: 'inherit' }}
          />
        </div>

        <div style={{ textAlign: 'center', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <span style={{ fontSize: '14px', color: 'rgba(0,0,0,0.6)' }}>More to say?</span>
          <PillBtn icon="+" label="New section" />
        </div>

        {/* RSVP Options */}
        <div style={{ ...glassStyle, padding: '16px', marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>⚙️ RSVP Options</span>
            <div style={{ background: 'rgba(0,0,0,0.05)', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
               👍 Emojis ▼
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
             {[
               { icon: '👍', label: 'Going' },
               { icon: '🤔', label: 'Maybe' },
               { icon: '😢', label: 'Can\'t Go' }
             ].map(opt => (
               <div key={opt.label} style={{ flex: 1, aspectRatio: '1', borderRadius: '50%', background: 'rgba(255,255,255,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: 'inset 0 0 20px rgba(255,255,255,0.5), 0 4px 12px rgba(0,0,0,0.02)' }}>
                  <span style={{ fontSize: '28px' }}>{opt.icon}</span>
                  <span style={{ fontSize: '13px', color: 'rgba(0,0,0,0.5)', fontWeight: 500 }}>{opt.label}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginTop: '16px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'rgba(0,0,0,0.6)', fontWeight: 500 }}>Quick actions for hosts</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <PillBtn icon="📋" label="Add Questionnaire" />
            <PillBtn icon="⏰" label="Reminders" />
            <PillBtn icon="👤" label="Require Guest Approval" />
            <PillBtn icon="•••" label="More" />
          </div>
        </div>

      </div>

      {/* Floating Bottom Action Bar */}
      <div style={{ 
        position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
        ...glassStyle, padding: '8px', borderRadius: '100px',
        display: 'flex', gap: '8px', zIndex: 100
      }}>
         <button style={{ background: 'transparent', border: 'none', padding: '8px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
           <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #4facfe, #00f2fe)' }} />
           <span style={{ fontSize: '11px', color: 'rgba(0,0,0,0.5)', fontWeight: 500 }}>Theme</span>
         </button>
         <button style={{ background: 'transparent', border: 'none', padding: '8px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
           <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'radial-gradient(circle, #f953c6, #b91d73)' }} />
           <span style={{ fontSize: '11px', color: 'rgba(0,0,0,0.5)', fontWeight: 500 }}>Effect</span>
         </button>
         <button style={{ background: 'transparent', border: 'none', padding: '8px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
           <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>⚙️</div>
           <span style={{ fontSize: '11px', color: 'rgba(0,0,0,0.5)', fontWeight: 500 }}>Settings</span>
         </button>
      </div>

    </div>
  );
}
