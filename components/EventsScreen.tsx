"use client";
import React, { useState, useMemo, useRef } from "react";
import { INITIAL_EVENTS, MOCK_ORGANIZATIONS, EventItem, MockUser, Organization, GPB_SEED_EVENTS } from "../lib/mockEventsData";
import { setUserRsvp, withResolvedStatuses, type UserRsvpStore } from "../lib/eventRsvps";
import { HomeFeedView } from "./events/HomeFeedView";
import { InvitesView } from "./events/InvitesView";
import { OrganizationWorkspace } from "./events/OrganizationWorkspace";
import { MemberClubHome } from "./events/MemberClubHome";
import { ManageEventView } from "./events/ManageEventView";
import { CreateEventSheet } from "./events/CreateEventSheet";
import { EventDetailView } from "./events/EventDetailView";
import { CreateProfileFlow } from "./events/CreateProfileFlow";
import { SwipeableInvites } from "./events/SwipeableInvites";
import { PublicProfileView } from "./events/PublicProfileView";
import { ImportContactsFlow } from "./events/ImportContactsFlow";
import { LiveActivityPill } from "./events/LiveActivityPill";
import { EVI } from "./events/Icons";
import { usePersistentState } from "../lib/usePersistentState";

type EventsView = "main" | "organization" | "member-club" | "manage-event" | "event-detail" | "publish-confirmation" | "public-profile" | "create-profile";
type MainTab = 'home' | 'invites' | 'clubs';

/** Demo users who belong to each org — used when publishing members-only invites */
const DEMO_ORG_MEMBERS: Record<string, string[]> = {
  program_board: ['cole', 'jordan'],
  sigma_phi_epsilon: ['marcus', 'jordan', 'bennett', 'cole'],
  phantoms: ['sofia'],
};

