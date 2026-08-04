"use client";
import React, { useState, useMemo, useRef } from "react";
import { INITIAL_EVENTS, MOCK_ORGANIZATIONS, EventItem, MockUser, GPB_SEED_EVENTS } from "../lib/mockEventsData";
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

export function EventsScreen({ onTab }: any) {
  const [activeUserId] = usePersistentState('ligo:active_user', 'marcus');

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

  // Keep mock data as-is for Charlotte to see the new fixture events
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
  
  const [showSwipeableInvites, setShowSwipeableInvites] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [importContactsOpen, setImportContactsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const lastViewedUserId = useRef<string | null>(null);

  // Per-user view of events (membership + invites + explicit RSVPs)
  const viewEvents = useMemo(
    () => withResolvedStatuses(events, activeUserId, activeUser, rsvpStore),
    [events, activeUserId, activeUser, rsvpStore],
  );
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Vercel (Linux) is case-sensitive; older cached rows can still point at `/posh/...`
  // while files live under `/Posh/...`. Keep cover URLs in sync with source data.
  // Also remap legacy hostOrganizationId values (e.g. GPB avatar code → program_board).
  React.useEffect(() => {
    const kickoffCopy =
      'Join the full Georgetown Program Board for our fall programming kickoff. We’ll walk through the semester calendar, assign initial event teams, review production timelines, and cover expectations for Programming, Marketing, and Production. Dinner will be provided, and all members should arrive ready to choose at least one September or October event to support.';
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
      // Created events saved flyerUrl but not image
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
          if (!image) image = e.flyerUrl || '/Posh/GPB2.png';
          if (!description) description = e.summary || kickoffCopy;
        }

        if (
          image === e.image
          && (e.flyerUrl || image) === e.flyerUrl
          && description === e.description
          && hostOrganizationId === e.hostOrganizationId
          && (e.summary || description) === e.summary
        ) {
          return e;
        }

        return {
          ...e,
          image,
          flyerUrl: e.flyerUrl || image,
          description,
          summary: e.summary || (typeof description === 'string' ? description : e.summary),
          hostOrganizationId,
        };
      });
      const stillMissing = GPB_SEED_EVENTS.filter(seed => !fixed.some(e => e.id === seed.id));
      return stillMissing.length ? [...fixed, ...stillMissing] : fixed;
    });
  }, [events, setEvents]);

  const pendingInvites = viewEvents.filter(e =>
    e.currentUserStatus === 'pending'
    && ['private', 'members_only', 'invite_only'].includes(e.visibility)
    && e.publishStatus !== 'draft'
    && e.publishStatus !== 'planning'
  );

  React.useEffect(() => {
    // When active user changes, trigger stack if they have invites
    if (activeUserId !== lastViewedUserId.current) {
      if (pendingInvites.length > 0) {
        setShowSwipeableInvites(true);
      } else {
        setShowSwipeableInvites(false);
      }
      lastViewedUserId.current = activeUserId;
      setLiveActivityEventId(null);
    }
  }, [activeUserId, pendingInvites.length]);

  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(null), 2600); }

  function handleRsvp(id: string, action: 'going'|'maybe'|'declined'|null) {
    const eventId = String(id);
    // null = undo → clear explicit RSVP so membership invites fall back to pending
    setRsvpStore(prev => setUserRsvp(prev, activeUserId, eventId, action));
    if (action === 'going') {
      setLiveActivityEventId(eventId);
      flash(`You're in — Live Activity on`);
    } else {
      if (liveActivityEventId === eventId) setLiveActivityEventId(null);
      if (action) flash(`RSVP updated to ${action}`);
      else flash('RSVP removed');
    }
  }

  function handlePublish(newEvent: Partial<EventItem>, isDraft: boolean) {
    setSheetOpen(false);
    if (isDraft) {
      flash('Draft saved');
      return;
    }

    let finalPendingCount = 0;
    const finalEvent = newEvent as EventItem;
    finalEvent.creatorId = activeUserId;
    finalEvent.invitedUserIds = [];

    const activeOrg = MOCK_ORGANIZATIONS[finalEvent.hostOrganizationId];
    const demoMembers = DEMO_ORG_MEMBERS[finalEvent.hostOrganizationId] || [];

    if (finalEvent.visibility === 'members_only') {
      if (activeOrg.memberCount === 0) {
        setImportContactsOpen(true);
        return;
      }
      const subgroups = finalEvent.selectedSubgroups || [];
      const allMembers = activeOrg.groups.find((g: any) => g.name === 'All Members');
      if (allMembers && subgroups.includes(allMembers.id)) {
        finalPendingCount = allMembers.memberCount;
      } else {
        let count = 0;
        for (const sg of subgroups) {
          const g = activeOrg.groups.find((x: any) => x.id === sg);
          if (g) count += g.memberCount;
        }
        finalPendingCount = count;
      }
      // Invite other demo profiles in this org (membership also implies pending)
      finalEvent.invitedUserIds = demoMembers.filter(id => id !== activeUserId);
      finalEvent.goingCount = 1;
      finalEvent.currentUserStatus = 'hosting';

    } else if (finalEvent.visibility === 'invite_only') {
      const guests = finalEvent.selectedGuests || [];
      let count = 0;
      const ids: string[] = [];
      for (const g of guests) {
        if (g.type === 'user') { count += 1; ids.push(g.id); }
        if (g.type === 'org') {
          const o = MOCK_ORGANIZATIONS[g.id];
          if (o) count += o.memberCount;
          const orgDemo = DEMO_ORG_MEMBERS[g.id] || [];
          ids.push(...orgDemo.filter(id => id !== activeUserId));
        }
      }
      finalPendingCount = count;
      finalEvent.invitedUserIds = ids.filter((id, i) => ids.indexOf(id) === i);
      finalEvent.goingCount = 1;
      finalEvent.currentUserStatus = 'hosting';

    } else {
      finalPendingCount = 0;
      finalEvent.goingCount = 1;
      finalEvent.currentUserStatus = 'hosting';
    }

    finalEvent.pendingCount = finalPendingCount;

    INITIAL_EVENTS.push(finalEvent);
    setEvents(prev => [...prev, finalEvent]);
    
    setActiveEventId(finalEvent.id);
    setSheetOpen(false);
    setView('publish-confirmation');
  }

  const simulateTimeJumpAndGoToDashboard = () => {
    if (activeEventId) {
      setEvents(prev => prev.map(e => {
        if (e.id === activeEventId) {
          return {
            ...e,
            id: typeof e.id === 'string' ? e.id.replace('new-', 'jump-') : e.id, // Remove new- prefix so it gets established activity
            goingCount: e.capacity ? Math.floor(e.capacity * 0.8) : 84,
            pendingCount: 12,
            declinedCount: 4,
          };
        }
        return e;
      }));
      // Wait a tick for state to update, or just change view immediately
      // Actually we need to change activeEventId to the new 'jump-' prefix if we renamed it!
      const newId = typeof activeEventId === 'string' ? activeEventId.replace('new-', 'jump-') : activeEventId;
      setActiveEventId(newId);
    }
    setView('manage-event');
  };

  const activeEvent = activeEventId ? viewEvents.find(e => e.id === activeEventId) : null;
  const activeOrg = activeOrgId ? MOCK_ORGANIZATIONS[activeOrgId] : null;
  const liveActivityEvent = liveActivityEventId
    ? viewEvents.find(e => String(e.id) === liveActivityEventId && (e.currentUserStatus === 'going' || e.currentUserStatus === 'hosting'))
    : null;

  // Profile data for the public profile view
  const activeProfileEvent = activeProfileOrgId
    ? viewEvents.find(e => e.hostOrganizationId === activeProfileOrgId || String(e.id) === activeProfileOrgId)
    : null;
  const activeProfileOrganizer = activeProfileEvent?.organizer || (activeProfileOrgId ? MOCK_ORGANIZATIONS[activeProfileOrgId] as any : null);
  const profileEvents = activeProfileOrgId
    ? viewEvents.filter(e => {
        const matchesOrg = e.hostOrganizationId === activeProfileOrgId;
        const matchesHost = e.organizer?.name === activeProfileOrganizer?.name;
        return matchesOrg || matchesHost;
      })
    : [];

  const openProfile = (eventOrOrgId: string, returnView?: EventsView) => {
    // Find the event to extract organizer data
    const event = viewEvents.find(e => String(e.id) === eventOrOrgId || e.hostOrganizationId === eventOrOrgId);
    if (event?.organizer) {
      setActiveProfileOrgId(event.hostOrganizationId || eventOrOrgId);
      setProfileReturnView(returnView || view);
      setView('public-profile');
    }
  };

  const managedOrgs = activeUser.organizations
    .filter((o: any) => ['officer', 'social_chair', 'admin'].includes(o.role))
    .map((o: any) => MOCK_ORGANIZATIONS[o.organizationId])
    .filter(Boolean);
  const isAdmin = managedOrgs.length > 0;
  const memberOrgs = activeUser.organizations
    .map((o: any) => ({
      ...o,
      org: MOCK_ORGANIZATIONS[o.organizationId],
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
                <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', color: '#111' }}>
                  <EVI.Search style={{ width: 24, height: 24 }} />
                </div>
              </div>
            </div>
            
            {/* Top Tab Bar */}
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

              {hasClubs && (
                <button 
                  onClick={() => setMainTab('clubs')} 
                  style={{ paddingBottom: 16, fontSize: compactTabs ? 15 : 16, fontWeight: 500, color: mainTab === 'clubs' ? 'var(--ink)' : 'rgba(20,17,13,0.4)', background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
                  Clubs
                  {mainTab === 'clubs' && <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, background: 'var(--ink)', borderRadius: 2 }} />}
                </button>
              )}

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
                orgs={MOCK_ORGANIZATIONS}
                onOpenEvent={(id) => { setActiveEventId(id); setDetailReturnView('main'); setView('event-detail'); }}
                onOpenOrgWorkspace={(id) => { setActiveOrgId(id); setSkipOrgWelcome(false); setView('organization'); }}
                onOpenProfile={(orgId) => openProfile(orgId, 'main')}
                onCreateProfile={() => setView('create-profile')}
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
              <div className="screen-fade" style={{ padding: '8px 20px 120px' }}>
                <div style={{ fontSize: 13, color: 'rgba(20,17,13,0.5)', fontWeight: 500, marginBottom: 20, marginTop: 8 }}>
                  Your organizations on campus
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {memberOrgs.map(({ org, role }: any) => (
                    <button
                      key={org.id}
                      onClick={() => {
                        setActiveOrgId(org.id);
                        setMemberClubScreen('home');
                        setSkipClubWelcome(false);
                        setView('member-club');
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
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: '#14110D', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, letterSpacing: '0.04em', flexShrink: 0 }}>
                        {org.initials}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 16, fontWeight: 600, color: '#14110D' }}>{org.name}</div>
                        <div style={{ fontSize: 14, color: 'rgba(20,17,13,0.5)', marginTop: 2 }}>
                          {org.category} · {org.memberCount} members · {String(role).replace('_', ' ')}
                        </div>
                      </div>
                      <EVI.Chevron style={{ width: 16, height: 16, color: 'rgba(20,17,13,0.3)', transform: 'rotate(-90deg)' }} />
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {view === 'member-club' && activeOrg && (
        <MemberClubHome
          org={activeOrg}
          events={viewEvents}
          currentUserId={activeUserId}
          currentUserRole={activeUser.organizations.find((o: any) => o.organizationId === activeOrgId)?.role || 'member'}
          initialScreen={memberClubScreen}
          skipWelcome={skipClubWelcome}
          onScreenChange={setMemberClubScreen}
          onRsvp={handleRsvp}
          onBack={() => { setActiveOrgId(null); setView('main'); setMainTab('clubs'); }}
          onOpenEvent={(id) => {
            setSkipClubWelcome(true);
            setActiveEventId(id);
            setDetailReturnView('member-club');
            setView('event-detail');
          }}
          onOpenManage={
            ['admin', 'officer', 'social_chair'].includes(
              activeUser.organizations.find((o: any) => o.organizationId === activeOrgId)?.role || ''
            )
              ? () => { setSkipOrgWelcome(false); setView('organization'); }
              : undefined
          }
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
          onCancel={() => setView('main')}
          onComplete={(profile) => {
            // Mock injecting the new profile into MOCK_ORGANIZATIONS
            MOCK_ORGANIZATIONS[profile.id] = {
              ...profile,
              groups: [{ id: 'all', name: 'All Members', memberCount: 1 }],
              workspaceFeatures: ['chat', 'events']
            };
            
            // Add user as admin
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
          club={MOCK_ORGANIZATIONS[activeUser.organizations.find((o: any) => ['officer', 'social_chair', 'admin'].includes(o.role))?.organizationId || 'phantoms']} 
          currentUserId={activeUser.id}
          onClose={() => setSheetOpen(false)} 
          onPublish={handlePublish} 
        />
      )}

      {importContactsOpen && (
        <ImportContactsFlow
          orgId={activeOrg?.id || activeUser.organizations.find((o: any) => ['officer', 'social_chair', 'admin'].includes(o.role))?.organizationId}
          orgName={
            activeOrg?.name
            || MOCK_ORGANIZATIONS[
              activeUser.organizations.find((o: any) => ['officer', 'social_chair', 'admin'].includes(o.role))?.organizationId || ''
            ]?.name
          }
          onBack={() => {
            setImportContactsOpen(false);
            // Stay on organization workspace if that's where invite was opened from
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
