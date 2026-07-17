const fs = require('fs');

const path = 'app/data/events.ts';
let content = fs.readFileSync(path, 'utf8');

const privateEvents = `
  // ----------------------------------------------------
  // PRIVATE EVENTS FOR MY EVENTS / INVITES TAB
  // ----------------------------------------------------
  {
    id: 101,
    title: "MAYA'S 20TH: AFTER HOURS",
    subtitle: 'Invited by Maya Thompson',
    image: '',
    hostAvatar: 'MT',
    hostAvatarColor: '#FF0055',
    hostName: 'Maya Thompson',
    location: 'Private residence, Burleith',
    visibility: 'private',
    currentUserStatus: 'pending',
    relativeDays: 2,
    time: '9:30 PM',
    description: [
      "Twenty deserves a proper night out — or in this case, a proper night in.",
      "Come celebrate Maya's birthday with drinks, cake, music, and an apartment full of people she loves. The night starts upstairs with birthday drinks and dessert, then the rest of the house opens up and it gets loud. Dress like the pictures are getting posted.",
      "This is a private party for friends and invited guests. Please respond so we can plan for numbers — and so the address doesn't have to float around publicly. The exact address and entry details unlock after your RSVP is confirmed."
    ],
    details: [
      { label: "Dress code", value: "going-out attire" },
      { label: "Bring", value: "nothing required — a bottle or mixer is welcome" },
      { label: "Transport", value: "Walking or rideshare recommended; street parking in Burleith is a myth" }
    ],
    schedule: [
      { label: "Cake & drinks", value: "9:30 PM" },
      { label: "Music starts", value: "10:00 PM" },
      { label: "Last entry", value: "11:30 PM" },
      { label: "Ends", value: "~1:30 AM" }
    ],
    tickets: [
      { name: 'Admission', price: 'Free', desc: 'Complimentary. No ticket — an accepted invitation is required for entry.' }
    ],
    rules: [
      "Private event. Invitation required.",
      "Georgetown students and personally invited guests only.",
      "The street address stays hidden until you respond Going."
    ],
    guestPolicy: "Invitations are non-transferable. No open plus-ones — text Maya directly if you want to bring someone. Don't share the address or the invite link.",
    socialProof: { going: 47, pending: 12, connections: 8 },
    tags: ['Birthday', 'House Party', 'Private', 'Burleith', 'Nightlife'],
    organizer: {
      name: 'Maya Thompson',
      desc: 'Georgetown sophomore studying Culture and Politics. Hosting dinners, birthdays, and any gathering that gives people a reason to dress up.',
      upcoming: 3,
      followers: '286' // Using followers as connections in EventDetailView
    }
  },
  {
    id: 102,
    title: "SAE WINTER FORMAL: MIDNIGHT IN MONACO",
    subtitle: 'Invited by Will Harrington',
    image: '',
    hostAvatar: 'ΣΑΕ',
    hostAvatarColor: '#4B0082',
    hostName: 'Sigma Alpha Epsilon',
    location: 'The Line DC',
    visibility: 'private',
    currentUserStatus: 'pending',
    relativeDays: 9,
    time: '8:00 PM',
    description: [
      "For one night, Washington becomes Monaco.",
      "Sigma Alpha Epsilon invites members and their guests to Midnight in Monaco, this year's winter formal at The Line DC. The evening starts with departures from campus, then moves into cocktails, casino tables, dinner bites, and a full dance floor inside one of DC's most distinctive hotels. It's the kind of night that begins with posed photos and ends in motion blur.",
      "This invitation was extended to you by Will Harrington. Please respond by Sunday so transportation and final guest counts can be confirmed."
    ],
    details: [
      { label: "Dress code", value: "formal — tuxedos or dark suits; evening dresses or equivalent" },
      { label: "Coat check", value: "complimentary" },
      { label: "Photos", value: "Event photographer on site, plus disposable cameras scattered through the venue" }
    ],
    schedule: [
      { label: "Campus check-in", value: "7:15 PM" },
      { label: "First bus", value: "7:30 PM" },
      { label: "Doors", value: "8:00 PM" },
      { label: "Casino tables", value: "8:00–10:00 PM" },
      { label: "Dancing", value: "9:30 PM–12:15 AM" },
      { label: "Return buses", value: "12:15 & 12:45 AM" }
    ],
    tickets: [
      { name: 'Hosted Guest Admission', price: 'Free', desc: 'Complimentary for invited dates. Includes transportation, venue access, coat check, light dinner service, and non-alcoholic beverages.' }
    ],
    rules: [
      "Private event. SAE members and individually invited guests only.",
      "Check in at the Georgetown departure point — guests may not board at the venue without prior approval.",
      "Government-issued ID and a matching invitation required. Invitations cannot be forwarded."
    ],
    guestPolicy: "Invitation valid only for the named recipient. No additional plus-ones. Responses can be changed until two days before the event.",
    socialProof: { going: 186, pending: 29, connections: 14 },
    tags: ['Formal', 'Fraternity', 'Private', 'Black Tie', 'Nightlife'],
    organizer: {
      name: 'Sigma Alpha Epsilon',
      desc: 'A private Georgetown social organization centered on brotherhood, campus life, and social programming.',
      upcoming: 4,
      followers: '721'
    }
  },
  {
    id: 103,
    title: "CANDLELIGHT SUPPER",
    subtitle: 'The 1789 Society · Members only',
    image: '',
    hostAvatar: '1789',
    hostAvatarColor: '#800000',
    hostName: 'The 1789 Society',
    location: 'Private Georgetown townhouse',
    visibility: 'private',
    currentUserStatus: 'pending',
    relativeDays: 12,
    time: '7:00 PM',
    description: [
      "Members are invited to gather for the annual Candlelight Supper.",
      "The evening takes place in a private Georgetown residence: a seated autumn dinner by candlelight, brief remarks from current members, and long conversation with a small group of alumni and invited guests. It's designed to feel less like a student event and more like an old Georgetown drawing room — quiet, unhurried, and off the radar.",
      "There is no public ticketing and no open guest list. Please respond by Sunday evening so the final table can be set. The exact address is released to confirmed guests at 3:00 PM the day of the supper."
    ],
    details: [
      { label: "Dress code", value: "cocktail attire, dark colors preferred" },
      { label: "Seating", value: "Assigned seating" },
      { label: "Menu", value: "Three-course seasonal menu — submit allergies or dietary requirements when responding" },
      { label: "Phones", value: "Phones away during remarks and dinner" }
    ],
    schedule: [
      { label: "Arrival window", value: "6:45–7:10 PM" },
      { label: "Doors close", value: "7:15 PM" },
      { label: "Dinner", value: "7:30 PM" },
      { label: "Closing toast", value: "9:30 PM" },
      { label: "Departure", value: "by 10:00 PM" }
    ],
    tickets: [
      { name: 'Members Only', price: 'Free', desc: 'No charge. Attendance limited to current members and specifically designated guests.' }
    ],
    rules: [
      "Private members-only event.",
      "Location hidden until the day of.",
      "Confirmed guests receive a temporary digital entry card in the app.",
      "Arrive within the designated window. No photography during dinner."
    ],
    guestPolicy: "No plus-ones. Invitations are personal and non-transferable. Do not share the invitation, guest list, address, or imagery outside the society.",
    socialProof: { going: 38, pending: 9, connections: 4 },
    tags: ['Members Only', 'Dinner', 'Society', 'Private', 'Tradition'],
    organizer: {
      name: 'The 1789 Society',
      desc: 'A private Georgetown society preserving friendship, discretion, and campus tradition.',
      upcoming: 2,
      followers: '96'
    }
  },
  {
    id: 104,
    title: "BLACK & WHITE",
    subtitle: 'The Rose Committee · Private event',
    image: '',
    hostAvatar: 'TRC',
    hostAvatarColor: '#000000',
    hostName: 'The Rose Committee',
    location: 'Observatory rooftop',
    visibility: 'private',
    currentUserStatus: 'going',
    relativeDays: 4,
    time: '10:00 PM',
    description: [
      "One rooftop. Two colors. Choose carefully.",
      "The Rose Committee presents Black & White, a private late-night party built around a single rule: every guest arrives dressed entirely in black or entirely in white. No other colors, no exceptions that require an explanation.",
      "The night moves through three spaces — a quieter cocktail hour up front, music on the main floor, and a flash portrait setup running all night. The crowd leans editorial, not chaotic: tight, late, and memorable."
    ],
    details: [
      { label: "Dress code", value: "entirely black or entirely white. Silver jewelry and metallic accessories permitted; denim, athletic wear, and visible color accents discouraged." },
      { label: "Drinks", value: "Beer, wine, simple cocktails, and non-alcoholic options." },
      { label: "Transport", value: "Rideshare recommended." }
    ],
    schedule: [
      { label: "Cocktails", value: "10:00 PM" },
      { label: "Portrait room opens", value: "10:30 PM" },
      { label: "Music", value: "11:00 PM" },
      { label: "Last entry", value: "12:30 AM" },
      { label: "Ends", value: "2:00 AM" }
    ],
    tickets: [
      { name: 'Admission', price: 'Free', desc: 'Complimentary. Invitation required. No public ticketing.' }
    ],
    rules: [
      "Private event.",
      "Full address visible only to guests marked Going or Maybe.",
      "Entry requires the rotating event pass shown in the app — screenshots not accepted.",
      "Capacity strictly limited."
    ],
    guestPolicy: "Named invitations only, no open plus-ones — requests go through the host and approval isn't guaranteed. Accepted invitations remain changeable until the event begins.",
    socialProof: { going: 84, pending: 17, connections: 11 },
    tags: ['Private Party', 'Fashion', 'Monochrome', 'Rooftop', 'Nightlife'],
    organizer: {
      name: 'The Rose Committee',
      desc: 'A private Georgetown social collective hosting dinners, parties, and small-format cultural events.',
      upcoming: 5,
      followers: '614'
    }
  },
  {
    id: 105,
    title: "CABIN FEVER: A PRIVATE WEEKEND AWAY",
    subtitle: 'Invited by Caroline Lee',
    image: '',
    hostAvatar: 'CL',
    hostAvatarColor: '#228B22',
    hostName: 'Caroline Lee',
    location: 'Private house, Middleburg, Virginia',
    visibility: 'private',
    currentUserStatus: 'maybe',
    relativeDays: 14,
    time: '4:00 PM',
    description: [
      "Campus will still be here when we get back.",
      "A small group is heading to Middleburg for one night away — dinner, drinks, music, a fire outside if the weather cooperates, and enough beds and couches for everyone to stay over. We leave Georgetown Friday afternoon and roll back Saturday after a slow breakfast.",
      "Final rides, room assignments, and the house address get shared once the guest list is confirmed. A Maybe is completely fine while you sort your schedule — but beds go to confirmed guests first."
    ],
    details: [
      { label: "Bring", value: "overnight bag, warm layers, comfortable shoes, personal drinks." },
      { label: "Dress", value: "relaxed by day, dinner and going-out looks at night." },
      { label: "Sleeping", value: "shared bedrooms, pullouts, and couches — roommate requests after RSVP." },
      { label: "Note", value: "Bonfire subject to weather." }
    ],
    schedule: [
      { label: "Day one", value: "Meet at Georgetown 3:45 PM · Depart 4:00 PM · House arrival ~5:30 PM · Dinner 7:30 PM · Bonfire 9:00 PM · Music inside 10:30 PM onward" },
      { label: "Day two", value: "Coffee & breakfast 9:30 AM · House reset 11:00 AM · Depart noon · Back at Georgetown ~1:30 PM" }
    ],
    tickets: [
      { name: 'Contribution', price: '$48', desc: 'covers the house, shared groceries, dinner, breakfast, firewood, and basic drinks. Payment request goes out only after you confirm.' }
    ],
    rules: [
      "Private trip.",
      "House address hidden until you confirm and submit your contribution.",
      "Only confirmed guests can see room assignments and carpool groups.",
      "Invite links can't be transferred."
    ],
    guestPolicy: "Invitation only. No unapproved plus-ones. Group capped at 24. Guests should plan on the full overnight unless arranging separate transportation.",
    socialProof: { going: 19, pending: 4, connections: 7 }, // Wait, maybe: 5. I will handle this in custom UI or just add it to 'going'
    tags: ['Weekend Trip', 'Private', 'Friends', 'Middleburg', 'Overnight'],
    organizer: {
      name: 'Caroline Lee',
      desc: 'Georgetown sophomore studying Marketing and Art History. Usually planning the dinner, the trip, or the after-party.',
      upcoming: 4,
      followers: '341' // Person-hosted
    }
  },
  {
    id: 106,
    title: "THE YOUNG ALUMNI TABLE",
    subtitle: 'Shared with Georgetown sophomores in finance',
    image: '',
    hostAvatar: 'GUA',
    hostAvatarColor: '#123712',
    hostName: 'GUASFCU',
    location: 'Filomena Ristorante, private dining room',
    visibility: 'private',
    currentUserStatus: 'declined',
    relativeDays: -5,
    time: '7:00 PM',
    description: [
      "A smaller table makes better conversations.",
      "GUASFCU invites a select group of students to join recent Georgetown alumni for dinner in Filomena's private dining room. Instead of a panel or a name-tag reception, guests are seated among alumni working across banking, private equity, consulting, venture, and fintech — for candid questions, practical advice, and introductions that outlast the night.",
      "Seating is limited to 28. If you can't attend, please decline promptly so your seat releases to the waitlist."
    ],
    details: [
      { label: "Menu", value: "Family-style Italian dinner, vegetarian accommodations available." },
      { label: "Networking", value: "Attendees receive a short alumni guest list beforehand. Alumni contact info shared only where the alum has opted in." },
      { label: "Photos", value: "One group photo after dinner." }
    ],
    schedule: [
      { label: "Arrival & introductions", value: "6:45 PM" },
      { label: "Seated", value: "7:10 PM" },
      { label: "Dinner", value: "7:15 PM" },
      { label: "Table rotation", value: "8:00 PM" },
      { label: "Closing remarks", value: "9:00 PM" },
      { label: "Ends", value: "9:15 PM" }
    ],
    tickets: [
      { name: 'Admission', price: 'Free', desc: 'Complimentary — sponsored by GUASFCU and participating alumni. Accepted invitation required.' }
    ],
    rules: [
      "Private professional event.",
      "Invited GUASFCU members and selected Georgetown students only.",
      "Assigned seating. Business casual required. Arrive before dinner service.",
      "Invitations non-transferable."
    ],
    guestPolicy: "No plus-ones. Limited to the selected student audience.",
    socialProof: { going: 28, pending: 0, connections: 9 }, // Past event 
    tags: ['Finance', 'Alumni', 'Dinner', 'Professional', 'Private'],
    organizer: {
      name: 'GUASFCU',
      desc: 'A student-run financial institution providing leadership experience, financial services, and lifelong alumni connection.',
      upcoming: 7,
      followers: '2,850'
    }
  }
];
`;

