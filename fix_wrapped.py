import re
import os

# 1. Create Starbucks SVG
svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#00704A" />
  <circle cx="50" cy="50" r="43" fill="none" stroke="#FFFFFF" stroke-width="2" />
  <path d="M50 25 C30 25 25 40 25 50 C25 60 30 75 50 75 C70 75 75 60 75 50 C75 40 70 25 50 25 Z" fill="#FFFFFF"/>
  <circle cx="50" cy="45" r="8" fill="#00704A" />
  <path d="M40 70 Q 50 80 60 70" fill="none" stroke="#00704A" stroke-width="4"/>
  <text x="50" y="16" font-family="sans-serif" font-weight="900" font-size="12" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">STARBUCKS</text>
  <text x="50" y="92" font-family="sans-serif" font-weight="900" font-size="12" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">COFFEE</text>
</svg>"""

with open('/Users/tjdozier7/Downloads/ligo-home-mockup-main/public/assets/starbucks-logo.svg', 'w') as f:
    f.write(svg_content)

# 2. Patch RevealScreen.tsx to fix UI issues and image references
tsx_path = '/Users/tjdozier7/Downloads/ligo-home-mockup-main/components/RevealScreen.tsx'
with open(tsx_path, 'r') as f:
    content = f.read()

# Fix image references everywhere
content = content.replace('starbucks-logo.png', 'starbucks-logo.svg')

# Fix ActSpotifyWrapped padding, colors, and button position
old_wrapped = re.search(r'// ── Act VIII: Spotify Wrapped Summary ─────────────────────────────────.*?// ── Share sheet', content, re.DOTALL)
if old_wrapped:
    new_wrapped = old_wrapped.group(0)
    
    # Increase top padding
    new_wrapped = new_wrapped.replace("padding: '40px 24px'", "padding: '100px 24px 100px'")
    
    # Darker background for stats container for better contrast
    new_wrapped = new_wrapped.replace("background: 'rgba(0,0,0,0.2)'", "background: 'rgba(0,0,0,0.5)'")
    
    # Lighter text colors
    new_wrapped = new_wrapped.replace("color: '#A271FF'", "color: '#D8B4FE'")
    new_wrapped = new_wrapped.replace("color: '#F5D783'", "color: '#FDE68A'")
    
    # Move button up
    new_wrapped = new_wrapped.replace("bottom: 40", "bottom: 120")
    
    content = content.replace(old_wrapped.group(0), new_wrapped)

with open(tsx_path, 'w') as f:
    f.write(content)
    
# 3. Patch HomeScreen.tsx to fix image references
home_path = '/Users/tjdozier7/Downloads/ligo-home-mockup-main/components/HomeScreen.tsx'
with open(home_path, 'r') as f:
    home_content = f.read()

home_content = home_content.replace('starbucks-logo.png', 'starbucks-logo.svg')

with open(home_path, 'w') as f:
    f.write(home_content)

print("UI fixes complete")
