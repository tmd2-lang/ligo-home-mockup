export type EventVisibility =
  | "public"
  | "campus"
  | "invite_only"
  | "members_only"
  | "private";

export type RSVPStatus =
  | "invited"
  | "pending"
  | "going"
  | "maybe"
  | "declined"
  | "hosting"
  | null;

export type OrganizationRole =
  | "member"
  | "officer"
  | "social_chair"
  | "admin";

export type EventItem = {
  id: string;
  day: string;
  dateLabel?: string;
  time: string;
  name: string;
  host: string;
  hostOrganizationId: string;
  venue: string;
  description?: string;
  category: string;
  color: string;

  visibility: EventVisibility;
  eligibleCampuses: string[];
  source: "campus" | "city" | "shared";
  origin?: string;

  currentUserStatus: RSVPStatus;
  currentUserAccessReason?: string;

  goingCount: number;
  pendingCount?: number;
  declinedCount?: number;
  capacity?: number;

  invited?: boolean;
  inviteOnly?: boolean;
  openTo?: string[];
  nudgedBy?: string;
  city?: boolean;
  flagship?: boolean;

  tag?: string;
  tagBg?: string;
  tagFg?: string;
  becauseArtist?: string;
  dj?: { name: string; genre: string };

  creatorId?: string;
  invitedUserIds?: string[];

  // New Posh fields
  image?: string;
  subtitle?: string;
  hostAvatar?: string;
  hostAvatarColor?: string;
  details?: { label: string; value: string }[];
  tickets?: { name: string; price: string; desc: string }[];
  rules?: string[];
  socialProof?: { going: number; connections: number };
  tags?: string[];
  organizer?: { name: string; desc: string; upcoming: number; followers: string };
  date?: string;
  timeFull?: string;
  
  // Custom mock fields
  title?: string;
  parsedDate?: any;
  dateStr?: string;
  relativeDays?: number;
};

import { LigoEvents } from "../app/data/events";

export type Organization = {
  id: string;
  name: string;
  initials: string;
  campus: string;
  category: string;
  memberCount: number;
  currentUserRole: OrganizationRole | null;
  groups: {
    id: string;
    name: string;
    memberCount: number;
    memberIds?: string[];
  }[];
};

export type MockUser = {
  id: string;
  name: string;
  campus: string;
  organizations: {
    organizationId: string;
    role: OrganizationRole;
    groupIds: string[];
  }[];
};

const G: Record<string, string> = {
  warm:'linear-gradient(160deg,#f97316,#c2410c)', pink:'linear-gradient(160deg,#ea8ce1,#a13d99)',
  gold:'linear-gradient(160deg,#f5d783,#a07c00)', navy:'linear-gradient(160deg,#1a2a5e,#3a4a9e)',
  forest:'linear-gradient(160deg,#2a5e40,#71c07f)', plum:'linear-gradient(160deg,#3a1a5e,#7a3a9e)',
  earth:'linear-gradient(160deg,#5e3a1a,#a07c00)', smoke:'linear-gradient(160deg,#14110d,#4a3a2a)',
  cream:'linear-gradient(160deg,#f5d783,#e9bf52)', sunset:'linear-gradient(160deg,#f97316,#ea8ce1)',
  cobalt:'linear-gradient(160deg,#2a3a8e,#5a6abe)', jade:'linear-gradient(160deg,#2a8e6a,#5abe9a)',
  crimson:'linear-gradient(160deg,#7a1020,#b3303f)', buff:'linear-gradient(160deg,#0d3b66,#1f6fb2)',
};

const TAGS: Record<string, { tag: string; tagBg: string; tagFg: string }> = {
  acappella: { tag: 'A cappella', tagBg: 'rgba(245,215,131,0.22)', tagFg: '#a07c00' },
  dance:     { tag: 'Dance',      tagBg: 'rgba(234,140,225,0.16)', tagFg: '#a13d99' },
  theatre:   { tag: 'Theatre',    tagBg: 'rgba(234,140,225,0.16)', tagFg: '#a13d99' },
  ensemble:  { tag: 'Ensemble',   tagBg: 'rgba(113,192,127,0.16)', tagFg: '#2f7d3f' },
  jazz:      { tag: 'Jazz',       tagBg: 'rgba(90,106,190,0.14)',  tagFg: '#3a4a9e' },
  live:      { tag: 'Live',       tagBg: 'rgba(249,115,22,0.12)',  tagFg: '#c2410c' },
  djset:     { tag: 'DJ set',     tagBg: 'rgba(20,17,13,0.08)',    tagFg: '#14110d' },
  greek:     { tag: 'Greek',      tagBg: 'rgba(234,140,225,0.14)', tagFg: '#a13d99' },
  culture:   { tag: 'Culture',    tagBg: 'rgba(113,192,127,0.16)', tagFg: '#2f7d3f' },
  prepro:    { tag: 'Pre-pro',    tagBg: 'rgba(90,42,138,0.12)',   tagFg: '#5a2b8a' },
  media:     { tag: 'Media',      tagBg: 'rgba(20,17,13,0.07)',    tagFg: '#14110d' },
  service:   { tag: 'Service',    tagBg: 'rgba(113,192,127,0.16)', tagFg: '#2f7d3f' },
  campus:    { tag: 'Campus',     tagBg: 'rgba(20,17,13,0.07)',    tagFg: '#14110d' },
};

