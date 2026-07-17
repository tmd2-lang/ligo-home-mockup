import React, { useState } from 'react';
import { LigoEvents } from '../app/data/events';

// --- Shared Sub-components ---

// Toggle Switch Component (Ligo style)
function Toggle({ active, onChange }: { active: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!active)}
      style={{
        width: '44px',
        height: '24px',
        borderRadius: '99px',
        background: active ? '#F97316' : 'rgba(255,255,255,0.1)',
        border: 'none',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 0.2s ease'
      }}
    >
      <div style={{
        position: 'absolute',
        top: '2px',
        left: active ? '22px' : '2px',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: '#fff',
        transition: 'left 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }} />
    </button>
  );
}

// Interactive Row Component for settings
function SettingsRow({ icon, title, subtitle, action }: { icon?: React.ReactNode, title: React.ReactNode, subtitle?: React.ReactNode, action: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      background: 'rgba(255,255,255,0.02)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {icon && <div style={{ color: 'rgba(255,255,255,0.5)' }}>{icon}</div>}
        <div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>{title}</div>
          {subtitle && <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{subtitle}</div>}
        </div>
      </div>
      <div>{action}</div>
    </div>
  );
}

export function PoshEventEditor() {
  const [mode, setMode] = useState<'sell' | 'rsvp'>('rsvp');

  // Modal State
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Form State
  const [eventName, setEventName] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [venue, setVenue] = useState('');
  const [flyerImage, setFlyerImage] = useState<string | null>(null);
  const [fontExpanded, setFontExpanded] = useState(false);
  const [selectedFont, setSelectedFont] = useState('Default');
  
  const [startDate, setStartDate] = useState('Wed, Jul 15');
  const [startTime, setStartTime] = useState('10:30pm');
  const [endDate, setEndDate] = useState('Thu, Jul 16');
  const [endTime, setEndTime] = useState('12:30am');

  // Toggle States
  const [toggles, setToggles] = useState({
    recurring: false,
    waitlist: false,
    transferable: true,
    approval: false,
    explore: true,
    password: false,
    campusOnly: false,
    emailVerification: true,
    approvedGuests: true,
    hideLocation: false,
    showAttendee: true,
  });

  const updateToggle = (key: keyof typeof toggles) => (v: boolean) => {
    setToggles(prev => {
      const next = { ...prev, [key]: v };
      if (key === 'approval' && v) next.transferable = false;
      if (key === 'transferable' && v) next.approval = false;
      return next;
    });
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      background: '#0a0907', 
      color: '#fff', 
      display: 'flex', 
      flexDirection: 'column',
      fontFamily: 'var(--font-body)',
      overflowY: 'auto'
    }}>
      
      {/* TOP NAVIGATION BAR */}
      <header style={{
        position: 'sticky',
        top: 0,
        height: '64px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        background: 'rgba(10,9,7,0.8)',
        backdropFilter: 'blur(12px)',
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Back Arrow & Ligo Logo */}
          <button style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: '#F5D783', letterSpacing: '0.05em' }}>LIGO</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button style={{ padding: '6px 16px', borderRadius: '100px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            Get Help
          </button>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>
            TD
          </div>
        </div>
      </header>

      {/* SUB-HEADER (Mode Toggle & Host Selector) */}
      <div style={{ padding: '24px 64px', display: 'flex', alignItems: 'center', gap: '32px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        
        {/* Host Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Don Dozier</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: '#333' }}></div>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>LIGO</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
          </div>
        </div>

        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', padding: '4px' }}>
          <button onClick={() => setMode('sell')} style={{ padding: '8px 32px', borderRadius: '100px', background: mode === 'sell' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: mode === 'sell' ? '#fff' : 'rgba(255,255,255,0.4)', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
            Sell Tickets
          </button>
          <button onClick={() => setMode('rsvp')} style={{ padding: '8px 32px', borderRadius: '100px', background: mode === 'rsvp' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: mode === 'rsvp' ? '#fff' : 'rgba(255,255,255,0.4)', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
            RSVP
          </button>
        </div>
      </div>

      {/* TWO COLUMN LAYOUT */}
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        
        {/* LEFT COLUMN (Scrollable Editor) */}
        <div style={{ flex: '1', padding: '40px 64px' }}>
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            
            {/* EVENT TITLE */}
            <input 
              type="text" 
              placeholder="My Event Name" 
              value={eventName}
              onChange={e => setEventName(e.target.value)}
              style={{ 
                width: '100%', 
                background: 'transparent', 
                border: 'none', 
                outline: 'none', 
                color: '#fff', 
                fontSize: '48px', 
                fontWeight: 700, 
                fontFamily: selectedFont === 'Serif' ? 'serif' : selectedFont === 'Mono' ? 'monospace' : selectedFont === 'Cursive' ? 'cursive' : selectedFont === 'Impact' ? 'Impact' : selectedFont === 'System' ? 'sans-serif' : 'var(--font-display)',
                letterSpacing: '-0.02em',
                marginBottom: '16px'
              }} 
            />

            <button onClick={() => setActiveModal('summary')} style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', 
              background: summary ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)', 
              border: summary ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.1)', 
              borderRadius: '8px', padding: '8px 16px', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' 
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
              {summary ? "Edit Short Summary" : "Add Short Summary"}
            </button>

            {/* FORM SECTIONS */}
            <div style={{ marginTop: '48px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              {/* DATES */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '15px', fontWeight: 600 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  Dates
                </div>
                
                {/* Start Date Row */}
                <div onClick={() => setActiveModal('startDate')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px', cursor: 'pointer' }}>
                  <span style={{ fontSize: '15px', fontWeight: 600 }}>Start</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>GMT -4</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: 600 }}>{startDate}</div>
                      <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: 600 }}>{startTime}</div>
                    </div>
                  </div>
                </div>

                {/* End Date Row */}
                <div onClick={() => setActiveModal('endDate')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 600 }}>End</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>GMT -4</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: 600 }}>{endDate}</div>
                      <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: 600 }}>{endTime}</div>
                    </div>
                  </div>
                </div>

                {/* Recurring */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: 600 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>
                    Recurring Series
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', fontWeight: 600 }}>{toggles.recurring ? 'Yes' : 'No'}</div>
                    <Toggle active={toggles.recurring} onChange={updateToggle('recurring')} />
                  </div>
                </div>
              </div>

              {/* EVENT DETAILS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '15px', fontWeight: 600 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
                  Event Details
                </div>
                
                <button onClick={() => setActiveModal('description')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: description ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)', border: description ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    {description ? "Edit Description" : "Add Description"}
                  </div>
                  {description && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F97316' }} />}
                </button>
                <button onClick={() => setActiveModal('location')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', background: location ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)', border: location ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {location || "Location"}
                </button>
                <button onClick={() => setActiveModal('venue')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', background: venue ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)', border: venue ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  {venue || "Venue Name"}
                </button>
              </div>

              {/* TICKETS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '15px', fontWeight: 600 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M8 3v18"/><path d="M16 3v18"/></svg>
                    Tickets
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
                    Enable waitlist <Toggle active={toggles.waitlist} onChange={updateToggle('waitlist')} />
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
                  <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ fontSize: '16px', fontWeight: 700 }}>RSVP</div>
                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>Free</div>
                  </div>
                  
                  <div style={{ display: 'flex', padding: '16px', gap: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>Transferable <span style={{ opacity: 0.5 }}>ⓘ</span></span>
                      <Toggle active={toggles.transferable} onChange={updateToggle('transferable')} />
                    </div>
                    <div style={{ width: '1px', background: 'rgba(255,255,255,0.05)' }}></div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>Require Approval</span>
                      <Toggle active={toggles.approval} onChange={updateToggle('approval')} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>RSVP Spots</span>
                    <div style={{ padding: '6px 12px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>Unlimited</div>
                  </div>
                </div>

                <button style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                </button>
              </div>

              {/* GUESTLIST */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '15px', fontWeight: 600 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    Guestlist <span style={{ opacity: 0.5 }}>ⓘ</span>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </div>
                
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '16px' }}>
                    David and 11 others going <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </div>
                  <div style={{ display: 'flex', paddingLeft: '8px' }}>
                    {[1,2,3,4,5,6,7,8].map((i) => (
                      <div key={i} style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#333', border: '2px solid #000', marginLeft: '-8px' }}></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* EVENT FEATURES */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '15px', fontWeight: 600 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    Event Features <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px' }}>
                  <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>Showcase your event's performers, sponsors and more.</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                    Add feature <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                </div>
              </div>

              {/* MEDIA */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: 600 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
                    YouTube Video <span style={{ opacity: 0.5 }}>ⓘ</span>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: 600 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    Image Gallery <span style={{ opacity: 0.5 }}>ⓘ</span>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </div>
              </div>

              {/* PAGE SETTINGS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '15px', fontWeight: 600 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                  Page Settings
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px' }}>
                  <SettingsRow title="Show on Explore" icon={<span style={{opacity:0.5}}>ⓘ</span>} action={<Toggle active={toggles.explore} onChange={updateToggle('explore')}/>} />
                  <SettingsRow title="Password Protected Event" icon={<span style={{opacity:0.5}}>ⓘ</span>} action={<Toggle active={toggles.password} onChange={updateToggle('password')}/>} />
                  <SettingsRow title="Campus-only visibility" subtitle="Only visible to students" action={<Toggle active={toggles.campusOnly} onChange={updateToggle('campusOnly')}/>} />
                  <SettingsRow title="Georgetown email verification" action={<Toggle active={toggles.emailVerification} onChange={updateToggle('emailVerification')}/>} />
                  <SettingsRow title="Allow approved guests" action={<Toggle active={toggles.approvedGuests} onChange={updateToggle('approvedGuests')}/>} />
                  <SettingsRow title="Hide exact location until approved" action={<Toggle active={toggles.hideLocation} onChange={updateToggle('hideLocation')}/>} />
                  <SettingsRow title="Show attendee list" action={<Toggle active={toggles.showAttendee} onChange={updateToggle('showAttendee')}/>} />
                </div>
              </div>

              <div style={{ height: '64px' }}></div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN (Sticky Preview) */}
        <div style={{ width: '480px', borderLeft: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.01)', position: 'relative' }}>
          <div style={{ position: 'sticky', top: '64px', height: 'calc(100vh - 64px)', maxHeight: 'calc(85vh - 64px)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '32px', flex: 1, overflowY: 'auto' }}>
              
              {/* FLYER UPLOAD */}
            <div 
              onClick={() => setActiveModal('flyer')}
              style={{ 
              width: '100%', aspectRatio: '1/1', borderRadius: '24px', 
              background: flyerImage ? `url(${flyerImage}) center/cover` : 'radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 70%), #111', 
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', overflow: 'hidden', cursor: 'pointer'
            }}>
              {!flyerImage && (
                <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '12px 24px', borderRadius: '100px', fontSize: '14px', fontWeight: 600 }}>
                  Upload your flyer
                </div>
              )}
            </div>

            {/* SPOTIFY */}
            <button style={{ 
              width: '100%', marginTop: '24px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', 
              borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' 
            }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#1DB954' }}></div>
              Add song from Spotify
            </button>

            {/* DESIGN SETTINGS */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', marginTop: '16px' }}>
              <div 
                onClick={() => setFontExpanded(!fontExpanded)}
                style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: fontExpanded ? 'none' : '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: 600, color: '#fff' }}>
                  <span style={{ opacity: 0.5 }}>Aa</span> Title Font
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {selectedFont}
                  <span style={{ transform: fontExpanded ? 'rotate(180deg)' : 'none', transition: '0.2s' }}>⌄</span>
                </div>
              </div>

              {fontExpanded && (
                <div style={{ padding: '0 16px 16px 16px', display: 'flex', gap: '8px', overflowX: 'auto', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {['Default', 'Serif', 'Mono', 'Cursive', 'Impact', 'System'].map(f => (
                    <div 
                      key={f}
                      onClick={() => setSelectedFont(f)}
                      style={{ 
                        width: '48px', height: '48px', flexShrink: 0, 
                        background: selectedFont === f ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.02)', 
                        border: selectedFont === f ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', fontSize: '18px',
                        fontFamily: f === 'Serif' ? 'serif' : f === 'Mono' ? 'monospace' : f === 'Cursive' ? 'cursive' : f === 'Impact' ? 'Impact' : 'sans-serif'
                      }}
                    >
                      Aa
                    </div>
                  ))}
                </div>
              )}

              <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: 600, color: '#fff' }}>
                  <span style={{ opacity: 0.5 }}>🎨</span> Accent Color
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>⌄</div>
              </div>
            </div>

          </div>

            {/* CREATE BUTTON */}
            <div style={{ padding: '24px 32px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(10,9,7,0.9)', backdropFilter: 'blur(12px)' }}>
              <button style={{ 
                width: '100%', padding: '18px', background: '#333', color: 'rgba(255,255,255,0.5)', 
                border: 'none', borderRadius: '16px', fontSize: '16px', fontWeight: 700, cursor: 'not-allowed' 
              }}>
                Create Event
              </button>
            </div>
          </div>
        </div>
      </div>

        {/* --- MODALS --- */}
        {activeModal && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {/* Backdrop */}
            <div 
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
              onClick={() => setActiveModal(null)}
            />
            
            {/* Modal Container */}
            <div style={{
              position: 'relative', width: activeModal === 'flyer' ? '600px' : '500px', background: '#111', 
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', 
              padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px',
              boxShadow: '0 32px 64px rgba(0,0,0,0.8)'
            }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>
                  {activeModal === 'summary' && 'Short Summary'}
                  {activeModal === 'description' && 'Description'}
                  {activeModal === 'location' && 'Location'}
                  {activeModal === 'venue' && 'Venue Name'}
                  {(activeModal === 'startDate' || activeModal === 'endDate') && 'Date & Time'}
                  {activeModal === 'flyer' && 'Upload Event Flyer'}
                </h3>
                <button onClick={() => setActiveModal(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
              </div>

              {/* SUMMARY MODAL */}
              {activeModal === 'summary' && (
                <div>
                  <textarea 
                    value={summary}
                    onChange={e => setSummary(e.target.value)}
                    placeholder="Briefly describe your event (max 150 chars)"
                    maxLength={150}
                    style={{ width: '100%', height: '100px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', color: '#fff', fontSize: '15px', resize: 'none', outline: 'none' }}
                  />
                </div>
              )}

              {/* DESCRIPTION MODAL */}
              {activeModal === 'description' && (
                <div>
                  <textarea 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Write a full description. Add schedule, rules, info..."
                    style={{ width: '100%', height: '200px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', color: '#fff', fontSize: '15px', resize: 'none', outline: 'none' }}
                  />
                </div>
              )}

              {/* LOCATION MODAL (Mock Autocomplete) */}
              {activeModal === 'location' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input 
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="Search for an address..."
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', color: '#fff', fontSize: '15px', outline: 'none' }}
                  />
                  {location.length > 2 && location !== 'Georgetown University, 3700 O St NW, Washington, DC 20057' && (
                    <div style={{ background: '#222', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
                      <div onClick={() => { setLocation('Georgetown University, 3700 O St NW, Washington, DC 20057'); setVenue('Georgetown University'); setActiveModal(null); }} style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontWeight: 600 }}>Georgetown University</div>
                        <div style={{ fontSize: '13px', color: '#888' }}>3700 O St NW, Washington, DC 20057</div>
                      </div>
                      <div onClick={() => { setLocation('The Tombs, 1226 36th St NW, Washington, DC 20007'); setVenue('The Tombs'); setActiveModal(null); }} style={{ padding: '12px 16px', cursor: 'pointer' }}>
                        <div style={{ fontWeight: 600 }}>The Tombs</div>
                        <div style={{ fontSize: '13px', color: '#888' }}>1226 36th St NW, Washington, DC 20007</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* VENUE NAME MODAL */}
              {activeModal === 'venue' && (
                <div>
                  <input 
                    type="text"
                    value={venue}
                    onChange={e => setVenue(e.target.value)}
                    placeholder="e.g. Village C West, The Tombs..."
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', color: '#fff', fontSize: '15px', outline: 'none' }}
                  />
                </div>
              )}

              {/* DATE & TIME MODAL */}
              {(activeModal === 'startDate' || activeModal === 'endDate') && (
                <div style={{ display: 'flex', gap: '24px' }}>
                  {/* Mock Calendar */}
                  <div style={{ flex: 2, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontWeight: 600 }}>
                      <span>July 2026</span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ opacity: 0.5 }}>&lt;</span>
                        <span>&gt;</span>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', fontSize: '12px', color: '#888', marginBottom: '8px' }}>
                      <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', fontSize: '14px' }}>
                      {/* Interactive Calendar Days */}
                      {Array.from({length: 31}).map((_, i) => {
                        const day = i + 1;
                        const activeDateString = activeModal === 'startDate' ? startDate : endDate;
                        const isSelected = activeDateString.endsWith(` ${day}`);
                        return (
                          <div 
                            key={i}
                            onClick={() => {
                              if (activeModal === 'startDate') setStartDate(`Wed, Jul ${day}`);
                              else setEndDate(`Thu, Jul ${day}`);
                            }}
                            style={{ 
                              width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                              borderRadius: '50%', cursor: 'pointer',
                              background: isSelected ? '#fff' : 'transparent', 
                              color: isSelected ? '#000' : '#fff',
                              fontWeight: isSelected ? 700 : 400
                            }}
                          >
                            {day}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Mock Time Picker */}
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflowY: 'auto', maxHeight: '280px', display: 'flex', flexDirection: 'column' }}>
                    {['9:00pm', '9:15pm', '9:30pm', '9:45pm', '10:00pm', '10:15pm', '10:30pm', '10:45pm', '11:00pm', '11:15pm', '11:30pm', '11:45pm', '12:00am', '12:15am', '12:30am'].map(time => {
                      const activeTime = activeModal === 'startDate' ? startTime : endTime;
                      const isSelected = activeTime === time;
                      return (
                        <div 
                          key={time}
                          onClick={() => {
                            if (activeModal === 'startDate') setStartTime(time);
                            else setEndTime(time);
                          }}
                          style={{ 
                            padding: '12px 16px', cursor: 'pointer', textAlign: 'center',
                            background: isSelected ? 'rgba(255,255,255,0.1)' : 'transparent',
                            fontWeight: isSelected ? 700 : 400
                          }}
                        >
                          {time}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* FLYER MODAL */}
              {activeModal === 'flyer' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                   {/* Drag and Drop */}
                   <div style={{ border: '1px dashed rgba(255,255,255,0.3)', borderRadius: '16px', padding: '32px', display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.02)' }}>
                     <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                     </div>
                     <div>
                       <div style={{ fontWeight: 600, fontSize: '15px' }}>Drag & drop or click here to upload a 4:5 flyer</div>
                       <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '4px' }}>4:5 aspect ratio (e.g. 1080 x 1350 px). Other sizes will be cropped.</div>
                     </div>
                   </div>

                   {/* Search */}
                   <div style={{ position: 'relative' }}>
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" style={{ position: 'absolute', left: '16px', top: '16px' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                     <input type="text" placeholder="Search for images..." style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px 16px 16px 44px', color: '#fff', fontSize: '15px', outline: 'none' }} />
                   </div>

                   {/* Image Grid */}
                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', maxHeight: '300px', overflowY: 'auto' }}>
                     {LigoEvents.map(ev => (
                       <div 
                         key={ev.id} 
                         onClick={() => { setFlyerImage(ev.image); setActiveModal(null); }}
                         style={{ width: '100%', aspectRatio: '4/5', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}
                       >
                         <img src={ev.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                       </div>
                     ))}
                   </div>
                </div>
              )}

              <button 
                onClick={() => setActiveModal(null)}
                style={{ width: '100%', padding: '16px', background: '#fff', color: '#000', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
  );
}
