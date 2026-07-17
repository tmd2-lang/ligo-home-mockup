import React, { useState } from 'react';

const Toggle = ({ active, onClick }: { active: boolean, onClick?: () => void }) => (
  <div onClick={onClick} style={{ width: '50px', height: '30px', borderRadius: '15px', background: active ? '#fff' : '#333', position: 'relative', cursor: 'pointer', transition: '0.2s' }}>
    <div style={{ width: '26px', height: '26px', borderRadius: '13px', background: active ? '#000' : '#fff', position: 'absolute', top: '2px', left: active ? '22px' : '2px', transition: '0.2s' }} />
  </div>
);

export function PoshMobileEventEditor() {
  const [step, setStep] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  
  const [limitCapacity, setLimitCapacity] = useState(true);
  const [eventName, setEventName] = useState('');
  const [venueName, setVenueName] = useState('');
  const [address, setAddress] = useState('');
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 6, 1)); // Default to July 2026
  const [startDate, setStartDate] = useState<Date | null>(new Date(2026, 6, 15));
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState('23:00');
  const [endTime, setEndTime] = useState('02:00');
  const [datePickerTarget, setDatePickerTarget] = useState<'start' | 'end' | null>(null);
  const [showTimeModal, setShowTimeModal] = useState(false);
  
  const [showFlyerModal, setShowFlyerModal] = useState(false);
  const [showFontModal, setShowFontModal] = useState(false);
  const [fontFamily, setFontFamily] = useState('var(--font-display)');
  const [flyerImg, setFlyerImg] = useState('/Posh/MayaJune.png');

  const [showOnExplore, setShowOnExplore] = useState(true);
  const [passwordProtected, setPasswordProtected] = useState(false);
  const [offSiteEvent, setOffSiteEvent] = useState(false);
  const [requireApproval, setRequireApproval] = useState(false);
  const [allowTransfers, setAllowTransfers] = useState(true);
  const [showErrors, setShowErrors] = useState(false);

  const formatTime = (time24: string) => {
    const [h, m] = time24.split(':');
    let hours = parseInt(h, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${m} ${ampm}`;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const formatDisplayDate = (d: Date | null) => d ? `${monthNames[d.getMonth()].slice(0,3)} ${d.getDate()}` : '';
  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#0a0907',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-body)',
      position: 'relative',
    }}>
      {/* Top Header Area (below status bar) */}
      <div style={{ paddingTop: '60px', paddingLeft: '24px', paddingRight: '24px', flexShrink: 0 }}>
        {/* Progress Bar */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ flex: 1, height: '2px', background: i <= step ? '#fff' : 'rgba(255,255,255,0.2)', borderRadius: '2px' }} />
          ))}
        </div>

        {/* Back Button */}
        <button onClick={() => {
          if (showLaunchModal) setShowLaunchModal(false);
          else if (datePickerTarget) setDatePickerTarget(null);
          else if (step > 1) setStep(step - 1);
        }} style={{ background: 'none', border: 'none', color: '#fff', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>

      {step === 1 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px', marginTop: '60px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 600, textAlign: 'center', marginBottom: '40px', fontFamily: 'var(--font-display)' }}>
            Let's launch your next event
          </h1>
          
          <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
            <div 
              onClick={() => setStep(2)}
              style={{ flex: 1, background: '#1a1a1a', borderRadius: '16px', padding: '32px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', cursor: 'pointer' }}
            >
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '6px solid #C4D383', borderBottomColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-45deg)' }}>
                <span style={{ color: '#C4D383', fontSize: '32px', fontWeight: 'bold', transform: 'rotate(45deg)' }}>$</span>
              </div>
              <span style={{ fontSize: '18px', fontWeight: 500 }}>Sell tickets</span>
            </div>

            <div 
              onClick={() => setStep(2)}
              style={{ flex: 1, background: '#1a1a1a', borderRadius: '16px', padding: '32px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', cursor: 'pointer' }}
            >
              <div style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '48px' }}>👏</span>
              </div>
              <span style={{ fontSize: '18px', fontWeight: 500 }}>RSVP Only</span>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 'auto', marginBottom: '40px' }}>
            <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: '0 auto' }}>
              Join a Kickoff Session
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', minHeight: 0 }}>
          <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '100px', minHeight: 0 }}>
            
            {/* Flyer Area */}
            <div style={{ 
              height: '350px', 
              background: `url("${flyerImg}") center/cover`, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' 
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: 600, textShadow: '0 2px 4px rgba(0,0,0,0.5)', fontFamily }}>Design your event page</h2>
              <button onClick={() => setShowFlyerModal(true)} style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', padding: '12px 24px', borderRadius: '12px', color: '#fff', marginTop: '16px', fontWeight: 600, cursor: 'pointer' }}>
                Upload Flyer
              </button>
            </div>

            {/* Tab Bar */}
            <div style={{ display: 'flex', borderBottom: '1px solid #333', background: '#111' }}>
              <div onClick={() => setShowFlyerModal(true)} style={{ flex: 1, textAlign: 'center', padding: '16px 0', fontSize: '13px', fontWeight: 600, borderRight: '1px solid #333', color: '#fff', cursor: 'pointer' }}>
                Flyer 🖼️
              </div>
              <div onClick={() => setShowFontModal(true)} style={{ flex: 1, textAlign: 'center', padding: '16px 0', fontSize: '13px', fontWeight: 600, color: '#aaa', cursor: 'pointer' }}>
                Font AA
              </div>
            </div>

            {/* Form Fields */}
            <div style={{ padding: '0' }}>
              <input 
                placeholder="My Event*"
                value={eventName}
                onChange={e => setEventName(e.target.value)}
                style={{ width: '100%', background: 'none', border: 'none', borderBottom: '1px solid #333', padding: '16px', color: '#ff4444', fontSize: '20px', fontWeight: 700, fontFamily }} 
              />
              <div style={{ display: 'flex', borderBottom: '1px solid #333' }}>
                <div onClick={() => setDatePickerTarget('start')} style={{ flex: 1, padding: '16px', color: '#ff4444', borderRight: '1px solid #333', cursor: 'pointer' }}>
                  {startDate ? `${formatDisplayDate(startDate)}*` : 'Start*'}
                </div>
                <div onClick={() => setDatePickerTarget('end')} style={{ flex: 1, padding: '16px', color: '#ff4444', display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
                  {endDate ? `${formatDisplayDate(endDate)}*` : 'End*'} <span>👁️</span>
                </div>
              </div>
              {showErrors && endDate && startDate && endDate.getTime() < startDate.getTime() && (
                <div style={{ padding: '8px 16px', color: '#ff4444', fontSize: '12px', background: 'rgba(255,0,0,0.1)' }}>End date must be after start date</div>
              )}

              <input 
                placeholder="Venue Name*" 
                value={venueName}
                onChange={e => setVenueName(e.target.value)}
                style={{ width: '100%', background: 'none', border: 'none', borderBottom: '1px solid #333', padding: '16px', color: '#ff4444', fontSize: '16px' }} 
              />
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', borderBottom: '1px solid #333', padding: '16px' }}>
                  <input 
                    placeholder="Address*" 
                    value={address}
                    onChange={e => {
                      setAddress(e.target.value);
                      setShowAddressDropdown(e.target.value.length > 0);
                    }}
                    style={{ flex: 1, background: 'none', border: 'none', color: '#ff4444', fontSize: '16px' }} 
                  />
                  <span>👁️</span>
                </div>
                {showAddressDropdown && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#1a1a1a', zIndex: 10, borderRadius: '0 0 12px 12px', border: '1px solid #333', borderTop: 'none', overflow: 'hidden' }}>
                    {['120 Broadway, Cambridge, MA', '120 Tremont St, Boston, MA', '1200 1st St NE, Washington, DC']
                      .filter(a => a.toLowerCase().includes(address.toLowerCase()))
                      .map(a => (
                        <div key={a} onClick={() => { setAddress(a); setShowAddressDropdown(false); }} style={{ padding: '16px', borderBottom: '1px solid #333', color: '#fff', fontSize: '14px', cursor: 'pointer' }}>
                          {a}
                        </div>
                      ))}
                    {['120 Broadway, Cambridge, MA', '120 Tremont St, Boston, MA', '1200 1st St NE, Washington, DC'].filter(a => a.toLowerCase().includes(address.toLowerCase())).length === 0 && (
                      <div style={{ padding: '16px', color: '#888', fontSize: '14px' }}>No results found</div>
                    )}
                  </div>
                )}
              </div>
              {showErrors && !address.trim() && (
                <div style={{ padding: '8px 16px', color: '#ff4444', fontSize: '12px', background: 'rgba(255,0,0,0.1)' }}>Event address is required</div>
              )}

              <div style={{ padding: '24px 16px 8px', color: '#888', fontSize: '14px', fontWeight: 600 }}>Additional Details</div>
              
              <div style={{ padding: '0 16px' }}>
                <textarea 
                  placeholder="Event Summary (optional)" 
                  style={{ width: '100%', height: '120px', background: '#1a1a1a', border: 'none', borderRadius: '12px', padding: '16px', color: '#fff', resize: 'none', fontSize: '16px' }} 
                />
              </div>

              <div style={{ marginTop: '16px', background: '#111', borderRadius: '12px', margin: '16px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #333' }}>
                  <span>Show on Explore ⓘ</span>
                  <Toggle active={showOnExplore} onClick={() => setShowOnExplore(!showOnExplore)} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #333' }}>
                  <span>Password Protected Event ⓘ</span>
                  <Toggle active={passwordProtected} onClick={() => setPasswordProtected(!passwordProtected)} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
                  <span>Off Site Event ⓘ</span>
                  <Toggle active={offSiteEvent} onClick={() => setOffSiteEvent(!offSiteEvent)} />
                </div>
              </div>

              <div style={{ padding: '24px 16px 8px', color: '#888', fontSize: '14px', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>RSVP Settings</span>
                <span style={{ fontSize: '20px' }}>+</span>
              </div>
              
              <div style={{ background: '#111', borderRadius: '12px', margin: '0 16px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #333' }}>
                  <span>Require Approval ⓘ</span>
                  <Toggle active={requireApproval} onClick={() => {
                    const next = !requireApproval;
                    setRequireApproval(next);
                    if (next) setAllowTransfers(false);
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #333' }}>
                  <span>Allow Ticket Transfers ⓘ</span>
                  <Toggle active={allowTransfers} onClick={() => {
                    const next = !allowTransfers;
                    setAllowTransfers(next);
                    if (next) setRequireApproval(false);
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
                  <span>Limit event capacity ⓘ</span>
                  <Toggle active={limitCapacity} onClick={() => setLimitCapacity(!limitCapacity)} />
                </div>
                {limitCapacity && (
                  <div style={{ padding: '16px', background: '#1a1a1a', borderTop: '1px solid #333' }}>
                    <input defaultValue="100" style={{ background: 'none', border: 'none', color: '#fff', fontSize: '16px' }} />
                  </div>
                )}
              </div>

              <div style={{ padding: '24px 16px 8px', color: '#888', fontSize: '14px', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Guestlist</span>
                <span>👁️</span>
              </div>
              <div style={{ background: '#111', borderRadius: '12px', margin: '0 16px', padding: '24px', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', margin: '0 0 16px 0' }}>
                  <img src="https://i.pravatar.cc/100?img=1" style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #111', marginLeft: '-12px', zIndex: 3 }} />
                  <img src="https://i.pravatar.cc/100?img=2" style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #111', marginLeft: '-12px', zIndex: 2 }} />
                  <img src="https://i.pravatar.cc/100?img=3" style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #111', marginLeft: '-12px', zIndex: 1 }} />
                </div>
                <div style={{ marginBottom: '12px', fontSize: '16px' }}>Sarah and 99 others going 👁️</div>
                <div style={{ fontSize: '14px', color: '#fff' }}>View guestlist</div>
              </div>

              <div style={{ marginTop: '24px', background: '#111', borderRadius: '12px', margin: '24px 16px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
                  <span style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>🎵 Add Features ⓘ</span>
                  <span style={{ fontSize: '20px' }}>+</span>
                </div>
              </div>

              <div style={{ textAlign: 'center', padding: '24px', color: '#fff', fontWeight: 600 }}>
                Hide Advanced Settings
              </div>

            </div>
          </div>

          {/* Fixed Bottom Bar */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 24px 32px', background: '#0a0907', borderTop: '1px solid #222', display: 'flex', gap: '12px' }}>
            <button onClick={() => setStep(1)} style={{ flex: 1, padding: '16px', borderRadius: '12px', background: '#1a1a1a', color: '#fff', border: 'none', fontWeight: 600, fontSize: '16px', cursor: 'pointer' }}>Back</button>
            <button onClick={() => {
              let hasError = false;
              if (endDate && startDate && endDate.getTime() < startDate.getTime()) hasError = true;
              if (!address.trim()) hasError = true;
              
              if (hasError) {
                setShowErrors(true);
              } else {
                setShowErrors(false);
                setShowLaunchModal(true);
              }
            }} style={{ flex: 1, padding: '16px', borderRadius: '12px', background: '#fff', color: '#000', border: 'none', fontWeight: 600, fontSize: '16px', cursor: 'pointer' }}>Save</button>
          </div>
        </div>
      )}

      {datePickerTarget && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', zIndex: 100, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ background: '#0a0907', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px', paddingBottom: '40px' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #333', margin: '-24px -24px 16px', padding: '0 24px' }}>
              <div onClick={() => { setDatePickerTarget(null); setShowFlyerModal(true); }} style={{ flex: 1, textAlign: 'center', padding: '16px 0', fontSize: '13px', fontWeight: 600, color: '#fff', cursor: 'pointer' }}>
                Flyer
              </div>
              <div onClick={() => { setDatePickerTarget(null); setShowFontModal(true); }} style={{ flex: 1, textAlign: 'center', padding: '16px 0', fontSize: '13px', fontWeight: 600, color: '#888', cursor: 'pointer' }}>
                Font
              </div>
            </div>
            
            <div style={{ color: '#888', fontSize: '14px', marginBottom: '24px' }}>
              {datePickerTarget === 'start' ? 'Selecting: Start Date' : 'Selecting: End Date'} | Timezone: America, New York
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '18px', fontWeight: 600 }}>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()} <span style={{ color: '#007aff' }}>{'>'}</span></div>
              <div style={{ display: 'flex', gap: '24px', color: '#007aff', fontSize: '20px' }}>
                <span style={{ cursor: 'pointer' }} onClick={prevMonth}>{'<'}</span>
                <span style={{ cursor: 'pointer' }} onClick={nextMonth}>{'>'}</span>
              </div>
            </div>
            
            {/* Calendar Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', marginBottom: '24px' }}>
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                <div key={d} style={{ fontSize: '12px', color: '#888', fontWeight: 600, marginBottom: '8px' }}>{d}</div>
              ))}
              {Array.from({length: getFirstDayOfMonth(currentMonth)}).map((_, i) => <div key={`empty-${i}`} />)}
              {Array.from({length: getDaysInMonth(currentMonth)}).map((_, i) => {
                const day = i + 1;
                const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                
                let isSelected = false;
                if (datePickerTarget === 'start' && startDate && startDate.getTime() === dateObj.getTime()) isSelected = true;
                if (datePickerTarget === 'end' && endDate && endDate.getTime() === dateObj.getTime()) isSelected = true;
                
                // Base past dates off a mock "today" of July 12, 2026
                const isPast = dateObj.getTime() < new Date(2026, 6, 12).getTime();
                
                return (
                  <div key={i} onClick={() => {
                    if (!isPast) {
                      if (datePickerTarget === 'start') setStartDate(dateObj);
                      else setEndDate(dateObj);
                    }
                  }} style={{ 
                    padding: '8px 0', 
                    fontSize: '18px',
                    color: isPast ? '#444' : '#fff',
                    background: isSelected ? '#007aff' : 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    cursor: isPast ? 'default' : 'pointer'
                  }}>
                    {day}
                  </div>
                )
              })}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderTop: '1px solid #333', borderBottom: '1px solid #333', marginBottom: '24px' }}>
              <span style={{ fontSize: '18px', fontWeight: 600 }}>Time</span>
              <div 
                onClick={() => setShowTimeModal(true)}
                style={{ background: '#1a1a1a', padding: '10px 16px', borderRadius: '16px', fontSize: '16px', cursor: 'pointer' }}
              >
                {formatTime(datePickerTarget === 'start' ? startTime : endTime)}
              </div>
            </div>

            <button onClick={() => setDatePickerTarget(null)} style={{ width: '100%', padding: '16px', borderRadius: '12px', background: '#1a1a1a', color: '#007aff', border: 'none', fontWeight: 600, fontSize: '18px', marginBottom: '12px', cursor: 'pointer' }}>Confirm</button>
            <button onClick={() => setDatePickerTarget(null)} style={{ width: '100%', padding: '16px', borderRadius: '12px', background: '#0a0907', color: '#007aff', border: 'none', fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Font Modal */}
      {showFontModal && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ background: '#0a0907', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px', paddingBottom: '40px', minHeight: '50%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Select a Font</h2>
              <span onClick={() => setShowFontModal(false)} style={{ fontSize: '24px', cursor: 'pointer' }}>×</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { name: 'Default', val: 'var(--font-display)' },
                { name: 'Serif', val: 'Georgia, serif' },
                { name: 'Cursive', val: 'cursive' },
                { name: 'Impact', val: 'Impact, sans-serif' },
                { name: 'Monospace', val: 'monospace' }
              ].map(font => (
                <div key={font.name} onClick={() => { setFontFamily(font.val); setShowFontModal(false); }} style={{ padding: '16px', borderRadius: '12px', background: fontFamily === font.val ? '#1a1a1a' : 'transparent', color: fontFamily === font.val ? '#C4D383' : '#fff', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: font.val, fontSize: '18px' }}>{font.name}</span>
                  {fontFamily === font.val && <span>✓</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Time Modal */}
      {showTimeModal && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 110, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ background: '#0a0907', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px', paddingBottom: '40px', height: '60%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', flexShrink: 0 }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Select Time</h2>
              <span onClick={() => setShowTimeModal(false)} style={{ fontSize: '24px', cursor: 'pointer' }}>×</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', flex: 1, paddingRight: '8px' }}>
              {Array.from({ length: 24 * 4 }).map((_, i) => {
                const h = Math.floor(i / 4);
                const m = (i % 4) * 15;
                const time24 = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                const isSelected = (datePickerTarget === 'start' ? startTime : endTime) === time24;
                return (
                  <div key={time24} onClick={() => { 
                    if (datePickerTarget === 'start') setStartTime(time24);
                    else setEndTime(time24);
                    setShowTimeModal(false); 
                  }} style={{ padding: '16px', borderRadius: '12px', background: isSelected ? '#1a1a1a' : 'transparent', color: isSelected ? '#C4D383' : '#fff', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '18px' }}>{formatTime(time24)}</span>
                    {isSelected && <span>✓</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Flyer Modal */}
      {showFlyerModal && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ background: '#0a0907', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px', paddingBottom: '40px', minHeight: '50%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Select a Flyer</h2>
              <span onClick={() => setShowFlyerModal(false)} style={{ fontSize: '24px', cursor: 'pointer' }}>×</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', overflowY: 'auto', maxHeight: '400px', padding: '4px' }}>
              {[
                '/Posh/MayaJune.png',
                '/Posh/Saxatones.png',
                '/Posh/Boxing.png',
                '/Posh/GeorgetownRadio.png',
                '/Posh/SigEpFlyer.png',
                '/Posh/TheBlackAffair.png',
                '/Posh/rangilamosaic.png',
                '/Posh/DJREN!.png'
              ].map(img => (
                <div key={img} onClick={() => { setFlyerImg(img); setShowFlyerModal(false); }} style={{ height: '180px', background: `url("${img}") center/cover`, borderRadius: '12px', cursor: 'pointer', border: flyerImg === img ? '2px solid #C4D383' : '2px solid transparent' }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {showLaunchModal && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', zIndex: 100, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ background: '#0a0907', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px', paddingBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 600 }}>Ready to launch your event?</h2>
              <span onClick={() => setShowLaunchModal(false)} style={{ fontSize: '28px', cursor: 'pointer', color: '#888' }}>×</span>
            </div>
            <p style={{ color: '#aaa', marginBottom: '32px', lineHeight: 1.5, fontSize: '16px' }}>This will launch events on the following dates. You can update event info individually or in bulk later, in the visual editor.</p>
            
            <div style={{ height: '240px', borderRadius: '16px', background: `url("${flyerImg}") center/cover`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', padding: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
              <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                <h3 style={{ fontSize: '32px', fontWeight: 600, textShadow: '0 2px 4px rgba(0,0,0,0.5)', fontFamily, marginBottom: '8px' }}>
                  {eventName || 'My Event'}
                </h3>
                <div style={{ fontSize: '16px', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                  {startDate ? `${monthNames[startDate.getMonth()]} ${startDate.getDate()}, ${startDate.getFullYear()} @ ${formatTime(startTime)} (EDT)` : ''}
                </div>
                <div style={{ fontSize: '14px', color: '#ccc', textShadow: '0 1px 2px rgba(0,0,0,0.5)', marginTop: '4px' }}>America, New York</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '40px' }}>
              <button onClick={() => setShowLaunchModal(false)} style={{ flex: 1, padding: '16px', borderRadius: '12px', background: '#1a1a1a', color: '#fff', border: 'none', fontWeight: 600, fontSize: '16px', cursor: 'pointer' }}>Save draft</button>
              <button onClick={() => { setShowLaunchModal(false); setStep(3); }} style={{ flex: 1, padding: '16px', borderRadius: '12px', background: '#fff', color: '#000', border: 'none', fontWeight: 600, fontSize: '16px', cursor: 'pointer' }}>Launch</button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#C4D383', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 600, textAlign: 'center', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>
            You're live.
          </h1>
          <p style={{ color: '#aaa', fontSize: '16px', textAlign: 'center', marginBottom: '40px', lineHeight: 1.5 }}>
            {eventName || 'My Event'} has been published. Get ready to sell out.
          </p>
          
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button style={{ width: '100%', padding: '16px', borderRadius: '12px', background: '#fff', color: '#000', border: 'none', fontWeight: 600, fontSize: '16px', cursor: 'pointer' }}>
              Share Event
            </button>
            <button onClick={() => setStep(1)} style={{ width: '100%', padding: '16px', borderRadius: '12px', background: '#1a1a1a', color: '#fff', border: 'none', fontWeight: 600, fontSize: '16px', cursor: 'pointer' }}>
              Create Another Event
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
