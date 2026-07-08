import re

# 1. Update lib/revealData.ts to include a small MOCK_CATALOG
reveal_data_path = '/Users/tjdozier7/Downloads/ligo-home-mockup-main/lib/revealData.ts'
with open(reveal_data_path, 'r') as f:
    reveal_data_content = f.read()

mock_catalog = """export const MOCK_CATALOG = [
  { title: "Espresso", artist: "Sabrina Carpenter", art: "/assets/covers/sabrina.webp" },
  { title: "Snooze", artist: "SZA", art: "/assets/covers/sos.webp" },
  { title: "Good 4 U", artist: "Olivia Rodrigo", art: "/assets/covers/sour.webp" },
  { title: "Starboy", artist: "The Weeknd", art: "/assets/covers/starboy.webp" },
  { title: "Feather", artist: "Sabrina Carpenter", art: "/assets/covers/sabrina.webp" }
];
"""
if "MOCK_CATALOG" not in reveal_data_content:
    reveal_data_content += "\n" + mock_catalog
    with open(reveal_data_path, 'w') as f:
        f.write(reveal_data_content)

# 2. Update HomeScreen.tsx to pass userAnswer
home_path = '/Users/tjdozier7/Downloads/ligo-home-mockup-main/components/HomeScreen.tsx'
with open(home_path, 'r') as f:
    home_content = f.read()

home_content = home_content.replace(
    '<RevealScreen isCN={isCN}', 
    '<RevealScreen isCN={isCN} userAnswer={answer}'
)
with open(home_path, 'w') as f:
    f.write(home_content)

# 3. Update RevealScreen.tsx to use userAnswer and MOCK_CATALOG
reveal_path = '/Users/tjdozier7/Downloads/ligo-home-mockup-main/components/RevealScreen.tsx'
with open(reveal_path, 'r') as f:
    reveal_content = f.read()

# Make sure we import MOCK_CATALOG
import_stmt = "import { ACTIVE_REVEAL_NIGHT, CN_PROFILES } from '@/lib/revealData';"
new_import = "import { ACTIVE_REVEAL_NIGHT, CN_PROFILES, MOCK_CATALOG } from '@/lib/revealData';"
reveal_content = reveal_content.replace(import_stmt, new_import)

# Update Props
old_props = """export function RevealScreen({
  activeUserId,
  playIntro,
  onBack,
  isCN = false,
}: {"""
new_props = """export function RevealScreen({
  activeUserId,
  playIntro,
  onBack,
  isCN = false,
  userAnswer,
}: {"""
reveal_content = reveal_content.replace(old_props, new_props)

old_props_type = """  isCN?: boolean;
}) {"""
new_props_type = """  isCN?: boolean;
  userAnswer?: string;
}) {"""
reveal_content = reveal_content.replace(old_props_type, new_props_type)

# Inject dynamic override logic inside RevealScreen
old_night = "  const night = ACTIVE_REVEAL_NIGHT;"
new_night = """  let night = { ...ACTIVE_REVEAL_NIGHT };
  if (userAnswer) {
    // Try to match from MOCK_CATALOG (or even just matching string)
    const match = MOCK_CATALOG.find(s => userAnswer.toLowerCase().includes(s.title.toLowerCase()));
    if (match) {
      night.topSong = match.title;
      night.topArtist = match.artist;
      night.topArt = match.art;
    } else {
      // If it doesn't match our exact catalog, we could still just set the text,
      // but the user asked to fallback to "Not Like Us" which is the default anyway!
      // Optionally we can uncomment the below to force text update without art:
      // night.topSong = userAnswer;
    }
  }"""
reveal_content = reveal_content.replace(old_night, new_night)

with open(reveal_path, 'w') as f:
    f.write(reveal_content)

print("Patch dynamic override complete")
