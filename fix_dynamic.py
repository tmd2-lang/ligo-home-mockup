import re

# 1. Revert HomeScreen.tsx change
home_path = '/Users/tjdozier7/Downloads/ligo-home-mockup-main/components/HomeScreen.tsx'
with open(home_path, 'r') as f:
    home_content = f.read()

home_content = home_content.replace(
    '<RevealScreen isCN={isCN} userAnswer={answer}', 
    '<RevealScreen isCN={isCN}'
)
with open(home_path, 'w') as f:
    f.write(home_content)

# 2. Fix RevealScreen.tsx
reveal_path = '/Users/tjdozier7/Downloads/ligo-home-mockup-main/components/RevealScreen.tsx'
with open(reveal_path, 'r') as f:
    reveal_content = f.read()

# Add imports for catalog search
import_stmt = "import { ACTIVE_REVEAL_NIGHT, CN_PROFILES, MOCK_CATALOG } from '@/lib/revealData';"
new_imports = """import { ACTIVE_REVEAL_NIGHT, CN_PROFILES } from '@/lib/revealData';
import { searchCharlotteCatalog } from "@/lib/charlotte-catalog";
import { searchColeCatalog } from "@/lib/cole-catalog";
import { searchCarolineCatalog } from "@/lib/caroline-catalog";
import { searchBennettCatalog } from "@/lib/bennett-catalog";
import { searchAlessiaCatalog } from "@/lib/alessia-catalog";
import { searchMaddieCatalog } from "@/lib/maddie-catalog";
import { searchMarcusCatalog } from "@/lib/marcus-catalog";
import { searchSofiaCatalog } from "@/lib/sofia-catalog";
import { searchJordanCatalog } from "@/lib/jordan-catalog";

function searchCatalogLocal(activeUserId: string, draft: string, limit = 8) {
  switch (activeUserId) {
    case "charlotte": return searchCharlotteCatalog(draft, limit);
    case "cole": return searchColeCatalog(draft, limit);
    case "caroline": return searchCarolineCatalog(draft, limit);
    case "bennett": return searchBennettCatalog(draft, limit);
    case "alessia": return searchAlessiaCatalog(draft, limit);
    case "maddie": return searchMaddieCatalog(draft, limit);
    case "marcus": return searchMarcusCatalog(draft, limit);
    case "sofia": return searchSofiaCatalog(draft, limit);
    default: return searchJordanCatalog(draft, limit);
  }
}
"""
reveal_content = reveal_content.replace(import_stmt, new_imports)

# Replace the broken dynamic logic
broken_logic = """export function RevealScreen({ onBack, activeUserId, playIntro = false, isCN = false }: Props) {
  let night = { ...ACTIVE_REVEAL_NIGHT };
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
  }
  const dayIndex = 0;
  const [answer] = usePersistentState(`ligo:daily:${activeUserId}:answer`, '');"""

fixed_logic = """export function RevealScreen({ onBack, activeUserId, playIntro = false, isCN = false }: Props) {
  const [answer] = usePersistentState(`ligo:daily:${activeUserId}:answer`, '');
  
  let night = { ...ACTIVE_REVEAL_NIGHT };
  if (answer) {
    // Exact match from user's actual catalog
    const matches = searchCatalogLocal(activeUserId, answer, 1);
    if (matches && matches.length > 0) {
      night.topSong = matches[0].title;
      night.topArtist = matches[0].artist;
      night.topArt = matches[0].art;
    }
  }

  const dayIndex = 0;"""

# In case it didn't match perfectly, use regex or replace piece by piece
if broken_logic in reveal_content:
    reveal_content = reveal_content.replace(broken_logic, fixed_logic)
else:
    # Try just replacing the if block
    broken_if = """  let night = { ...ACTIVE_REVEAL_NIGHT };
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
    fixed_if = """  const [answer] = usePersistentState(`ligo:daily:${activeUserId}:answer`, '');
  let night = { ...ACTIVE_REVEAL_NIGHT };
  if (answer) {
    const matches = searchCatalogLocal(activeUserId, answer, 1);
    if (matches && matches.length > 0) {
      night.topSong = matches[0].title;
      night.topArtist = matches[0].artist;
      night.topArt = matches[0].art;
    }
  }"""
    reveal_content = reveal_content.replace(broken_if, fixed_if)
    # Remove the duplicate const [answer] later down
    reveal_content = reveal_content.replace("  const [answer] = usePersistentState(`ligo:daily:${activeUserId}:answer`, '');", "", 1)

with open(reveal_path, 'w') as f:
    f.write(reveal_content)

print("Dynamic fix complete")
