"use client";
import React, { useState } from 'react';
import { EVI } from './Icons';

type FlowStep = 'type' | 'basics' | 'look' | 'socials' | 'done';

export function CreateProfileFlow({ onComplete, onCancel }: { onComplete: (profile: any) => void, onCancel: () => void }) {
  const [step, setStep] = useState<FlowStep>('type');
  
  // Form State
  const [type, setType] = useState<'club' | 'artist' | 'person' | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [desc, setDesc] = useState('');
  const [avatarColor, setAvatarColor] = useState('#f97316'); // default orange
  const [insta, setInsta] = useState('');
  const [spotify, setSpotify] = useState('');

  const handleNext = () => {
    if (step === 'type') setStep('basics');
    else if (step === 'basics') setStep('look');
    else if (step === 'look') setStep('socials');
    else if (step === 'socials') {
      setStep('done');
      setTimeout(() => {
        onComplete({
          id: `new-${Date.now()}`,
          name,
          category,
          desc,
          type,
          avatarColor,
          followers: '0',
          upcoming: 0,
          memberCount: type === 'club' ? 1 : undefined,
          links: [
            ...(insta ? [{ label: 'Instagram', url: `https://instagram.com/${insta.replace('@','')}`, icon: '📸' }] : []),
            ...(spotify ? [{ label: type === 'artist' ? 'SoundCloud' : 'Website', url: spotify, icon: type === 'artist' ? '🎵' : '🌐' }] : [])
          ]
        });
      }, 1500);
    }
  };

  const getStepNumber = () => {
    switch(step) {
      case 'type': return 1;
      case 'basics': return 2;
      case 'look': return 3;
      case 'socials': return 4;
      default: return 5;
    }
  };

  if (step === 'done') {
    return (
      <div className="screen-fade" style={{ position: 'absolute', inset: 0, zIndex: 100, background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, animation: 'pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}>
          <EVI.Check style={{ width: 40, height: 40 }} />
        </div>
        <h1 style={{ fontSize: 32, fontFamily: 'var(--font-display)', fontWeight: 600, color: '#111', margin: '0 0 12px', animation: 'fadeInUpStatic 0.4s ease forwards', opacity: 0, animationDelay: '0.2s' }}>Profile Created</h1>
        <p style={{ color: '#666', fontSize: 16, animation: 'fadeInUpStatic 0.4s ease forwards', opacity: 0, animationDelay: '0.3s' }}>Taking you to your new page...</p>
      </div>
    );
  }

  return (
    <div className="screen-fade" style={{ position: 'absolute', inset: 0, zIndex: 50, background: '#FAFAF8', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ padding: 'max(env(safe-area-inset-top, 20px), 20px) 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <button onClick={step === 'type' ? onCancel : () => {
          if (step === 'basics') setStep('type');
          if (step === 'look') setStep('basics');
          if (step === 'socials') setStep('look');
        }} style={{ background: 'none', border: 'none', padding: 8, margin: -8, cursor: 'pointer' }}>
          <EVI.Back style={{ width: 24, height: 24, color: '#111' }} />
        </button>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#111', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Step {getStepNumber()} of 4
        </div>
        <div style={{ width: 24 }} /> {/* Spacer */}
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', height: 3, background: 'rgba(0,0,0,0.05)' }}>
        <div style={{ width: `${(getStepNumber() / 4) * 100}%`, height: '100%', background: 'var(--orange)', transition: 'width 0.3s ease' }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 24px 120px' }}>
        
        {step === 'type' && (
          <div className="fade-in">
            <h1 style={{ fontSize: 32, fontFamily: 'var(--font-display)', fontWeight: 600, color: '#111', margin: '0 0 8px', letterSpacing: '-1px' }}>What are you setting up?</h1>
            <p style={{ color: '#666', fontSize: 16, margin: '0 0 32px 0' }}>Choose the type of profile you want to create.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { id: 'club', title: 'Student Organization', desc: 'Clubs, frats, program boards, and societies.', icon: '🏛️' },
                { id: 'artist', title: 'Artist / DJ', desc: 'For performers, bands, and campus DJs.', icon: '🎧' },
                { id: 'person', title: 'Student Host', desc: 'Just you, hosting your own events.', icon: '👋' }
              ].map(opt => (
                <button 
                  key={opt.id}
                  onClick={() => setType(opt.id as any)}
                  style={{ 
                    display: 'flex', alignItems: 'flex-start', gap: 16, padding: 20, 
                    background: type === opt.id ? '#fff' : 'rgba(255,255,255,0.5)', 
                    border: `2px solid ${type === opt.id ? 'var(--ink)' : 'rgba(0,0,0,0.05)'}`, 
                    borderRadius: 16, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' 
                  }}
                >
                  <div style={{ fontSize: 32 }}>{opt.icon}</div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 600, color: '#111', marginBottom: 4 }}>{opt.title}</div>
                    <div style={{ fontSize: 14, color: '#666', lineHeight: 1.4 }}>{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'basics' && (
          <div className="fade-in">
            <h1 style={{ fontSize: 32, fontFamily: 'var(--font-display)', fontWeight: 600, color: '#111', margin: '0 0 8px', letterSpacing: '-1px' }}>The Basics</h1>
            <p style={{ color: '#666', fontSize: 16, margin: '0 0 32px 0' }}>Let's get the essential details down.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder={type === 'club' ? 'e.g. Georgetown Program Board' : type === 'artist' ? 'e.g. DJ Ren' : 'Your name'}
                  style={{ width: '100%', padding: '16px', fontSize: 16, background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 12, outline: 'none' }}
                  autoFocus
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Category</label>
                <input 
                  type="text" 
                  value={category} 
                  onChange={e => setCategory(e.target.value)} 
                  placeholder={type === 'club' ? 'e.g. Greek Life, Performing Arts' : type === 'artist' ? 'e.g. House DJ, Indie Band' : 'e.g. Student'}
                  style={{ width: '100%', padding: '16px', fontSize: 16, background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 12, outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Short Bio</label>
                <textarea 
                  value={desc} 
                  onChange={e => setDesc(e.target.value)} 
                  placeholder="Tell campus what you're all about..."
                  style={{ width: '100%', padding: '16px', fontSize: 16, background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 12, outline: 'none', minHeight: 120, resize: 'none' }}
                />
              </div>
            </div>
          </div>
        )}

        {step === 'look' && (
          <div className="fade-in">
            <h1 style={{ fontSize: 32, fontFamily: 'var(--font-display)', fontWeight: 600, color: '#111', margin: '0 0 8px', letterSpacing: '-1px' }}>Look & Feel</h1>
            <p style={{ color: '#666', fontSize: 16, margin: '0 0 32px 0' }}>Customize your profile's aesthetic.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              
              {/* Live Preview */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Preview</label>
                <div style={{ position: 'relative', height: 120, background: `linear-gradient(160deg, ${avatarColor}, #111)`, borderRadius: 16, overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', bottom: -24, left: 16, width: 64, height: 64, borderRadius: 16, background: avatarColor, border: '3px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20, fontWeight: 700 }}>
                    {(name || 'U').charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Brand Color</label>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {['#f97316', '#ea8ce1', '#71c07f', '#4f46e5', '#e11d48', '#14110d'].map(color => (
                    <button
                      key={color}
                      onClick={() => setAvatarColor(color)}
                      style={{
                        width: 48, height: 48, borderRadius: '50%', background: color, border: 'none', cursor: 'pointer',
                        boxShadow: avatarColor === color ? `0 0 0 3px #FAFAF8, 0 0 0 5px ${color}` : 'none',
                        transition: 'all 0.15s ease'
                      }}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {step === 'socials' && (
          <div className="fade-in">
            <h1 style={{ fontSize: 32, fontFamily: 'var(--font-display)', fontWeight: 600, color: '#111', margin: '0 0 8px', letterSpacing: '-1px' }}>Link Out</h1>
            <p style={{ color: '#666', fontSize: 16, margin: '0 0 32px 0' }}>Where else can people find you?</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Instagram</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 16, top: 16, color: '#888' }}>@</span>
                  <input 
                    type="text" 
                    value={insta} 
                    onChange={e => setInsta(e.target.value)} 
                    placeholder="username"
                    style={{ width: '100%', padding: '16px 16px 16px 40px', fontSize: 16, background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 12, outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                  {type === 'artist' ? 'SoundCloud Link' : 'Website Link'}
                </label>
                <input 
                  type="text" 
                  value={spotify} 
                  onChange={e => setSpotify(e.target.value)} 
                  placeholder="https://"
                  style={{ width: '100%', padding: '16px', fontSize: 16, background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 12, outline: 'none' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Footer */}
      <div style={{ padding: '16px 24px max(env(safe-area-inset-bottom, 24px), 24px)', background: '#fff', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <button 
          onClick={handleNext}
          disabled={
            (step === 'type' && !type) || 
            (step === 'basics' && (!name || !category))
          }
          style={{ 
            width: '100%', padding: 18, background: 'var(--ink)', color: '#fff', 
            fontSize: 15, fontWeight: 600, borderRadius: 100, border: 'none', cursor: 'pointer',
            opacity: ((step === 'type' && !type) || (step === 'basics' && (!name || !category))) ? 0.5 : 1
          }}
        >
          {step === 'socials' ? 'Complete Profile' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
