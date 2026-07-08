import re
import os

css_path = '/Users/tjdozier7/Downloads/ligo-home-mockup-main/app/globals.css'
with open(css_path, 'r') as f:
    css_content = f.read()

# Remove techy animations if they exist
if '/* ── Techy / Sleek Animations ── */' in css_content:
    css_content = css_content.split('/* ── Techy / Sleek Animations ── */')[0]

# Append new social animations
css_content += """/* ── Trendy Social Animations ── */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
@keyframes aura-spin {
  from { transform: rotate(0deg) scale(1.2); }
  to { transform: rotate(360deg) scale(1.2); }
}
@keyframes pop-in {
  0% { opacity: 0; transform: scale(0.8); }
  60% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes soft-pulse {
  0%, 100% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.02); }
}
"""
with open(css_path, 'w') as f:
    f.write(css_content)

# Patch RevealScreen.tsx
tsx_path = '/Users/tjdozier7/Downloads/ligo-home-mockup-main/components/RevealScreen.tsx'
with open(tsx_path, 'r') as f:
    content = f.read()

old_acts = re.search(r'// ── Shared night label ────────────────────────────────────────────────(.*?)// ── Main RevealScreen ─────────────────────────────────────────────────', content, re.DOTALL)

new_acts = """// ── Shared night label ────────────────────────────────────────────────
function NightLabel({ text, color, dotBg, dotGlow }: { text: string; color: string; dotBg: string; dotGlow: string }) {
  return (
    <span style={{
      fontFamily: FF, fontWeight: 700, fontSize: 13, letterSpacing: '0.08em',
      textTransform: 'uppercase', color,
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: 'rgba(255,255,255,0.1)', padding: '6px 14px', borderRadius: 999,
      backdropFilter: 'blur(10px)'
    } as React.CSSProperties}>
      <span style={{ width: 8, height: 8, borderRadius: 99, background: dotBg, boxShadow: dotGlow, display: 'inline-block' }} />
      {text}
    </span>
  );
}

// ── Act I: Campus Pulse (Floating Album) ──────────────────────────────
function ActCampusPulse({ night, anim }: { night: any; anim: string }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 2,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center', gap: 16,
      padding: '40px 24px 100px', animation: anim,
    }}>
      {/* Sponsor Lockup */}
      <div style={{ position: 'absolute', top: 50, display: 'flex', alignItems: 'center', gap: 6, opacity: 0.9, background: 'rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: 99, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
        <span style={{ fontFamily: FF, fontWeight: 600, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)' }}>Presented by</span>
        <img src="/assets/starbucks-logo.png" alt="Starbucks" style={{ height: 16 }} onError={(e) => (e.currentTarget.style.display = 'none')} />
      </div>

      <NightLabel text="Campus Pulse" color="#F5D783" dotBg="#F5D783" dotGlow="0 0 10px rgba(245,215,131,0.5)" />

      <h3 style={{ fontFamily: FF, fontSize: 18, color: 'rgba(255,255,255,0.7)', marginTop: 24, fontStyle: 'italic' }}>
        &ldquo;{night.question}&rdquo;
      </h3>

      {/* Floating Album Art */}
      <div style={{ position: 'relative', margin: '30px 0', animation: 'float 4s ease-in-out infinite' }}>
        <div style={{ position: 'absolute', inset: -30, background: 'radial-gradient(circle, rgba(245,215,131,0.3) 0%, transparent 70%)', filter: 'blur(20px)', zIndex: 0 }} />
        <img src={night.topArt} alt="Art" style={{ width: 160, height: 160, borderRadius: 24, objectFit: 'cover', boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)', zIndex: 1, position: 'relative' }} />
      </div>

      <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 44, letterSpacing: '-0.03em', lineHeight: 1.05, color: '#FFFFFF', textShadow: '0 4px 20px rgba(0,0,0,0.4)', animation: 'pop-in 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both' }}>
        {night.topSong}
      </div>
      <div style={{ fontFamily: FF, fontSize: 20, color: 'rgba(255,255,255,0.7)', marginTop: 8, fontWeight: 500 }}>
        {night.topArtist}
      </div>
      
      <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
        <div style={{ background: 'rgba(245,215,131,0.15)', border: '1px solid rgba(245,215,131,0.3)', borderRadius: 99, padding: '8px 16px', fontFamily: FF, fontSize: 14, color: '#F5D783', fontWeight: 600, backdropFilter: 'blur(10px)' }}>
          {night.consensusPct}% Consensus
        </div>
        <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 99, padding: '8px 16px', fontFamily: FF, fontSize: 14, color: '#FFFFFF', fontWeight: 600, backdropFilter: 'blur(10px)' }}>
          {night.totalVotes} Votes
        </div>
      </div>
    </div>
  );
}

// ── Act II: Campus Mood (Aura Gradient) ───────────────────────────────
function ActCampusMood({ night, anim }: { night: any; anim: string }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 2,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center',
      padding: '40px 30px', animation: anim, overflow: 'hidden'
    }}>
      {/* Immersive Aura */}
      <div style={{ position: 'absolute', width: '150%', height: '150%', background: 'conic-gradient(from 90deg, #A271FF, #EA8CE1, #F5D783, #A271FF)', filter: 'blur(100px)', opacity: 0.5, animation: 'aura-spin 15s linear infinite', zIndex: 0 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 0 }} />

      <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <NightLabel text="Campus Mood" color="#A271FF" dotBg="#A271FF" dotGlow="0 0 10px rgba(162,113,255,0.5)" />
        
        <h2 style={{
          fontFamily: FF, fontWeight: 700, fontSize: 52, lineHeight: 1.05,
          letterSpacing: '-0.04em', color: '#FFFFFF', margin: '40px 0 20px',
          textShadow: '0 10px 40px rgba(0,0,0,0.5)', animation: 'pop-in 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both'
        }}>
          Georgetown<br/>is feeling<br/><span style={{ color: '#EA8CE1' }}>nostalgic.</span>
        </h2>

        <p style={{ fontFamily: FF, fontSize: 18, color: 'rgba(255,255,255,0.8)', marginTop: 12, lineHeight: 1.4, maxWidth: 280 }}>
          {night.totalVotes} answers painted a picture of homesickness and deep cuts.
        </p>
      </div>
    </div>
  );
}

// ── Act III: Rarity (VIP Card) ────────────────────────────────────────
function ActRarity({ anim }: { anim: string }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 2,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      padding: '40px 24px', animation: anim,
    }}>
      <NightLabel text="Your Identity" color="#EA8CE1" dotBg="#EA8CE1" dotGlow="0 0 10px rgba(234,140,225,0.5)" />
      
      <h2 style={{ fontFamily: FF, fontWeight: 700, fontSize: 36, lineHeight: 1.1, letterSpacing: '-0.03em', color: '#FFFFFF', margin: '30px 0' }}>
        You went against the grain tonight.
      </h2>

      {/* VIP Glass Card */}
      <div style={{ 
        width: '100%', maxWidth: 280, padding: 32, 
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))', 
        borderRadius: 32, border: '1px solid rgba(255,255,255,0.2)', 
        backdropFilter: 'blur(20px)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
        animation: 'float 5s ease-in-out infinite', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, background: '#EA8CE1', filter: 'blur(50px)', opacity: 0.3 }} />
        
        <div style={{ fontFamily: FF, fontWeight: 600, fontSize: 14, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
          Rarity Score
        </div>
        <div style={{ fontFamily: FF, fontWeight: 800, fontSize: 48, color: '#EA8CE1', letterSpacing: '-0.02em', textShadow: '0 4px 20px rgba(234,140,225,0.4)', animation: 'pop-in 0.6s 0.2s both' }}>
          Niche
        </div>
      </div>
      
      <p style={{ fontFamily: FF, fontSize: 16, color: 'rgba(255,255,255,0.7)', marginTop: 30, lineHeight: 1.5, maxWidth: 260 }}>
        You skipped the consensus. Your taste is officially built different.
      </p>
    </div>
  );
}

// ── Act IV: Percentile (Playful Bounce) ───────────────────────────────
function ActPercentile({ anim }: { anim: string }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 2,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      padding: '40px 24px', animation: anim,
    }}>
      <NightLabel text="Personal Standing" color="#EA8CE1" dotBg="#EA8CE1" dotGlow="0 0 10px rgba(234,140,225,0.5)" />
      
      <div style={{ marginTop: 60, marginBottom: 40, position: 'relative' }}>
        <div style={{ position: 'absolute', top: -20, right: -30, fontSize: 40, animation: 'float 3s ease-in-out infinite' }}>🔥</div>
        <div style={{ position: 'absolute', bottom: -10, left: -40, fontSize: 32, animation: 'float 4s ease-in-out infinite 1s' }}>✨</div>
        
        <div style={{ fontSize: 120, fontWeight: 800, fontFamily: FF, color: '#EA8CE1', lineHeight: 0.9, letterSpacing: '-0.05em', textShadow: '0 20px 50px rgba(234,140,225,0.4)', animation: 'pop-in 0.5s cubic-bezier(0.3, 1.5, 0.4, 1) both' }}>
          7%
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, fontFamily: FF, color: '#fff', letterSpacing: '-0.02em', marginTop: 12 }}>
          Top Percentile
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '16px 24px', borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: 12, backdropFilter: 'blur(10px)' }}>
        <span style={{ fontSize: 24 }}>🧑‍🤝‍🧑</span>
        <span style={{ fontFamily: FF, fontSize: 18, color: '#fff', fontWeight: 600 }}>You and 47 others</span>
      </div>

      <p style={{ fontFamily: FF, fontSize: 16, color: 'rgba(255,255,255,0.7)', margin: '24px 0 0', maxWidth: 260 }}>
        picked deep cuts tonight. Your people are out there.
      </p>
    </div>
  );
}

// ── Act V: Social Proof (Overlapping Avatars) ─────────────────────────
function ActSocialProof({ night, anim }: { night: any; anim: string }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 2,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      padding: '40px 24px', animation: anim,
    }}>
      <NightLabel text="Network Pulse" color="#71C07F" dotBg="#71C07F" dotGlow="0 0 10px rgba(113,192,127,0.5)" />
      
      <h2 style={{ fontFamily: FF, fontWeight: 700, fontSize: 38, lineHeight: 1.05, letterSpacing: '-0.03em', color: '#FFFFFF', margin: '40px 0' }}>
        Nobody in your network agreed with you.
      </h2>
      
      {/* Overlapping Avatars */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
        <img src="/assets/Charlotte-Profile.png" style={{ width: 80, height: 80, borderRadius: 99, objectFit: 'cover', border: '4px solid #111', zIndex: 2, boxShadow: '0 10px 20px rgba(0,0,0,0.4)', animation: 'pop-in 0.4s both' }} />
        <img src="/assets/Cole-profile.png" style={{ width: 80, height: 80, borderRadius: 99, objectFit: 'cover', border: '4px solid #111', marginLeft: -24, zIndex: 1, boxShadow: '0 10px 20px rgba(0,0,0,0.4)', animation: 'pop-in 0.4s 0.1s both' }} />
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 300, marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.1)', padding: '12px 20px', borderRadius: 16, backdropFilter: 'blur(10px)' }}>
          <span style={{ fontFamily: FF, fontWeight: 600, fontSize: 16, color: '#fff' }}>Charlotte</span>
          <span style={{ fontFamily: FF, fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>SZA (40%)</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.1)', padding: '12px 20px', borderRadius: 16, backdropFilter: 'blur(10px)' }}>
          <span style={{ fontFamily: FF, fontWeight: 600, fontSize: 16, color: '#fff' }}>Cole</span>
          <span style={{ fontFamily: FF, fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>Drake (28%)</span>
        </div>
      </div>

      <p style={{ fontFamily: FF, fontSize: 16, color: 'rgba(255,255,255,0.7)', maxWidth: 280 }}>
        You're completely isolated from your friends tonight. Your taste is yours alone.
      </p>
    </div>
  );
}

// ── Act VI: Forward Hook (Hype Countdown) ────────────────────────────
function ActForwardHook({ night, anim, dayIndex }: { night: any; anim: string; dayIndex: number }) {
  const [now, setNow] = React.useState(Date.now());
  React.useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const nextReveal = (() => {
    const d = new Date(now);
    d.setHours(20, 0, 0, 0);
    if (d.getTime() <= now) d.setDate(d.getDate() + 1);
    return d.getTime();
  })();
  const ms = Math.max(0, nextReveal - now);
  const h  = Math.floor(ms / 3600000);
  const m  = Math.floor((ms % 3600000) / 60000);
  const s  = Math.floor((ms % 60000) / 1000);
  const countdown = `${h}h ${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`;

  const streakCount = Math.min(dayIndex + 1, 7);

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 2,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      padding: '40px 24px', animation: anim,
    }}>
      <NightLabel text="Tomorrow · 8 PM" color="#F5D783" dotBg="#F5D783" dotGlow="0 0 10px rgba(245,215,131,0.5)" />
      
      <div style={{ margin: '50px 0', animation: 'soft-pulse 3s infinite' }}>
        <div style={{ fontFamily: FF, fontWeight: 800, fontSize: 64, letterSpacing: '-0.04em', lineHeight: 1, color: '#F5D783', textShadow: '0 10px 40px rgba(245,215,131,0.4)' }}>
          {countdown}
        </div>
        <div style={{ fontFamily: FF, fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginTop: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Until Lock-In
        </div>
      </div>

      <div style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))', border: '1px solid rgba(255,255,255,0.2)', padding: '16px 24px', borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 40, backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
        <span style={{ fontSize: 28, filter: 'drop-shadow(0 0 10px rgba(255,100,0,0.8))' }}>🔥</span>
        <span style={{ fontFamily: FF, fontWeight: 700, fontSize: 20, color: '#fff' }}>{streakCount} Day Streak</span>
      </div>

      <h2 style={{ fontFamily: FF, fontWeight: 700, fontSize: 26, lineHeight: 1.15, letterSpacing: '-0.03em', color: '#FFFFFF', maxWidth: 280 }}>
        {night.tomorrowTeaser}
      </h2>
    </div>
  );
}

// ── Act VII: Sponsor CTA (High-End Loyalty) ───────────────────────────
function ActSponsorCTA({ anim }: { anim: string }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 2,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      padding: '40px 24px', animation: anim,
    }}>
      <div style={{ 
        width: '100%', maxWidth: 320, background: 'linear-gradient(145deg, #00704A 0%, #00452C 100%)', 
        borderRadius: 32, padding: '40px 24px', 
        boxShadow: '0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.3)',
        border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Soft glow behind logo */}
        <div style={{ position: 'absolute', top: 20, width: 120, height: 120, background: '#fff', borderRadius: 99, filter: 'blur(40px)', opacity: 0.2 }} />
        
        <div style={{ width: 80, height: 80, background: '#fff', borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: '0 10px 20px rgba(0,0,0,0.3)', zIndex: 1 }}>
          <img src="/assets/starbucks-logo.png" alt="Starbucks" style={{ width: 60, height: 60, objectFit: 'contain' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
        </div>
        
        <h2 style={{ fontFamily: FF, fontWeight: 800, fontSize: 32, lineHeight: 1.05, letterSpacing: '-0.03em', color: '#FFFFFF', marginBottom: 12, zIndex: 1 }}>
          Starbucks fuels Georgetown.
        </h2>
        
        <p style={{ fontFamily: FF, fontSize: 16, color: 'rgba(255,255,255,0.9)', marginBottom: 32, lineHeight: 1.4, zIndex: 1 }}>
          Reveal complete. Grab 50% off your next cold brew on us.
        </p>
        
        <button style={{
          width: '100%', height: 56, border: 0, borderRadius: 999, background: '#FFFFFF', color: '#00704A',
          fontFamily: FF, fontWeight: 800, fontSize: 16, cursor: 'pointer',
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)', zIndex: 1, transition: 'transform 0.2s'
        }} onClick={() => alert('Opens Starbucks App')} onPointerDown={(e) => e.currentTarget.style.transform = 'scale(0.96)'} onPointerUp={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          Redeem in App
        </button>
      </div>
    </div>
  );
}

// ── Share sheet (Festival Poster Recap) ───────────────────────────────
function ShareSheet({ act, night, onClose }: { act: number; night: any; onClose: () => void }) {
  return (
    <>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.5)', animation: 'fadeIn 220ms ease both', backdropFilter: 'blur(15px)' }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 61,
        background: '#FAF9F6', borderRadius: '32px 32px 0 0',
        padding: '12px 24px 36px',
        animation: `sheetUp 400ms cubic-bezier(0.2, 0.8, 0.2, 1) both`,
      }}>
        <div style={{ width: 40, height: 5, borderRadius: 99, background: 'rgba(0,0,0,0.1)', margin: '0 auto 24px' }} />
        
        {/* The Poster Card */}
        <div id="share-card" style={{ background: 'linear-gradient(135deg, #111316, #0A0806)', borderRadius: 24, padding: '32px 24px', marginBottom: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontFamily: FF, fontWeight: 800, fontSize: 36, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>Ligo Reveal</div>
            <div style={{ fontFamily: FF, fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>Georgetown University</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Stat Row */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontFamily: FF, fontSize: 12, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 600 }}>Campus Pick</span>
                <span style={{ fontFamily: FF, fontWeight: 700, fontSize: 18, color: '#F5D783' }}>{night.topArtist}</span>
              </div>
              <img src={night.topArt} style={{ width: 40, height: 40, borderRadius: 8 }} />
            </div>

            {/* Stat Row */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontFamily: FF, fontSize: 12, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 600 }}>Campus Mood</span>
                <span style={{ fontFamily: FF, fontWeight: 700, fontSize: 18, color: '#A271FF' }}>Nostalgic</span>
              </div>
              <span style={{ fontSize: 24 }}>💭</span>
            </div>

            {/* Stat Row */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontFamily: FF, fontSize: 12, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 600 }}>Your Taste</span>
                <span style={{ fontFamily: FF, fontWeight: 700, fontSize: 18, color: '#EA8CE1' }}>Top 7% Niche</span>
              </div>
              <span style={{ fontSize: 24 }}>✨</span>
            </div>
          </div>

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: FF, fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Presented by</span>
              <img src="/assets/starbucks-logo.png" alt="Starbucks" style={{ height: 18, filter: 'grayscale(1) brightness(1.5)' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
            </div>
            <span style={{ fontFamily: FF, fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>10/24/23</span>
          </div>
        </div>

        <button onClick={onClose} style={{ width: '100%', height: 56, border: 0, borderRadius: 16, background: '#000', color: '#fff', fontFamily: FF, fontWeight: 800, fontSize: 16, cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
          Share to Instagram Story
        </button>
      </div>
    </>
  );
}

// ── Main RevealScreen ─────────────────────────────────────────────────"""

content = content.replace(old_acts.group(0), new_acts)

with open(tsx_path, 'w') as f:
    f.write(content)

print("Patch social complete")
