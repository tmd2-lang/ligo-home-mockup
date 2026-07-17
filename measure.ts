import { INITIAL_EVENTS } from './lib/mockEventsData';
INITIAL_EVENTS.forEach(e => {
  const hostLen = e.host?.length || 0;
  const venueLen = e.venue?.length || 0;
  const nameLen = e.name?.length || 0;
  if (hostLen > 40 || venueLen > 40 || nameLen > 40) {
    console.log(`${e.name}: host=${hostLen}, venue=${venueLen}, name=${nameLen}`);
  }
});
