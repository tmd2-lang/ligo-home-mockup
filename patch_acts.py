import re

with open('/Users/tjdozier7/Downloads/ligo-home-mockup-main/components/RevealScreen.tsx', 'r') as f:
    content = f.read()

old_acts = re.search(r'// ── Shared night label ────────────────────────────────────────────────(.*?)// ── Main RevealScreen ─────────────────────────────────────────────────', content, re.DOTALL)

new_acts = """// ── Shared night label ────────────────────────────────────────────────
function NightLabel({ text, color, dotBg, dotGlow }: { text: string; color: string; dotBg: string; dotGlow: string }) {
  return (
    <span style={{
      fontFamily: FF, fontWeight: 700, fontSize: 11, letterSpacing: '0.18em',
      textTransform: 'uppercase', color,
      display: 'inline-flex', alignItems: 'center', gap: 8,
    } as React.CSSProperties}>
      <span style={{ width: 6, height: 6, borderRadius: 99, background: dotBg, boxShadow: dotGlow, display: 'inline-block' }} />
      {text}
    </span>
  );
}

// ── Act I: Campus Pulse ────────────────────────────────────────
function ActCampusPulse({ night, anim }: { night: any; anim: string }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 2,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center', gap: 0,
      padding: '100px 30px 140px', animation: anim,
    }}>
      {/* Sponsor Lockup */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6, opacity: 0.9, background: 'rgba(255,255,255,0.05)', padding: '6px 14px', borderRadius: 99, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <span style={{ fontFamily: FF, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>Presented by</span>
        <img src="/assets/starbucks-logo.png" alt="Starbucks" style={{ height: 16 }} onError={(e) => (e.currentTarget.style.display = 'none')} />
      </div>

      <NightLabel text="Campus Pulse" color="#F5D783" dotBg="#F5D783" dotGlow="0 0 0 4px rgba(245,215,131,0.18)" />
      
      <p style={{
        fontFamily: FF, fontSize: 15, lineHeight: 1.45, color: 'rgba(255,255,255,0.6)',
        margin: '12px 0 32px', maxWidth: 280, textShadow: '0 1px 10px rgba(0,0,0,0.6)',
      }}>
        &ldquo;{night.question}&rdquo;
      </p>

      {/* Fancy Visualization */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
        <div style={{ width: 140, height: 140, borderRadius: 99, background: 'radial-gradient(circle, rgba(245,215,131,0.2) 0%, transparent 70%)', position: 'absolute', animation: 'pulse 3s infinite alternate' }} />
        <img src={night.topArt} alt="Art" style={{ width: 100, height: 100, borderRadius: 18, objectFit: 'cover', boxShadow: '0 12px 30px rgba(245,215,131,0.3)', border: '1px solid rgba(255,255,255,0.15)', zIndex: 1 }} />
      </div>

      <div style={{
        fontFamily: FF, fontWeight: 700, fontSize: 40, letterSpacing: '-0.025em',
        lineHeight: 1.05, color: '#FFFFFF',
        textShadow: '0 2px 20px rgba(0,0,0,0.6)',
      }}>
        {night.topSong}
      </div>
      <div style={{ fontFamily: FF, fontSize: 16, color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>
        {night.topArtist}
      </div>
      
      <div style={{ marginTop: 28, background: 'rgba(245,215,131,0.1)', border: '1px solid rgba(245,215,131,0.2)', borderRadius: 16, padding: '16px 20px', width: '100%', maxWidth: 300, backdropFilter: 'blur(10px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontFamily: FF, fontSize: 13, color: '#F5D783', fontWeight: 600 }}>
          <span>{night.consensusPct}% Consensus</span>
          <span>{night.totalVotes} Votes</span>
        </div>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ width: `${night.consensusPct}%`, height: '100%', background: '#F5D783', borderRadius: 99 }} />
        </div>
      </div>
    </div>
  );
}

// ── Act II: Campus Mood ──────────────────────────────────────────────
function ActCampusMood({ night, anim }: { night: any; anim: string }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 2,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center', gap: 0,
      padding: '100px 30px 140px', animation: anim,
    }}>
      {/* Background ambient glow for mood */}
      <div style={{ position: 'absolute', inset: -50, background: 'radial-gradient(circle at center, rgba(162,113,255,0.2) 0%, transparent 60%)', filter: 'blur(40px)', zIndex: -1 }} />

      <NightLabel text="Campus Mood" color="#A271FF" dotBg="#A271FF" dotGlow="0 0 0 4px rgba(162,113,255,0.18)" />
      
      <h2 style={{
        fontFamily: FF, fontWeight: 600, fontSize: 44, lineHeight: 1.05,
        letterSpacing: '-0.03em', color: '#FFFFFF', margin: '30px 0 20px',
        textShadow: '0 4px 30px rgba(0,0,0,0.8)',
      } as React.CSSProperties}>
        Georgetown is feeling nostalgic.
      </h2>

      <p style={{ fontFamily: FF, fontSize: 16, lineHeight: 1.5, color: 'rgba(255,255,255,0.7)', maxWidth: 280, marginBottom: 40 }}>
        The campus shifted today. {night.totalVotes} answers painted a picture of homesickness and deep cuts.
      </p>

      {/* Fancy tag pill */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(162,113,255,0.15)', border: '1px solid rgba(162,113,255,0.3)', padding: '12px 24px', borderRadius: 999, backdropFilter: 'blur(12px)' }}>
        <span style={{ fontSize: 18 }}>💭</span>
        <span style={{ fontFamily: FF, fontWeight: 600, fontSize: 15, color: '#A271FF', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Nostalgic</span>
      </div>
    </div>
  );
}

// ── Act III: Rarity ───────────────────────────────────────────────────
function ActRarity({ anim }: { anim: string }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 2,
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      padding: '100px 30px 140px', animation: anim,
    }}>
      <NightLabel text="Your Music Identity" color="#EA8CE1" dotBg="#EA8CE1" dotGlow="0 0 0 4px rgba(234,140,225,0.18)" />
      
      <h2 style={{
        fontFamily: FF, fontWeight: 600, fontSize: 38, lineHeight: 1.08,
        letterSpacing: '-0.025em', color: '#FFFFFF', margin: '24px 0 20px',
        textShadow: '0 2px 24px rgba(0,0,0,0.6)',
      } as React.CSSProperties}>
        You went against the grain tonight.
      </h2>

      <div style={{ position: 'relative', padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', marginBottom: 24 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: '#EA8CE1', borderRadius: '24px 0 0 24px', boxShadow: '0 0 20px rgba(234,140,225,0.6)' }} />
        <div style={{ fontFamily: FF, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
          Rarity Score
        </div>
        <div style={{ fontFamily: FF, fontSize: 32, fontWeight: 700, color: '#EA8CE1', lineHeight: 1 }}>
          Niche
        </div>
      </div>

      <p style={{
        fontFamily: FF, fontSize: 16, lineHeight: 1.55, color: 'rgba(255,255,255,0.7)',
        textShadow: '0 1px 12px rgba(0,0,0,0.6)',
      }}>
        You skipped the consensus. Your niche coefficient is building over time.
      </p>
    </div>
  );
}

// ── Act IV: Percentile ────────────────────────────────────────────────
function ActPercentile({ anim }: { anim: string }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 2,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      padding: '100px 30px 140px', animation: anim,
    }}>
      <NightLabel text="Personal Standing" color="#EA8CE1" dotBg="#EA8CE1" dotGlow="0 0 0 4px rgba(234,140,225,0.18)" />
      
      <div style={{ margin: '40px 0', position: 'relative' }}>
        <div style={{ fontSize: 90, fontWeight: 800, fontFamily: FF, color: '#EA8CE1', lineHeight: 1, textShadow: '0 10px 40px rgba(234,140,225,0.4)' }}>
          7%
        </div>
        <div style={{ fontSize: 18, fontWeight: 600, fontFamily: FF, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 12 }}>
          Top Percentile
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px 24px', borderRadius: 999, backdropFilter: 'blur(10px)', display: 'inline-flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 20 }}>🧑‍🤝‍🧑</span>
        <span style={{ fontFamily: FF, fontSize: 15, color: '#fff', fontWeight: 600 }}>You and 47 others</span>
      </div>

      <p style={{ fontFamily: FF, fontSize: 15, lineHeight: 1.55, color: 'rgba(255,255,255,0.6)', margin: '24px 0 0', maxWidth: 260 }}>
        picked deep cuts tonight. Your people are out there.
      </p>
    </div>
  );
}

// ── Act V: Social Proof ───────────────────────────────────────────────
function ActSocialProof({ night, anim }: { night: any; anim: string }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 2,
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      padding: '100px 30px 140px', animation: anim,
    }}>
      <NightLabel text="Network Pulse" color="#71C07F" dotBg="#71C07F" dotGlow="0 0 0 4px rgba(113,192,127,0.18)" />
      
      <h2 style={{
        fontFamily: FF, fontWeight: 600, fontSize: 36, lineHeight: 1.08,
        letterSpacing: '-0.025em', color: '#FFFFFF', margin: '24px 0 28px',
        textShadow: '0 2px 28px rgba(0,0,0,0.65)',
      } as React.CSSProperties}>
        Nobody in your network agreed with you.
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: 14, borderRadius: 16, backdropFilter: 'blur(10px)' }}>
          <img src="/assets/Charlotte-Profile.png" style={{ width: 44, height: 44, borderRadius: 99, objectFit: 'cover' }} />
          <div>
            <div style={{ fontFamily: FF, fontSize: 15, fontWeight: 600, color: '#fff' }}>Charlotte picked SZA</div>
            <div style={{ fontFamily: FF, fontSize: 13, color: '#71C07F', marginTop: 2 }}>With the 40% majority</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: 14, borderRadius: 16, backdropFilter: 'blur(10px)' }}>
          <img src="/assets/Cole-profile.png" style={{ width: 44, height: 44, borderRadius: 99, objectFit: 'cover' }} />
          <div>
            <div style={{ fontFamily: FF, fontSize: 15, fontWeight: 600, color: '#fff' }}>Cole picked Drake</div>
            <div style={{ fontFamily: FF, fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>With the 28% runner-up</div>
          </div>
        </div>
      </div>

      <p style={{ fontFamily: FF, fontSize: 15, lineHeight: 1.5, color: 'rgba(255,255,255,0.65)', margin: 0 }}>
        You're completely isolated from your friends tonight. Your taste is yours alone.
      </p>
    </div>
  );
}

// ── Act VI: Forward Hook ──────────────────────────────────────────────
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
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center',
      padding: '100px 30px 150px', animation: anim,
    }}>
      <NightLabel text="Tomorrow · 8:00 pm" color="#F5D783" dotBg="#F5D783" dotGlow="0 0 0 4px rgba(245,215,131,0.18)" />
      
      <div style={{
        fontFamily: FF, fontWeight: 700, fontSize: 64, letterSpacing: '-0.03em', lineHeight: 1,
        color: '#F5D783', margin: '24px 0 8px', fontVariantNumeric: 'tabular-nums',
        textShadow: '0 0 50px rgba(245,215,131,0.4)',
      } as React.CSSProperties}>
        {countdown}
      </div>
      <span style={{ fontFamily: FF, fontSize: 13, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        until the question unlocks
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '40px 0', background: 'rgba(255,255,255,0.05)', padding: '12px 24px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
        <span style={{ fontSize: 24, filter: 'drop-shadow(0 0 10px rgba(255,100,0,0.8))' }}>🔥</span>
        <span style={{ fontFamily: FF, fontWeight: 700, fontSize: 18, color: '#fff' }}>{streakCount} Day Streak</span>
      </div>

      <h2 style={{
        fontFamily: FF, fontWeight: 600, fontSize: 28, lineHeight: 1.15,
        letterSpacing: '-0.02em', color: '#FFFFFF', margin: '0 0 16px', maxWidth: 300,
        textShadow: '0 2px 20px rgba(0,0,0,0.6)',
      } as React.CSSProperties}>
        {night.tomorrowTeaser}
      </h2>
    </div>
  );
}

// ── Act VII: Sponsor CTA ──────────────────────────────────────────────
function ActSponsorCTA({ anim }: { anim: string }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 2,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center',
      padding: '100px 30px 150px', animation: anim,
    }}>
      <div style={{ 
        width: '100%', maxWidth: 320, background: 'linear-gradient(145deg, #006241 0%, #00452C 100%)', 
        borderRadius: 28, padding: '32px 24px', 
        boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', flexDirection: 'column', alignItems: 'center'
      }}>
        <div style={{ width: 70, height: 70, background: '#fff', borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}>
          <img src="/assets/starbucks-logo.png" alt="Starbucks" style={{ width: 50, height: 50, objectFit: 'contain' }} />
        </div>
        
        <h2 style={{
          fontFamily: FF, fontWeight: 700, fontSize: 26, lineHeight: 1.1,
          letterSpacing: '-0.02em', color: '#FFFFFF', margin: '0 0 12px',
        } as React.CSSProperties}>
          Starbucks fuels<br/>Georgetown's nights.
        </h2>
        
        <p style={{ fontFamily: FF, fontSize: 14, lineHeight: 1.5, color: 'rgba(255,255,255,0.8)', margin: '0 0 24px', maxWidth: 260 }}>
          Since you made it to the end of the reveal, grab 50% off your next cold brew.
        </p>
        
        <button style={{
          width: '100%', height: 50, border: 0, borderRadius: 999, background: '#FFFFFF', color: '#006241',
          fontFamily: FF, fontWeight: 700, fontSize: 15, cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }} onClick={() => alert('Opens Starbucks App')}>
          Redeem in App
        </button>
      </div>
    </div>
  );
}

// ── Share sheet ───────────────────────────────────────────────────────
function ShareSheet({ act, night, onClose }: { act: number; night: any; onClose: () => void }) {
  const CARDS = [
    { title: `Georgetown picked ${night.topArtist} tonight.`, sub: `Campus Pulse · ${night.consensusPct}% Consensus` },
    { title: 'Georgetown is feeling nostalgic.', sub: 'Campus Mood · 4 Days in a row' },
    { title: 'Niche Coefficient: Building.', sub: 'Personal Standing · Rarity' },
    { title: 'Top 7% most unique answers tonight.', sub: 'Personal Standing · Percentile' },
    { title: 'Nobody in your network agreed with you.', sub: 'Social Proof · Isolated' },
    { title: '6 Day Streak. Answers lock at 8 PM.', sub: 'Streak · Georgetown' },
    { title: 'Starbucks fueled tonight\\'s reveal.', sub: 'Exclusive Offer · Georgetown' },
  ];
  const card = CARDS[act] ?? CARDS[0];
  return (
    <>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.55)', animation: 'fadeIn 220ms cubic-bezier(.2,.7,.2,1) both', backdropFilter: 'blur(5px)' }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 61,
        background: 'rgba(20,18,16,0.95)', borderRadius: '32px 32px 0 0',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: '12px 24px 36px',
        animation: `sheetUp 320ms cubic-bezier(.2,.7,.2,1) both`,
        boxShadow: '0 -20px 50px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{ width: 40, height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.2)', margin: '0 auto 20px' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <span style={{ fontFamily: FF, fontWeight: 700, fontSize: 18, letterSpacing: '-0.015em', color: '#FFFFFF' }}>Share this card</span>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 99, border: 0, background: 'rgba(255,255,255,0.1)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>
        {/* Share card preview */}
        <div style={{ background: 'linear-gradient(135deg, #111316, #0A0806)', borderRadius: 24, padding: '28px 24px', marginBottom: 24, border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
          {/* Sponsor Lockup */}
          <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6, opacity: 0.9 }}>
            <span style={{ fontFamily: FF, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>Presented by</span>
            <img src="/assets/starbucks-logo.png" alt="Starbucks" style={{ height: 18 }} onError={(e) => (e.currentTarget.style.display = 'none')} />
          </div>

          <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 18, color: '#FFFFFF', letterSpacing: '-0.01em', marginBottom: 8, lineHeight: 1.2 }}>{card.title}</div>
          <div style={{ fontFamily: FF, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Georgetown · under the lights</div>
          <div style={{ fontFamily: FF, fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{card.sub}</div>
        </div>
        <button onClick={onClose} style={{ width: '100%', height: 52, border: 0, borderRadius: 16, background: '#fff', color: '#000', fontFamily: FF, fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 4px 14px rgba(255,255,255,0.2)' }}>
          Share to Instagram Story
        </button>
      </div>
    </>
  );
}

// ── Main RevealScreen ─────────────────────────────────────────────────"""

content = content.replace(old_acts.group(0), new_acts)

old_steps = re.search(r'const standardSteps = \[.*?\];', content, re.DOTALL)
new_steps = """const standardSteps = [
    ({ anim }: { anim: string }) => <ActCampusPulse night={night} anim={anim} />,
    ({ anim }: { anim: string }) => <ActCampusMood night={night} anim={anim} />,
    ({ anim }: { anim: string }) => <ActRarity anim={anim} />,
    ({ anim }: { anim: string }) => <ActPercentile anim={anim} />,
    ({ anim }: { anim: string }) => <ActSocialProof night={night} anim={anim} />,
    ({ anim }: { anim: string }) => <ActForwardHook night={night} dayIndex={dayIndex} anim={anim} />,
    ({ anim }: { anim: string }) => <ActSponsorCTA anim={anim} />,
  ];"""

content = content.replace(old_steps.group(0), new_steps)

with open('/Users/tjdozier7/Downloads/ligo-home-mockup-main/components/RevealScreen.tsx', 'w') as f:
    f.write(content)

print("Patch complete")