export const MOCK_USER: MockUser = {
  id: 'current-user-1',
  name: 'Marcus T.',
  campus: 'georgetown',
  organizations: [
    {
      organizationId: 'phantoms',
      role: 'social_chair',
      groupIds: ['g1', 'g2'],
    },
    {
      organizationId: 'jazz',
      role: 'member',
      groupIds: ['g-all'],
    }
  ]
};

export const MOCK_ORGANIZATIONS: Record<string, Organization> = {
  sigma_phi_epsilon: {
    id: 'sigma_phi_epsilon',
    name: 'Sigma Phi Epsilon',
    initials: 'SPE',
    campus: 'georgetown',
    category: 'Fraternity',
    memberCount: 85,
    currentUserRole: 'admin',
    groups: [
      { id: 'g-all-spe', name: 'All Members', memberCount: 85, memberIds: [] },
      { id: 'g-exec-spe', name: 'Exec Board', memberCount: 8, memberIds: [] },
      { id: 'g-bros-spe', name: 'Brothers', memberCount: 60, memberIds: [] },
      { id: 'g-new-spe', name: 'New Members', memberCount: 17, memberIds: [] },
      { id: 'g-alum-spe', name: 'Alumni', memberCount: 150, memberIds: [] },
    ],
  },
  phantoms: {
    id: 'phantoms',
    name: 'The Phantoms',
    initials: 'P',
    campus: 'georgetown',
    category: 'A cappella',
    memberCount: 96,
    currentUserRole: 'social_chair',
    groups: [
      { id: 'g1', name: 'Officers', memberCount: 4, memberIds: ['1','2','3','4'] },
      { id: 'g2', name: 'Soprano Section', memberCount: 3, memberIds: ['1','5','6'] },
      { id: 'g3', name: 'Bass Section', memberCount: 3, memberIds: ['2','7','8'] },
      { id: 'g4', name: 'Alumni', memberCount: 5, memberIds: ['9','10','11','12','13'] },
    ],
  },
  jazz: {
    id: 'jazz',
    name: 'Georgetown Jazz Ensemble',
    initials: 'JE',
    campus: 'georgetown',
    category: 'Jazz',
    memberCount: 42,
    currentUserRole: 'member',
    groups: [
      { id: 'g-all', name: 'All Members', memberCount: 42 },
    ]
  }
};

const ev = (
  id: string, day: string, time: string, name: string, host: string, hostOrganizationId: string, 
  venue: string, going: number, cat: string, color: string, vis: EventVisibility, 
  status: RSVPStatus, reason: string | undefined, extra?: any
): EventItem => ({
  id, day, time, name, host, hostOrganizationId, venue, 
  goingCount: going, category: cat, color,
  visibility: vis,
  eligibleCampuses: vis === 'public' || vis === 'campus' ? ['georgetown'] : [],
  source: extra?.source || 'campus',
  currentUserStatus: status,
  currentUserAccessReason: reason,
  ...TAGS[cat],
  ...(extra || {}),
});

