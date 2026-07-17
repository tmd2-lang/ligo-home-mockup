import React, { useState } from 'react';
import { EventItem, Organization, MOCK_ORGANIZATIONS } from '../../lib/mockEventsData';
import { EVI } from './Icons';

type DistributionMode = 'members_only' | 'invite_only' | 'campus' | 'public';

const TIME_OPTIONS = Array.from({ length: 24 * 2 }).map((_, i) => {
  const h = Math.floor(i / 2);
  const m = (i % 2) * 30;
  const period = h < 12 ? 'AM' : 'PM';
  const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const displayMin = m === 0 ? '00' : m;
  const valueStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  const displayStr = `${displayHour}:${displayMin} ${period}`;
  return { value: valueStr, label: displayStr };
});

export function CreateEventSheet({ club, onClose, onPublish, currentUserId }: { club: Organization, onClose: () => void, onPublish: (e: Partial<EventItem>, isDraft: boolean) => void, currentUserId: string }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [venue, setVenue] = useState('');
  const [summary, setSummary] = useState('');
  const [capacityToggle, setCapacityToggle] = useState(false);
  const [capacity, setCapacity] = useState<number | ''>('');
  const [flyerUrl, setFlyerUrl] = useState<string | null>('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop');
  const [mode, setMode] = useState<DistributionMode | null>(null);
  const [selectedSubgroups, setSelectedSubgroups] = useState<string[]>(() => {
    const all = club.groups.find(g => g.name === 'All Members');
    return all ? [all.id] : [];
  });
  const [selectedGuests, setSelectedGuests] = useState<Array<{id: string, name: string, type: 'user'|'org'}>>([]);

  const handleNext = () => setStep(s => s + 1);
  
  const finish = (draft = false) => {
    onPublish({
      id: 'new-' + Date.now(),
      name: name,
      host: club.name,
      hostOrganizationId: club.id,
      day: date,
      time: time,
      endTime: endTime || undefined,
      venue: venue,
      summary: summary || undefined,
      capacity: capacityToggle && capacity !== '' ? Number(capacity) : undefined,
      flyerUrl: flyerUrl || undefined,
      visibility: mode || 'members_only',
      inviteOnly: mode === 'invite_only',
      selectedSubgroups: mode === 'members_only' ? selectedSubgroups : undefined,
      selectedGuests: mode === 'invite_only' ? selectedGuests : undefined,
      color: '#f5d783',
      tag: 'Social',
      tags: ['Social'],
      tagBg: '#0a0907',
      tagFg: '#fff',
      goingCount: 1,
      pendingCount: 0,
      currentUserStatus: 'hosting'
    }, draft);
  };

  return (
    <div className="sheet-backdrop" style={{ position: 'absolute', inset: 0, background: 'rgba(20,17,13,0.4)', zIndex: 50, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div className="sheet-content screen-fade" style={{ background: 'var(--ligo-paper)', height: '90%', borderRadius: '24px 24px 0 0', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ padding: '24px 20px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--ink)' }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink)', cursor: 'pointer' }}>Cancel</button>
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(20,17,13,0.4)' }}>
            Step {step} of 3
          </div>
          <button onClick={() => finish(true)} style={{ background: 'none', border: 'none', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--orange)', cursor: 'pointer' }}>Save Draft</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '40px 20px' }}>
          {step === 1 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
                <h2 style={{ fontSize: 40, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--ink)', lineHeight: 1, textTransform: 'uppercase', margin: 0 }}>The Basics</h2>
                {club.id === 'sigma_phi_epsilon' && (
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      setName('Saturday Darty ☀️');
                      setDate('Saturday, September 19, 2026');
                      setTime('2:00 PM');
                      setEndTime('6:00 PM');
                      setVenue('SigEp House');
                      setSummary("The forecast says 75 and sunny, so we're doing what we always do. Backyard open, speakers turned all the way up, drinks on ice, and everyone's invited. Hydrate now. You'll thank yourself later. Backyard opens at 2. See you there. Grab your roommates and send it.");
                      setFlyerUrl('/posh/SigEpFrat.png');
                    }}
                    style={{ background: 'rgba(20,17,13,0.05)', color: 'var(--ink)', border: 'none', padding: '8px 16px', borderRadius: 16, fontSize: 11, fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                  >
                    Autofill Darty
                  </button>
                )}
              </div>
              
              <div style={{ marginBottom: 32 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(20,17,13,0.4)', marginBottom: 12 }}>Upload Flyer</label>
                <div style={{ width: '100%', aspectRatio: '3/4', background: flyerUrl ? `url(${flyerUrl}) center/cover` : 'rgba(20,17,13,0.05)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', border: flyerUrl ? 'none' : '2px dashed rgba(20,17,13,0.2)' }}>
                  {!flyerUrl ? (
                    <div style={{ color: 'rgba(20,17,13,0.4)', fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <EVI.Plus style={{ width: 24, height: 24 }} />
                      Upload Flyer
                    </div>
                  ) : (
                    <>
                      <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.9)', color: 'var(--ink)', padding: '8px 12px', borderRadius: 20, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', pointerEvents: 'none' }}>
                        Replace
                      </div>
                      <button onClick={(e) => { e.preventDefault(); setFlyerUrl('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop'); }} style={{ position: 'absolute', top: 16, left: 16, width: 32, height: 32, borderRadius: 16, background: 'rgba(255,255,255,0.9)', color: 'var(--ink)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10 }}>
                        <EVI.Close style={{ width: 14, height: 14 }} />
                      </button>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={e => {
                    if (e.target.files?.[0]) setFlyerUrl(URL.createObjectURL(e.target.files[0]));
                  }} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                </div>
              </div>

              <div style={{ marginBottom: 32 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(20,17,13,0.4)', marginBottom: 12 }}>Event Name</label>
                <input 
                  type="text" 
                  placeholder="E.g. Fall Concert" 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  style={{ width: '100%', fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-display)', border: 'none', borderBottom: '2px solid var(--ink)', background: 'transparent', padding: '8px 0', outline: 'none', color: 'var(--ink)', textTransform: 'uppercase' }} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 32 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(20,17,13,0.4)', marginBottom: 12 }}>Date</label>
                  <input type="text" placeholder="Sat, Dec 12" value={date} onChange={e => setDate(e.target.value)} style={{ width: '100%', fontSize: 16, fontWeight: 800, color: 'var(--ink)', border: 'none', borderBottom: '2px solid rgba(20,17,13,0.2)', paddingBottom: 8, background: 'transparent', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(20,17,13,0.4)', marginBottom: 12 }}>Start Time</label>
                  <input type="text" placeholder="10:00 PM" value={time} onChange={e => setTime(e.target.value)} style={{ width: '100%', fontSize: 16, fontWeight: 800, color: 'var(--ink)', border: 'none', borderBottom: '2px solid rgba(20,17,13,0.2)', paddingBottom: 8, background: 'transparent', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(20,17,13,0.4)', marginBottom: 12 }}>End Time</label>
                  <input type="text" placeholder="1:00 AM" value={endTime} onChange={e => setEndTime(e.target.value)} style={{ width: '100%', fontSize: 16, fontWeight: 800, color: 'var(--ink)', border: 'none', borderBottom: '2px solid rgba(20,17,13,0.2)', paddingBottom: 8, background: 'transparent', outline: 'none' }} />
                </div>
              </div>

              <div style={{ marginBottom: 32 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(20,17,13,0.4)', marginBottom: 12 }}>Location</label>
                <input type="text" placeholder="E.g. The Tombs" value={venue} onChange={e => setVenue(e.target.value)} style={{ width: '100%', fontSize: 16, fontWeight: 800, color: 'var(--ink)', border: 'none', borderBottom: '2px solid rgba(20,17,13,0.2)', paddingBottom: 8, background: 'transparent', outline: 'none' }} />
              </div>

              <div style={{ marginBottom: 32 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(20,17,13,0.4)', marginBottom: 12 }}>Event Summary</label>
                <textarea 
                  placeholder="What should people know?" 
                  value={summary} 
                  onChange={e => setSummary(e.target.value)}
                  style={{ width: '100%', fontSize: 16, fontWeight: 500, color: 'var(--ink)', border: '2px solid rgba(20,17,13,0.1)', borderRadius: 12, padding: 16, background: 'transparent', outline: 'none', resize: 'none', minHeight: 100 }} 
                />
              </div>

              <div style={{ marginBottom: capacityToggle ? 16 : 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>Limit Capacity</label>
                <button onClick={() => setCapacityToggle(!capacityToggle)} style={{ width: 44, height: 24, borderRadius: 12, background: capacityToggle ? 'var(--orange)' : 'rgba(20,17,13,0.1)', border: 'none', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}>
                  <div style={{ width: 20, height: 20, borderRadius: 10, background: '#fff', position: 'absolute', top: 2, left: capacityToggle ? 22 : 2, transition: 'left 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                </button>
              </div>
              
              {capacityToggle && (
                <div style={{ marginBottom: 32 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(20,17,13,0.4)', marginBottom: 12 }}>Max Capacity</label>
                  <input type="number" placeholder="150" value={capacity} onChange={e => setCapacity(e.target.value ? Number(e.target.value) : '')} style={{ width: '100%', fontSize: 16, fontWeight: 800, color: 'var(--ink)', border: 'none', borderBottom: '2px solid var(--ink)', paddingBottom: 8, background: 'transparent', outline: 'none' }} />
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ fontSize: 40, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--ink)', lineHeight: 1, textTransform: 'uppercase', marginBottom: 16 }}>Distribution</h2>
              <div style={{ fontSize: 16, color: 'rgba(20,17,13,0.6)', fontWeight: 500, marginBottom: 40 }}>Who gets to see and attend this event?</div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { id: 'members_only', title: 'Members Only', desc: `Only visible to members of ${club.name}.` },
                  { id: 'invite_only', title: 'Invited Guests', desc: 'Private event. Guests cannot invite others.' },
                  { id: 'campus', title: 'Georgetown', desc: 'Visible on the Explore feed at Georgetown.' },
                  { id: 'public', title: 'Public & Cross-Campus', desc: 'Visible to everyone in the DC network.' }
                ].map(m => (
                  <div key={m.id}>
                    <button 
                      onClick={() => setMode(m.id as DistributionMode)}
                      style={{ 
                        width: '100%',
                        padding: 24, 
                        background: mode === m.id ? 'var(--ink)' : 'transparent',
                        color: mode === m.id ? '#fff' : 'var(--ink)',
                        border: mode === m.id ? '2px solid var(--ink)' : '2px solid rgba(20,17,13,0.2)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        borderRadius: 16
                      }}>
                      <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-display)', textTransform: 'uppercase', marginBottom: 8 }}>{m.title}</div>
                      <div style={{ fontSize: 14, color: mode === m.id ? 'rgba(255,255,255,0.7)' : 'rgba(20,17,13,0.6)', fontWeight: 500 }}>{m.desc}</div>
                    </button>
                    
                    {mode === m.id && m.id === 'members_only' && (
                      <div style={{ marginTop: 12, padding: '16px 24px', background: 'rgba(20,17,13,0.03)', borderRadius: 16 }}>
                        {club.groups.map(g => {
                          const isAllMembers = g.name === 'All Members';
                          const isAlumni = g.name === 'Alumni';
                          const allMembersChecked = selectedSubgroups.includes(club.groups.find(x => x.name === 'All Members')?.id || '');
                          
                          const isChecked = selectedSubgroups.includes(g.id) || (allMembersChecked && !isAllMembers && !isAlumni);
                          const isDisabled = allMembersChecked && !isAllMembers && !isAlumni;

                          return (
                            <label key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', cursor: isDisabled ? 'default' : 'pointer', opacity: isDisabled ? 0.5 : 1 }}>
                              <input 
                                type="checkbox" 
                                checked={isChecked} 
                                disabled={isDisabled}
                                onChange={() => {
                                  if (isAllMembers) {
                                    if (allMembersChecked) {
                                      setSelectedSubgroups(prev => prev.filter(id => id === club.groups.find(x => x.name === 'Alumni')?.id));
                                    } else {
                                      setSelectedSubgroups(prev => [...prev, g.id]);
                                    }
                                  } else {
                                    if (selectedSubgroups.includes(g.id)) {
                                      setSelectedSubgroups(prev => prev.filter(id => id !== g.id));
                                    } else {
                                      setSelectedSubgroups(prev => [...prev, g.id]);
                                    }
                                  }
                                }}
                                style={{ width: 20, height: 20, accentColor: 'var(--ink)' }}
                              />
                              <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--ink)' }}>{g.name} ({g.memberCount})</span>
                            </label>
                          );
                        })}
                        <div style={{ marginTop: 16, fontSize: 14, fontWeight: 700, color: 'var(--ink)', paddingTop: 16, borderTop: '1px solid rgba(20,17,13,0.1)' }}>
                          {(() => {
                            const allMembers = club.groups.find(g => g.name === 'All Members');
                            const alumni = club.groups.find(g => g.name === 'Alumni');
                            const allMembersChecked = allMembers && selectedSubgroups.includes(allMembers.id);
                            const alumniChecked = alumni && selectedSubgroups.includes(alumni.id);
                            
                            let count = 0;
                            if (allMembersChecked) {
                              count += allMembers.memberCount;
                            } else {
                              count += club.groups.filter(g => g.name !== 'All Members' && g.name !== 'Alumni' && selectedSubgroups.includes(g.id)).reduce((acc, g) => acc + g.memberCount, 0);
                            }
                            if (alumniChecked && alumni) count += alumni.memberCount;
                            
                            return `Invites ${count} members · hidden from everyone else.`;
                          })()}
                        </div>
                      </div>
                    )}

                    {mode === m.id && m.id === 'invite_only' && (
                      <div style={{ marginTop: 12, padding: '16px 24px', background: 'rgba(20,17,13,0.03)', borderRadius: 16 }}>
                        {selectedGuests.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                            {selectedGuests.map(g => (
                              <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--ink)', color: '#fff', padding: '6px 10px 6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
                                {g.name}
                                <button onClick={() => setSelectedGuests(prev => prev.filter(x => x.id !== g.id))} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
                                  <EVI.Close style={{ width: 14, height: 14 }} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div style={{ border: '1px solid rgba(20,17,13,0.1)', borderRadius: 12, background: '#fff', overflow: 'hidden' }}>
                          {[
                            { id: 'charlotte', name: 'Charlotte', type: 'user' as const },
                            { id: 'jordan', name: 'Jordan', type: 'user' as const },
                            { id: 'marcus', name: 'Marcus', type: 'user' as const },
                            { id: 'sofia', name: 'Sofia', type: 'user' as const },
                            ...Object.values(MOCK_ORGANIZATIONS).filter(o => o.id !== club.id).map(o => ({ id: o.id, name: o.name, type: 'org' as const }))
                          ].filter(g => !selectedGuests.some(x => x.id === g.id) && g.id !== currentUserId).slice(0, 5).map(g => (
                            <button 
                              key={g.id}
                              onClick={() => setSelectedGuests(prev => [...prev, g])}
                              style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', borderBottom: '1px solid rgba(20,17,13,0.05)', cursor: 'pointer', textAlign: 'left' }}
                            >
                              <div style={{ width: 32, height: 32, borderRadius: g.type === 'org' ? 6 : 16, background: 'rgba(20,17,13,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: 'var(--ink)' }}>
                                {g.name.charAt(0)}
                              </div>
                              <div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{g.name}</div>
                                <div style={{ fontSize: 12, color: 'rgba(20,17,13,0.4)', fontWeight: 600 }}>{g.type === 'org' ? 'Group' : 'Person'}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                        
                        <div style={{ marginTop: 16, fontSize: 14, fontWeight: 700, color: 'var(--ink)', paddingTop: 16, borderTop: '1px solid rgba(20,17,13,0.1)' }}>
                          Invites {selectedGuests.length} guests · hidden from everyone else.
                        </div>
                      </div>
                    )}

                    {mode === m.id && m.id === 'campus' && (
                      <div style={{ marginTop: 12, fontSize: 14, color: 'rgba(20,17,13,0.6)', fontWeight: 500, padding: '0 8px' }}>
                        Discoverable by everyone at Georgetown. No invitations sent.
                      </div>
                    )}

                    {mode === m.id && m.id === 'public' && (
                      <div style={{ marginTop: 12, fontSize: 14, color: 'rgba(20,17,13,0.6)', fontWeight: 500, padding: '0 8px' }}>
                        Discoverable by everyone on and beyond campus. No invitations sent.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 style={{ fontSize: 40, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--ink)', lineHeight: 1, textTransform: 'uppercase', marginBottom: 40 }}>Review</h2>
              
              <div style={{ background: '#fff', borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(20,17,13,0.1)', marginBottom: 40 }}>
                {/* Flyer */}
                <div style={{ width: '100%', aspectRatio: '3/4', background: flyerUrl ? `url(${flyerUrl}) center/cover` : 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {!flyerUrl && <EVI.Grid style={{ width: 48, height: 48, color: 'rgba(255,255,255,0.2)' }} />}
                </div>
                
                {/* Details */}
                <div style={{ padding: 24 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--orange)', marginBottom: 8 }}>Ready to Publish</div>
                  <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'var(--font-display)', textTransform: 'uppercase', lineHeight: 1, marginBottom: 16 }}>{name}</div>
                  
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                    {date} • {time}{endTime ? `–${endTime}` : ''}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'rgba(20,17,13,0.6)', marginBottom: 24 }}>
                    {venue}
                  </div>
                  
                  {summary && (
                    <div style={{ fontSize: 15, color: 'rgba(20,17,13,0.8)', lineHeight: 1.5, marginBottom: 32 }}>
                      {summary}
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', gap: 16, marginBottom: capacityToggle && capacity ? 16 : 0 }}>
                    <EVI.Globe style={{ color: 'var(--orange)', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(20,17,13,0.4)', marginBottom: 4 }}>Audience</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>
                        {(() => {
                          if (mode === 'members_only') {
                            const allMembers = club.groups.find(g => g.name === 'All Members');
                            if (allMembers && selectedSubgroups.includes(allMembers.id)) {
                              return `${club.name} · All Members`;
                            } else {
                              const selNames = club.groups.filter(g => selectedSubgroups.includes(g.id)).map(g => g.name).join(', ');
                              return `${club.name} · ${selNames || 'None'}`;
                            }
                          }
                          if (mode === 'invite_only') return `${selectedGuests.length} guests invited`;
                          if (mode === 'campus') return 'Everyone at Georgetown';
                          if (mode === 'public') return 'Public · cross-campus';
                          return '';
                        })()}
                      </div>
                    </div>
                  </div>

                  {capacityToggle && capacity !== '' && (
                    <div style={{ display: 'flex', gap: 16 }}>
                      <EVI.Check style={{ color: 'var(--orange)', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(20,17,13,0.4)', marginBottom: 4 }}>Capacity</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{capacity} people</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: 20, borderTop: '2px solid rgba(20,17,13,0.1)' }}>
          {step < 3 ? (
            <button 
              onClick={handleNext} 
              disabled={(step === 1 && (!name.trim() || !date.trim() || !time.trim() || !venue.trim())) || (step === 2 && !mode)} 
              style={{ width: '100%', padding: '20px', background: ((step === 1 && (!name.trim() || !date.trim() || !time.trim() || !venue.trim())) || (step === 2 && !mode)) ? 'rgba(20,17,13,0.1)' : 'var(--ink)', color: ((step === 1 && (!name.trim() || !date.trim() || !time.trim() || !venue.trim())) || (step === 2 && !mode)) ? 'rgba(20,17,13,0.4)' : '#fff', fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none', cursor: 'pointer', borderRadius: 16 }}>
              Next Step
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => finish(true)} style={{ flex: 1, padding: 20, borderRadius: 16, background: 'rgba(20,17,13,0.05)', color: 'var(--ink)', fontSize: 16, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none', cursor: 'pointer' }}>
                Save Draft
              </button>
              <button onClick={() => finish(false)} style={{ flex: 1, padding: 20, borderRadius: 16, background: 'var(--ink)', color: '#fff', fontSize: 16, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none', cursor: 'pointer' }}>
                Publish
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