content = content.replace('];\n', privateEvents);

// We need to inject relative date logic at the end of the file
const relativeDateLogic = `
// Process relative dates dynamically
const today = new Date();
LigoEvents.forEach(e => {
  if (e.relativeDays !== undefined) {
    const d = new Date(today);
    d.setDate(today.getDate() + e.relativeDays);
    const days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
    const months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    e.dateStr = \`\${days[d.getDay()]} · \${months[d.getMonth()]}.\${String(d.getDate()).padStart(2, '0')} · \${e.time}\`;
    e.date = e.dateStr;
    e.timeFull = \`\${days[d.getDay()]}, \${months[d.getMonth()]}/\${String(d.getDate()).padStart(2, '0')} at \${e.time}\`;
    e.parsedDate = d;
  } else {
    // For sorting non-relative events (mock data)
    // Create a dummy parsedDate if we want to sort, or just fallback
    e.parsedDate = new Date(); // fallback
  }
  // Make descriptions one string with \\n\\n
  if (Array.isArray(e.description)) {
    e.description = e.description.join('\\\\n\\\\n');
  }
  if (e.id === 3) e.currentUserStatus = 'going';
  if (e.id === 15) e.currentUserStatus = 'maybe';
});
`;

content = content + "\n" + relativeDateLogic;

fs.writeFileSync(path, content, 'utf8');
console.log('Appended private events to ' + path);