// Convert LigoEvents to INITIAL_EVENTS
export const INITIAL_EVENTS: EventItem[] = LigoEvents.map(e => {
  return {
    ...e,
    id: e.id.toString(),
    day: e.date?.split('·')[0]?.trim() || '',
    time: e.date?.split('·')[2]?.trim() || e.time,
    name: e.title,
    host: e.hostName,
    hostOrganizationId: e.hostAvatar === 'PH' ? 'phantoms' : e.hostAvatar === 'SPE' ? 'sigma_phi_epsilon' : e.hostAvatar, // using avatar as a rough ID
    venue: e.location.split(',')[0],
    description: Array.isArray(e.description) ? e.description.join('\\n\\n') : e.description,
    category: e.tags?.[0] || 'campus',
    color: e.hostAvatarColor || '#eee',
    visibility: e.visibility || (e.rules?.some((r: string) => r.toLowerCase().includes('invite')) ? 'invite_only' : 'public'),
    eligibleCampuses: ['georgetown'],
    source: 'campus',
    currentUserStatus: e.currentUserStatus || (e.id === 5 || e.id === 20 ? 'invited' : null),
    currentUserAccessReason: '',
    goingCount: e.socialProof?.going || Math.floor(Math.random() * 500),
    image: e.image,
    subtitle: e.subtitle,
    hostAvatar: e.hostAvatar,
    hostAvatarColor: e.hostAvatarColor,
    details: e.details,
    tickets: e.tickets,
    rules: e.rules,
    socialProof: e.socialProof,
    tags: e.tags,
    organizer: e.organizer,
    date: e.date,
    timeFull: e.timeFull,
  } as EventItem;
});

// Re-export EVI helper functions directly since they aren't data but icons, wait, actually let's keep icons in a separate file or within EventsScreen, but we can't easily export JSX from a .ts file if we don't have React in it. Let's keep EVI in EventsScreen or primitives.

export type OrganizationMember = {
  org: string;
  subgroup: string;
  name: string;
  title: string | null;
  email: string;
  phone: string;
  status: string;
};

