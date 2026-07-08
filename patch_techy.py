import re

with open('/Users/tjdozier7/Downloads/ligo-home-mockup-main/components/RevealScreen.tsx', 'r') as f:
    content = f.read()

# Match everything from `// ── Shared night label` down to `// ── Main RevealScreen`
old_acts = re.search(r'// ── Shared night label ────────────────────────────────────────────────(.*?)// ── Main RevealScreen ─────────────────────────────────────────────────', content, re.DOTALL)

new_acts = """// ── Shared night label ────────────────────────────────────────────────
function NightLabel({ text, color, dotBg, dotGlow }: { text: string; color: string; dotBg: string; dotGlow: string }) {
  return (
    <span style={{
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
      fontWeight: 700, fontSize: 10, letterSpacing: '0.15em',
      textTransform: 'uppercase', color,
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: `rgba(255,255,255,0.03)`, padding: '4px 10px', borderRadius: 6,
      border: `1px solid ${color}40`,
      boxShadow: `0 0 10px ${dotGlow}`
    } as React.CSSProperties}>
      <span style={{ width: 6, height: 6, borderRadius: 99, background: dotBg, boxShadow: dotGlow, display: 'inline-block', animation: 'neon-flicker 3s infinite alternate' }} />
      {text}
    </span>
  );
}

// ── Act I: Campus Pulse (Bento & Radar) ──────────────────────────────
function ActCampusPulse({ night, anim }: { night: any; anim: string }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 2,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 16,
      padding: '40px 24px 100px', animation: anim,
    }}>
      {/* Sponsor Lockup */}
      <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6, opacity: 0.9, background: 'rgba(0,0,0,0.5)', padding: '6px 14px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)' }}>
        <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>SYS.SPNSR</span>
        <img src="/assets/starbucks-logo.png" alt="Starbucks" style={{ height: 16 }} onError={(e) => (e.currentTarget.style.display = 'none')} />
      </div>

      <NightLabel text="SYS.PULSE" color="#F5D783" dotBg="#F5D783" dotGlow="rgba(245,215,131,0.5)" />

      {/* Bento Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%', maxWidth: 320, marginTop: 12 }}>
        
        {/* Radar Map */}
        <div style={{ gridColumn: '1 / -1', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundSize: '20px 20px', backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)', zIndex: 0 }} />
          
          <div style={{ position: 'relative', width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
            {/* Radar Sweep */}
            <div style={{ position: 'absolute', inset: -20, borderRadius: 999, background: 'conic-gradient(from 0deg, transparent 70%, rgba(245,215,131,0.4) 100%)', animation: 'radar-sweep 4s linear infinite' }} />
            <div style={{ position: 'absolute', inset: -20, borderRadius: 999, border: '1px solid rgba(245,215,131,0.2)' }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: 999, border: '1px dashed rgba(245,215,131,0.4)' }} />
            <img src={night.topArt} alt="Art" style={{ width: 80, height: 80, borderRadius: 99, objectFit: 'cover', border: '2px solid #F5D783' }} />
          </div>

          <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 24, color: '#FFFFFF', marginTop: 24, zIndex: 1 }}>{night.topSong}</div>
          <div style={{ fontFamily: FF, fontSize: 13, color: 'rgba(255,255,255,0.5)', zIndex: 1 }}>{night.topArtist}</div>
        </div>

        {/* Data Box 1 */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>DAT.VOTES</div>
          <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 24, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{night.totalVotes}</div>
        </div>

        {/* Data Box 2 */}
        <div style={{ background: 'rgba(245,215,131,0.05)', border: '1px solid rgba(245,215,131,0.2)', borderRadius: 16, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 10, color: '#F5D783', textTransform: 'uppercase' }}>DAT.CONSENSUS</div>
          <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 24, color: '#F5D783', fontVariantNumeric: 'tabular-nums' }}>{night.consensusPct}%</div>
        </div>
      </div>
    </div>
  );
}

// ── Act II: Campus Mood (Fluid Orb) ──────────────────────────────────
function ActCampusMood({ night, anim }: { night: any; anim: string }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 2,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center',
      padding: '40px 30px', animation: anim, overflow: 'hidden'
    }}>
      {/* Fluid Orb */}
      <div style={{ position: 'absolute', width: 300, height: 300, background: 'linear-gradient(135deg, #A271FF, #EA8CE1)', filter: 'blur(60px)', opacity: 0.4, animation: 'fluid-orb 10s ease-in-out infinite', zIndex: 0 }} />

      <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <NightLabel text="SYS.MOOD" color="#A271FF" dotBg="#A271FF" dotGlow="rgba(162,113,255,0.5)" />
        
        <div style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(162,113,255,0.3)', borderRadius: 12, padding: '24px', marginTop: 40, width: '100%', maxWidth: 320, backdropFilter: 'blur(20px)', textAlign: 'left' }}>
          <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12, color: '#A271FF', marginBottom: 12 }}>
            $ ligo analyze --campus --emotion
          </div>
          <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 14, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', borderRight: '2px solid #A271FF', animation: 'typewriter 2s steps(40, end), blink-caret .75s step-end infinite' }}>
            > STATUS: NOSTALGIC
          </div>
          <p style={{ fontFamily: FF, fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 24, lineHeight: 1.5, animation: 'fadeIn 1s 2s both' }}>
            The campus shifted today. {night.totalVotes} answers painted a picture of homesickness and deep cuts.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Act III: Rarity (Distribution) ───────────────────────────────────
function ActRarity({ anim }: { anim: string }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 2,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', animation: anim,
    }}>
      <NightLabel text="SYS.IDENTITY" color="#EA8CE1" dotBg="#EA8CE1" dotGlow="rgba(234,140,225,0.5)" />
      
      <div style={{ width: '100%', maxWidth: 320, marginTop: 40 }}>
        {/* Fake Data Chart */}
        <div style={{ display: 'flex', alignItems: 'flex-end', height: 120, gap: 4, marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 8 }}>
          {[20, 35, 60, 85, 100, 80, 50, 30, 15, 8, 4].map((h, i) => (
            <div key={i} style={{ flex: 1, background: i === 10 ? '#EA8CE1' : 'rgba(255,255,255,0.1)', height: `${h}%`, borderRadius: '4px 4px 0 0', position: 'relative', boxShadow: i === 10 ? '0 0 15px rgba(234,140,225,0.6)' : 'none' }}>
              {i === 10 && <div style={{ position: 'absolute', top: -24, left: '50%', transform: 'translateX(-50%)', fontFamily: "ui-monospace", fontSize: 10, color: '#EA8CE1' }}>YOU</div>}
            </div>
          ))}
        </div>
        
        <h2 style={{ fontFamily: FF, fontWeight: 700, fontSize: 32, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#FFFFFF', marginBottom: 12 }}>
          You went against the grain tonight.
        </h2>
        <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 4 }}>COEFFICIENT_CLASS:</div>
        <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 24, fontWeight: 700, color: '#EA8CE1', textShadow: '0 0 20px rgba(234,140,225,0.5)' }}>
          NICHE
        </div>
      </div>
    </div>
  );
}

// ── Act IV: Percentile (100 Dots) ────────────────────────────────────
function ActPercentile({ anim }: { anim: string }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 2,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', animation: anim,
    }}>
      <NightLabel text="SYS.STANDING" color="#EA8CE1" dotBg="#EA8CE1" dotGlow="rgba(234,140,225,0.5)" />
      
      <div style={{ marginTop: 40, width: '100%', maxWidth: 300 }}>
        {/* 10x10 Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 6, marginBottom: 30 }}>
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} style={{ aspectRatio: '1', borderRadius: 2, background: i < 7 ? '#EA8CE1' : 'rgba(255,255,255,0.05)', boxShadow: i < 7 ? '0 0 8px rgba(234,140,225,0.6)' : 'none', animation: i < 7 ? `fadeIn 0.2s ${i*0.1}s both` : 'none' }} />
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
          <div style={{ fontSize: 64, fontWeight: 700, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", color: '#EA8CE1', lineHeight: 1 }}>07</div>
          <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', fontFamily: "ui-monospace" }}>PERCENTILE</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '16px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, background: 'rgba(234,140,225,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EA8CE1', fontFamily: "ui-monospace" }}>47</div>
          <div style={{ fontFamily: FF, fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>
            Users picked deep cuts.<br/>Your people are out there.
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Act V: Social Proof (Node Graph) ─────────────────────────────────
function ActSocialProof({ night, anim }: { night: any; anim: string }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 2,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', animation: anim,
    }}>
      <NightLabel text="SYS.NETWORK" color="#71C07F" dotBg="#71C07F" dotGlow="rgba(113,192,127,0.5)" />
      
      {/* Node Graph */}
      <div style={{ position: 'relative', width: 260, height: 260, marginTop: 20, marginBottom: 20 }}>
        {/* Friend Cluster */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0 }}>
          {/* Charlotte */}
          <div style={{ position: 'absolute', animation: 'orbit 20s linear infinite' }}>
            <div style={{ width: 48, height: 48, borderRadius: 99, padding: 2, background: 'rgba(255,255,255,0.1)', transform: 'translate(-50%, -50%)', animation: 'orbit-reverse 20s linear infinite' }}>
              <img src="/assets/Charlotte-Profile.png" style={{ width: '100%', height: '100%', borderRadius: 99, objectFit: 'cover' }} />
            </div>
          </div>
          {/* Cole */}
          <div style={{ position: 'absolute', animation: 'orbit 25s linear infinite reverse', animationDelay: '-5s' }}>
            <div style={{ width: 40, height: 40, borderRadius: 99, padding: 2, background: 'rgba(255,255,255,0.1)', transform: 'translate(-50%, -50%)', animation: 'orbit 25s linear infinite' }}>
              <img src="/assets/Cole-profile.png" style={{ width: '100%', height: '100%', borderRadius: 99, objectFit: 'cover' }} />
            </div>
          </div>
          {/* Cluster Center (Majority) */}
          <div style={{ position: 'absolute', width: 60, height: 60, background: 'radial-gradient(circle, rgba(113,192,127,0.2), transparent)', transform: 'translate(-50%, -50%)', borderRadius: 99 }} />
        </div>
        
        {/* User Node (Isolated) */}
        <div style={{ position: 'absolute', bottom: 0, right: 20, width: 40, height: 40, borderRadius: 99, background: '#EA8CE1', boxShadow: '0 0 20px rgba(234,140,225,0.6)', transform: 'translate(-50%, -50%)' }} />
        <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <line x1="50%" y1="50%" x2="90%" y2="90%" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 4" />
          <text x="75%" y="65%" fill="rgba(234,140,225,0.8)" fontSize="10" fontFamily="ui-monospace">0 MATCH</text>
        </svg>
      </div>

      <div style={{ width: '100%', maxWidth: 320, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: 20 }}>
        <h2 style={{ fontFamily: FF, fontWeight: 600, fontSize: 24, color: '#FFFFFF', marginBottom: 12 }}>
          Nobody in your network agreed with you.
        </h2>
        <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
          CHARLOTTE -> SZA [40%]<br/>
          COLE -> DRAKE [28%]<br/>
          <span style={{ color: '#EA8CE1' }}>YOU -> ISOLATED</span>
        </div>
      </div>
    </div>
  );
}

// ── Act VI: Forward Hook (Circular Countdown) ────────────────────────
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
  const countdown = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;

  const streakCount = Math.min(dayIndex + 1, 7);
  // Calculate progress circle (assuming 24h total)
  const pct = ms / (24 * 3600000);
  const offset = 283 * pct;

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 2,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', animation: anim,
    }}>
      <NightLabel text="SYS.LOCK" color="#F5D783" dotBg="#F5D783" dotGlow="rgba(245,215,131,0.5)" />
      
      <div style={{ position: 'relative', width: 200, height: 200, marginTop: 40, marginBottom: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="200" height="200" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
          <circle cx="100" cy="100" r="45" stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="none" />
          <circle cx="100" cy="100" r="45" stroke="#F5D783" strokeWidth="4" fill="none" strokeDasharray="283" strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 1s linear' }} />
          {/* Decorative outer ring */}
          <circle cx="100" cy="100" r="80" stroke="rgba(255,255,255,0.02)" strokeWidth="1" fill="none" strokeDasharray="4 8" />
        </svg>
        <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 24, fontWeight: 700, color: '#F5D783', letterSpacing: '2px', textShadow: '0 0 10px rgba(245,215,131,0.5)' }}>
          {countdown}
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 20px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, width: '100%', maxWidth: 300 }}>
        <span style={{ fontSize: 20, filter: 'drop-shadow(0 0 8px rgba(255,100,0,0.8))' }}>🔥</span>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: "ui-monospace", fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>DAT.STREAK</span>
          <span style={{ fontFamily: FF, fontWeight: 700, fontSize: 16, color: '#fff' }}>{streakCount} Days Locked In</span>
        </div>
      </div>

      <h2 style={{ fontFamily: FF, fontWeight: 600, fontSize: 22, lineHeight: 1.2, color: '#FFFFFF', textAlign: 'center', maxWidth: 280 }}>
        {night.tomorrowTeaser}
      </h2>
    </div>
  );
}

// ── Act VII: Sponsor CTA (ID Badge) ──────────────────────────────────
function ActSponsorCTA({ anim }: { anim: string }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 2,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', animation: anim,
    }}>
      <div style={{ 
        width: '100%', maxWidth: 320, background: '#07090C', 
        borderRadius: 16, padding: '2px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
        border: '1px solid rgba(0,98,65,0.3)', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,98,65,0.2) 0%, transparent 50%)', pointerEvents: 'none' }} />
        
        <div style={{ background: '#111', borderRadius: 14, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: 16, marginBottom: 20 }}>
            <img src="/assets/starbucks-logo.png" alt="Starbucks" style={{ width: 40, height: 40, objectFit: 'contain' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "ui-monospace", fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>AUTH.TOKEN</div>
              <div style={{ fontFamily: "ui-monospace", fontSize: 12, color: '#006241', fontWeight: 700 }}>50%_OFF_BREW</div>
            </div>
          </div>
          
          <h2 style={{ fontFamily: FF, fontWeight: 700, fontSize: 24, lineHeight: 1.1, color: '#FFFFFF', marginBottom: 12 }}>
            Starbucks fuels<br/>Georgetown.
          </h2>
          <p style={{ fontFamily: FF, fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>
            Reveal complete. Access your exclusive reward.
          </p>
          
          <button style={{
            width: '100%', height: 48, border: '1px solid #006241', borderRadius: 8, background: 'rgba(0,98,65,0.1)', color: '#006241',
            fontFamily: "ui-monospace", fontWeight: 700, fontSize: 13, cursor: 'pointer', letterSpacing: '0.05em',
            transition: 'background 0.2s'
          }} onClick={() => alert('Opens Starbucks App')}>
            > INIT.REDEEM
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Share sheet (Cumulative Stats Receipt) ───────────────────────────
function ShareSheet({ act, night, onClose }: { act: number; night: any; onClose: () => void }) {
  return (
    <>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.7)', animation: 'fadeIn 220ms ease both', backdropFilter: 'blur(8px)' }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 61,
        background: '#0a0a0a', borderRadius: '24px 24px 0 0',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: '12px 24px 36px',
        animation: `sheetUp 320ms cubic-bezier(.2,.7,.2,1) both`,
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.2)', margin: '0 auto 20px' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <span style={{ fontFamily: "ui-monospace", fontWeight: 700, fontSize: 14, color: '#FFFFFF' }}>EXPORT.STATS</span>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: 0, background: 'rgba(255,255,255,0.1)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        
        {/* The Receipt / Summary Card */}
        <div id="share-card" style={{ background: '#111', borderRadius: 16, padding: '24px 20px', marginBottom: 24, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
          <div style={{ textAlign: 'center', borderBottom: '1px dashed rgba(255,255,255,0.2)', paddingBottom: 16, marginBottom: 16 }}>
            <div style={{ fontFamily: "ui-monospace", fontSize: 10, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>LIGO // GEORGETOWN</div>
            <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 24, color: '#fff' }}>Reveal Log</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: "ui-monospace", fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>CAMPUS.PULSE</span>
              <span style={{ fontFamily: FF, fontWeight: 600, fontSize: 14, color: '#F5D783' }}>{night.topArtist}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: "ui-monospace", fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>SYS.MOOD</span>
              <span style={{ fontFamily: FF, fontWeight: 600, fontSize: 14, color: '#A271FF' }}>Nostalgic</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: "ui-monospace", fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>DAT.STANDING</span>
              <span style={{ fontFamily: FF, fontWeight: 600, fontSize: 14, color: '#EA8CE1' }}>Top 7% Niche</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: "ui-monospace", fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>NETWORK.MATCH</span>
              <span style={{ fontFamily: FF, fontWeight: 600, fontSize: 14, color: '#71C07F' }}>0 (Isolated)</span>
            </div>
          </div>

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <img src="/assets/starbucks-logo.png" alt="Starbucks" style={{ height: 16, filter: 'grayscale(1) brightness(2)' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
            <span style={{ fontFamily: "ui-monospace", fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>POWERED BY SBUX</span>
          </div>
        </div>

        <button onClick={onClose} style={{ width: '100%', height: 48, border: 0, borderRadius: 8, background: '#fff', color: '#000', fontFamily: "ui-monospace", fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
          > EXPORT_TO_IG
        </button>
      </div>
    </>
  );
}

// ── Main RevealScreen ─────────────────────────────────────────────────"""

content = content.replace(old_acts.group(0), new_acts)

with open('/Users/tjdozier7/Downloads/ligo-home-mockup-main/components/RevealScreen.tsx', 'w') as f:
    f.write(content)

print("Patch techy complete")
