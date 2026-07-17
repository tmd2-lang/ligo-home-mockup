import { ALESSIA_CATALOG } from './alessia-catalog';
import { BENNETT_CATALOG } from './bennett-catalog';
import { CAROLINE_CATALOG } from './caroline-catalog';
import { CHARLOTTE_CATALOG } from './charlotte-catalog';
import { COLE_CATALOG } from './cole-catalog';
import { JORDAN_CATALOG } from './jordan-catalog';
import { MADDIE_CATALOG } from './maddie-catalog';
import { MARCUS_CATALOG } from './marcus-catalog';
import { SOFIA_CATALOG } from './sofia-catalog';

export type CatalogTrack = {
  title: string;
  artist: string;
  album: string;
  coverArt: string;
};

// Flatten all catalogs into one unified array of tracks
const ALL_TRACKS: CatalogTrack[] = [
  ...ALESSIA_CATALOG.map(t => ({ title: t.title, artist: t.artist, album: t.album, coverArt: t.cover })),
  ...BENNETT_CATALOG.map(t => ({ title: t.title, artist: t.artist, album: t.album, coverArt: t.cover })),
  ...CAROLINE_CATALOG.map(t => ({ title: t.title, artist: t.artist, album: t.album, coverArt: t.cover })),
  ...CHARLOTTE_CATALOG.map(t => ({ title: t.title, artist: t.artist, album: t.album, coverArt: t.cover })),
  ...COLE_CATALOG.map(t => ({ title: t.title, artist: t.artist, album: t.album, coverArt: t.cover })),
  ...JORDAN_CATALOG.map(t => ({ title: t.title, artist: t.artist, album: t.album, coverArt: t.cover })),
  ...MADDIE_CATALOG.map(t => ({ title: t.title, artist: t.artist, album: t.album, coverArt: t.cover })),
  ...MARCUS_CATALOG.map(t => ({ title: t.title, artist: t.artist, album: t.album, coverArt: t.cover })),
  ...SOFIA_CATALOG.map(t => ({ title: t.title, artist: t.artist, album: t.album, coverArt: t.cover })),
];

// Deduplicate tracks by 'artist - title'
const trackMap = new Map<string, CatalogTrack>();
for (const t of ALL_TRACKS) {
  const key = `${t.artist.toLowerCase()} - ${t.title.toLowerCase()}`;
  if (!trackMap.has(key)) {
    trackMap.set(key, t);
  }
}
export const UNIFIED_CATALOG = Array.from(trackMap.values());

export function searchCatalog(query: string, limit = 20): CatalogTrack[] {
  if (!query) return [];
  const q = query.toLowerCase();
  
  const results = [];
  for (const track of UNIFIED_CATALOG) {
    if (track.title.toLowerCase().includes(q) || track.artist.toLowerCase().includes(q) || track.album.toLowerCase().includes(q)) {
      results.push(track);
    }
    if (results.length >= limit) break;
  }
  return results;
}

// Generate a unique list of artists with one photo each for artist search
const artistMap = new Map<string, { name: string; photo: string }>();
for (const t of UNIFIED_CATALOG) {
  if (!artistMap.has(t.artist)) {
    artistMap.set(t.artist, { name: t.artist, photo: t.coverArt }); // Fallback to coverArt if we don't have artist photos
  }
}
export const UNIFIED_ARTISTS = Array.from(artistMap.values());

export function searchArtists(query: string, limit = 20) {
  if (!query) return [];
  const q = query.toLowerCase();
  
  const results = [];
  for (const artist of UNIFIED_ARTISTS) {
    if (artist.name.toLowerCase().includes(q)) {
      results.push(artist);
    }
    if (results.length >= limit) break;
  }
  return results;
}
