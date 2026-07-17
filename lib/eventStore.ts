import { LigoEvent } from "@/components/PracticeEventsScreenV2";

export type LigoRsvp = {
  id: string;
  name: string;
  phone: string;
  response: 'going' | 'maybe' | 'cant_go';
  answers: Record<string, string>;
  timestamp: string;
};

const EVENTS_KEY = 'ligo_events';
const RSVPS_KEY = 'ligo_rsvps';

const isBrowser = typeof window !== 'undefined';

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function saveEvent(event: LigoEvent): string {
  if (!isBrowser) return event.id;

  let baseSlug = slugify(event.title) || 'untitled-event';
  let finalSlug = baseSlug;
  
  const events = getStoredEvents();
  
  // Handle collisions (if it's a new event or title changed to collide with another)
  let counter = 2;
  while (events[finalSlug] && events[finalSlug].id !== event.id) {
    finalSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  // Update event with final slug
  const finalEvent = { ...event, id: finalSlug };
  events[finalSlug] = finalEvent;
  
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  
  return finalSlug;
}

export function getEvent(slug: string): LigoEvent | null {
  if (!isBrowser) return null;
  const events = getStoredEvents();
  return events[slug] || null;
}

export function listEvents(): LigoEvent[] {
  if (!isBrowser) return [];
  const events = getStoredEvents();
  return Object.values(events);
}

export function addRsvp(slug: string, rsvp: LigoRsvp): void {
  if (!isBrowser) return;
  const rsvps = getStoredRsvps();
  if (!rsvps[slug]) {
    rsvps[slug] = [];
  }
  
  // Replace if exists by phone, else push
  const existingIndex = rsvps[slug].findIndex((r: LigoRsvp) => r.phone === rsvp.phone);
  if (existingIndex >= 0) {
    rsvps[slug][existingIndex] = rsvp;
  } else {
    rsvps[slug].push(rsvp);
  }
  
  localStorage.setItem(RSVPS_KEY, JSON.stringify(rsvps));
}

export function getRsvps(slug: string): LigoRsvp[] {
  if (!isBrowser) return [];
  const rsvps = getStoredRsvps();
  return rsvps[slug] || [];
}

// Internal helpers
function getStoredEvents(): Record<string, LigoEvent> {
  if (!isBrowser) return {};
  try {
    return JSON.parse(localStorage.getItem(EVENTS_KEY) || '{}');
  } catch {
    return {};
  }
}

function getStoredRsvps(): Record<string, LigoRsvp[]> {
  if (!isBrowser) return {};
  try {
    return JSON.parse(localStorage.getItem(RSVPS_KEY) || '{}');
  } catch {
    return {};
  }
}
