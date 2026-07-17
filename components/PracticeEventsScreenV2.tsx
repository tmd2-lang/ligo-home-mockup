"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { saveEvent } from "@/lib/eventStore";

// --- DATA CONTRACT ---
export type LigoEvent = {
  id: string;
  title: string;
  titleFont: 'classic' | 'eclectic' | 'fancy' | 'literary';
  coverMedia: { kind: 'image' | 'video' | null; src: string | null };
  discoverableBy: 'private' | 'guests_friends' | 'public';
  date: { start: string | null; end?: string | null; repeats: 'never' | 'weekly' | 'biweekly' | 'monthly' };
  hostNickname: string | null;
  hosts: { name: string; avatar: string }[];
  location: {
    displayName: string | null;
    address: string | null;
    unit: string | null;
  };
  capacity: { limit: number | null; waitlist: boolean };
  cost: { 
    chipIn: 'required' | 'optional'; 
    amount: number | null; 
    methods: { venmo: string | null; cashapp: string | null; paypal: string | null };
  };
  rsvpDeadline: string | null;
  customFields: { label: string; url: string; icon: string; kind: 'link'|'playlist'|'registry'|'dresscode' }[];
  description: string;
  extraSections: { title: string; body: string }[];
  
  rsvpOptions: { setId: 'emojis' | 'icons' | 'bloom' | 'hearts' | 'flirty'; allowMaybe: boolean };
  questionnaire: { enabled: boolean; questions: { type: string; text: string; required: boolean }[] };
  remindersEnabled: boolean;
  
  theme: string;
  
  advanced: {
    requireApproval: boolean;
    guestQrCodes: boolean;
    passwordProtected: boolean;
    password: string | null;
    hideGuestList: boolean;
    allowTicketTransfers: boolean;
  };
};

const INITIAL_EVENT: LigoEvent = {
  id: 'temp-slug-123',
  title: '',
  titleFont: 'classic',
  coverMedia: { kind: null, src: null },
  discoverableBy: 'private',
  date: { start: null, repeats: 'never' },
  hostNickname: null,
  hosts: [{ name: 'TJ Dozier', avatar: 'TD' }],
  location: { displayName: null, address: null, unit: null },
  capacity: { limit: null, waitlist: false },
  cost: { chipIn: 'required', amount: null, methods: { venmo: null, cashapp: null, paypal: null } },
  rsvpDeadline: null,
  customFields: [],
  description: '',
  extraSections: [],
  rsvpOptions: { setId: 'emojis', allowMaybe: true },
  questionnaire: { enabled: false, questions: [] },
  remindersEnabled: true,
  theme: 'cream',
  advanced: {
    requireApproval: false,
    guestQrCodes: false,
    passwordProtected: false,
    password: null,
    hideGuestList: false,
    allowTicketTransfers: false
  }
};

const RSVP_SETS = {
  emojis: { label: 'Emojis', going: '👍', maybe: '🤔', cantGo: '😢' },
  icons: { label: 'Icons', going: '✓', maybe: '?', cantGo: '✕' },
  bloom: { label: 'Bloom', going: '💐', maybe: '🌷', cantGo: '🌱' },
  hearts: { label: 'Hearts', going: '❤️', maybe: '❤️‍🩹', cantGo: '💔' }, // ❤️‍🩹 explicitly uses ZWJ
  flirty: { label: 'Flirty', going: '😘', maybe: '💋', cantGo: '🤐' },
} as const;

// --- THEMES ---
const THEMES: Record<string, { bg: string; surface: string }> = {
  cream: { bg: '#FAFAF8', surface: '#FFFFFF' },
  dark: { bg: '#14110D', surface: '#221F1A' },
  blue: { bg: '#F0F4FA', surface: '#FFFFFF' },
};