export function EventsScreen({ onTab, overrideUserId, siloMode }: { onTab?: any; overrideUserId?: string; siloMode?: boolean }) {
  const [persistedUserId] = usePersistentState('ligo:active_user', 'marcus');
  const activeUserId = overrideUserId || persistedUserId;
  const [customOrgs, setCustomOrgs] = usePersistentState<Record<string, any>>('ligo:custom_orgs_v3', {});
  const [customMemberships, setCustomMemberships] = usePersistentState<Record<string, any[]>>('ligo:custom_memberships_v3', {});

  // Dynamic user based on profile state
  const activeUser: MockUser = {
    id: activeUserId,
    name: activeUserId.charAt(0).toUpperCase() + activeUserId.slice(1),
    campus: 'georgetown',
    organizations: activeUserId === 'marcus' ? [
      { organizationId: 'sigma_phi_epsilon', role: 'admin', groupIds: ['g-all-spe', 'g-exec-spe'] }
    ] : activeUserId === 'sofia' ? [
      { organizationId: 'phantoms', role: 'admin', groupIds: ['g1', 'g2'] }
    ] : activeUserId === 'cole' ? [
      { organizationId: 'program_board', role: 'admin', groupIds: ['g-all-gpb', 'g-exec-gpb', 'g-programming-gpb'] }
    ] : activeUserId === 'jordan' ? [
      { organizationId: 'sigma_phi_epsilon', role: 'member', groupIds: ['g-all-spe'] },
      { organizationId: 'program_board', role: 'member', groupIds: ['g-all-gpb', 'g-production-gpb'] }
    ] : activeUserId === 'bennett' ? [
      { organizationId: 'sigma_phi_epsilon', role: 'member', groupIds: ['g-all-spe'] }
    ] : []
  };

  const dynamicInitialEvents = INITIAL_EVENTS;

  const [events, setEvents] = usePersistentState<EventItem[]>('ligo:all_events_v6', dynamicInitialEvents);
  const [rsvpStore, setRsvpStore] = usePersistentState<UserRsvpStore>('ligo:user_rsvps_v1', {});
  const [view, setView] = useState<EventsView>("main");
  const [mainTab, setMainTab] = useState<MainTab>('home');
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [detailReturnView, setDetailReturnView] = useState<EventsView>('main');
  const [memberClubScreen, setMemberClubScreen] = useState<'home' | 'chat' | 'events' | 'people'>('home');
  const [skipClubWelcome, setSkipClubWelcome] = useState(false);
  const [skipOrgWelcome, setSkipOrgWelcome] = useState(false);
  const [liveActivityEventId, setLiveActivityEventId] = useState<string | null>(null);
  const [activeProfileOrgId, setActiveProfileOrgId] = useState<string | null>(null);
  const [profileReturnView, setProfileReturnView] = useState<EventsView>('main');
  
  // Host & Registration modal states
  const [hostActionSheetOpen, setHostActionSheetOpen] = useState(false);
  const [createProfileType, setCreateProfileType] = useState<'artist' | 'club' | 'person' | null>(null);

  const [showSwipeableInvites, setShowSwipeableInvites] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [importContactsOpen, setImportContactsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const lastViewedUserId = useRef<string | null>(null);

  // Combine static orgs with custom-created orgs/artists
  const allOrgs = useMemo<Record<string, Organization>>(() => ({
    ...MOCK_ORGANIZATIONS,
    ...customOrgs
  }), [customOrgs]);

  // Combine user orgs
  const userOrgsList = useMemo(() => {
    const base = activeUser.organizations || [];
    const custom = customMemberships[activeUserId] || [];
    return [...base, ...custom];
  }, [activeUser.organizations, customMemberships, activeUserId]);

  // Per-user view of events (membership + invites + explicit RSVPs)
  const viewEvents = useMemo(
    () => withResolvedStatuses(events, activeUserId, activeUser, rsvpStore),
    [events, activeUserId, activeUser, rsvpStore],
  );

  React.useEffect(() => {
    const byId = new Map(INITIAL_EVENTS.map(e => [String(e.id), e]));

    const needsFix = events.some(e => {
      const source = byId.get(String(e.id));
      if (typeof e.image === 'string' && e.image.includes('/posh/')) return true;
      if (e.hostOrganizationId === 'GPB') return true;
      if (source?.image && source.image !== e.image) return true;
      const isKickoff = (e.name || '').toLowerCase().includes('kickoff')
        && (e.hostOrganizationId === 'program_board' || e.hostOrganizationId === 'GPB');
      if (isKickoff && !(e.image || e.flyerUrl)) return true;
      if (isKickoff && !(e.description || e.summary)) return true;
      if (e.flyerUrl && !e.image) return true;
      if (e.summary && !e.description) return true;
      return false;
    });
    const missingSeeds = GPB_SEED_EVENTS.filter(seed => !events.some(e => e.id === seed.id));
    if (!needsFix && missingSeeds.length === 0) return;

    setEvents(prev => {
      const fixed = prev.map(e => {
        const source = byId.get(String(e.id));
        const normalized =
          typeof e.image === 'string' ? e.image.replace(/\/posh\//g, '/Posh/') : e.image;
        let image = source?.image || normalized || e.flyerUrl || e.image;
        let description = e.description || e.summary;
        const hostOrganizationId =
          e.hostOrganizationId === 'GPB' ? 'program_board'
          : (source?.hostOrganizationId || e.hostOrganizationId);

        const isKickoff = (e.name || '').toLowerCase().includes('kickoff')
          && (hostOrganizationId === 'program_board');
        if (isKickoff) {
          if (!image) image = '/Posh/GPB.png';
          if (!description) description = 'Georgetown Program Board Fall Kickoff meeting.';
        }
        return {
          ...e,
          hostOrganizationId,
          image,
          description: description || e.description,
          summary: description || e.summary,
        };
      });
      const stillMissing = GPB_SEED_EVENTS.filter(seed => !fixed.some(e => e.id === seed.id));
      return [...fixed, ...stillMissing];
    });
  }, [events, setEvents]);

  // Invites pending swipe/decision
  const pendingInvites = useMemo(() => {
    return viewEvents.filter(e => {
      const explicit = rsvpStore[String(e.id)]?.[activeUserId];
      if (explicit) return false;
      return e.currentUserStatus === 'invited' || e.currentUserStatus === 'pending';
    });
  }, [viewEvents, rsvpStore, activeUserId]);

  React.useEffect(() => {
    // Siloed admin demos skip the consumer Pass / I'm In stack
    if (siloMode) {
      setShowSwipeableInvites(false);
      return;
    }
    // When active user changes or on first mount, trigger stack if they have pending invites
    if (activeUserId !== lastViewedUserId.current) {
      if (pendingInvites.length > 0) {
        setShowSwipeableInvites(true);
      } else {
        setShowSwipeableInvites(false);
      }
      lastViewedUserId.current = activeUserId;
      setLiveActivityEventId(null);
    }
  }, [activeUserId, pendingInvites.length, siloMode]);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleRsvp = (eventId: string, status: 'going' | 'declined' | 'maybe' | 'not_going' | 'pending' | 'hosting' | null) => {
    const normStatus = status === 'not_going' ? 'declined' : status;
    setRsvpStore(prev => setUserRsvp(prev, eventId, activeUserId, normStatus as any));
    const evt = events.find(e => String(e.id) === String(eventId));
    const title = evt?.name || 'Event';
    if (normStatus === 'going') {
      setLiveActivityEventId(String(eventId));
      flash(`Going to ${title}`);
    } else if (normStatus === 'declined') {
      if (liveActivityEventId === String(eventId)) setLiveActivityEventId(null);
      flash(`Declined ${title}`);
    }
  };

  const handlePublish = (e: Partial<EventItem>, isDraft: boolean) => {
    const hostOrgId = activeUser.organizations.find((o: any) => ['officer', 'social_chair', 'admin'].includes(o.role))?.organizationId || 'sigma_phi_epsilon';
    const hostOrg = allOrgs[hostOrgId] || MOCK_ORGANIZATIONS.sigma_phi_epsilon;
    const isMembersOnly = e.visibility === 'members_only';
    const isInviteOnly = e.visibility === 'invite_only';
    const orgRoster = DEMO_ORG_MEMBERS[hostOrgId] || [];

    const newEvent: EventItem = {
      id: `new-${Date.now()}`,
      name: e.name || "Untitled Event",
      summary: e.summary || "",
      description: e.description || e.summary || "",
      day: e.day || "FRI",
      dateLabel: e.dateLabel || "OCT 25",
      time: e.time || "10:00 PM",
      venue: (e as any).venue || (e as any).location || "Georgetown Campus",
      category: e.category || "Campus Event",
      host: hostOrg.name,
      hostOrganizationId: hostOrgId,
      hostAvatar: hostOrg.initials,
      hostAvatarColor: '#14110D',
      color: e.color || "#14110D",
      visibility: e.visibility || "public",
      status: isDraft ? 'draft' : 'published',
      publishedAt: isDraft ? undefined : new Date().toISOString(),
      goingCount: 1,
      currentUserStatus: 'hosting',
      flyerUrl: e.flyerUrl,
      image: e.flyerUrl || e.image,
      isHost: true,
      eligibleCampuses: ['georgetown'],
      source: 'campus',
      ...(e as any),
    };

    setEvents(prev => [newEvent, ...prev]);
    setSheetOpen(false);

    if (isDraft) {
      flash('Draft saved');
    } else {
      setActiveEventId(newEvent.id);
      setView('publish-confirmation');
    }
  };

  const simulateTimeJumpAndGoToDashboard = () => {
    if (activeEventId) {
      setEvents(prev => prev.map(evt => {
        if (evt.id === activeEventId) {
          return {
            ...evt,
            id: `jump-${evt.id}`,
            goingCount: (evt.goingCount || 0) + 14,
            invitedCount: Math.max((evt as any).invitedCount || 0, 18),
            relativeDays: 0,
            time: 'LIVE NOW',
          };
        }
        return evt;
      }));
      const newId = typeof activeEventId === 'string' ? activeEventId.replace('new-', 'jump-') : activeEventId;
      setActiveEventId(newId);
    }
    setView('manage-event');
  };

  const activeEvent = activeEventId ? viewEvents.find(e => e.id === activeEventId) : null;
  const activeOrg = activeOrgId ? allOrgs[activeOrgId] : null;
  const liveActivityEvent = liveActivityEventId
    ? viewEvents.find(e => String(e.id) === liveActivityEventId && (e.currentUserStatus === 'going' || e.currentUserStatus === 'hosting'))
    : null;

  // Profile data for the public profile view
  const activeProfileEvent = activeProfileOrgId
    ? viewEvents.find(e => e.hostOrganizationId === activeProfileOrgId || String(e.id) === activeProfileOrgId)
    : null;
  const activeProfileOrganizer = activeProfileEvent?.organizer || (activeProfileOrgId ? allOrgs[activeProfileOrgId] as any : null);
  const profileEvents = activeProfileOrgId
    ? viewEvents.filter(e => {
        const matchesOrg = e.hostOrganizationId === activeProfileOrgId;
        const matchesHost = e.organizer?.name === activeProfileOrganizer?.name;
        return matchesOrg || matchesHost;
      })
    : [];

  const openProfile = (eventOrOrgId: string, returnView?: EventsView) => {
    const event = viewEvents.find(e => String(e.id) === eventOrOrgId || e.hostOrganizationId === eventOrOrgId);
    if (event?.organizer) {
      setActiveProfileOrgId(event.hostOrganizationId || eventOrOrgId);
      setProfileReturnView(returnView || view);
      setView('public-profile');
    } else if (allOrgs[eventOrOrgId]) {
      setActiveProfileOrgId(eventOrOrgId);
      setProfileReturnView(returnView || view);
      setView('public-profile');
    }
  };

  const managedOrgs = userOrgsList
    .filter((o: any) => ['officer', 'social_chair', 'admin'].includes(o.role))
    .map((o: any) => allOrgs[o.organizationId])
    .filter(Boolean);
  const isAdmin = managedOrgs.length > 0;
  
  const memberOrgs = userOrgsList
    .map((o: any) => ({
      ...o,
      org: allOrgs[o.organizationId],
    }))
    .filter((o: any) => o.org);
  const hasClubs = memberOrgs.length > 0;
  const compactTabs = isAdmin || hasClubs;

  return (
    <div className="screen" style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: 'var(--ligo-paper)' }}>
      
      {liveActivityEvent && (
        <LiveActivityPill
          event={liveActivityEvent}
          onOpen={() => {
            setActiveEventId(String(liveActivityEvent.id));
            setDetailReturnView(view === 'main' ? 'main' : view);
            setView('event-detail');
          }}
          onDismiss={() => setLiveActivityEventId(null)}
        />
      )}

      {showSwipeableInvites && (
        <SwipeableInvites 
          invites={pendingInvites} 
          hidden={view === 'event-detail'}
          onComplete={() => setShowSwipeableInvites(false)} 
          onClose={() => setShowSwipeableInvites(false)}
          onRsvp={handleRsvp}
          currentUserId={activeUserId}
          onViewDetails={(id) => {
            setActiveEventId(id);
            setDetailReturnView('main');
            setView('event-detail');
          }}
        />
      )}

      {view === 'main' && !showSwipeableInvites && (
        <div className="scroll" style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <div style={{ paddingTop: 'max(env(safe-area-inset-top, 56px), 56px)', paddingLeft: 20, paddingRight: 20, paddingBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ligo-orange)', marginBottom: 4 }}>
                CAMPUS · GEORGETOWN
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h1 style={{ fontSize: 32, fontWeight: 500, margin: 0, fontFamily: '"Bricolage Grotesque", sans-serif', letterSpacing: '-1px', color: '#111' }}>
                  What's Happening<br/>on Campus
                </h1>
                
                {/* Header Action: Search */}
                <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', color: '#111' }}>
                  <EVI.Search style={{ width: 24, height: 24 }} />
                </div>
              </div>
            </div>
            
            {/* Top Tab Bar: Explore | My Events | Clubs | (Manage) */}
            <div style={{ display: 'flex', gap: compactTabs ? 16 : 24, padding: '0 20px' }}>
              <button 
                onClick={() => setMainTab('home')} 
                style={{ paddingBottom: 16, fontSize: compactTabs ? 15 : 16, fontWeight: 500, color: mainTab === 'home' ? 'var(--ink)' : 'rgba(20,17,13,0.4)', background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
                Explore
                {mainTab === 'home' && <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, background: 'var(--ink)', borderRadius: 2 }} />}
              </button>
              
              <button 
                onClick={() => setMainTab('invites')} 
                style={{ paddingBottom: 16, marginRight: pendingInvites.length > 0 ? 16 : 0, fontSize: compactTabs ? 15 : 16, fontWeight: 500, color: mainTab === 'invites' ? 'var(--ink)' : 'rgba(20,17,13,0.4)', background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
                My Events
                {pendingInvites.length > 0 && (
                  <div style={{ position: 'absolute', top: -4, right: -14, background: 'var(--ligo-orange)', color: '#fff', fontSize: 10, fontWeight: 500, borderRadius: 10, padding: '2px 6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {pendingInvites.length}
                  </div>
                )}
                {mainTab === 'invites' && <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, background: 'var(--ink)', borderRadius: 2 }} />}
              </button>

              {/* Clubs Tab is ALWAYS visible */}
              <button 
                onClick={() => setMainTab('clubs')} 
                style={{ paddingBottom: 16, fontSize: compactTabs ? 15 : 16, fontWeight: 500, color: mainTab === 'clubs' ? 'var(--ink)' : 'rgba(20,17,13,0.4)', background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
                Clubs
                {mainTab === 'clubs' && <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, background: 'var(--ink)', borderRadius: 2 }} />}
              </button>

              {isAdmin && (
                <button 
                  onClick={() => {
                    setActiveOrgId(managedOrgs[0].id);
                    setSkipOrgWelcome(false);
                    setView('organization');
                  }} 
                  style={{ paddingBottom: 16, fontSize: 15, fontWeight: 500, color: 'rgba(20,17,13,0.4)', background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
                  Manage
                </button>
              )}
            </div>
          </div>
          
          <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
            {mainTab === 'home' && (
              <HomeFeedView 
                events={activeUser.id === 'ligo' ? [] : viewEvents} 
                user={activeUser} 
                orgs={allOrgs}
                onOpenEvent={(id) => { setActiveEventId(id); setDetailReturnView('main'); setView('event-detail'); }}
                onOpenOrgWorkspace={(id) => { setActiveOrgId(id); setSkipOrgWelcome(false); setView('organization'); }}
                onOpenProfile={(orgId) => openProfile(orgId, 'main')}
                onCreateProfile={() => {
                  setCreateProfileType(null);
                  setView('create-profile');
                }}
              />
            )}

            {mainTab === 'invites' && (
              <InvitesView 
                events={activeUser.id === 'ligo' ? [] : viewEvents}
                onOpenEvent={(id) => { setActiveEventId(id); setDetailReturnView('main'); setView('event-detail'); }}
                onAction={handleRsvp}
                currentUserId={activeUserId}
              />
            )}

            {mainTab === 'clubs' && (
              <div className="screen-fade" style={{ padding: '16px 20px 120px' }}>
                {hasClubs ? (
                  /* USER HAS CLUBS / DJ HUBS */
                  <div>
                    <div style={{ fontSize: 13, color: 'rgba(20,17,13,0.5)', fontWeight: 500, marginBottom: 16 }}>
                      Your organizations & creator hubs
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {memberOrgs.map(({ org, role }: any) => {
                        const isDjOrArtist = org.type === 'artist' || org.name.toLowerCase().includes('dj');
                        return (
                          <button
                            key={org.id}
                            onClick={() => {
                              if (isDjOrArtist) {
                                openProfile(org.id, 'main');
                              } else {
                                setActiveOrgId(org.id);
                                setMemberClubScreen('home');
                                setSkipClubWelcome(false);
                                setView('member-club');
                              }
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 16,
                              padding: 16,
                              background: '#fff',
                              borderRadius: 20,
                              boxShadow: '0 4px 16px rgba(20,17,13,0.04)',
                              border: '1px solid rgba(20,17,13,0.06)',
                              cursor: 'pointer',
                              textAlign: 'left',
                            }}
                          >
                            <div style={{
                              width: 48, height: 48, borderRadius: 14,
                              background: org.avatarColor || '#14110D', color: '#fff',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: isDjOrArtist ? 20 : 13, fontWeight: 600, letterSpacing: '0.04em', flexShrink: 0
                            }}>
                              {isDjOrArtist ? '🎧' : (org.initials || org.name.charAt(0))}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ fontSize: 16, fontWeight: 600, color: '#14110D' }}>{org.name}</span>
                                {isDjOrArtist && (
                                  <span style={{ fontSize: 11, fontWeight: 600, color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '2px 8px', borderRadius: 8 }}>
                                    DJ Persona
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: 13.5, color: 'rgba(20,17,13,0.5)', marginTop: 3 }}>
                                {org.category || (isDjOrArtist ? 'Campus DJ' : 'Student Org')} · {String(role).replace('_', ' ')}
                              </div>
                            </div>
                            <EVI.Chevron style={{ width: 16, height: 16, color: 'rgba(20,17,13,0.3)', transform: 'rotate(-90deg)' }} />
                          </button>
                        );
                      })}
                    </div>

                    {/* Discreet bottom action to register another organization or DJ profile */}
                    <button
                      onClick={() => setHostActionSheetOpen(true)}
                      style={{
                        marginTop: 20,
                        width: '100%',
                        padding: '14px',
                        borderRadius: 16,
                        border: '1px dashed rgba(20,17,13,0.18)',
                        background: 'rgba(255,255,255,0.6)',
                        color: 'rgba(20,17,13,0.6)',
                        fontSize: 13.5,
                        fontWeight: 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span style={{ fontSize: 16, fontWeight: 600 }}>+</span>
                      <span>Register another club or DJ profile</span>
                    </button>
                  </div>
                ) : (
                  /* CLEAN EMPTY STATE (e.g. Ligo user or new student without clubs) */
                  <div className="fade-in">
                    <div style={{ textAlign: 'center', padding: '32px 16px 24px' }}>
                      <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'rgba(249,115,22,0.1)', color: 'var(--ligo-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 30 }}>
                        🏛️
                      </div>
                      <h2 style={{ fontSize: 24, fontWeight: 600, color: '#111', fontFamily: 'var(--font-display)', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
                        Campus Organizations & Hosts
                      </h2>
                      <p style={{ fontSize: 14.5, color: '#666', lineHeight: 1.5, margin: '0 auto 28px', maxWidth: 320 }}>
                        Your hub for student clubs, Greek life, and campus DJs. Once you join a roster or register your host persona, you'll manage private chats, member rosters, and events here.
                      </p>
                    </div>

                    {/* Registration Entry Cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <button
                        onClick={() => {
                          setCreateProfileType('artist');
                          setView('create-profile');
                        }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 16, padding: 18,
                          background: '#fff', borderRadius: 20, border: '1px solid rgba(0,0,0,0.08)',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.03)', cursor: 'pointer', textAlign: 'left'
                        }}
                      >
                        <div style={{ width: 50, height: 50, borderRadius: 14, background: 'rgba(239,68,68,0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                          🎧
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 16, fontWeight: 600, color: '#111', marginBottom: 2 }}>
                            Register as an Artist / DJ
                          </div>
                          <div style={{ fontSize: 13, color: '#666', lineHeight: 1.35 }}>
                            Post live sets, link SoundCloud, and get booked for campus gigs & formals.
                          </div>
                        </div>
                        <EVI.Chevron style={{ width: 16, height: 16, color: 'rgba(20,17,13,0.3)', transform: 'rotate(-90deg)', flexShrink: 0 }} />
                      </button>

                      <button
                        onClick={() => {
                          setCreateProfileType('club');
                          setView('create-profile');
                        }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 16, padding: 18,
                          background: '#fff', borderRadius: 20, border: '1px solid rgba(0,0,0,0.08)',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.03)', cursor: 'pointer', textAlign: 'left'
                        }}
                      >
                        <div style={{ width: 50, height: 50, borderRadius: 14, background: 'rgba(59,130,246,0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                          🏛️
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 16, fontWeight: 600, color: '#111', marginBottom: 2 }}>
                            Register a Student Org or Club
                          </div>
                          <div style={{ fontSize: 13, color: '#666', lineHeight: 1.35 }}>
                            Manage member rosters, private group chats, and publish events to Explore.
                          </div>
                        </div>
                        <EVI.Chevron style={{ width: 16, height: 16, color: 'rgba(20,17,13,0.3)', transform: 'rotate(-90deg)', flexShrink: 0 }} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* TOP HEADER + ACTION SHEET */}
      {hostActionSheetOpen && (
        <div 
          onClick={() => setHostActionSheetOpen(false)}
          className="screen-fade" 
          style={{ position: 'absolute', inset: 0, zIndex: 70, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: '24px 24px 0 0', padding: '24px 20px max(env(safe-area-inset-bottom, 24px), 24px)', animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
          >
            {/* Grab handle */}
            <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.15)', margin: '0 auto 20px' }} />
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#111', fontFamily: 'var(--font-display)' }}>
                  Host on Georgetown Ligo
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: 13.5, color: '#666' }}>
                  Register your DJ persona, band, or a student organization.
                </p>
              </div>
              <button 
                onClick={() => setHostActionSheetOpen(false)}
                style={{ background: 'rgba(0,0,0,0.05)', border: 'none', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Option 1: Artist / DJ */}
              <button
                onClick={() => {
                  setHostActionSheetOpen(false);
                  setCreateProfileType('artist');
                  setView('create-profile');
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: 16,
                  borderRadius: 18, background: '#FAFAF8', border: '1px solid rgba(0,0,0,0.06)',
                  cursor: 'pointer', textAlign: 'left'
                }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#14110D', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                  🎧
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>Register as an Artist / DJ</div>
                  <div style={{ fontSize: 12.5, color: '#666', marginTop: 2 }}>Post live sets, link SoundCloud & get booked</div>
                </div>
                <EVI.Chevron style={{ width: 14, height: 14, color: '#888', transform: 'rotate(-90deg)' }} />
              </button>

              {/* Option 2: Student Org / Greek */}
              <button
                onClick={() => {
                  setHostActionSheetOpen(false);
                  setCreateProfileType('club');
                  setView('create-profile');
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: 16,
                  borderRadius: 18, background: '#FAFAF8', border: '1px solid rgba(0,0,0,0.06)',
                  cursor: 'pointer', textAlign: 'left'
                }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--ligo-orange)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                  🏛️
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>Register a Student Org / Greek</div>
                  <div style={{ fontSize: 12.5, color: '#666', marginTop: 2 }}>Rosters, private group chat & campus events</div>
                </div>
                <EVI.Chevron style={{ width: 14, height: 14, color: '#888', transform: 'rotate(-90deg)' }} />
              </button>
            </div>
          </div>
        </div>
      )}

      {view === 'member-club' && activeOrg && (
        <MemberClubHome
          org={activeOrg}
          events={viewEvents}
          skipWelcome={skipClubWelcome}
          onBack={() => { setActiveOrgId(null); setSkipClubWelcome(false); setView('main'); }}
          onOpenEvent={(id: string) => {
            setActiveEventId(id);
            setDetailReturnView('member-club');
            setView('event-detail');
          }}
          onOpenManage={() => {
            setSkipOrgWelcome(false);
            setView('organization');
          }}
          onRsvp={handleRsvp}
          currentUserId={activeUserId}
          currentUserRole={userOrgsList.find((o: any) => o.organizationId === activeOrgId)?.role || 'member'}
          initialScreen={memberClubScreen}
        />
      )}

      {view === 'organization' && activeOrg && (
        <OrganizationWorkspace 
          org={activeOrg} 
          events={viewEvents} 
          skipWelcome={skipOrgWelcome}
          onBack={() => { setActiveOrgId(null); setSkipOrgWelcome(false); setView('main'); }}
          onManageEvent={(id) => {
            setSkipOrgWelcome(true);
            setActiveEventId(id);
            setView('manage-event');
          }}
          onCreateEvent={() => setSheetOpen(true)}
          onInviteMembers={() => setImportContactsOpen(true)}
          currentUserRole={activeUser.organizations.find((o: any) => o.organizationId === activeOrgId)?.role || 'admin'}
          currentUserId={activeUserId}
        />
      )}

      {view === 'manage-event' && activeEvent && (
        <ManageEventView 
          event={activeEvent} 
          onBack={() => {
            setSkipOrgWelcome(true);
            setView(activeOrgId ? 'organization' : 'main');
          }} 
          onToast={flash}
          currentUserId={activeUserId}
          onViewEvent={() => {
            setDetailReturnView('manage-event');
            setView('event-detail');
          }}
          onDelete={() => {
            setEvents(prev => prev.filter(e => e.id !== activeEvent.id));
            flash('Event deleted');
            setSkipOrgWelcome(true);
            setView(activeOrgId ? 'organization' : 'main');
          }}
        />
      )}

      {view === 'event-detail' && activeEvent && (
        <EventDetailView 
          e={activeEvent} 
          onBack={() => setView(detailReturnView)} 
          onRsvpAction={(a) => handleRsvp(activeEvent.id, a)}
          currentUserId={activeUserId}
          canOpenEventChat={activeUser.organizations.some(
            (o: any) => o.organizationId === activeEvent.hostOrganizationId
          )}
          onOpenProfile={(orgId) => openProfile(orgId, 'event-detail')}
        />
      )}

      {view === 'public-profile' && (
        activeProfileOrganizer ? (
          <PublicProfileView
            organizer={activeProfileOrganizer}
            hostAvatar={activeProfileEvent?.hostAvatar}
            hostAvatarColor={activeProfileEvent?.hostAvatarColor || (activeProfileOrganizer as any).avatarColor}
            events={profileEvents}
            onBack={() => setView(profileReturnView)}
            onOpenEvent={(id) => {
              setActiveEventId(id);
              setDetailReturnView('public-profile');
              setView('event-detail');
            }}
          />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FAFAF8', padding: 24 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>👻</div>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: '#111', marginBottom: 8 }}>Profile Data Lost</h2>
            <p style={{ color: '#666', textAlign: 'center', marginBottom: 24, fontSize: 15 }}>The mock data was reset by a hot-reload.</p>
            <button 
              onClick={() => setView('main')}
              style={{ padding: '12px 24px', background: 'var(--ink)', color: '#fff', borderRadius: 100, border: 'none', fontWeight: 600, cursor: 'pointer' }}
            >
              Back to Home
            </button>
          </div>
        )
      )}

      {view === 'create-profile' && (
        <CreateProfileFlow 
          initialType={createProfileType}
          onCancel={() => setView('main')}
          onComplete={(profile) => {
            const orgObj = {
              ...profile,
              groups: [{ id: 'all', name: 'All Members', memberCount: 1 }],
              workspaceFeatures: ['chat', 'events']
            };

            // Save to in-memory MOCK_ORGANIZATIONS
            MOCK_ORGANIZATIONS[profile.id] = orgObj;
            
            // Save to persistent custom orgs
            setCustomOrgs(prev => ({
              ...prev,
              [profile.id]: orgObj
            }));

            // Save user membership
            setCustomMemberships(prev => {
              const userList = prev[activeUserId] || [];
              return {
                ...prev,
                [activeUserId]: [
                  ...userList,
                  {
                    organizationId: profile.id,
                    role: 'admin',
                    groupIds: ['all']
                  }
                ]
              };
            });

            // Also push to activeUser for immediate render
            activeUser.organizations.push({
              organizationId: profile.id,
              role: 'admin',
              groupIds: ['all']
            });

            // Navigate to public profile
            setActiveProfileOrgId(profile.id);
            setProfileReturnView('main');
            setView('public-profile');
          }}
        />
      )}

      {view === 'publish-confirmation' && activeEvent && (
        <div className="screen-fade" style={{ background: 'var(--ligo-paper)', minHeight: '100%', position: 'absolute', inset: 0, zIndex: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--orange)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
            <EVI.Check style={{ width: 40, height: 40 }} />
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 500, fontFamily: '"Bricolage Grotesque", sans-serif', margin: '0 0 16px 0', lineHeight: 1, textTransform: 'uppercase' }}>It&apos;s Live.</h1>
          <p style={{ fontSize: 16, color: 'rgba(20,17,13,0.6)', fontWeight: 500, marginBottom: 48, maxWidth: 300, lineHeight: 1.4 }}>
            {activeEvent.visibility === 'members_only' || activeEvent.visibility === 'invite_only' 
              ? `Invites are being delivered to your guests.` 
              : `Your event is now live on the Georgetown feed.`}
          </p>
          <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <button 
              onClick={simulateTimeJumpAndGoToDashboard} 
              style={{ width: '100%', padding: '18px 24px', background: 'var(--ink)', color: '#fff', fontSize: 13, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none', borderRadius: 40, cursor: 'pointer' }}>
              Go to Dashboard
            </button>
            <button 
              onClick={() => setView(activeOrgId ? 'organization' : 'main')} 
              style={{ width: '100%', padding: '18px 24px', background: 'transparent', color: 'var(--ink)', fontSize: 13, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none', cursor: 'pointer' }}>
              Back to feed
            </button>
          </div>
        </div>
      )}

      {view === 'organization' && activeUser.organizations.some((o: any) => ['officer', 'social_chair', 'admin'].includes(o.role)) && (
        <button 
          onClick={() => setSheetOpen(true)} 
          style={{ position: 'absolute', bottom: 100, right: 20, zIndex: 30, background: 'var(--ink)', color: '#fff', padding: '16px 24px', borderRadius: 40, fontSize: 14, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
          <EVI.Plus /> Create
        </button>
      )}

      {sheetOpen && (
        <CreateEventSheet 
          club={allOrgs[userOrgsList.find((o: any) => ['officer', 'social_chair', 'admin'].includes(o.role))?.organizationId || 'phantoms'] || MOCK_ORGANIZATIONS.phantoms} 
          currentUserId={activeUser.id}
          onClose={() => setSheetOpen(false)} 
          onPublish={handlePublish} 
        />
      )}

      {importContactsOpen && (
        <ImportContactsFlow
          orgId={activeOrg?.id || userOrgsList.find((o: any) => ['officer', 'social_chair', 'admin'].includes(o.role))?.organizationId}
          orgName={
            activeOrg?.name
            || allOrgs[
              userOrgsList.find((o: any) => ['officer', 'social_chair', 'admin'].includes(o.role))?.organizationId || ''
            ]?.name
          }
          onBack={() => {
            setImportContactsOpen(false);
            if (activeOrgId) setView('organization');
          }}
          onClose={() => {
            setImportContactsOpen(false);
            if (activeOrgId) setView('organization');
            flash('Invitations sent');
          }}
        />
      )}

      {toast && (
        <div style={{ position: 'absolute', top: 40, left: 20, right: 20, background: 'var(--ink)', color: '#fff', padding: 16, fontSize: 13, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', zIndex: 100, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'var(--orange)' }}><EVI.Check /></span>{toast}
        </div>
      )}
    </div>
  );
}