export const SIGEP_ROSTER: OrganizationMember[] = [
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "exec-board",
    "name": "Marcus T.",
    "title": "Social Chair",
    "email": "marcust@georgetown.edu",
    "phone": "(202) 555-0100",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "exec-board",
    "name": "Ethan Caldwell",
    "title": "President",
    "email": "ethanc@georgetown.edu",
    "phone": "(202) 555-0101",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "exec-board",
    "name": "Julian Brooks",
    "title": "Vice President",
    "email": "julianb@georgetown.edu",
    "phone": "(202) 555-0102",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "exec-board",
    "name": "Noah Patel",
    "title": "Treasurer",
    "email": "noahp@georgetown.edu",
    "phone": "(202) 555-0103",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "exec-board",
    "name": "Cameron Lewis",
    "title": "Risk Manager",
    "email": "cameronl@georgetown.edu",
    "phone": "(202) 555-0104",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "exec-board",
    "name": "Grant Rivera",
    "title": "Rush Chair",
    "email": "grantr@georgetown.edu",
    "phone": "(202) 555-0105",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "exec-board",
    "name": "Miles Chen",
    "title": "Secretary",
    "email": "milesc@georgetown.edu",
    "phone": "(202) 555-0106",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "exec-board",
    "name": "Andrew Sullivan",
    "title": "New Member Educator",
    "email": "andrews@georgetown.edu",
    "phone": "(202) 555-0107",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Jordan D.",
    "title": null,
    "email": "jordand@georgetown.edu",
    "phone": "(202) 555-0108",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Cole B.",
    "title": null,
    "email": "coleb@georgetown.edu",
    "phone": "(202) 555-0109",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Bennett R.",
    "title": null,
    "email": "bennettr@georgetown.edu",
    "phone": "(202) 555-0110",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Alex Baker",
    "title": null,
    "email": "alexb@georgetown.edu",
    "phone": "(202) 555-0111",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Andre Cooper",
    "title": null,
    "email": "andrec@georgetown.edu",
    "phone": "(202) 555-0112",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Andrew Gonzalez",
    "title": null,
    "email": "andrewg@georgetown.edu",
    "phone": "(202) 555-0113",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Anthony Jackson",
    "title": null,
    "email": "anthonyj@georgetown.edu",
    "phone": "(202) 555-0114",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Arjun Lopez",
    "title": null,
    "email": "arjunl@georgetown.edu",
    "phone": "(202) 555-0115",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Asher Nelson",
    "title": null,
    "email": "ashern@georgetown.edu",
    "phone": "(202) 555-0116",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Austin Price",
    "title": null,
    "email": "austinp@georgetown.edu",
    "phone": "(202) 555-0117",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Ben Sanchez",
    "title": null,
    "email": "bens@georgetown.edu",
    "phone": "(202) 555-0118",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Blake Tran",
    "title": null,
    "email": "blaket@georgetown.edu",
    "phone": "(202) 555-0119",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Brandon Young",
    "title": null,
    "email": "brandony@georgetown.edu",
    "phone": "(202) 555-0120",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Caleb Tan",
    "title": null,
    "email": "calebt@georgetown.edu",
    "phone": "(202) 555-0121",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Cameron Bennett",
    "title": null,
    "email": "cameronb@georgetown.edu",
    "phone": "(202) 555-0122",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Carlos Cruz",
    "title": null,
    "email": "carlosc@georgetown.edu",
    "phone": "(202) 555-0123",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Carson Grant",
    "title": null,
    "email": "carsong@georgetown.edu",
    "phone": "(202) 555-0124",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Carter James",
    "title": null,
    "email": "carterj@georgetown.edu",
    "phone": "(202) 555-0125",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Charlie Martin",
    "title": null,
    "email": "charliem@georgetown.edu",
    "phone": "(202) 555-0126",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Chris Nguyen",
    "title": null,
    "email": "chrisn@georgetown.edu",
    "phone": "(202) 555-0127",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Christian Ramirez",
    "title": null,
    "email": "christianr@georgetown.edu",
    "phone": "(202) 555-0128",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Christopher Scott",
    "title": null,
    "email": "christophers@georgetown.edu",
    "phone": "(202) 555-0129",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Colin Turner",
    "title": null,
    "email": "colint@georgetown.edu",
    "phone": "(202) 555-0130",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Connor Choi",
    "title": null,
    "email": "connorc@georgetown.edu",
    "phone": "(202) 555-0131",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Daniel Vega",
    "title": null,
    "email": "danielv@georgetown.edu",
    "phone": "(202) 555-0132",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Darius Brooks",
    "title": null,
    "email": "dariusb@georgetown.edu",
    "phone": "(202) 555-0133",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "David Davis",
    "title": null,
    "email": "davidd@georgetown.edu",
    "phone": "(202) 555-0134",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Declan Green",
    "title": null,
    "email": "declang@georgetown.edu",
    "phone": "(202) 555-0135",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Diego Jenkins",
    "title": null,
    "email": "diegoj@georgetown.edu",
    "phone": "(202) 555-0136",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Dylan Martinez",
    "title": null,
    "email": "dylanm@georgetown.edu",
    "phone": "(202) 555-0137",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Eli O'Brien",
    "title": null,
    "email": "elio@georgetown.edu",
    "phone": "(202) 555-0138",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Elias Reed",
    "title": null,
    "email": "eliasr@georgetown.edu",
    "phone": "(202) 555-0139",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Elliot Shah",
    "title": null,
    "email": "elliots@georgetown.edu",
    "phone": "(202) 555-0140",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Emmett Vasquez",
    "title": null,
    "email": "emmettv@georgetown.edu",
    "phone": "(202) 555-0141",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Ethan Desai",
    "title": null,
    "email": "ethand@georgetown.edu",
    "phone": "(202) 555-0142",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Evan Wu",
    "title": null,
    "email": "evanw@georgetown.edu",
    "phone": "(202) 555-0143",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Felix Brown",
    "title": null,
    "email": "felixb@georgetown.edu",
    "phone": "(202) 555-0144",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Gabriel Diaz",
    "title": null,
    "email": "gabrield@georgetown.edu",
    "phone": "(202) 555-0145",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Gavin Gupta",
    "title": null,
    "email": "gaving@georgetown.edu",
    "phone": "(202) 555-0146",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "George Johnson",
    "title": null,
    "email": "georgej@georgetown.edu",
    "phone": "(202) 555-0147",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Grant Mason",
    "title": null,
    "email": "grantm@georgetown.edu",
    "phone": "(202) 555-0148",
    "status": "invited"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Henry Ortiz",
    "title": null,
    "email": "henryo@georgetown.edu",
    "phone": "(202) 555-0149",
    "status": "invited"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Hugo Reyes",
    "title": null,
    "email": "hugor@georgetown.edu",
    "phone": "(202) 555-0150",
    "status": "invited"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Ian Singh",
    "title": null,
    "email": "ians@georgetown.edu",
    "phone": "(202) 555-0151",
    "status": "invited"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Isaac Walker",
    "title": null,
    "email": "isaacw@georgetown.edu",
    "phone": "(202) 555-0152",
    "status": "invited"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Isaiah Ibrahim",
    "title": null,
    "email": "isaiahi@georgetown.edu",
    "phone": "(202) 555-0153",
    "status": "invited"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Jack Yoon",
    "title": null,
    "email": "jacky@georgetown.edu",
    "phone": "(202) 555-0154",
    "status": "invited"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Jackson Campbell",
    "title": null,
    "email": "jacksonc@georgetown.edu",
    "phone": "(202) 555-0155",
    "status": "invited"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Jacob Edwards",
    "title": null,
    "email": "jacobe@georgetown.edu",
    "phone": "(202) 555-0156",
    "status": "invited"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "James Hall",
    "title": null,
    "email": "jamesh@georgetown.edu",
    "phone": "(202) 555-0157",
    "status": "invited"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Jason Jones",
    "title": null,
    "email": "jasonj@georgetown.edu",
    "phone": "(202) 555-0158",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Jayden Miller",
    "title": null,
    "email": "jaydenm@georgetown.edu",
    "phone": "(202) 555-0159",
    "status": "sms-pending"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Julian Owens",
    "title": null,
    "email": "juliano@georgetown.edu",
    "phone": "(202) 555-0160",
    "status": "sms-pending"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Kai Rivera",
    "title": null,
    "email": "kair@georgetown.edu",
    "phone": "(202) 555-0161",
    "status": "sms-pending"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Kevin Smith",
    "title": null,
    "email": "kevins@georgetown.edu",
    "phone": "(202) 555-0162",
    "status": "sms-pending"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Landon Ward",
    "title": null,
    "email": "landonw@georgetown.edu",
    "phone": "(202) 555-0163",
    "status": "sms-pending"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Leo Khan",
    "title": null,
    "email": "leok@georgetown.edu",
    "phone": "(202) 555-0164",
    "status": "sms-pending"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Liam Zimmerman",
    "title": null,
    "email": "liamz@georgetown.edu",
    "phone": "(202) 555-0165",
    "status": "sms-pending"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Logan Carson",
    "title": null,
    "email": "loganc@georgetown.edu",
    "phone": "(202) 555-0166",
    "status": "sms-pending"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "brothers",
    "name": "Lucas Ellis",
    "title": null,
    "email": "lucase@georgetown.edu",
    "phone": "(202) 555-0167",
    "status": "sms-pending"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "new-members",
    "name": "Patrick Hall",
    "title": null,
    "email": "patrickh@georgetown.edu",
    "phone": "(202) 555-0168",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "new-members",
    "name": "Paul Kelly",
    "title": null,
    "email": "paulk@georgetown.edu",
    "phone": "(202) 555-0169",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "new-members",
    "name": "Peter Morgan",
    "title": null,
    "email": "peterm@georgetown.edu",
    "phone": "(202) 555-0170",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "new-members",
    "name": "Quentin Phillips",
    "title": null,
    "email": "quentinp@georgetown.edu",
    "phone": "(202) 555-0171",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "new-members",
    "name": "Rafael Scott",
    "title": null,
    "email": "rafaels@georgetown.edu",
    "phone": "(202) 555-0172",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "new-members",
    "name": "Reid Walker",
    "title": null,
    "email": "reidw@georgetown.edu",
    "phone": "(202) 555-0173",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "new-members",
    "name": "Ryan Liu",
    "title": null,
    "email": "ryanl@georgetown.edu",
    "phone": "(202) 555-0174",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "new-members",
    "name": "Sam Allen",
    "title": null,
    "email": "sama@georgetown.edu",
    "phone": "(202) 555-0175",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "new-members",
    "name": "Samuel Collins",
    "title": null,
    "email": "samuelc@georgetown.edu",
    "phone": "(202) 555-0176",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "new-members",
    "name": "Sebastian Grant",
    "title": null,
    "email": "sebastiang@georgetown.edu",
    "phone": "(202) 555-0177",
    "status": "joined"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "new-members",
    "name": "Simon Johnson",
    "title": null,
    "email": "simonj@georgetown.edu",
    "phone": "(202) 555-0178",
    "status": "invited"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "new-members",
    "name": "Theo Mitchell",
    "title": null,
    "email": "theom@georgetown.edu",
    "phone": "(202) 555-0179",
    "status": "invited"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "new-members",
    "name": "Thomas Perez",
    "title": null,
    "email": "thomasp@georgetown.edu",
    "phone": "(202) 555-0180",
    "status": "invited"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "new-members",
    "name": "Tyler Ross",
    "title": null,
    "email": "tylerr@georgetown.edu",
    "phone": "(202) 555-0181",
    "status": "invited"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "new-members",
    "name": "Victor Tran",
    "title": null,
    "email": "victort@georgetown.edu",
    "phone": "(202) 555-0182",
    "status": "invited"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "new-members",
    "name": "Vincent Desai",
    "title": null,
    "email": "vincentd@georgetown.edu",
    "phone": "(202) 555-0183",
    "status": "sms-pending"
  },
  {
    "org": "sigma-phi-epsilon",
    "subgroup": "new-members",
    "name": "Wesley Zimmerman",
    "title": null,
    "email": "wesleyz@georgetown.edu",
    "phone": "(202) 555-0184",
    "status": "sms-pending"
  }
];
