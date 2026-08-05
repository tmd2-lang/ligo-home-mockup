"use client";
import React, { useState } from 'react';
import { EVI } from './Icons';

type FlowStep = 'type' | 'basics' | 'music' | 'look' | 'preview' | 'done';

const SOUND_GENRE_OPTIONS = [
  'Rage Rap',
  'Atlanta Trap',
  'Jersey Club',
  'House Edits',
  'UK Garage',
  '2000s Throwbacks',
  'Baile Funk',
  'Tech House',
  'Afrobeats',
  'Indie Dance',
  'Hip-Hop Classics',
  'Pop Re-edits'
];

export function CreateProfileFlow({ 
  initialType = null,
  onComplete, 
  onCancel 
}: { 
  initialType?: 'club' | 'artist' | 'person' | null;
  onComplete: (profile: any) => void; 
  onCancel: () => void;
}) {
  const [type, setType] = useState<'club' | 'artist' | 'person' | null>(initialType);
  const [step, setStep] = useState<FlowStep>(initialType ? 'basics' : 'type');
  
  // Basic Form State
  const [name, setName] = useState(type === 'artist' ? 'DJ Bennett' : '');
  const [category, setCategory] = useState(type === 'artist' ? 'Resident DJ · Hip-Hop & House' : '');
  const [desc, setDesc] = useState(
    type === 'artist' 
      ? 'Rage rap early · Atlanta trap late · house when the room turns. High-energy basement sets to 2 AM afters.' 
      : ''
  );
  const [residentBase, setResidentBase] = useState('SigEp Resident DJ');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    type === 'artist' ? ['Rage Rap', 'Atlanta Trap', 'House Edits'] : []
  );

  // Music & Links
  const [mixUrl, setMixUrl] = useState('https://soundcloud.com/bennett-sets/spe-halloweekend-live');
  const [mixTitle, setMixTitle] = useState("SigEp Halloweekend Live '24");
  const [insta, setInsta] = useState('bennettr_dj');
  const [spotify, setSpotify] = useState('');
  const [bookingOpen, setBookingOpen] = useState(true);

  // Look & Aesthetic
  const [avatarColor, setAvatarColor] = useState('#ef4444'); // Rage red for DJ Bennett
  const [avatarImage, setAvatarImage] = useState<string | null>(type === 'artist' ? '/assets/bennet-profile.png' : null);

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      if (selectedGenres.length < 4) {
        setSelectedGenres([...selectedGenres, genre]);
      }
    }
  };

  const handleNext = () => {
    if (step === 'type') {
      if (type === 'artist' && !name) {
        setName('DJ Bennett');
        setCategory('Resident DJ · Hip-Hop & House');
        setDesc('Rage rap early · Atlanta trap late · house when the room turns. High-energy basement sets to 2 AM afters.');
        setAvatarColor('#ef4444');
        setAvatarImage('/assets/bennet-profile.png');
        if (selectedGenres.length === 0) setSelectedGenres(['Rage Rap', 'Atlanta Trap', 'House Edits']);
      }
      setStep('basics');
    } else if (step === 'basics') {
      if (type === 'artist') {
        setStep('music');
      } else {
        setStep('look');
      }
    } else if (step === 'music') {
      setStep('look');
    } else if (step === 'look') {
      setStep('preview');
    } else if (step === 'preview') {
      setStep('done');
      setTimeout(() => {
        const links: { label: string; url: string; icon: string }[] = [];
        if (insta) links.push({ label: 'Instagram', url: `https://instagram.com/${insta.replace('@','')}`, icon: '📸' });
        if (mixUrl) links.push({ label: 'SoundCloud Set', url: mixUrl, icon: '🎧' });
        if (spotify) links.push({ label: 'Spotify', url: spotify, icon: '🎵' });

        onComplete({
          id: type === 'artist' ? `artist-${Date.now()}` : `org-${Date.now()}`,
          name: name || (type === 'artist' ? 'DJ Bennett' : 'Campus Club'),
          initials: name.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase() || 'DJ',
          category: category || (type === 'artist' ? 'Campus DJ' : 'Student Org'),
          desc,
          type: type || 'artist',
          avatarColor,
          avatarImage,
          coverImage: type === 'artist' ? '/artists/playboicarti-profile.jpeg' : undefined,
          genres: selectedGenres,
          residentBase,
          featuredMix: mixUrl ? { title: mixTitle, url: mixUrl } : undefined,
          bookingOpen,
          followers: '148',
          upcoming: 2,
          memberCount: type === 'club' ? 1 : undefined,
          links
        });
      }, 1400);
    }
  };

  const handleBack = () => {
    if (step === 'basics') {
      if (initialType) onCancel();
      else setStep('type');
    } else if (step === 'music') {
      setStep('basics');
    } else if (step === 'look') {
      if (type === 'artist') setStep('music');
      else setStep('basics');
    } else if (step === 'preview') {
      setStep('look');
    } else if (step === 'type') {
      onCancel();
    }
  };

  const totalSteps = type === 'artist' ? 4 : 3;
  const currentStepNum = step === 'basics' ? 1 : step === 'music' ? 2 : step === 'look' ? (type === 'artist' ? 3 : 2) : step === 'preview' ? totalSteps : 1;

  if (step === 'done') {
    return (
      <div className="screen-fade" style={{ position: 'absolute', inset: 0, zIndex: 100, background: '#14110D', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
        <div style={{ width: 88, height: 88, borderRadius: '50%', background: avatarColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: `0 0 32px ${avatarColor}88`, animation: 'pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}>
          <span style={{ fontSize: 40 }}>{type === 'artist' ? '🎧' : '🏛️'}</span>
        </div>
        <h1 style={{ fontSize: 30, fontFamily: 'var(--font-display)', fontWeight: 600, margin: '0 0 12px', letterSpacing: '-0.5px' }}>
          {type === 'artist' ? 'DJ Profile Live' : 'Profile Created'}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, maxWidth: 300, lineHeight: 1.5, margin: 0 }}>
          {type === 'artist' 
            ? `${name} is now registered on Georgetown Explore. Taking you to your artist hub...`
            : `${name} is ready. Taking you to your new page...`}
        </p>
      </div>
    );
  }

  return (
    <div className="screen-fade" style={{ position: 'absolute', inset: 0, zIndex: 60, background: '#FAFAF8', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ padding: 'max(env(safe-area-inset-top, 20px), 20px) 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.05)', background: '#fff' }}>
        <button onClick={handleBack} style={{ background: 'none', border: 'none', padding: 8, margin: -8, cursor: 'pointer' }}>
          <EVI.Back style={{ width: 24, height: 24, color: '#111' }} />
        </button>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#111', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {step === 'type' ? 'Register Host' : `Step ${currentStepNum} of ${totalSteps}`}
        </div>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', fontSize: 14, color: '#888', fontWeight: 500, cursor: 'pointer' }}>
          Cancel
        </button>
      </div>

      {/* Progress Bar */}
      {step !== 'type' && (
        <div style={{ width: '100%', height: 3, background: 'rgba(0,0,0,0.06)' }}>
          <div style={{ width: `${(currentStepNum / totalSteps) * 100}%`, height: '100%', background: avatarColor || 'var(--ligo-orange)', transition: 'width 0.3s ease' }} />
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 20px 120px' }}>
        
        {/* STEP: TYPE SELECTION */}
        {step === 'type' && (
          <div className="fade-in">
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ligo-orange)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              Campus Registration
            </div>
            <h1 style={{ fontSize: 30, fontFamily: 'var(--font-display)', fontWeight: 600, color: '#111', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
              What are you registering?
            </h1>
            <p style={{ color: '#666', fontSize: 15, margin: '0 0 28px 0', lineHeight: 1.4 }}>
              Create an official host entity on the Georgetown Events side.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { 
                  id: 'artist', 
                  title: 'Artist / Campus DJ', 
                  desc: 'For DJs, bands, and solo performers. Post sets, link SoundCloud, and get booked for gigs.', 
                  icon: '🎧',
                  badge: 'Bennett Recommended'
                },
                { 
                  id: 'club', 
                  title: 'Student Organization / Greek', 
                  desc: 'Clubs, fraternities, program boards, and societies with member rosters.', 
                  icon: '🏛️' 
                },
                { 
                  id: 'person', 
                  title: 'Independent Host', 
                  desc: 'Host your own campus parties, pregame kickbacks, or open houses.', 
                  icon: '👋' 
                }
              ].map(opt => (
                <button 
                  key={opt.id}
                  onClick={() => {
                    setType(opt.id as any);
                    if (opt.id === 'artist') {
                      setName('DJ Bennett');
                      setCategory('Resident DJ · Hip-Hop & House');
                      setAvatarColor('#ef4444');
                    }
                  }}
                  style={{ 
                    display: 'flex', alignItems: 'flex-start', gap: 16, padding: 18, 
                    background: type === opt.id ? '#fff' : 'rgba(255,255,255,0.6)', 
                    border: `2px solid ${type === opt.id ? 'var(--ink)' : 'rgba(0,0,0,0.06)'}`, 
                    borderRadius: 18, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                    boxShadow: type === opt.id ? '0 8px 24px rgba(0,0,0,0.06)' : 'none'
                  }}
                >
                  <div style={{ fontSize: 32, lineHeight: 1 }}>{opt.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 17, fontWeight: 600, color: '#111' }}>{opt.title}</span>
                      {opt.badge && (
                        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ligo-orange)', background: 'rgba(249,115,22,0.1)', padding: '2px 8px', borderRadius: 10 }}>
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 13.5, color: '#666', lineHeight: 1.4 }}>{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP: BASICS (TAILORED FOR ARTIST OR CLUB) */}
        {step === 'basics' && (
          <div className="fade-in">
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ligo-orange)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              {type === 'artist' ? 'Stage Identity' : 'Organization Info'}
            </div>
            <h1 style={{ fontSize: 28, fontFamily: 'var(--font-display)', fontWeight: 600, color: '#111', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
              {type === 'artist' ? 'The Stage & Sound' : 'The Basics'}
            </h1>
            <p style={{ color: '#666', fontSize: 15, margin: '0 0 24px 0' }}>
              {type === 'artist' ? 'Define your DJ persona and signature vibe.' : 'Essential details for your campus profile.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#444', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                  {type === 'artist' ? 'Stage / DJ Name' : 'Organization Name'}
                </label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder={type === 'artist' ? 'e.g. DJ Bennett' : 'e.g. Georgetown Program Board'}
                  style={{ width: '100%', padding: '15px 16px', fontSize: 16, background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 14, outline: 'none' }}
                  autoFocus
                />
              </div>

              {type === 'artist' && (
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#444', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                    Campus Base / Resident Status
                  </label>
                  <input 
                    type="text" 
                    value={residentBase} 
                    onChange={e => setResidentBase(e.target.value)} 
                    placeholder="e.g. SigEp Resident DJ · Georgetown DC"
                    style={{ width: '100%', padding: '15px 16px', fontSize: 16, background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 14, outline: 'none' }}
                  />
                </div>
              )}

              {type === 'artist' ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#444', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Sound Signature (Pick up to 4)
                    </label>
                    <span style={{ fontSize: 12, color: '#888' }}>{selectedGenres.length}/4</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {SOUND_GENRE_OPTIONS.map(genre => {
                      const selected = selectedGenres.includes(genre);
                      return (
                        <button
                          key={genre}
                          type="button"
                          onClick={() => toggleGenre(genre)}
                          style={{
                            padding: '8px 14px',
                            borderRadius: 100,
                            fontSize: 13,
                            fontWeight: selected ? 600 : 500,
                            background: selected ? 'var(--ink)' : '#fff',
                            color: selected ? '#fff' : '#444',
                            border: `1px solid ${selected ? 'var(--ink)' : 'rgba(0,0,0,0.1)'}`,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {selected ? '✓ ' : ''}{genre}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#444', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                    Category
                  </label>
                  <input 
                    type="text" 
                    value={category} 
                    onChange={e => setCategory(e.target.value)} 
                    placeholder="e.g. Fraternity, Performing Arts, Student Media"
                    style={{ width: '100%', padding: '15px 16px', fontSize: 16, background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 14, outline: 'none' }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#444', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                  Short Bio / Aux Credo
                </label>
                <textarea 
                  value={desc} 
                  onChange={e => setDesc(e.target.value)} 
                  placeholder={type === 'artist' ? "Describe your set energy, aux philosophy, or favorite artists..." : "Tell campus what your organization does..."}
                  style={{ width: '100%', padding: '14px 16px', fontSize: 15, background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 14, outline: 'none', minHeight: 90, resize: 'none', lineHeight: 1.4 }}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP: MUSIC & MIXES (FOR ARTISTS/DJS) */}
        {step === 'music' && type === 'artist' && (
          <div className="fade-in">
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ligo-orange)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              Audio Proof
            </div>
            <h1 style={{ fontSize: 28, fontFamily: 'var(--font-display)', fontWeight: 600, color: '#111', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
              Mixes & Booking
            </h1>
            <p style={{ color: '#666', fontSize: 15, margin: '0 0 24px 0' }}>
              Give campus a taste of what your sets sound like.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#444', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                  Featured Mix / SoundCloud Link
                </label>
                <input 
                  type="text" 
                  value={mixUrl} 
                  onChange={e => setMixUrl(e.target.value)} 
                  placeholder="https://soundcloud.com/yourname/live-set"
                  style={{ width: '100%', padding: '15px 16px', fontSize: 15, background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 14, outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#444', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                  Featured Set Title
                </label>
                <input 
                  type="text" 
                  value={mixTitle} 
                  onChange={e => setMixTitle(e.target.value)} 
                  placeholder="e.g. SigEp Halloweekend Live '24"
                  style={{ width: '100%', padding: '15px 16px', fontSize: 15, background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 14, outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#444', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                  DJ Instagram Handle
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 16, top: 15, color: '#888', fontSize: 15 }}>@</span>
                  <input 
                    type="text" 
                    value={insta} 
                    onChange={e => setInsta(e.target.value)} 
                    placeholder="bennettr_dj"
                    style={{ width: '100%', padding: '15px 16px 15px 36px', fontSize: 15, background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 14, outline: 'none' }}
                  />
                </div>
              </div>

              {/* Booking availability switch */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.06)' }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>Open for Campus Bookings</div>
                  <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>Show "Book for Gigs / Formals" badge</div>
                </div>
                <button
                  type="button"
                  onClick={() => setBookingOpen(!bookingOpen)}
                  style={{
                    width: 50, height: 30, borderRadius: 20,
                    background: bookingOpen ? 'var(--ligo-orange)' : 'rgba(0,0,0,0.15)',
                    border: 'none', position: 'relative', cursor: 'pointer',
                    transition: 'background 0.2s ease'
                  }}
                >
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', background: '#fff',
                    position: 'absolute', top: 3, left: bookingOpen ? 23 : 3,
                    transition: 'left 0.2s ease', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP: LOOK & THEME */}
        {step === 'look' && (
          <div className="fade-in">
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ligo-orange)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              Visual Aesthetic
            </div>
            <h1 style={{ fontSize: 28, fontFamily: 'var(--font-display)', fontWeight: 600, color: '#111', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
              {type === 'artist' ? 'Booth & Brand Glow' : 'Look & Feel'}
            </h1>
            <p style={{ color: '#666', fontSize: 15, margin: '0 0 24px 0' }}>
              {type === 'artist' ? 'Choose your DJ signature aesthetic.' : 'Set your organization colors and look.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              {/* Card Mini Preview */}
              <div style={{
                position: 'relative',
                height: 140,
                borderRadius: 20,
                background: `linear-gradient(135deg, ${avatarColor}, #14110D)`,
                padding: 16,
                display: 'flex',
                alignItems: 'flex-end',
                boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
                overflow: 'hidden'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, zIndex: 2 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 16, background: '#111',
                    border: '2px solid rgba(255,255,255,0.3)', overflow: 'hidden',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                    fontWeight: 700, fontSize: 20
                  }}>
                    {avatarImage ? (
                      <img src={avatarImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      (name || 'D').charAt(0)
                    )}
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontSize: 18, fontWeight: 600 }}>{name || 'DJ Bennett'}</div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{residentBase || category || 'Resident DJ'}</div>
                  </div>
                </div>
              </div>

              {/* Color Swatches */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#444', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                  Signature Accent Glow
                </label>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {[
                    { hex: '#ef4444', label: 'Rage Red' },
                    { hex: '#f97316', label: 'Ligo Orange' },
                    { hex: '#ea8ce1', label: 'Neon Pink' },
                    { hex: '#8b5cf6', label: 'Electric Purple' },
                    { hex: '#10b981', label: 'Bass Emerald' },
                    { hex: '#14110D', label: 'Obsidian' }
                  ].map(c => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setAvatarColor(c.hex)}
                      style={{
                        width: 44, height: 44, borderRadius: '50%', background: c.hex, border: 'none', cursor: 'pointer',
                        boxShadow: avatarColor === c.hex ? `0 0 0 3px #FAFAF8, 0 0 0 6px ${c.hex}` : 'none',
                        transition: 'all 0.15s ease'
                      }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* STEP: LIVE PREVIEW & LAUNCH */}
        {step === 'preview' && (
          <div className="fade-in">
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ligo-orange)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              Final Review
            </div>
            <h1 style={{ fontSize: 28, fontFamily: 'var(--font-display)', fontWeight: 600, color: '#111', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
              Ready for Explore
            </h1>
            <p style={{ color: '#666', fontSize: 15, margin: '0 0 20px 0' }}>
              Here is how your host profile will appear across campus.
            </p>

            {/* Simulated Public Card */}
            <div style={{ background: '#fff', borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
              
              {/* Card Banner */}
              <div style={{ height: 120, background: `linear-gradient(135deg, ${avatarColor}, #14110D)`, position: 'relative', padding: 16 }}>
                {bookingOpen && (
                  <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600, color: '#111' }}>
                    ⚡ Available for Gigs
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div style={{ padding: '0 20px 20px', position: 'relative' }}>
                <div style={{
                  marginTop: -40, width: 72, height: 72, borderRadius: 18,
                  background: '#111', border: '4px solid #fff', overflow: 'hidden',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                  fontSize: 24, fontWeight: 700, boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
                }}>
                  {avatarImage ? (
                    <img src={avatarImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    (name || 'D').charAt(0)
                  )}
                </div>

                <div style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: '#111', fontFamily: 'var(--font-display)' }}>
                      {name || 'DJ Bennett'}
                    </h2>
                    <span style={{ fontSize: 16 }}>🎧</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#888', marginTop: 2, fontWeight: 500 }}>
                    {residentBase || category}
                  </div>
                </div>

                {/* Sound Genre Tags */}
                {selectedGenres.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
                    {selectedGenres.map(g => (
                      <span key={g} style={{ fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 100, background: 'rgba(20,17,13,0.05)', color: '#333' }}>
                        {g}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bio */}
                <p style={{ fontSize: 14, color: '#555', lineHeight: 1.45, marginTop: 14, marginBottom: 14 }}>
                  {desc}
                </p>

                {/* Audio Mix Teaser */}
                {mixUrl && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'rgba(20,17,13,0.03)', borderRadius: 14, border: '1px solid rgba(20,17,13,0.06)' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                      ▶
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {mixTitle || 'Featured Live Set'}
                      </div>
                      <div style={{ fontSize: 11, color: '#888' }}>SoundCloud Audio Drop</div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Action Button Footer */}
      <div style={{ padding: '16px 20px max(env(safe-area-inset-bottom, 24px), 24px)', background: '#fff', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <button 
          onClick={handleNext}
          disabled={step === 'type' && !type}
          style={{ 
            width: '100%', padding: 18, 
            background: step === 'preview' ? 'var(--ink)' : 'var(--ink)', 
            color: '#fff', 
            fontSize: 16, fontWeight: 600, borderRadius: 100, border: 'none', cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
            opacity: (step === 'type' && !type) ? 0.5 : 1,
            transition: 'all 0.15s ease'
          }}
        >
          {step === 'preview' 
            ? (type === 'artist' ? '🎧 Launch DJ Profile' : '🚀 Launch Organization') 
            : 'Continue'}
        </button>
      </div>
    </div>
  );
}
