export const LigoEvents = [
  // 14: The Georgetown Saxatones (ID 15)
  {
    id: 15,
    title: 'VOICES FOR GOOD',
    subtitle: 'The Georgetown Saxatones',
    relativeDays: 3,
    date: 'THU · 11.12 · 7:30 PM',
    image: '/Posh/Saxatones.png',
    hostAvatar: 'SAX',
    hostAvatarColor: '#660000',
    hostName: 'The Georgetown Saxatones',
    location: 'Dahlgren Chapel, Georgetown University',
    timeFull: 'Thu, Nov 12 at 7:30 PM - 9:00 PM (EST)',
    description: [
      "Music in service of something larger.",
      "The Georgetown Saxatones present **Voices for Good**, an evening of contemporary a cappella supporting a local community partner.",
      "The concert brings together new arrangements, featured solos, and guest performers for a night centered on music, service, and the Georgetown community."
    ],
    details: [
      { label: "Doors", value: "7:00 PM" },
      { label: "Concert", value: "7:30 PM" },
      { label: "Run time", value: "Approximately 80 minutes" },
      { label: "Donation opportunities", value: "Available during checkout and at the venue" }
    ],
    tickets: [
      { name: 'Student RSVP', price: 'Free', desc: 'Guaranteed entry' },
      { name: 'Supporter Ticket', price: '$10', desc: 'Includes base donation' },
      { name: 'Community Sponsor', price: '$25', desc: 'Includes premium donation' }
    ],
    rules: [
      "Open to Georgetown students, faculty, alumni, families, and members of the public.",
      "Seating is first come, first served."
    ],
    socialProof: { going: 212, connections: 13 },
    tags: ['A Cappella', 'Benefit', 'Community Service', 'Live Music', 'All Ages', 'Georgetown'],
    organizer: { name: 'The Georgetown Saxatones', desc: 'Georgetown’s service-based a cappella group, established in 2003.', upcoming: 3, followers: '1,520' }
  },

  // 10: Blue & Gray Tour Guide Society (ID 11)
  {
    id: 11,
    title: 'BLUE & GRAY AFTER DARK',
    subtitle: 'Blue & Gray Tour Guide Society',
    date: 'THU · 09.24 · 8:00 PM',
    image: '/Posh/BGTourGuide.jpeg',
    hostAvatar: 'B&G',
    hostAvatarColor: '#041e42',
    hostName: 'Blue & Gray Tour Guide Society',
    location: 'Healy Lawn, Georgetown University',
    timeFull: 'Thu, Sep 24 at 8:00 PM - 10:00 PM (EDT)',
    description: [
      "Tradition looks better at night.",
      "Blue & Gray Tour Guide Society invites current members and interested students to **Blue & Gray After Dark**, a welcome-back evening centered on community, Georgetown tradition, and the people who help tell the university’s story.",
      "Expect light bites, photos, conversation, and a few Hilltop stories worth hearing in person."
    ],
    details: [
      { label: "Check-in", value: "7:45 PM" },
      { label: "Program begins", value: "8:20 PM" },
      { label: "Attire", value: "Smart casual" }
    ],
    tickets: [
      { name: 'Member RSVP', price: 'Free', desc: 'For current guides' },
      { name: 'Prospective Guide RSVP', price: 'Free', desc: 'For interested students' }
    ],
    rules: [
      "Open to Blue & Gray members and approved prospective guides.",
      "Georgetown email required."
    ],
    socialProof: { going: 96, connections: 11 },
    tags: ['Community', 'Campus Tradition', 'Networking', 'Social', 'Free', 'Georgetown'],
    organizer: { name: 'Blue & Gray Tour Guide Society', desc: 'Student ambassadors sharing Georgetown’s history, campus, and traditions.', upcoming: 2, followers: '1,040' }
  },

  // 6: Frequency (ID 7)
  {
    id: 7,
    title: 'FREQUENCY',
    subtitle: 'Live from the Hilltop',
    date: 'THU · 10.22 · 8:00 PM',
    image: '/Posh/GeorgetownRadio.png',
    hostAvatar: 'WGTB',
    hostAvatarColor: '#7fa832',
    hostName: 'WGTB Georgetown Radio',
    location: 'Bulldog Alley, Georgetown University',
    timeFull: 'Thu, Oct 22 at 8:00 PM - 11:30 PM (EDT)',
    description: [
      "Four acts. One room. No filler.",
      "WGTB Georgetown Radio and Prospect Records present **Frequency**, a live showcase featuring emerging Georgetown artists across indie rock, alternative R&B, electronic, and experimental pop.",
      "Come early. Stand close. Find your next favorite artist before everyone else does."
    ],
    details: [
      { label: "Doors", value: "7:30 PM" },
      { label: "First act", value: "8:00 PM" },
      { label: "DJ closing set", value: "10:45 PM" }
    ],
    tickets: [
      { name: 'Student RSVP', price: 'Free', desc: 'Guaranteed entry' },
      { name: 'Support the Artists', price: '$5', desc: 'Suggested contribution' }
    ],
    rules: [
      "Open to Georgetown students, faculty, and approved guests.",
      "Limited capacity.",
      "Entry is first come, first served even with an RSVP."
    ],
    socialProof: { going: 193, connections: 16 },
    tags: ['Live Music', 'Student Artists', 'Indie', 'DJ', 'Georgetown', 'Free'],
    organizer: {
      name: 'WGTB & Prospect Records',
      desc: 'Student-led artist development, radio, and independent music collective.',
      upcoming: 9,
      followers: '3,750'
    }
  },

  // 8: Georgetown Club Boxing (ID 9)
  {
    id: 9,
    title: 'HILLTOP FIGHT NIGHT',
    subtitle: 'Georgetown Club Boxing',
    date: 'FRI · 10.30 · 7:00 PM',
    image: '/Posh/Boxing.png',
    hostAvatar: 'GCB',
    hostAvatarColor: '#b30000',
    hostName: 'Georgetown Club Boxing',
    location: 'McDonough Gymnasium, Georgetown University',
    timeFull: 'Fri, Oct 30 at 7:00 PM - 10:30 PM (EDT)',
    description: [
      "Lights on. Gloves up.",
      "Georgetown Club Boxing presents **Hilltop Fight Night**, an evening of live amateur bouts featuring Georgetown fighters and guest teams from across the DMV.",
      "Expect multiple matchups, walkouts, student energy, and a packed gym atmosphere."
    ],
    details: [
      { label: "Doors", value: "6:30 PM" },
      { label: "First bout", value: "7:15 PM" },
      { label: "Main event", value: "9:30 PM" }
    ],
    tickets: [
      { name: 'Student Admission', price: '$10', desc: 'Standard entry' },
      { name: 'General Admission', price: '$18', desc: 'Non-student' },
      { name: 'Floor Seating', price: '$25', desc: 'Ringside access' }
    ],
    rules: [
      "Open to Georgetown students, faculty, alumni, and approved guests.",
      "Student ID required for student tickets.",
      "No outside food or drink."
    ],
    socialProof: { going: 418, connections: 22 },
    tags: ['Sports', 'Boxing', 'Competition', 'Campus', 'Ticketed', 'Georgetown'],
    organizer: { name: 'Georgetown Club Boxing', desc: 'Competitive club team training and competing year-round.', upcoming: 4, followers: '1,150' }
  },

  // 16: Georgetown University Dance Company (ID 17)
  {
    id: 17,
    title: 'BETWEEN WORLDS',
    subtitle: 'Georgetown University Dance Company',
    date: 'FRI · 02.12 · 7:30 PM',
    image: '/Posh/GeorgetownUniverisityDance.png',
    hostAvatar: 'GUDC',
    hostAvatarColor: '#003366',
    hostName: 'Georgetown University Dance Company',
    location: 'Gonda Theatre, Georgetown University',
    timeFull: 'Fri, Feb 12 at 7:30 PM - 9:00 PM (EST)',
    description: [
      "Movement begins where language ends.",
      "Georgetown University Dance Company presents **Between Worlds**, a spring repertory concert exploring transition, memory, identity, and the spaces between certainty and change.",
      "The program features student and guest choreography across classical ballet, contemporary, modern, jazz, and hip-hop."
    ],
    details: [
      { label: "Doors", value: "7:00 PM" },
      { label: "Performance", value: "7:30 PM" },
      { label: "Run time", value: "Approximately 90 minutes" },
      { label: "Artist conversation", value: "Following Friday’s performance" }
    ],
    tickets: [
      { name: 'Georgetown Student', price: '$10', desc: 'Student discount' },
      { name: 'Faculty and Staff', price: '$12', desc: 'University discount' },
      { name: 'General Admission', price: '$18', desc: 'Standard seating' }
    ],
    rules: [
      "Reserved seating.",
      "Open to Georgetown students and the public.",
      "Photography and recording are not permitted during the performance."
    ],
    socialProof: { going: 492, connections: 29 },
    tags: ['Dance', 'Ballet', 'Contemporary', 'Student Choreography', 'Performance', 'Georgetown'],
    organizer: { name: 'Georgetown University Dance Company', desc: 'Georgetown’s pre-professional concert repertory dance company, established in 1974.', upcoming: 3, followers: '2,940' }
  },

  // 12: Georgetown GraceNotes (ID 13)
  {
    id: 13,
    title: 'VELVET HOUR',
    subtitle: 'Georgetown GraceNotes',
    date: 'FRI · 11.06 · 8:00 PM',
    image: '/Posh/GraceNotes.png',
    hostAvatar: 'GN',
    hostAvatarColor: '#4a004a',
    hostName: 'Georgetown GraceNotes',
    location: 'Copley Formal Lounge, Georgetown University',
    timeFull: 'Fri, Nov 6 at 8:00 PM - 9:30 PM (EST)',
    description: [
      "An evening built around voices.",
      "Georgetown GraceNotes presents **Velvet Hour**, a fall concert featuring new arrangements, featured soloists, and the songs that shaped this semester.",
      "Expect contemporary pop, R&B, and stripped-back vocal performances in one of Georgetown’s most intimate formal spaces."
    ],
    details: [
      { label: "Doors", value: "7:30 PM" },
      { label: "Performance", value: "8:00 PM" },
      { label: "Run time", value: "Approximately 90 minutes" },
      { label: "Seating", value: "First come, first served" }
    ],
    tickets: [
      { name: 'Student RSVP', price: 'Free', desc: 'Standard access' },
      { name: 'General Admission', price: '$8', desc: 'Non-student' },
      { name: 'Supporter Ticket', price: '$15', desc: 'Includes an additional contribution to the group' }
    ],
    rules: [
      "Open to Georgetown students, faculty, alumni, families, and guests.",
      "An RSVP does not guarantee seating after 7:55 PM."
    ],
    socialProof: { going: 184, connections: 16 },
    tags: ['A Cappella', 'Women in Music', 'Live Performance', 'Campus', 'Georgetown', 'All Ages'],
    organizer: { name: 'Georgetown GraceNotes', desc: 'A cappella for women and gender minorities at Georgetown University, established in 1980.', upcoming: 3, followers: '1,640' }
  },

  // 21: The Hoya (ID 22)
  {
    id: 22,
    title: 'INSIDE THE NEWSROOM',
    subtitle: 'The Hoya Fall Open House',
    date: 'TUE · 09.08 · 7:00 PM',
    image: '/Posh/TheHoya.png',
    hostAvatar: 'HOYA',
    hostAvatarColor: '#0a1f44',
    hostName: 'The Hoya',
    location: 'The Hoya Newsroom, Leavey Center',
    timeFull: 'Tue, Sep 8 at 7:00 PM - 8:30 PM (EDT)',
    description: [
      "Every story starts with someone asking a better question.",
      "Join **The Hoya** for an inside look at Georgetown’s student newsroom and the people who produce its reporting, photography, commentary, design, podcasts, social content, and business operations.",
      "Meet section editors, tour the newsroom, explore open roles, and find the desk that fits how you want to contribute.",
      "No previous journalism experience is required."
    ],
    details: [
      { label: "Doors", value: "6:45 PM" },
      { label: "Welcome", value: "7:00 PM" },
      { label: "Section rotations", value: "7:15 PM" },
      { label: "Editor coffee-chat signups", value: "8:10 PM" }
    ],
    tickets: [
      { name: 'General RSVP', price: 'Free', desc: 'Open house registration' }
    ],
    rules: [
      "Open to all Georgetown undergraduate students.",
      "Georgetown email verification required."
    ],
    socialProof: { going: 147, connections: 20 },
    tags: ['Journalism', 'Media', 'Open House', 'Recruitment', 'Creative', 'Georgetown'],
    organizer: { name: 'The Hoya', desc: 'Georgetown University’s student newspaper of record.', upcoming: 5, followers: '12,400' }
  },

  // 15: Mask & Bauble Dramatic Society (ID 16)
  {
    id: 16,
    title: 'THE DONN B. MURPHY ONE-ACTS',
    subtitle: 'Mask & Bauble Dramatic Society',
    date: 'FRI · 04.09 · 8:00 PM',
    image: '/Posh/MaskBauble.png',
    hostAvatar: 'M&B',
    hostAvatarColor: '#1a1a1a',
    hostName: 'Mask & Bauble Dramatic Society',
    location: 'Poulton Hall, Stage III, Georgetown University',
    timeFull: 'Fri, Apr 9 at 8:00 PM - 10:00 PM (EDT)',
    description: [
      "Three plays. Three worlds. One stage.",
      "Mask & Bauble presents the **Donn B. Murphy One-Act Play Festival**, featuring original student-written works selected for full production.",
      "Each piece is brought to life by student directors, actors, designers, and production teams, creating one of the most distinctly Georgetown nights of theater each year."
    ],
    details: [
      { label: "Friday", value: "8:00 PM" },
      { label: "Saturday", value: "2:00 PM and 8:00 PM" },
      { label: "Sunday", value: "2:00 PM" },
      { label: "Run time", value: "Approximately two hours, including intermission" }
    ],
    tickets: [
      { name: 'Georgetown Student', price: '$8', desc: 'Standard entry' },
      { name: 'General Admission', price: '$12', desc: 'Non-student' },
      { name: 'Festival Pass', price: '$20', desc: 'Access to both rotating programs' }
    ],
    rules: [
      "Open to students and the public.",
      "Seating is limited due to the black-box venue.",
      "Late seating is at the discretion of house management."
    ],
    socialProof: { going: 198, connections: 17 },
    tags: ['Theater', 'Student Writing', 'Original Work', 'Festival', 'Ticketed', 'Georgetown'],
    organizer: { name: 'Mask & Bauble Dramatic Society', desc: 'Student-produced theater at Georgetown since 1852.', upcoming: 5, followers: '2,180' }
  },

  // 3: After Hours (ID 4)
  { 
    id: 4, 
    title: 'AFTER HOURS', 
    subtitle: 'Georgetown Sigma Phi Epsilon', 
    date: 'FRI · 09.18 · 10:00 PM', 
    image: '/Posh/SigEpFlyer.png', 
    hostAvatar: 'ΣΦΕ',
    hostAvatarColor: '#7a0016', 
    hostName: 'Georgetown Sigma Phi Epsilon',
    location: 'Georgetown, Washington, DC',
    timeFull: 'Fri, Sep 18 at 10:00 PM - 1:30 AM (EDT)',
    description: [
      "The city gets quieter. We don't.",
      "Georgetown SigEp presents **After Hours**, a late-night social bringing together Georgetown students for one of the first major events of the semester.",
      "Expect a packed room, a live student DJ, late-night energy, and a limited guest list curated for the night.",
      "Entry is available through advance RSVP only. Capacity is limited, and registration does not guarantee admission once the venue reaches capacity.",
      "The exact location will be shared with approved guests before the event."
    ],
    details: [
      { label: "Music", value: "Hip-hop, house, throwbacks, and late-night edits" },
      { label: "Dress code", value: "Elevated night out" },
      { label: "Doors", value: "10:00 PM" },
      { label: "Last entry", value: "11:30 PM" }
    ],
    tickets: [
      { name: 'Early RSVP', price: 'Free', desc: 'Limited quantity' },
      { name: 'General Admission', price: '$10', desc: 'Standard entry' },
      { name: 'Final Release', price: '$15', desc: 'Last chance' },
      { name: 'SigEp Members', price: 'Member Access', desc: 'Requires code' }
    ],
    rules: [
      "Georgetown students and approved university guests only.",
      "A valid college ID and government-issued ID may be required at check-in.",
      "The guest list closes at 8:00 PM on the day of the event.",
      "No entry after 11:30 PM.",
      "Tickets and RSVPs are non-transferable."
    ],
    socialProof: { going: 184, connections: 12 },
    tags: ['Nightlife', 'Fraternity', 'DJ', 'Georgetown', '21+', 'Invite Approval'],
    organizer: {
      name: 'Georgetown Sigma Phi Epsilon',
      desc: 'Social fraternity at Georgetown University.',
      upcoming: 4,
      followers: '1,200'
    }
  },

  // 5: The Exchange (ID 1)
  {
    id: 1,
    title: 'THE EXCHANGE',
    subtitle: 'Alpha Kappa Psi Fall Recruitment',
    date: 'THU · 09.10 · 7:00 PM',
    image: '/Posh/AlphaKappaPsi.png',
    hostAvatar: 'AKΨ',
    hostAvatarColor: '#0a1f44',
    hostName: 'Georgetown Alpha Kappa Psi',
    location: 'Healey Family Student Center, Georgetown University',
    timeFull: 'Thu, Sep 10 at 7:00 PM - 9:00 PM (EDT)',
    description: [
      "Your first conversation could shape your next four years.",
      "Join Georgetown Alpha Kappa Psi for **The Exchange**, an evening built around conversation, community, and the people behind Georgetown's premier professional business fraternity.",
      "Meet current members, learn about the recruitment process, and hear how AKPsi members have turned campus relationships into internships, mentorship, and lifelong friendships."
    ],
    details: [
      { label: "Attire", value: "Business casual" },
      { label: "Check-in", value: "6:45 PM" },
      { label: "Program begins", value: "7:15 PM" },
      { label: "Note", value: "Light refreshments provided" }
    ],
    tickets: [
      { name: 'General RSVP', price: 'Free', desc: 'Standard access' },
      { name: 'Priority Access', price: 'Free', desc: 'For students who attended an earlier coffee chat' }
    ],
    rules: [
      "Open to current Georgetown students.",
      "Georgetown email verification required.",
      "Registration closes at noon on the day of the event."
    ],
    socialProof: { going: 126, connections: 18 },
    tags: ['Professional', 'Recruitment', 'Networking', 'Business', 'Georgetown', 'Free'],
    organizer: {
      name: 'Georgetown Alpha Kappa Psi',
      desc: 'Professional business fraternity focused on leadership, community, and professional development.',
      upcoming: 5,
      followers: '1,480'
    }
  },

  // 2: One Last First Night (ID 8)
  {
    id: 8,
    title: 'ONE LAST FIRST NIGHT',
    subtitle: 'Georgetown Class of 2027',
    date: 'SAT · 09.12 · 8:30 PM',
    image: '/Posh/Classof27.png',
    hostAvatar: 'SCC',
    hostAvatarColor: '#032363',
    hostName: 'Senior Class Committee',
    location: 'The Waterfront (Venue released to verified seniors)',
    timeFull: 'Sat, Sep 12 at 8:30 PM - 12:30 AM (EDT)',
    description: [
      "The beginning of the last chapter.",
      "The Senior Class Committee invites the Class of 2027 to **One Last First Night**, the official opening celebration of senior year.",
      "Reconnect after summer, take in the waterfront, and start the year with the people who made Georgetown feel like home.",
      "Featuring a live DJ, class photography, Georgetown giveaways, and late-night food."
    ],
    details: [
      { label: "Doors", value: "8:30 PM" },
      { label: "Class toast", value: "9:30 PM" },
      { label: "Last entry", value: "10:30 PM" }
    ],
    tickets: [
      { name: 'Senior Early Access', price: '$10', desc: 'Limited quantity' },
      { name: 'General Senior Admission', price: '$15', desc: 'Standard entry' },
      { name: 'Final Release', price: '$20', desc: 'Last chance' }
    ],
    rules: [
      "Georgetown Class of 2027 only.",
      "Graduation year verified through Georgetown email and student profile.",
      "Tickets are transferable only to another verified senior."
    ],
    socialProof: { going: 624, connections: 39 },
    tags: ['Senior Year', 'Class of 2027', 'Waterfront', 'Dance', 'Georgetown', 'Verified Access'],
    organizer: {
      name: 'Senior Class Committee',
      desc: 'Creating traditions, events, and shared experiences for the Class of 2027.',
      upcoming: 12,
      followers: '2,900'
    }
  },

  // 4: The Black Affair (ID 5)
  {
    id: 5,
    title: 'THE BLACK AFFAIR',
    subtitle: 'An Evening in Black',
    date: 'SAT · 10.17 · 9:00 PM',
    image: '/Posh/TheBlackAffair.png',
    hostAvatar: 'BSA',
    hostAvatarColor: '#1a1a1a',
    hostName: 'Georgetown Black Student Alliance',
    location: 'Copley Formal Lounge, Georgetown University',
    timeFull: 'Sat, Oct 17 at 9:00 PM - 1:00 AM (EDT)',
    description: [
      "An evening made for being seen.",
      "The Georgetown Black Student Alliance invites you to **The Black Affair**, a formal celebration of Black community, style, music, and culture on the Hilltop.",
      "The night begins with a reception and photography hour before moving into dancing, live DJ sets, and late-night refreshments."
    ],
    details: [
      { label: "Reception", value: "9:00 PM" },
      { label: "Dancing", value: "10:00 PM" },
      { label: "Last entry", value: "10:45 PM" },
      { label: "Attire", value: "Formal, all-black encouraged" }
    ],
    tickets: [
      { name: 'BSA Member Access', price: 'Free', desc: 'For active members' },
      { name: 'Georgetown Student', price: '$12', desc: 'Standard admission' },
      { name: 'Approved Guest', price: '$18', desc: 'Must be registered by a student' }
    ],
    rules: [
      "Georgetown students and approved university guests.",
      "Guests must be registered by a Georgetown student.",
      "Government-issued ID required for guests."
    ],
    socialProof: { going: 312, connections: 24 },
    tags: ['Formal', 'Black Culture', 'Dance', 'Community', 'Georgetown', 'Invite Approval'],
    organizer: {
      name: 'Georgetown Black Student Alliance',
      desc: 'Building community and celebrating Black identity, culture, and student life at Georgetown.',
      upcoming: 7,
      followers: '3,200'
    }
  },
  // 11: Independent Georgetown DJ / Artist (ID 12)
  {
    id: 12,
    title: 'MIDNIGHT SET',
    subtitle: 'DJ Ren',
    date: 'FRI · 10.09 · 10:30 PM',
    image: '/Posh/DJREN!.png',
    hostAvatar: 'REN',
    hostAvatarColor: '#000000',
    hostName: 'DJ Ren / Georgetown Artist Profile',
    location: 'Georgetown, Washington, DC (Location released to confirmed guests)',
    timeFull: 'Fri, Oct 9 at 10:30 PM - 1:00 AM (EDT)',
    description: [
      "A late set for the people who stay out.",
      "Georgetown student artist DJ Ren presents **Midnight Set**, a one-night party built around house edits, jersey club, remixes, and after-hours energy.",
      "Expect a packed room, limited capacity, and a dance floor-first atmosphere."
    ],
    details: [
      { label: "Doors", value: "10:30 PM" },
      { label: "Set begins", value: "11:00 PM" },
      { label: "Last entry", value: "11:45 PM" }
    ],
    tickets: [
      { name: 'Early RSVP', price: 'Free', desc: 'Limited quantity' },
      { name: 'General Admission', price: '$8', desc: 'Standard entry' },
      { name: 'Final Release', price: '$12', desc: 'Last chance' }
    ],
    rules: [
      "Georgetown students and approved guests only.",
      "Location released after RSVP confirmation.",
      "College ID required."
    ],
    socialProof: { going: 221, connections: 19 },
    tags: ['DJ', 'Nightlife', 'House', 'Student Artist', 'Dance', 'Georgetown'],
    organizer: { name: 'DJ Ren', desc: 'Student DJ playing house, jersey club, edits, and late-night sets.', upcoming: 1, followers: '860' }
  },

  // 13: The Georgetown Phantoms (ID 14)
  {
    id: 14,
    title: 'PHANTOM FREQUENCY',
    subtitle: 'The Georgetown Phantoms',
    date: 'SAT · 10.24 · 8:30 PM',
    image: '/Posh/Phantoms.png',
    hostAvatar: 'PH',
    hostAvatarColor: '#000033',
    hostName: 'The Georgetown Phantoms',
    location: 'Gaston Hall, Georgetown University',
    timeFull: 'Sat, Oct 24 at 8:30 PM - 10:00 PM (EDT)',
    description: [
      "Turn the volume up.",
      "The Georgetown Phantoms present **Phantom Frequency**, a full-stage fall concert featuring new arrangements across pop, rock, and R&B.",
      "From stripped-back solos to full-group anthems, the night is designed to move quickly, hit hard, and sound even better live."
    ],
    details: [
      { label: "Doors", value: "8:00 PM" },
      { label: "Show", value: "8:30 PM" },
      { label: "Intermission", value: "10 minutes" },
      { label: "Run time", value: "Approximately 90 minutes" }
    ],
    tickets: [
      { name: 'Georgetown Student', price: '$8', desc: 'Standard access' },
      { name: 'General Admission', price: '$15', desc: 'Non-student seating' },
      { name: 'Front Orchestra', price: '$20', desc: 'Premium seating' }
    ],
    rules: [
      "Open to students, faculty, alumni, families, and the public.",
      "General admission by seating section."
    ],
    socialProof: { going: 436, connections: 27 },
    tags: ['A Cappella', 'Pop', 'R&B', 'Live Music', 'Ticketed', 'Georgetown'],
    organizer: { name: 'The Georgetown Phantoms', desc: 'Georgetown’s all-gender a cappella group performing pop, rock, and R&B since 1988.', upcoming: 4, followers: '2,760' }
  },

  // 13.5: Fall Rush Kickoff (ID 30) - Marcus's org
  {
    id: 30,
    title: 'FALL RUSH KICKOFF',
    subtitle: 'Sigma Phi Epsilon',
    date: 'TBA', // overridden by relativeDays at runtime if supported, otherwise just a fallback
    relativeDays: 9,
    image: '/Posh/NoWahala.png',
    hostAvatar: 'SPE',
    hostAvatarColor: '#5a0000',
    hostName: 'Sigma Phi Epsilon',
    location: 'On-campus venue',
    timeFull: '8:00 PM',
    time: '8:00 PM',
    visibility: 'members_only',
    description: [
      "Welcome back.",
      "Join us for the official start of our Fall Rush. Meet the brothers, learn about our values, and enjoy the night."
    ],
    details: [
      { label: "Start", value: "8:00 PM" }
    ],
    tickets: [],
    rules: ["Members and invitees only."],
    socialProof: { going: 63, connections: 10 },
    goingCount: 63,
    pendingCount: 22,
    tags: ['Greek', 'Rush', 'Members Only'],
    organizer: { name: 'Sigma Phi Epsilon', desc: 'Georgetown’s Sigma Phi Epsilon fraternity.', upcoming: 2, followers: '2,760' }
  },

  // 13.4: Saturday Darty
  {
    id: 32,
    title: 'SATURDAY DARTY ☀️',
    subtitle: 'Sigma Phi Epsilon',
    date: 'SAT · 09.19 · 2:00 PM', 
    image: '/posh/SigEpFrat.png',
    hostAvatar: 'SPE',
    hostAvatarColor: '#5a0000',
    hostName: 'Sigma Phi Epsilon',
    location: 'SigEp House',
    timeFull: 'Sat, Sep 19 at 2:00 PM - 6:00 PM',
    time: '2:00 PM',
    visibility: 'members_only',
    description: [
      "The forecast says 75 and sunny, so we're doing what we always do.",
      "Backyard open, speakers turned all the way up, drinks on ice, and everyone's invited. Hydrate now. You'll thank yourself later.",
      "Backyard opens at 2. See you there. Grab your roommates and send it."
    ],
    details: [
      { label: "Start", value: "2:00 PM" },
      { label: "End", value: "6:00 PM" }
    ],
    tickets: [],
    rules: ["Invite Only"],
    socialProof: { going: 84, connections: 15 },
    goingCount: 84,
    pendingCount: 0,
    tags: ['Greek', 'Social', 'Day Party'],
    organizer: { name: 'Sigma Phi Epsilon', desc: 'Georgetown’s Sigma Phi Epsilon fraternity.', upcoming: 3, followers: '2,760' }
  },

  // 13.6: Brotherhood Retreat (ID 31)
  {
    id: 31,
    title: 'BROTHERHOOD RETREAT',
    subtitle: 'Sigma Phi Epsilon',
    date: 'TBA',
    relativeDays: 16,
    image: '/Posh/Phantoms.png',
    hostAvatar: 'SPE',
    hostAvatarColor: '#5a0000',
    hostName: 'Sigma Phi Epsilon',
    location: 'Off-campus Cabin (Address shared with RSVP)',
    timeFull: '5:00 PM',
    time: '5:00 PM',
    visibility: 'members_only',
    description: [
      "Our annual weekend retreat.",
      "Get away from campus for a weekend of brotherhood, planning, and tradition."
    ],
    details: [
      { label: "Departure", value: "5:00 PM" }
    ],
    tickets: [],
    rules: ["Brothers only."],
    socialProof: { going: 45, connections: 8 },
    goingCount: 45,
    pendingCount: 40,
    tags: ['Greek', 'Retreat', 'Members Only'],
    organizer: { name: 'Sigma Phi Epsilon', desc: 'Georgetown’s Sigma Phi Epsilon fraternity.', upcoming: 2, followers: '2,760' }
  },

  // 0: No Wahala (was ID 6)
  {
    id: 6,
    title: 'NO WAHALA',
    subtitle: 'Afrobeats All Night',
    date: 'FRI · 09.25 · 10:00 PM',
    image: '/Posh/NoWahala.png',
    hostAvatar: 'ASG',
    hostAvatarColor: '#b54e12',
    hostName: 'African Society of Georgetown',
    location: 'Georgetown University (Venue released to ticket holders)',
    timeFull: 'Fri, Sep 25 at 10:00 PM - 1:30 AM (EDT)',
    description: [
      "No stress. No sitting down.",
      "African Society of Georgetown presents **No Wahala**, a late-night celebration powered by Afrobeats, Amapiano, Afro house, and the sounds moving across the continent and diaspora.",
      "Featuring DJ Kofi and a guest student set.",
      "Come ready to dance."
    ],
    details: [
      { label: "Doors", value: "10:00 PM" },
      { label: "Last entry", value: "11:30 PM" },
      { label: "Dress code", value: "Night-out energy" },
      { label: "Location", value: "Released to confirmed guests" }
    ],
    tickets: [
      { name: 'First Release', price: 'Free', desc: 'Limited quantity' },
      { name: 'General Admission', price: '$8', desc: 'Standard entry' },
      { name: 'Final Release', price: '$12', desc: 'Last chance' }
    ],
    rules: [
      "Georgetown students and approved college guests.",
      "College ID required.",
      "Tickets are non-transferable outside Ligo."
    ],
    socialProof: { going: 267, connections: 21 },
    tags: ['Afrobeats', 'Amapiano', 'African Culture', 'Dance', 'Nightlife', 'Georgetown'],
    organizer: {
      name: 'African Society of Georgetown',
      desc: 'Creating community through African culture, conversation, music, and celebration.',
      upcoming: 5,
      followers: '2,650'
    }
  },

  // 7: Rangila (ID 3)
  {
    id: 3,
    title: 'RANGILA: MOSAIC',
    subtitle: 'A thousand stories. One stage.',
    relativeDays: 5,
    date: 'SAT · 11.07 · 7:30 PM',
    image: '/Posh/rangilamosaic.png',
    hostAvatar: 'SAS',
    hostAvatarColor: '#8a0a1a',
    hostName: 'Georgetown South Asian Society',
    location: 'Gaston Hall, Georgetown University',
    timeFull: 'Sat, Nov 7 at 7:30 PM - 10:00 PM (EDT)',
    description: [
      "Hundreds of performers. One unforgettable stage.",
      "Georgetown South Asian Society presents **Rangila: Mosaic**, a celebration of movement, music, culture, and the stories that connect us.",
      "This year's production brings together dance teams, designers, musicians, and student storytellers from across Georgetown for one of the university's most anticipated performances.",
      "Proceeds support a selected nonprofit partner."
    ],
    details: [
      { label: "Doors", value: "6:45 PM" },
      { label: "Show", value: "7:30 PM" },
      { label: "Intermission", value: "15 minutes" },
      { label: "Run time", value: "Approximately 2.5 hours" }
    ],
    tickets: [
      { name: 'Student Balcony', price: '$12', desc: 'Upper level' },
      { name: 'Student Orchestra', price: '$18', desc: 'Lower level' },
      { name: 'General Admission', price: '$25', desc: 'Non-student seating' },
      { name: 'Supporter Ticket', price: '$40', desc: 'Includes an additional donation' }
    ],
    rules: [
      "Open to Georgetown students, faculty, families, alumni, and the public.",
      "Reserved seating.",
      "Tickets are nonrefundable."
    ],
    socialProof: { going: 1934, connections: 31 },
    tags: ['Culture', 'Dance', 'Performance', 'South Asian', 'Fundraiser', 'Georgetown'],
    organizer: {
      name: 'Georgetown South Asian Society',
      desc: 'Celebrating South Asian culture, identity, community, and creative expression.',
      upcoming: 6,
      followers: '4,300'
    }
  },

  // 1: Hilltop Live (ID 2)
  {
    id: 2,
    title: 'HILLTOP LIVE',
    subtitle: 'Kai Reign with Maya June',
    date: 'FRI · 10.02 · 8:00 PM',
    image: '/Posh/MayaJune.png',
    hostAvatar: 'GPB',
    hostAvatarColor: '#0050ff',
    hostName: 'Georgetown Program Board',
    location: 'McDonough Arena, Georgetown University',
    timeFull: 'Fri, Oct 2 at 8:00 PM - 11:00 PM (EDT)',
    description: [
      "The Hilltop's biggest night of the fall.",
      "Georgetown Program Board presents **Hilltop Live**, featuring recording artist **Kai Reign**, with an opening performance from Georgetown's own Maya June.",
      "Expect a full arena production, immersive lighting, and one night built for the entire campus."
    ],
    details: [
      { label: "Doors", value: "7:00 PM" },
      { label: "Student opener", value: "8:00 PM" },
      { label: "Headliner", value: "9:15 PM" },
      { label: "Rules", value: "No bags larger than 12 × 12 inches." }
    ],
    tickets: [
      { name: 'Student Presale', price: '$15', desc: 'Limited quantity' },
      { name: 'General Student Admission', price: '$25', desc: 'Standard entry' },
      { name: 'Faculty and Staff', price: '$30', desc: 'University ID required' }
    ],
    rules: [
      "Georgetown students, faculty, and staff only.",
      "One ticket per verified Georgetown account.",
      "Student ID required at entry.",
      "Tickets are transferable only through Ligo."
    ],
    socialProof: { going: 1842, connections: 46 },
    tags: ['Concert', 'Live Music', 'Campus', 'Georgetown', 'Ticketed', 'Featured'],
    organizer: {
      name: 'Georgetown Program Board',
      desc: 'Student-led entertainment and campus programming at Georgetown University.',
      upcoming: 8,
      followers: '8,900'
    }
  },

  // 19: GUASFCU (ID 20)
  {
    id: 20,
    title: 'THE VAULT',
    subtitle: 'GUASFCU Holiday Formal',
    date: 'SAT · 12.05 · 9:00 PM',
    image: '/Posh/GUAFSCU.png',
    hostAvatar: 'GUA',
    hostAvatarColor: '#123712',
    hostName: 'GUASFCU',
    location: 'The Ritz-Carlton Georgetown, Washington, D.C.',
    timeFull: 'Sat, Dec 5 at 9:00 PM - 12:30 AM (EST)',
    description: [
      "The books are closed for the night.",
      "GUASFCU invites interns, leadership, alumni, and registered guests to **The Vault**, its end-of-semester holiday formal.",
      "The evening includes a cocktail-style reception, department photographs, awards, a live DJ, and a final celebration before winter break."
    ],
    details: [
      { label: "Reception", value: "9:00 PM" },
      { label: "Remarks and awards", value: "9:45 PM" },
      { label: "Dancing", value: "10:15 PM" },
      { label: "Last entry", value: "10:30 PM" }
    ],
    tickets: [
      { name: 'GUASFCU Intern', price: '$20', desc: 'Member access' },
      { name: 'GUASFCU Alumni', price: '$35', desc: 'Alumni access' },
      { name: 'Registered Guest', price: '$40', desc: 'Invited guests only' }
    ],
    rules: [
      "GUASFCU members, alumni, and invited guests only.",
      "Each intern may register one guest.",
      "Government-issued ID required."
    ],
    socialProof: { going: 284, connections: 23 },
    tags: ['Formal', 'Finance', 'Members Only', 'Alumni', 'Dance', 'Georgetown'],
    organizer: { name: 'GUASFCU', desc: 'A student-run federal credit union providing financial services and hands-on professional experience at Georgetown.', upcoming: 8, followers: '3,460' }
  },

  // 17: Georgetown University Jazz Ensemble (ID 18)
  {
    id: 18,
    title: 'AFTER ELLINGTON',
    subtitle: 'Georgetown University Jazz Ensemble',
    date: 'THU · 12.03 · 7:30 PM',
    image: '/Posh/Jazz.png',
    hostAvatar: 'GUJE',
    hostAvatarColor: '#0a1f44',
    hostName: 'Georgetown University Jazz Ensemble',
    location: 'Gonda Theatre, Georgetown University',
    timeFull: 'Thu, Dec 3 at 7:30 PM - 9:00 PM (EST)',
    description: [
      "The sound of the city, played on the Hilltop.",
      "The Georgetown University Jazz Ensemble presents **After Ellington**, an evening tracing the evolution of the American big-band tradition from foundational Washington, D.C. sounds to contemporary arrangements.",
      "The program features ensemble works, improvisation, and student soloists."
    ],
    details: [
      { label: "Doors", value: "7:00 PM" },
      { label: "Concert", value: "7:30 PM" },
      { label: "Run time", value: "Approximately 90 minutes" }
    ],
    tickets: [
      { name: 'General RSVP', price: 'Free', desc: 'First come, first served' },
      { name: 'Reserved Center Seating', price: '$8', desc: 'Premium seating' }
    ],
    rules: [
      "Open to Georgetown students, faculty, families, alumni, and the public.",
      "Unclaimed reserved seats are released five minutes before the concert."
    ],
    socialProof: { going: 236, connections: 12 },
    tags: ['Jazz', 'Big Band', 'Live Music', 'D.C. Culture', 'Free', 'Georgetown'],
    organizer: { name: 'Georgetown University Jazz Ensemble', desc: 'Performing classic and contemporary big-band music at Georgetown and throughout Washington, D.C.', upcoming: 3, followers: '1,310' }
  },

  // 18: Georgetown University Orchestra (ID 19)
  {
    id: 19,
    title: 'THE NEW WORLD',
    subtitle: 'Georgetown University Orchestra',
    date: 'SUN · 11.22 · 5:00 PM',
    image: '/Posh/Orchestra.png',
    hostAvatar: 'GUO',
    hostAvatarColor: '#2d2d2d',
    hostName: 'Georgetown University Orchestra',
    location: 'Gaston Hall, Georgetown University',
    timeFull: 'Sun, Nov 22 at 5:00 PM - 6:45 PM (EST)',
    description: [
      "A journey from stillness to scale.",
      "The Georgetown University Orchestra presents **The New World**, a fall concert featuring a program of symphonic works exploring place, movement, and transformation.",
      "Performed beneath the historic ceiling of Gaston Hall, the concert brings together the full orchestra for one of Georgetown’s signature formal music events."
    ],
    details: [
      { label: "Doors", value: "4:30 PM" },
      { label: "Concert", value: "5:00 PM" },
      { label: "Run time", value: "Approximately 105 minutes, including intermission" }
    ],
    tickets: [
      { name: 'General Admission', price: 'Free', desc: 'Open seating' },
      { name: 'Priority RSVP', price: 'Free', desc: 'Reserved until 4:50 PM' }
    ],
    rules: [
      "Open to students, faculty, alumni, families, and the public.",
      "All seating becomes general admission ten minutes before the performance."
    ],
    socialProof: { going: 528, connections: 18 },
    tags: ['Orchestra', 'Classical Music', 'Symphonic', 'Gaston Hall', 'Free', 'Georgetown'],
    organizer: { name: 'Georgetown University Orchestra', desc: 'Georgetown’s student orchestra performing symphonic repertoire in fall and spring concerts.', upcoming: 2, followers: '1,720' }
  },

  // 9: The Capitol G's (ID 10)
  {
    id: 10,
    title: 'UNDER THE LIGHTS',
    subtitle: 'The Capitol G’s',
    date: 'SAT · 11.14 · 8:00 PM',
    image: '/Posh/CapitolG\'s.png',
    hostAvatar: 'CG',
    hostAvatarColor: '#00264d',
    hostName: 'The Capitol G’s',
    location: 'Dahlgren Chapel Steps, Georgetown University',
    timeFull: 'Sat, Nov 14 at 8:00 PM - 9:30 PM (EST)',
    description: [
      "An evening of live music on the Hilltop.",
      "Join The Capitol G’s for **Under the Lights**, a special performance featuring contemporary arrangements, crowd favorites, and new solos from one of Georgetown’s signature vocal groups.",
      "Bring friends, arrive early, and stay for a set built for a fall night on campus."
    ],
    details: [
      { label: "Check-in", value: "7:30 PM" },
      { label: "Performance begins", value: "8:00 PM" },
      { label: "Run time", value: "90 minutes" }
    ],
    tickets: [
      { name: 'General RSVP', price: 'Free', desc: 'Guaranteed access' },
      { name: 'Supporter RSVP', price: 'Free', desc: 'Optional donation at checkout' }
    ],
    rules: [
      "Open to students, faculty, families, alumni, and guests.",
      "Limited seating available."
    ],
    socialProof: { going: 173, connections: 14 },
    tags: ['A Cappella', 'Live Music', 'Performance', 'Campus', 'Free', 'Georgetown'],
    organizer: { name: 'The Capitol G’s', desc: 'Georgetown’s contemporary a cappella group.', upcoming: 3, followers: '1,980' }
  },

  // 22: Georgetown University Student Association (ID 23)
  {
    id: 23,
    title: 'THE HILLTOP FORUM',
    subtitle: 'Your Campus. Your Questions.',
    date: 'WED · 10.21 · 7:00 PM',
    image: '/Posh/GUSA.png',
    hostAvatar: 'GUSA',
    hostAvatarColor: '#002244',
    hostName: 'GUSA',
    location: 'Lohrfink Auditorium, Georgetown University',
    timeFull: 'Wed, Oct 21 at 7:00 PM - 9:00 PM (EDT)',
    description: [
      "Bring the questions that usually stay in the group chat.",
      "GUSA presents **The Hilltop Forum**, a live student town hall focused on the services, spaces, and policies shaping daily life at Georgetown.",
      "Students can submit questions in advance or speak during the open-floor portion of the evening. Topics include dining, housing, transportation, affordability, student space, and campus accessibility."
    ],
    details: [
      { label: "Doors", value: "6:30 PM" },
      { label: "Opening remarks", value: "7:00 PM" },
      { label: "Moderated discussion", value: "7:15 PM" },
      { label: "Open student questions", value: "8:00 PM" }
    ],
    tickets: [
      { name: 'Student RSVP', price: 'Free', desc: 'Standard access' },
      { name: 'Submit a Question', price: 'Free', desc: 'Includes an optional advance-submission form' }
    ],
    rules: [
      "Open to all Georgetown students.",
      "A Georgetown ID is required at entry.",
      "Questions may be submitted anonymously through the event page."
    ],
    socialProof: { going: 326, connections: 34 },
    tags: ['Student Government', 'Town Hall', 'Campus Issues', 'Civic Engagement', 'Free', 'Georgetown'],
    organizer: { name: 'Georgetown University Student Association', desc: 'Representing undergraduate student interests and coordinating advocacy, services, and campus initiatives.', upcoming: 10, followers: '6,820' }
  },

  // 20: Latin American Student Association (ID 21)
  {
    id: 21,
    title: 'RAÍCES',
    subtitle: 'A Night of Latin American Culture',
    date: 'SAT · 10.10 · 7:00 PM',
    image: '/Posh/LASA.png',
    hostAvatar: 'LASA',
    hostAvatarColor: '#cc3300',
    hostName: 'Georgetown LASA',
    location: 'Healey Family Student Center, Georgetown University',
    timeFull: 'Sat, Oct 10 at 7:00 PM - 10:00 PM (EDT)',
    description: [
      "Culture is not one story.",
      "Georgetown LASA presents **Raíces**, a multidisciplinary celebration of Latin America and its diasporas through fashion, music, food, dance, and student storytelling.",
      "The evening features a student fashion presentation, cultural performances, regional food stations, live music, and a closing dance set."
    ],
    details: [
      { label: "Doors", value: "6:30 PM" },
      { label: "Program begins", value: "7:00 PM" },
      { label: "Fashion presentation", value: "8:00 PM" },
      { label: "Closing dance set", value: "9:15 PM" }
    ],
    tickets: [
      { name: 'Georgetown Student', price: '$8', desc: 'Discounted access' },
      { name: 'General Admission', price: '$15', desc: 'Standard entry' },
      { name: 'Supporter Ticket', price: '$25', desc: 'Includes an added contribution to the featured community partner' }
    ],
    rules: [
      "Open to Georgetown students and the public.",
      "Food quantities are limited and available while supplies last."
    ],
    socialProof: { going: 384, connections: 26 },
    tags: ['Latin America', 'Culture', 'Fashion', 'Food', 'Live Performance', 'Georgetown'],
    organizer: { name: 'Georgetown Latin American Student Association', desc: 'Promoting Latin American cultures through academic, cultural, social, and service programming.', upcoming: 6, followers: '3,180' }
  },

  // ----------------------------------------------------
  // PRIVATE EVENTS FOR MY EVENTS / INVITES TAB
  // ----------------------------------------------------
  {
    id: 101,
    title: "MAYA'S 20TH: AFTER HOURS",
    subtitle: 'Invited by Maya Thompson',
    image: '/posh/Mayas20.png',
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
    image: '/posh/MidnightInMonaco.png',
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
    image: '/posh/1789Candle.png',
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
    image: '/posh/TheBlackAffair.png',
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
    image: '/posh/CabinFever.png',
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
    image: '/posh/YoungAlumni.png',
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


// Process relative dates dynamically
const today = new Date();
LigoEvents.forEach((event: any) => {
  const e = event;

  // Sweep all events: populate missing e.time from e.date
  if (!e.time && e.date) {
    const parts = e.date.split('·');
    if (parts.length >= 3) {
      e.time = parts[2].trim();
    }
  }
  if (e.relativeDays !== undefined) {
    const d = new Date(today);
    d.setDate(today.getDate() + e.relativeDays);
    const days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
    const months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    e.dateStr = `${days[d.getDay()]} · ${months[d.getMonth()]}.${String(d.getDate()).padStart(2, '0')} · ${e.time}`;
    e.date = e.dateStr;
    e.timeFull = `${days[d.getDay()]}, ${months[d.getMonth()]}/${String(d.getDate()).padStart(2, '0')} at ${e.time}`;
    e.parsedDate = d;
  } else {
    // Parse 'SAT · 11.07 · 7:30 PM'
    const parts = e.date?.split('·') || [];
    if (parts.length >= 2) {
      const md = parts[1].trim(); // "11.07"
      const [m, d] = md.split('.');
      if (m && d) {
        const dateObj = new Date(today.getFullYear(), parseInt(m) - 1, parseInt(d));
        e.parsedDate = dateObj;
        e.relativeDays = Math.ceil((dateObj.getTime() - today.getTime()) / (1000 * 3600 * 24));
      } else {
        e.parsedDate = today;
      }
    } else {
      e.parsedDate = today;
    }
  }
  // Make descriptions one string with \n\n
  if (Array.isArray(e.description)) {
    e.description = e.description.join('\\n\\n');
  }
  if (e.id === 3) e.currentUserStatus = 'going';
  if (e.id === 15) e.currentUserStatus = 'maybe';
});
