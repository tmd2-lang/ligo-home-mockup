"use client";
import React, { useState } from "react";

const THEMES: Record<string, { bg: string; surface: string }> = {
  cream: { bg: '#FAFAF8', surface: '#FFFFFF' },
  dark: { bg: '#14110D', surface: '#221F1A' },
  blue: { bg: '#F0F4FA', surface: '#FFFFFF' },
};

const RSVP_SETS = {
  emojis: { label: 'Emojis', going: '👍', maybe: '🤔', cantGo: '😢' },
  icons: { label: 'Icons', going: '✓', maybe: '?', cantGo: '✕' },
  bloom: { label: 'Bloom', going: '💐', maybe: '🌷', cantGo: '🌱' },
  hearts: { label: 'Hearts', going: '❤️', maybe: '❤️‍🩹', cantGo: '💔' },
  flirty: { label: 'Flirty', going: '😘', maybe: '💋', cantGo: '🤐' },
} as const;

export function PracticeGuestEventScreen() {
  const theme = 'dark';
  const themeVars = THEMES[theme];
  const isDark = theme === 'dark';
  
  const cssVars = {
    '--bg': themeVars.bg,
    '--surface': themeVars.surface,
    '--accent': '#0055FF',
    '--ink': isDark ? '#FFFFFF' : '#14110D',
    '--ink-muted': isDark ? 'rgba(255,255,255,0.5)' : 'rgba(20, 17, 13, 0.5)',
    '--border': isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
  } as React.CSSProperties;

  const rsvpSet = RSVP_SETS.hearts;

  return (
    <div className="screen scroll no-scrollbar" style={{ ...cssVars, width: '100%', height: '100%', overflowY: 'auto', background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'sans-serif', paddingBottom: '160px' }}>
      
      {/* TOP NAV */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 20px', position: 'sticky', top: 0, zIndex: 10 }}>
        <button style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--surface)', border: `1px solid var(--border)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)', fontSize: '20px', cursor: 'pointer' }}>
          ‹
        </button>
        <button style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--surface)', border: `1px solid var(--border)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)', fontSize: '18px', cursor: 'pointer' }}>
          ↗
        </button>
      </div>

      <div style={{ padding: '0 20px' }}>
        
        {/* TITLE */}
        <h1 style={{ 
          fontSize: '40px', fontWeight: 800, margin: '8px 0 24px 0', lineHeight: 1.1, textAlign: 'center', fontFamily: 'sans-serif'
        }}>
          Niceman to Iceman
        </h1>

        {/* COVER MEDIA */}
        <div style={{ width: '100%', aspectRatio: '1', background: `url(/covers/drake-iceman-coverart.jpeg) center/cover`, borderRadius: '24px', marginBottom: '32px', border: `1px solid var(--border)` }} />

        {/* DATE & TIME */}
        <div style={{ marginBottom: '24px' }}>
           <div style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>Saturday, Aug 1</div>
           <div style={{ fontSize: '18px', color: 'var(--ink)' }}>8:00pm</div>
        </div>

        {/* ACTIONS */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
           <button style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--surface)', border: `1px solid var(--border)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: 'var(--ink)', cursor: 'pointer' }}>📅</button>
           <button style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--surface)', border: `1px solid var(--border)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: 'var(--ink)', cursor: 'pointer' }}>↗️</button>
           <button style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--surface)', border: `1px solid var(--border)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: 'var(--ink)', cursor: 'pointer' }}>🔔</button>
        </div>

        {/* HOST ROW */}
        <div style={{ marginBottom: '32px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--ink-muted)', fontSize: '16px' }}>
             <span>💼</span> Hosted by
           </div>
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
               <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--surface)', border: `1px solid var(--border)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 700 }}>👻</div>
               <div style={{ fontSize: '18px', fontWeight: 600 }}>The Phantoms</div>
             </div>
             <button style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--surface)', border: `1px solid var(--border)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: 'var(--ink)', cursor: 'pointer' }}>💬</button>
           </div>
        </div>

        {/* APPROX LOCATION */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
           <div style={{ display: 'flex', gap: '16px' }}>
             <div style={{ fontSize: '24px', marginTop: '2px' }}>📍</div>
             <div>
                <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>3210 Prospect St NW</div>
                <div style={{ fontSize: '15px', color: 'var(--ink-muted)' }}>
                  Washington, DC 20007
                </div>
             </div>
           </div>
           <button style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--surface)', border: `1px solid var(--border)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: 'var(--ink)', cursor: 'pointer' }}>🗺️</button>
        </div>

        {/* DESCRIPTION */}
        <div style={{ fontSize: '17px', lineHeight: 1.5, marginBottom: '48px', whiteSpace: 'pre-wrap' }}>
          Come celebrate Louie's 21st birthday as he transitions from Niceman to Iceman. We're going to listen to Iceman by Drake all night long. Pull up to the house, drinks provided. 
        </div>

        {/* GUEST LIST */}
        <div style={{ marginBottom: '64px' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
             <div>
               <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 700 }}>Guest List</h3>
               <div style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>65 Going · 8 Maybe</div>
             </div>
             <button style={{ background: 'var(--surface)', border: `1px solid var(--border)`, borderRadius: '100px', padding: '6px 16px', fontSize: '14px', fontWeight: 600, color: 'var(--ink)', cursor: 'pointer' }}>View all</button>
           </div>
           
           <div style={{ display: 'flex', paddingLeft: '8px' }}>
             {['TJ', 'DD', 'MW', 'KL', 'AR'].map((initials, i) => (
                <div key={i} style={{ width: 48, height: 48, borderRadius: '50%', background: `hsl(${i * 60}, 70%, 40%)`, border: `2px solid var(--bg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700, color: '#fff', marginLeft: '-8px' }}>
                  {initials}
                </div>
             ))}
             <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--surface)', border: `2px solid var(--bg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 700, color: 'var(--ink)', marginLeft: '-8px' }}>
               +60
             </div>
           </div>
        </div>

      </div>

      {/* STICKY RSVP BAR (Pre-RSVP State) */}
      <div style={{ position: 'sticky', bottom: '32px', margin: '0 20px', borderRadius: '100px', display: 'flex', padding: '6px', gap: '6px', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', backgroundColor: isDark ? 'rgba(40,36,30,0.6)' : 'rgba(255,255,255,0.6)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, boxShadow: '0 12px 40px rgba(0,0,0,0.3)', zIndex: 100 }}>
        <button style={{ flex: 1, padding: '10px 0', borderRadius: '100px', background: 'var(--surface)', border: `1px solid var(--border)`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}>
          <span style={{ fontSize: '18px' }}>{rsvpSet.going}</span><span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>Going</span>
        </button>
        <button style={{ flex: 1, padding: '10px 0', borderRadius: '100px', background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}>
          <span style={{ fontSize: '18px' }}>{rsvpSet.maybe}</span><span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>Maybe</span>
        </button>
        <button style={{ flex: 1, padding: '10px 0', borderRadius: '100px', background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}>
          <span style={{ fontSize: '18px' }}>{rsvpSet.cantGo}</span><span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>Can't</span>
        </button>
      </div>

    </div>
  );
}
