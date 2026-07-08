import re

tsx_path = '/Users/tjdozier7/Downloads/ligo-home-mockup-main/components/RevealScreen.tsx'
with open(tsx_path, 'r') as f:
    content = f.read()

# 1. Define the new ActSpotifyWrapped component right before ShareSheet
new_act = """// ── Act VIII: Spotify Wrapped Summary ─────────────────────────────────
function ActSpotifyWrapped({ night, anim, dayIndex }: { night: any; anim: string; dayIndex: number }) {
  const streakCount = Math.min(dayIndex + 1, 7);
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 2,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', animation: anim, overflow: 'hidden',
      background: 'linear-gradient(135deg, #FF3366, #FF9933, #71C07F)',
    }}>
      {/* Dynamic Shapes Background */}
      <div style={{ position: 'absolute', top: -50, left: -50, width: 200, height: 200, background: '#A271FF', borderRadius: 999, filter: 'blur(40px)', opacity: 0.6, animation: 'float 6s infinite alternate' }} />
      <div style={{ position: 'absolute', bottom: -100, right: -50, width: 250, height: 250, background: '#EA8CE1', borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%', filter: 'blur(50px)', opacity: 0.7, animation: 'aura-spin 15s linear infinite' }} />

      {/* The Wrapped Card Content */}
      <div style={{ zIndex: 1, width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h1 style={{ fontFamily: FF, fontWeight: 800, fontSize: 52, lineHeight: 0.9, letterSpacing: '-0.05em', color: '#FFFFFF', textShadow: '0 10px 30px rgba(0,0,0,0.3)', marginBottom: 12 }}>
          Your<br/>Ligo<br/>Reveal.
        </h1>

        <div style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 24, padding: 24, display: 'flex', flexDirection: 'column', gap: 16, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
          {/* Stat 1 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 12 }}>
            <span style={{ fontFamily: FF, fontWeight: 700, fontSize: 14, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Campus Pick</span>
            <span style={{ fontFamily: FF, fontWeight: 800, fontSize: 22, color: '#FFFFFF' }}>{night.topArtist}</span>
          </div>
          {/* Stat 2 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 12 }}>
            <span style={{ fontFamily: FF, fontWeight: 700, fontSize: 14, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Vibe</span>
            <span style={{ fontFamily: FF, fontWeight: 800, fontSize: 22, color: '#A271FF' }}>Nostalgic</span>
          </div>
          {/* Stat 3 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 12 }}>
            <span style={{ fontFamily: FF, fontWeight: 700, fontSize: 14, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Identity</span>
            <span style={{ fontFamily: FF, fontWeight: 800, fontSize: 22, color: '#F5D783' }}>Top 7% Niche</span>
          </div>
          {/* Stat 4 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 12 }}>
            <span style={{ fontFamily: FF, fontWeight: 700, fontSize: 14, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Network</span>
            <span style={{ fontFamily: FF, fontWeight: 800, fontSize: 22, color: '#FFFFFF' }}>0 Match</span>
          </div>
          {/* Stat 5 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <span style={{ fontFamily: FF, fontWeight: 700, fontSize: 14, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Streak</span>
            <span style={{ fontFamily: FF, fontWeight: 800, fontSize: 22, color: '#FFFFFF' }}>{streakCount} Days</span>
          </div>
        </div>

        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'rgba(0,0,0,0.3)', padding: '12px 20px', borderRadius: 99, backdropFilter: 'blur(10px)' }}>
          <span style={{ fontFamily: FF, fontWeight: 700, fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Presented by</span>
          <img src="/assets/starbucks-logo.png" style={{ height: 20 }} onError={(e) => (e.currentTarget.style.display = 'none')} />
        </div>
      </div>
      
      <button style={{
        position: 'absolute', bottom: 40, width: 'calc(100% - 48px)', height: 56,
        background: '#FFFFFF', color: '#000', border: 0, borderRadius: 999,
        fontFamily: FF, fontWeight: 800, fontSize: 16, cursor: 'pointer',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)', zIndex: 1
      }}>
        Share to IG Story
      </button>
    </div>
  );
}

// ── Share sheet"""

content = content.replace('// ── Share sheet', new_act)

# 2. Update standardSteps array
old_steps = re.search(r'const standardSteps = \[.*?\];', content, re.DOTALL)
new_steps = """const standardSteps = [
    ({ anim }: { anim: string }) => <ActCampusPulse night={night} anim={anim} />,
    ({ anim }: { anim: string }) => <ActCampusMood night={night} anim={anim} />,
    ({ anim }: { anim: string }) => <ActRarity anim={anim} />,
    ({ anim }: { anim: string }) => <ActPercentile anim={anim} />,
    ({ anim }: { anim: string }) => <ActSocialProof night={night} anim={anim} />,
    ({ anim }: { anim: string }) => <ActForwardHook night={night} dayIndex={dayIndex} anim={anim} />,
    ({ anim }: { anim: string }) => <ActSponsorCTA anim={anim} />,
    ({ anim }: { anim: string }) => <ActSpotifyWrapped night={night} dayIndex={dayIndex} anim={anim} />,
  ];"""
content = content.replace(old_steps.group(0), new_steps)

with open(tsx_path, 'w') as f:
    f.write(content)

print("Patch wrapped complete")