export function PracticeEventsScreenV2({ onTab }: any) {
  const [event, setEvent] = useState<LigoEvent>(INITIAL_EVENT);
  const [activeSheet, setActiveSheet] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [showShare, setShowShare] = useState(false);
  const [advancedExpanded, setAdvancedExpanded] = useState(false);
  const [capacityEditMode, setCapacityEditMode] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const themeVars = THEMES[event.theme] || THEMES.cream;
  const isDark = event.theme === 'dark';
  
  const cssVars = {
    '--bg': themeVars.bg,
    '--surface': themeVars.surface,
    '--accent': '#0055FF', // Blue accent matching partiful style
    '--ink': isDark ? '#FFFFFF' : '#14110D',
    '--ink-muted': isDark ? 'rgba(255,255,255,0.5)' : 'rgba(20, 17, 13, 0.5)',
    '--border': isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
  } as React.CSSProperties;

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function handleSave() {
    if (!event.title.trim()) {
      flash("Title is required to save.");
      return;
    }
    const finalSlug = saveEvent(event);
    setEvent(prev => ({ ...prev, id: finalSlug }));
    console.log("=== SAVED LIGO EVENT TO STORE ===", finalSlug);
    setShowShare(true);
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEvent(prev => ({ ...prev, coverMedia: { kind: 'image', src: event.target?.result as string } }));
      };
      reader.readAsDataURL(file);
    }
  }

  // --- REUSABLE UI COMPONENTS ---
  const Row = ({ icon, placeholder, value, onClick, rightNode }: any) => (
    <div 
      onClick={onClick}
      style={{ 
        display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', 
        borderBottom: `1px solid var(--border)`, cursor: onClick ? 'pointer' : 'default'
      }}
    >
      <span style={{ fontSize: '18px', width: '24px', textAlign: 'center', opacity: 0.8 }}>{icon}</span>
      <div style={{ flex: 1, fontSize: '15px', color: value ? 'var(--ink)' : 'var(--ink-muted)', fontWeight: value ? 600 : 500 }}>
        {value || placeholder}
      </div>
      {rightNode && <div>{rightNode}</div>}
    </div>
  );

  const Pill = ({ icon, label, onClick }: any) => (
    <button 
      onClick={onClick}
      style={{
        background: 'var(--surface)', border: `1px solid var(--border)`, color: 'var(--ink)',
        padding: '8px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 600,
        display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', cursor: 'pointer'
      }}
    >
      {icon} {label}
    </button>
  );

  const Toggle = ({ active, onChange }: { active: boolean, onChange: (v: boolean) => void }) => (
    <div onClick={() => onChange(!active)} style={{ width: 44, height: 24, borderRadius: 100, background: active ? 'var(--ink)' : 'var(--border)', position: 'relative', cursor: 'pointer', transition: '0.2s' }}>
      <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--bg)', position: 'absolute', top: 2, left: active ? 22 : 2, transition: '0.2s' }} />
    </div>
  );

  const handlePreloadDemo = () => {
    setEvent(prev => ({
      ...prev,
      title: 'Niceman to Iceman',
      titleFont: 'classic',
      theme: 'dark',
      rsvpOptions: { setId: 'hearts', allowMaybe: true },
      date: { start: 'Saturday, Aug 1 · 8:00pm', repeats: 'never' },
      hosts: [{ name: 'The Phantoms', avatar: '👻' }],
      location: { displayName: 'The Frathouse', address: '3210 Prospect St NW\nWashington, DC 20007', unit: null },
      description: "Come celebrate Louie's 21st birthday as he transitions from Niceman to Iceman. We're going to listen to Iceman by Drake all night long. Pull up to the house, drinks provided.",
      coverMedia: { kind: 'image', src: '/covers/drake-iceman-coverart.jpeg' }
    }));
  };

  return (
    <div className="screen" style={{ ...cssVars, position: 'relative', width: '100%', height: '100%', background: 'var(--bg)', color: 'var(--ink)', overflow: 'hidden', fontFamily: 'sans-serif' }}>
      
      <div style={{ height: '100%', overflowY: 'auto', paddingBottom: '120px' }}>
        
        {/* HEADER */}
        <div style={{ position: 'sticky', top: 0, zIndex: 50, display: 'flex', justifyContent: 'space-between', padding: '16px 20px', paddingTop: 'max(env(safe-area-inset-top, 40px), 40px)' }}>
          <button style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--surface)', border: `1px solid var(--border)`, color: 'var(--ink)', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          
          {/* DISCOVERABILITY TOGGLE */}
          <button onClick={() => {
              const modes = ['private', 'guests_friends', 'public'] as const;
              const next = modes[(modes.indexOf(event.discoverableBy) + 1) % modes.length];
              setEvent({...event, discoverableBy: next});
            }}
            style={{ background: 'var(--surface)', border: `1px solid var(--border)`, padding: '8px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 600, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {event.discoverableBy === 'private' && <span>🔒 Private (link only)</span>}
            {event.discoverableBy === 'guests_friends' && <span>👥 Guests & friends</span>}
            {event.discoverableBy === 'public' && <span>🌍 Public event</span>}
          </button>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handlePreloadDemo} style={{ background: 'var(--surface)', color: 'var(--accent)', border: `1px solid var(--accent)`, padding: '8px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Demo Auto-Fill</button>
            <button onClick={handleSave} style={{ background: 'var(--ink)', color: 'var(--bg)', border: 'none', padding: '8px 16px', borderRadius: '100px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>Save</button>
          </div>
        </div>

        {/* CANVAS */}
        <div style={{ padding: '0 20px' }}>
          
          {/* TITLE & FONT */}
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <input 
              type="text"
              placeholder="Untitled Event"
              value={event.title}
              onChange={e => setEvent({ ...event, title: e.target.value })}
              style={{
                width: '100%', background: 'transparent', border: 'none', outline: 'none', textAlign: 'center',
                fontSize: '36px', fontWeight: 800, color: 'var(--ink)',
                fontFamily: event.titleFont === 'eclectic' ? 'monospace' : event.titleFont === 'fancy' ? 'cursive' : event.titleFont === 'literary' ? 'serif' : 'sans-serif'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px', overflowX: 'auto' }}>
              {(['classic', 'eclectic', 'fancy', 'literary'] as const).map(f => (
                <button 
                  key={f} onClick={() => setEvent({ ...event, titleFont: f })}
                  style={{ background: event.titleFont === f ? 'rgba(0,0,0,0.05)' : 'transparent', border: event.titleFont === f ? `1px solid var(--border)` : '1px solid transparent', padding: '6px 12px', borderRadius: '100px', fontSize: '13px', textTransform: 'capitalize', color: 'var(--ink)', cursor: 'pointer' }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* COVER MEDIA */}
          <div style={{ width: '100%', aspectRatio: '1', background: event.coverMedia.src ? `url(${event.coverMedia.src}) center/cover` : 'linear-gradient(135deg, #FFD194 0%, #70E1F5 100%)', borderRadius: '24px', position: 'relative', marginBottom: '24px' }}>
             {!event.coverMedia.src && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5, fontSize: '48px', fontWeight: 800, color: '#fff' }}>LIGO</div>}
             <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
             <button onClick={() => fileInputRef.current?.click()} style={{ position: 'absolute', bottom: 16, right: 16, width: 44, height: 44, borderRadius: '50%', background: 'var(--surface)', border: `1px solid var(--border)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>✏️</button>
          </div>

          {/* DETAILS LIST */}
          <div style={{ background: 'var(--surface)', borderRadius: '24px', border: `1px solid var(--border)`, overflow: 'hidden', marginBottom: '24px' }}>
            <Row icon="📅" placeholder="Set a date…" value={event.date.start} onClick={() => setActiveSheet('date')} rightNode={<span style={{color:'var(--ink-muted)'}}>›</span>} />
            <div style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--ink-muted)', borderBottom: `1px solid var(--border)` }}>
               Can't decide when? <span onClick={() => flash("Polling coming soon")} style={{ color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }}>Poll your guests →</span>
            </div>
            
            <div style={{ padding: '16px', borderBottom: `1px solid var(--border)` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>👑</span>
                <input 
                  type="text" placeholder="Hosted by (optional) nickname" 
                  value={event.hostNickname || ''} onChange={e => setEvent({ ...event, hostNickname: e.target.value })}
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '14px', color: 'var(--ink)' }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px', paddingLeft: '32px' }}>
                 <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg)', border: `1px solid var(--border)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>TD</div>
                 <span style={{ fontSize: '15px', fontWeight: 600 }}>TJ Dozier</span>
                 <div style={{ flex: 1 }} />
                 <Pill label="+ Add cohosts" onClick={() => flash("Add cohosts coming soon")} />
              </div>
            </div>

            <Row icon="🔒" placeholder="Location" value={event.location.displayName} onClick={() => setActiveSheet('location')} />
            
            {/* INLINE CAPACITY */}
            {capacityEditMode ? (
              <div style={{ padding: '16px', borderBottom: `1px solid var(--border)`, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '18px', width: '24px', textAlign: 'center', opacity: 0.8 }}>👥</span>
                <input 
                  type="number" autoFocus placeholder="# total spots" 
                  value={event.capacity.limit || ''} 
                  onChange={e => setEvent({ ...event, capacity: { ...event.capacity, limit: parseInt(e.target.value) || null } })}
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '16px', color: 'var(--ink)', fontWeight: 600 }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>Waitlist</span>
                  <Toggle active={event.capacity.waitlist} onChange={(v) => setEvent({ ...event, capacity: { ...event.capacity, waitlist: v } })} />
                </div>
                <button onClick={() => setCapacityEditMode(false)} style={{ background: 'var(--ink)', color: 'var(--bg)', border: 'none', padding: '6px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 700 }}>Done</button>
              </div>
            ) : (
              <Row icon="👥" placeholder="Unlimited spots" value={event.capacity.limit ? `${event.capacity.limit} spots` : null} onClick={() => setCapacityEditMode(true)} />
            )}
            
            <Row icon="🎟" placeholder="Cost per person" value={event.cost.amount ? `$${event.cost.amount}` : null} onClick={() => setActiveSheet('cost')} rightNode={<div style={{ background: 'var(--accent)', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>Sell tickets!</div>} />
            <Row icon="⌛" placeholder="RSVP Deadline" value={event.rsvpDeadline} onClick={() => setActiveSheet('deadline')} />
          </div>

          {/* CUSTOM FIELDS */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px' }}>
            <Pill icon="+" label="Link" onClick={() => setActiveSheet('custom-link')} />
            <Pill icon="+" label="Playlist" onClick={() => setActiveSheet('custom-playlist')} />
            <Pill icon="+" label="Registry" onClick={() => setActiveSheet('custom-link')} />
            <Pill icon="+" label="Dress code" onClick={() => setActiveSheet('custom-link')} />
          </div>

          {event.customFields.map((field, i) => (
             <div key={i} style={{ background: 'var(--surface)', borderRadius: '16px', border: `1px solid var(--border)`, padding: '16px', marginBottom: '16px' }}>
                {field.kind === 'playlist' && (field.url.includes('spotify.com') || field.url.includes('apple.com')) ? (
                  <div style={{ background: 'var(--bg)', borderRadius: '12px', padding: '24px', textAlign: 'center', border: `1px dashed var(--border)` }}>
                    🎵 Embedded {field.url.includes('spotify') ? 'Spotify' : 'Apple Music'} Player Mock<br/><span style={{fontSize:'12px', opacity:0.5}}>{field.url}</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '20px' }}>{field.icon}</span>
                    <div>
                      <div style={{ fontWeight: 600 }}>{field.label}</div>
                      <div style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>{field.url}</div>
                    </div>
                  </div>
                )}
             </div>
          ))}

          {/* DESCRIPTION */}
          <div style={{ background: 'var(--surface)', borderRadius: '24px', border: `1px solid var(--border)`, padding: '20px', marginBottom: '8px' }}>
            <textarea 
              placeholder="Add a description of your event"
              value={event.description}
              onChange={e => setEvent({ ...event, description: e.target.value })}
              style={{ width: '100%', minHeight: '100px', background: 'transparent', border: 'none', outline: 'none', resize: 'none', fontSize: '16px', color: 'var(--ink)', fontFamily: 'inherit' }}
            />
          </div>
          <div style={{ textAlign: 'center', fontSize: '14px', color: 'var(--ink-muted)', marginBottom: '24px' }}>
             More to say? <button onClick={() => flash("New section coming soon")} style={{ background: 'transparent', border: 'none', color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }}>+ New section</button>
          </div>

          {/* RSVP OPTIONS */}
          <div style={{ background: 'var(--surface)', borderRadius: '24px', border: `1px solid var(--border)`, padding: '20px', marginBottom: '24px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
               <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>⚙ RSVP Options</h4>
               
               {!event.advanced.requireApproval && (
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                   <span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>Allow Maybe</span>
                   <Toggle active={event.rsvpOptions.allowMaybe} onChange={v => setEvent({ ...event, rsvpOptions: { ...event.rsvpOptions, allowMaybe: v } })} />
                 </div>
                 <select 
                   value={event.rsvpOptions.setId} 
                   onChange={e => setEvent({ ...event, rsvpOptions: { ...event.rsvpOptions, setId: e.target.value as any } })}
                   style={{ background: 'var(--bg)', padding: '6px 12px', borderRadius: '100px', fontSize: '13px', border: `1px solid var(--border)`, outline: 'none' }}
                 >
                   {Object.entries(RSVP_SETS).map(([id, set]) => (
                     <option key={id} value={id}>{set.label}</option>
                   ))}
                 </select>
               </div>
             )}
             </div>
             
             {event.advanced.requireApproval ? (
               <div style={{ display: 'flex', gap: '12px' }}>
                  <button style={{ flex: 1, background: 'var(--ink)', color: 'var(--bg)', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: 700 }}>Get on the list</button>
               </div>
             ) : (
               <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
                 <div style={{ flex: 1, aspectRatio: '1', borderRadius: '50%', background: 'var(--bg)', border: `1px solid var(--border)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                   <span style={{ fontSize: '28px', marginBottom: '4px' }}>{RSVP_SETS[event.rsvpOptions.setId].going}</span><span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink-muted)' }}>Going</span>
                 </div>
                 {event.rsvpOptions.allowMaybe && (
                   <div style={{ flex: 1, aspectRatio: '1', borderRadius: '50%', background: 'var(--bg)', border: `1px solid var(--border)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                     <span style={{ fontSize: '28px', marginBottom: '4px' }}>{RSVP_SETS[event.rsvpOptions.setId].maybe}</span><span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink-muted)' }}>Maybe</span>
                   </div>
                 )}
                 <div style={{ flex: 1, aspectRatio: '1', borderRadius: '50%', background: 'var(--bg)', border: `1px solid var(--border)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                   <span style={{ fontSize: '28px', marginBottom: '4px' }}>{RSVP_SETS[event.rsvpOptions.setId].cantGo}</span><span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink-muted)' }}>Can't Go</span>
                 </div>
               </div>
             )}
          </div>

          {/* QUICK ACTIONS */}
          <div style={{ marginBottom: '16px' }}>
             <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', color: 'var(--ink-muted)', fontWeight: 500 }}>Quick actions for hosts</h4>
             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
               {event.advanced.requireApproval && (
                 <Pill label="Remove Guest Approval" onClick={() => setEvent({ ...event, advanced: { ...event.advanced, requireApproval: false } })} />
               )}
               <Pill label="Add Questionnaire" onClick={() => setActiveSheet('questionnaire')} />
               <Pill label="Reminders" onClick={() => setActiveSheet('reminders')} />
               <Pill label="••• More" onClick={() => setActiveSheet('more')} />
             </div>
          </div>

          {/* ADVANCED SETTINGS EXPANDER */}
          <div style={{ marginBottom: '40px', borderTop: `1px solid var(--border)`, paddingTop: '16px' }}>
             <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <button onClick={() => setAdvancedExpanded(!advancedExpanded)} style={{ background: 'transparent', border: 'none', color: 'var(--ink-muted)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                   {advancedExpanded ? 'Hide advanced settings ▴' : 'Show advanced settings ▾'}
                </button>
             </div>
             
             {advancedExpanded && (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div>
                        <div style={{ fontSize: '15px', fontWeight: 600 }}>Require Guest Approval</div>
                        <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>You must approve guests before they get a ticket.</div>
                     </div>
                     <Toggle active={event.advanced.requireApproval} onChange={v => setEvent({ ...event, advanced: { ...event.advanced, requireApproval: v } })} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div>
                        <div style={{ fontSize: '15px', fontWeight: 600 }}>Guest QR codes <span style={{ fontSize: '12px', opacity: 0.5 }}>ⓘ</span></div>
                        <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>Guests get a QR code for check-in at the door</div>
                     </div>
                     <Toggle active={event.advanced.guestQrCodes} onChange={v => setEvent({ ...event, advanced: { ...event.advanced, guestQrCodes: v } })} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div>
                        <div style={{ fontSize: '15px', fontWeight: 600 }}>Password protected event <span style={{ fontSize: '12px', opacity: 0.5 }}>ⓘ</span></div>
                        <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>Only guests with the password can view details</div>
                     </div>
                     <Toggle active={event.advanced.passwordProtected} onChange={v => setEvent({ ...event, advanced: { ...event.advanced, passwordProtected: v }, password: v ? '' : null } as any)} />
                  </div>
                  
                  {event.advanced.passwordProtected && (
                    <input type="text" placeholder="Enter event password" value={(event.advanced as any).password || ''} onChange={e => setEvent({ ...event, advanced: { ...event.advanced, password: e.target.value } } as any)} style={{ width: '100%', padding: '12px 16px', background: 'var(--surface)', border: `1px solid var(--border)`, borderRadius: '12px', fontSize: '14px', outline: 'none', color: 'var(--ink)', marginTop: '-8px' }} />
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div>
                        <div style={{ fontSize: '15px', fontWeight: 600 }}>Hide guest list <span style={{ fontSize: '12px', opacity: 0.5 }}>ⓘ</span></div>
                        <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>Guests cannot see who else is attending</div>
                     </div>
                     <Toggle active={event.advanced.hideGuestList} onChange={v => setEvent({ ...event, advanced: { ...event.advanced, hideGuestList: v } })} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div>
                        <div style={{ fontSize: '15px', fontWeight: 600 }}>Allow ticket transfers <span style={{ fontSize: '12px', opacity: 0.5 }}>ⓘ</span></div>
                        <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>Guests can transfer tickets to other users</div>
                     </div>
                     <Toggle active={event.advanced.allowTicketTransfers} onChange={v => setEvent({ ...event, advanced: { ...event.advanced, allowTicketTransfers: v } })} />
                  </div>
               </div>
             )}
          </div>

        </div>
      </div>

      {/* --- OVERLAY SHEETS --- */}

      {/* 1. Date & Time / Deadline Component */}
      {(activeSheet === 'date' || activeSheet === 'deadline') && (
         <div style={{ position: 'absolute', inset: 0, zIndex: 100, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.4)' }}>
            <div onClick={() => setActiveSheet(null)} style={{ flex: 1 }} />
            <div style={{ background: 'var(--bg)', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px', paddingBottom: '32px', color: 'var(--ink)' }}>
               {/* Header */}
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <button onClick={() => setActiveSheet(null)} style={{ background: 'var(--surface)', border: `1px solid var(--border)`, padding: '6px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 600 }}>Clear</button>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>{activeSheet === 'date' ? 'Date & Time' : 'Deadline'}</h3>
                  {activeSheet === 'deadline' ? (
                    <button onClick={() => setActiveSheet(null)} style={{ background: 'var(--ink)', color: 'var(--bg)', padding: '6px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 700, border: 'none' }}>Save</button>
                  ) : <div style={{ width: 60 }} />}
               </div>
               
               {activeSheet === 'date' && (
                 <div style={{ background: 'var(--surface)', border: `1px solid var(--border)`, borderRadius: '12px', display: 'flex', padding: '16px', marginBottom: '24px', alignItems: 'center' }}>
                    <div style={{ flex: 1, background: 'var(--bg)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                       <div style={{ fontSize: '13px', fontWeight: 600 }}>Sat July 18</div>
                       <div style={{ fontSize: '16px', fontWeight: 800 }}>8:00pm</div>
                    </div>
                    <div style={{ padding: '0 16px', fontSize: '20px', color: 'var(--ink-muted)' }}>›</div>
                    <div style={{ flex: 1, padding: '12px', textAlign: 'center', color: 'var(--ink-muted)' }}>
                       <div style={{ fontSize: '13px' }}>Optional</div>
                       <div style={{ fontSize: '16px', fontWeight: 600 }}>End Date</div>
                    </div>
                 </div>
               )}

               {/* Calendar Fake */}
               <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                     <div style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '18px' }}>July 2026 ›</div>
                     <div style={{ display: 'flex', gap: '24px', color: 'var(--accent)', fontWeight: 700, fontSize: '20px' }}>
                        <span style={{ opacity: 0.3 }}>‹</span>
                        <span>›</span>
                     </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600, color: 'var(--ink-muted)', marginBottom: '12px' }}>
                     {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => <div key={d} style={{ width: '32px', textAlign: 'center' }}>{d}</div>)}
                  </div>
                  {/* Fake Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px 0', justifyItems: 'center', fontSize: '16px', fontWeight: 500 }}>
                     {[1,2,3,4].map(d => <div key={d} style={{ color: 'var(--ink-muted)', opacity: 0.3 }}>{d}</div>)}
                     {[5,6,7,8,9,10,11].map(d => <div key={d} style={{ color: 'var(--ink-muted)', opacity: 0.3 }}>{d}</div>)}
                     {[12,13,14].map(d => <div key={d} style={{ color: 'var(--ink-muted)', opacity: 0.3 }}>{d}</div>)}
                     {[15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31].map(d => {
                        const dateStr = `2026-07-${d.toString().padStart(2, '0')}`;
                        const isStart = event.date.start === dateStr;
                        const isDeadline = event.rsvpDeadline === dateStr;
                        const isSelected = activeSheet === 'date' ? isStart : isDeadline;
                        
                        // Disable dates after start date for deadline sheet
                        const isDisabled = activeSheet === 'deadline' && event.date.start && dateStr > event.date.start;
                        
                        return (
                          <div 
                            key={d} 
                            onClick={() => {
                              if (isDisabled) return;
                              if (activeSheet === 'date') {
                                // If setting start date and it's after the deadline, clamp deadline
                                let newDeadline = event.rsvpDeadline;
                                if (newDeadline && dateStr < newDeadline) {
                                  newDeadline = dateStr;
                                }
                                setEvent({ ...event, date: { ...event.date, start: dateStr }, rsvpDeadline: newDeadline });
                              } else if (activeSheet === 'deadline') {
                                setEvent({ ...event, rsvpDeadline: dateStr });
                              }
                            }}
                            style={{ 
                              width: 32, height: 32, borderRadius: '50%', 
                              display: 'flex', alignItems: 'center', justifyContent: 'center', 
                              fontWeight: isSelected ? 700 : 500,
                              background: isSelected ? 'var(--accent)' : 'transparent', 
                              color: isSelected ? '#fff' : isDisabled ? 'rgba(0,0,0,0.1)' : 'var(--ink)',
                              cursor: isDisabled ? 'not-allowed' : 'pointer',
                              opacity: isDisabled ? 0.3 : 1
                            }}
                          >
                            {d}
                          </div>
                        );
                     })}
                  </div>
               </div>

               {/* Time Wheel Fake */}
               {activeSheet === 'date' ? (
                 <div style={{ textAlign: 'center', position: 'relative', height: '120px', overflow: 'hidden', marginBottom: '24px' }}>
                    <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '40px', background: 'rgba(0,0,0,0.05)', transform: 'translateY(-50%)', borderRadius: '8px' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                       <div style={{ opacity: 0.3 }}>7:30pm</div>
                       <div style={{ opacity: 0.6 }}>7:45pm</div>
                       <div style={{ fontWeight: 600, fontSize: '18px' }}>8:00pm</div>
                       <div style={{ opacity: 0.6 }}>8:15pm</div>
                       <div style={{ opacity: 0.3 }}>8:30pm</div>
                    </div>
                 </div>
               ) : (
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--surface)', borderRadius: '12px', border: `1px solid var(--border)` }}>
                    <span style={{ fontWeight: 600 }}>Time</span>
                    <div style={{ background: 'var(--bg)', padding: '8px 12px', borderRadius: '8px', fontSize: '14px', border: `1px solid var(--border)` }}>11:59pm</div>
                 </div>
               )}

               {/* Footer */}
               {activeSheet === 'date' && (
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>🌐 Eastern Time (ET)</div>
                    <button onClick={() => setActiveSheet(null)} style={{ background: 'var(--ink)', color: 'var(--bg)', border: 'none', padding: '12px 24px', borderRadius: '100px', fontSize: '15px', fontWeight: 700 }}>Done</button>
                 </div>
               )}
            </div>
         </div>
      )}

      {/* 2. Location Sheet */}
      {activeSheet === 'location' && (
         <div style={{ position: 'absolute', inset: 0, zIndex: 100, background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: 'max(env(safe-area-inset-top, 40px), 40px) 20px 20px 20px' }}>
               <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                  <button onClick={() => setActiveSheet(null)} style={{ width: 36, height: 36, borderRadius: '50%', background: 'transparent', border: `1px solid var(--border)`, fontSize: '16px' }}>✕</button>
                  <h3 style={{ flex: 1, margin: 0, textAlign: 'center', fontSize: '18px', fontWeight: 700, marginRight: 36 }}>Location</h3>
               </div>
               <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 16, top: 14, fontSize: '18px', opacity: 0.5 }}>🔍</span>
                  <input 
                    type="text" 
                    placeholder="Search" 
                    value={locationQuery}
                    onChange={e => setLocationQuery(e.target.value)}
                    style={{ width: '100%', padding: '16px 16px 16px 48px', fontSize: '16px', borderRadius: '100px', border: `1px solid var(--border)`, background: 'transparent', outline: 'none' }} 
                  />
                  {locationQuery && (
                    <span onClick={() => setLocationQuery('')} style={{ position: 'absolute', right: 16, top: 16, fontSize: '14px', opacity: 0.5, cursor: 'pointer' }}>✕</span>
                  )}
               </div>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto' }}>
               {locationQuery.trim() && (
                 <Row icon="✏️" value={`Use "${locationQuery}"`} onClick={() => { setEvent({...event, location: {...event.location, displayName: locationQuery}}); setActiveSheet(null); }} />
               )}
               
               {[
                 { name: "1131 Commonwealth Ave", sub: "Allston, MA, United States" },
                 { name: "1131 Tremont St", sub: "Roxbury Crossing, MA, United States" },
                 { name: "1131 Massachusetts Ave", sub: "Cambridge, MA, United States" },
                 { name: "Madison Square Garden", sub: "New York, NY, United States" },
                 { name: "Staples Center", sub: "Los Angeles, CA, United States" }
               ].filter(r => r.name.toLowerCase().includes(locationQuery.toLowerCase()) || r.sub.toLowerCase().includes(locationQuery.toLowerCase())).map((res, i) => (
                 <Row key={i} icon="📍" placeholder={<div><div style={{fontWeight:600, color:'var(--ink)'}}>{res.name}</div><div style={{fontSize:'13px', color:'var(--ink-muted)'}}>{res.sub}</div></div>} onClick={() => { setEvent({...event, location: {...event.location, displayName: res.name}}); setActiveSheet(null); }} />
               ))}
            </div>
         </div>
      )}

      {/* 4. Cost Per Person Sheet (Full Screen) */}
      {activeSheet === 'cost' && (
         <div style={{ position: 'absolute', inset: 0, zIndex: 100, background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: 'max(env(safe-area-inset-top, 40px), 40px) 20px 0 20px' }}>
               <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                  <button onClick={() => setActiveSheet(null)} style={{ width: 36, height: 36, borderRadius: '50%', background: 'transparent', border: `1px solid var(--border)`, fontSize: '16px' }}>‹</button>
                  <h3 style={{ flex: 1, margin: 0, textAlign: 'center', fontSize: '18px', fontWeight: 700 }}>Cost Per Person</h3>
                  <button style={{ width: 36, height: 36, borderRadius: '50%', background: 'transparent', border: `1px solid var(--border)`, fontSize: '16px' }}>?</button>
               </div>
               
               <div style={{ display: 'flex', borderBottom: `1px solid var(--border)` }}>
                  <div style={{ flex: 1, textAlign: 'center', padding: '16px', fontWeight: 600, color: 'var(--ink-muted)' }}>🎟 Sell Tickets</div>
                  <div style={{ flex: 1, textAlign: 'center', padding: '16px', fontWeight: 600, color: 'var(--ink)', borderBottom: `2px solid var(--ink)` }}>💰 Request Money</div>
               </div>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px' }}>
               <div style={{ background: 'var(--surface)', border: `1px solid var(--border)`, borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontWeight: 600 }}>Chip In</span>
                  <select 
                    value={event.cost.chipIn} 
                    onChange={e => setEvent({ ...event, cost: { ...event.cost, chipIn: e.target.value as any } })}
                    style={{ background: 'var(--bg)', padding: '8px 12px', borderRadius: '8px', border: `1px solid var(--border)`, outline: 'none' }}
                  >
                    <option value="required">Required amount</option>
                    <option value="optional">Optional</option>
                  </select>
               </div>

               <div style={{ background: 'var(--surface)', border: `1px solid var(--border)`, borderRadius: '12px', padding: '16px', marginBottom: '32px' }}>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>⚠️ Payments are not verified</div>
                  <div style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>Guests self-report payment during RSVP</div>
               </div>

               <h4 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Cost Per Person</h4>
               <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
                  <div style={{ background: 'var(--surface)', border: `1px solid var(--border)`, borderRadius: '8px', padding: '16px', fontWeight: 600 }}>🇺🇸 USD $ ▾</div>
                  <input type="number" placeholder="Amount" value={event.cost.amount || ''} onChange={e => setEvent({...event, cost: {...event.cost, amount: parseInt(e.target.value) || null}})} style={{ flex: 1, background: 'var(--surface)', border: `1px solid var(--border)`, borderRadius: '8px', padding: '16px', fontSize: '16px', outline: 'none' }} />
               </div>

               <h4 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Payment Methods</h4>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                     <div style={{ width: '100px', fontWeight: 600 }}>Venmo</div>
                     <input type="text" placeholder="@ username" value={event.cost.methods.venmo || ''} onChange={e => setEvent({...event, cost: {...event.cost, methods: {...event.cost.methods, venmo: e.target.value}}})} style={{ flex: 1, background: 'var(--surface)', border: `1px solid var(--border)`, borderRadius: '8px', padding: '16px', fontSize: '16px', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                     <div style={{ width: '100px', fontWeight: 600 }}>Cash App</div>
                     <input type="text" placeholder="$ Cashtag" value={event.cost.methods.cashapp || ''} onChange={e => setEvent({...event, cost: {...event.cost, methods: {...event.cost.methods, cashapp: e.target.value}}})} style={{ flex: 1, background: 'var(--surface)', border: `1px solid var(--border)`, borderRadius: '8px', padding: '16px', fontSize: '16px', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                     <div style={{ width: '100px', fontWeight: 600 }}>PayPal</div>
                     <input type="text" placeholder="@ username" value={event.cost.methods.paypal || ''} onChange={e => setEvent({...event, cost: {...event.cost, methods: {...event.cost.methods, paypal: e.target.value}}})} style={{ flex: 1, background: 'var(--surface)', border: `1px solid var(--border)`, borderRadius: '8px', padding: '16px', fontSize: '16px', outline: 'none' }} />
                  </div>
               </div>

               <div style={{ fontSize: '13px', color: 'var(--ink-muted)', textAlign: 'center' }}>Not supported with Guest Approval or Find a Time</div>
            </div>
         </div>
      )}

      {/* 5. Questionnaire Sheet (Full Screen) */}
      {activeSheet === 'questionnaire' && (
         <div style={{ position: 'absolute', inset: 0, zIndex: 100, background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: 'max(env(safe-area-inset-top, 40px), 40px) 20px 20px 20px', borderBottom: `1px solid var(--border)` }}>
               <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <button onClick={() => setActiveSheet(null)} style={{ width: 36, height: 36, borderRadius: '50%', background: 'transparent', border: `1px solid var(--border)`, fontSize: '16px' }}>‹</button>
                  <h3 style={{ flex: 1, margin: 0, textAlign: 'center', fontSize: '18px', fontWeight: 700 }}>Questionnaire</h3>
                  <button style={{ width: 36, height: 36, borderRadius: '50%', background: 'transparent', border: `1px solid var(--border)`, fontSize: '16px' }}>?</button>
               </div>
               <div style={{ fontSize: '14px', color: 'var(--ink-muted)', textAlign: 'center' }}>Ask guests questions when they RSVP. Collect emails, dietary restrictions, anything!</div>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 600 }}>Questionnaire</span>
                  <Toggle active={event.questionnaire.enabled} onChange={v => setEvent({ ...event, questionnaire: { ...event.questionnaire, enabled: v } })} />
               </div>

               {event.questionnaire.enabled && (
                 <>
                   {event.questionnaire.questions.map((q, i) => (
                      <div key={i} style={{ background: 'var(--surface)', border: `1px solid var(--border)`, borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <div style={{ background: 'var(--bg)', border: `1px solid var(--border)`, padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}>Short Answer ▾</div>
                            <button onClick={() => {
                              const newQ = [...event.questionnaire.questions];
                              newQ.splice(i, 1);
                              setEvent({ ...event, questionnaire: { ...event.questionnaire, questions: newQ } });
                            }} style={{ background: 'transparent', border: 'none', color: 'var(--ink-muted)' }}>✕</button>
                         </div>
                         <input type="text" placeholder="e.g. Any dietary restrictions?" value={q.text} onChange={e => {
                           const newQ = [...event.questionnaire.questions];
                           newQ[i].text = e.target.value;
                           setEvent({ ...event, questionnaire: { ...event.questionnaire, questions: newQ } });
                         }} style={{ width: '100%', padding: '12px 0', border: 'none', borderBottom: `1px solid var(--border)`, background: 'transparent', outline: 'none', fontSize: '16px', marginBottom: '16px' }} />
                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input type="checkbox" checked={q.required} onChange={e => {
                              const newQ = [...event.questionnaire.questions];
                              newQ[i].required = e.target.checked;
                              setEvent({ ...event, questionnaire: { ...event.questionnaire, questions: newQ } });
                            }} /> <span style={{ fontSize: '14px' }}>Required</span>
                         </div>
                      </div>
                   ))}
                   
                   <button onClick={() => setEvent({ ...event, questionnaire: { ...event.questionnaire, questions: [...event.questionnaire.questions, { type: 'short', text: '', required: false }] } })} style={{ background: 'transparent', border: 'none', color: 'var(--accent)', fontWeight: 600, fontSize: '16px', padding: '12px 0', cursor: 'pointer' }}>+ Add question</button>
                 </>
               )}
            </div>
            <div style={{ padding: '20px', borderTop: `1px solid var(--border)` }}>
               <button onClick={() => setActiveSheet(null)} style={{ width: '100%', background: 'var(--ink)', color: 'var(--bg)', padding: '16px', borderRadius: '100px', fontSize: '16px', fontWeight: 700, border: 'none' }}>Save</button>
            </div>
         </div>
      )}

      {/* 6. Auto-Reminders Sheet (Full Screen Preview) */}
      {activeSheet === 'reminders' && (
         <div style={{ position: 'absolute', inset: 0, zIndex: 100, background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: 'max(env(safe-area-inset-top, 40px), 40px) 20px 20px 20px' }}>
               <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <button onClick={() => setActiveSheet(null)} style={{ width: 36, height: 36, borderRadius: '50%', background: 'transparent', border: `1px solid var(--border)`, fontSize: '16px' }}>‹</button>
                  <h3 style={{ flex: 1, margin: 0, textAlign: 'center', fontSize: '18px', fontWeight: 700 }}>Auto-Reminders</h3>
                  <button style={{ width: 36, height: 36, borderRadius: '50%', background: 'transparent', border: `1px solid var(--border)`, fontSize: '16px' }}>?</button>
               </div>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', padding: '16px 0', borderBottom: `1px solid var(--border)` }}>
                  <span style={{ fontSize: '18px', fontWeight: 600 }}>Auto-Reminders</span>
                  <Toggle active={event.remindersEnabled} onChange={v => setEvent({ ...event, remindersEnabled: v })} />
               </div>

               {event.remindersEnabled && (
                 <>
                   <div style={{ fontSize: '14px', color: 'var(--ink-muted)', marginBottom: '16px' }}>Your guests will receive:</div>
                   
                   <div style={{ background: 'var(--surface)', border: `1px solid var(--border)`, borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
                      <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>Reminders to RSVP</div>
                      <div style={{ color: 'var(--accent)', fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>1 week before event</div>
                      <div style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>To: <span style={{ display: 'inline-block', background: 'var(--bg)', border: `1px solid var(--border)`, padding: '4px 8px', borderRadius: '100px', color: 'var(--ink)' }}>💌 Invited</span> <span style={{ display: 'inline-block', background: 'var(--bg)', border: `1px solid var(--border)`, padding: '4px 8px', borderRadius: '100px', color: 'var(--ink)' }}>{RSVP_SETS[event.rsvpOptions.setId].maybe} Maybe</span></div>
                   </div>

                   <div style={{ background: 'var(--surface)', border: `1px solid var(--border)`, borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
                      <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>Event Reminders</div>
                      <div style={{ color: 'var(--accent)', fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>2 hours before event</div>
                      <div style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>To: <span style={{ display: 'inline-block', background: 'var(--bg)', border: `1px solid var(--border)`, padding: '4px 8px', borderRadius: '100px', color: 'var(--ink)' }}>{RSVP_SETS[event.rsvpOptions.setId].going} Going</span></div>
                   </div>
                 </>
               )}
            </div>
         </div>
      )}

      {/* 7. "••• More" Sheet */}
      {activeSheet === 'more' && (
         <div style={{ position: 'absolute', inset: 0, zIndex: 100, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.4)' }}>
            <div onClick={() => setActiveSheet(null)} style={{ flex: 1 }} />
            <div style={{ background: 'var(--surface)', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', paddingBottom: '32px', color: 'var(--ink)' }}>
               <div style={{ width: 40, height: 4, background: 'var(--border)', borderRadius: 2, margin: '16px auto 8px' }} />
               
               <div style={{ padding: '8px 20px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: `1px solid var(--border)` }}>
                    <span style={{ fontSize: '16px', fontWeight: 600 }}>Limit +1s</span>
                    <span style={{ color: 'var(--ink-muted)' }}>›</span>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: `1px solid var(--border)` }}>
                    <span style={{ fontSize: '16px', fontWeight: 600 }}>Hide Guest List</span>
                    <Toggle active={event.advanced.hideGuestList} onChange={v => setEvent({ ...event, advanced: { ...event.advanced, hideGuestList: v } })} />
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: `1px solid var(--border)` }}>
                    <span style={{ fontSize: '16px', fontWeight: 600 }}>Hide Activity Timestamps</span>
                    <Toggle active={false} onChange={() => flash("Coming soon")} />
                 </div>
               </div>

               <div style={{ height: 8, background: 'var(--bg)' }} />

               <div style={{ padding: '8px 20px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: `1px solid var(--border)` }}>
                    <span style={{ fontSize: '16px', fontWeight: 600 }}>All Settings</span>
                    <span style={{ color: 'var(--ink-muted)' }}>›</span>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
                    <span style={{ fontSize: '16px', fontWeight: 600 }}>FAQ</span>
                    <span style={{ color: 'var(--ink-muted)' }}>›</span>
                 </div>
               </div>
            </div>
         </div>
      )}

      {/* TOAST & SHARE (Omitted for brevity in edit, but keeping functionality) */}
      {toast && (
        <div style={{ position: 'absolute', top: '100px', left: '50%', transform: 'translateX(-50%)', background: 'var(--ink)', color: 'var(--bg)', padding: '12px 24px', borderRadius: '100px', fontSize: '14px', fontWeight: 600, zIndex: 200, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
          {toast}
        </div>
      )}

      {showShare && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 300, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
           <div style={{ background: 'var(--surface)', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '32px 24px' }}>
              <h2 style={{ margin: '0 0 16px 0', fontSize: '24px', fontWeight: 800 }}>Event saved!</h2>
              <div style={{ background: 'var(--bg)', border: `1px solid var(--border)`, padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                 <span style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>localhost:3000/e/{event.id}</span>
                 <button onClick={() => { navigator.clipboard.writeText(`http://localhost:3000/e/${event.id}`); flash("Copied!"); }} style={{ background: 'var(--ink)', color: 'var(--bg)', padding: '6px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Copy</button>
              </div>
              <button onClick={() => router.push(`/e/${event.id}`)} style={{ width: '100%', background: 'var(--bg)', color: 'var(--ink)', border: `1px solid var(--border)`, padding: '16px', borderRadius: '100px', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}>View Event Page →</button>
           </div>
        </div>
      )}

    </div>
  );
}
