import re

# 1. Update HomeScreen.tsx
home_path = '/Users/tjdozier7/Downloads/ligo-home-mockup-main/components/HomeScreen.tsx'
with open(home_path, 'r') as f:
    home_content = f.read()

old_everyone = """            <span
              style={{
                fontFamily: "Bricolage Grotesque, sans-serif",
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(20,17,13,0.4)",
              }}
            >
              Everyone answers
            </span>"""

new_everyone = """            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  fontFamily: "Bricolage Grotesque, sans-serif",
                  fontWeight: 700,
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(20,17,13,0.5)",
                }}
              >
                Presented to you by Starbucks™
              </span>
              <img src="/assets/starbucks-logo.png" style={{ height: 14, filter: 'grayscale(1) opacity(0.7)' }} alt="Starbucks" onError={(e) => (e.currentTarget.style.display = 'none')} />
            </div>"""

if old_everyone in home_content:
    home_content = home_content.replace(old_everyone, new_everyone)
else:
    print("Warning: Could not find 'Everyone answers' in HomeScreen.tsx")

with open(home_path, 'w') as f:
    f.write(home_content)

# 2. Update RevealScreen.tsx
reveal_path = '/Users/tjdozier7/Downloads/ligo-home-mockup-main/components/RevealScreen.tsx'
with open(reveal_path, 'r') as f:
    reveal_content = f.read()

# Remove the sponsor lockup from ActCampusPulse
old_sponsor_pulse = """      {/* Sponsor Lockup */}
      <div style={{ position: 'absolute', top: 50, display: 'flex', alignItems: 'center', gap: 6, opacity: 0.9, background: 'rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: 99, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
        <span style={{ fontFamily: FF, fontWeight: 600, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)' }}>Presented by</span>
        <img src="/assets/starbucks-logo.png" alt="Starbucks" style={{ height: 16 }} onError={(e) => (e.currentTarget.style.display = 'none')} />
      </div>"""

reveal_content = reveal_content.replace(old_sponsor_pulse, "")

# Add the sponsor lockup to NightLabel so it appears on all standard slides
old_night_label = """function NightLabel({ text, color, dotBg, dotGlow }: { text: string; color: string; dotBg: string; dotGlow: string }) {
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
}"""

new_night_label = """function NightLabel({ text, color, dotBg, dotGlow }: { text: string; color: string; dotBg: string; dotGlow: string }) {
  return (
    <>
      <div style={{ position: 'absolute', top: 40, display: 'flex', alignItems: 'center', gap: 6, opacity: 0.8, background: 'rgba(255,255,255,0.1)', padding: '6px 14px', borderRadius: 99, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)' }}>
        <span style={{ fontFamily: FF, fontWeight: 600, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>Presented by</span>
        <img src="/assets/starbucks-logo.png" alt="Starbucks" style={{ height: 14 }} onError={(e) => (e.currentTarget.style.display = 'none')} />
      </div>
      <span style={{
        fontFamily: FF, fontWeight: 700, fontSize: 13, letterSpacing: '0.08em',
        textTransform: 'uppercase', color,
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: 'rgba(255,255,255,0.1)', padding: '6px 14px', borderRadius: 999,
        backdropFilter: 'blur(10px)', marginTop: 20
      } as React.CSSProperties}>
        <span style={{ width: 8, height: 8, borderRadius: 99, background: dotBg, boxShadow: dotGlow, display: 'inline-block' }} />
        {text}
      </span>
    </>
  );
}"""

reveal_content = reveal_content.replace(old_night_label, new_night_label)

with open(reveal_path, 'w') as f:
    f.write(reveal_content)

print("Patch complete")
