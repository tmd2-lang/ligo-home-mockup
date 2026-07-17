"use client";
import React, { useState } from "react";
import { INITIAL_EVENTS, MOCK_ORGANIZATIONS, EventItem, MockUser } from "../lib/mockEventsData";
import { HomeFeedView } from "./events/HomeFeedView";
import { InvitesView } from "./events/InvitesView";
import { OrganizationWorkspace } from "./events/OrganizationWorkspace";
import { ManageEventView } from "./events/ManageEventView";
import { CreateEventSheet } from "./events/CreateEventSheet";
import { EventDetailView } from "./events/EventDetailView";
import { SwipeableInvites } from "./events/SwipeableInvites";
import { ImportContactsFlow } from "./events/ImportContactsFlow";
import { EVI } from "./events/Icons";
import { usePersistentState } from "../lib/usePersistentState";

type EventsView = "main" | "organization" | "manage-event" | "event-detail" | "publish-confirmation";
type MainTab = 'home' | 'invites';

export function EventsScreen({ onTab }: any) {
  const [activeUserId] = usePersistentState('ligo:active_user', 'marcus');

  // Dynamic user based on profile state
  const activeUser: MockUser = {
    id: activeUserId,
    name: activeUserId.charAt(0).toUpperCase() + activeUserId.slice(1),
    campus: 'georgetown',
    organizations: activeUserId === 'marcus' ? [
      { organizationId: 'sigma_phi_epsilon', role: 'social_chair', groupIds: ['g-all-spe', 'g-exec-spe'] }
    ] : activeUserId === 'sofia' ? [
      { organizationId: 'phantoms', role: 'social_chair', groupIds: ['g1', 'g2'] }
    ] : []
  };

  // Keep mock data as-is for Charlotte to see the new fixture events
  const dynamicInitialEvents = INITIAL_EVENTS;

  const [events, setEvents] = usePersistentState<EventItem[]>('ligo:all_events_v1', dynamicInitialEvents);
  const [view, setView] = useState<EventsView>("main");
  const [mainTab, setMainTab] = useState<'home' | 'invites'>('home');
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [importContactsOpen, setImportContactsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  React.useEffect(() => {
    setEvents(prev => prev.map(e => {
      if (typeof e.id === 'string' && e.id.startsWith('new-')) {
        const isHost = activeUserId === (e as any).creatorId;
        const isTarget = (e as any).invitedUserIds?.includes(activeUserId);
        return { ...e, currentUserStatus: isHost ? 'hosting' : isTarget ? 'pending' : null };
      }
      return e;
    }));
  }, [activeUserId]);

  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(null), 2600); }

  function handleRsvp(id: string, action: 'going'|'maybe'|'declined'|null) {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, currentUserStatus: action } : e));
    if (action) flash(`RSVP updated to ${action}`);
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

    if (finalEvent.visibility === 'members_only') {
      if (activeOrg.memberCount === 0) {
        setImportContactsOpen(true);
        return;
      }
      const subgroups = finalEvent.selectedSubgroups || [];
      const allMembers = activeOrg.groups.find((g: any) => g.name === 'All Members');
      if (allMembers && subgroups.includes(allMembers.id)) {
        finalPendingCount = allMembers.memberCount;
        finalEvent.invitedUserIds = ['jordan', 'sofia', 'charlotte'];
      } else {
        let count = 0;
        for (const sg of subgroups) {
          const g = activeOrg.groups.find((x: any) => x.id === sg);
          if (g) count += g.memberCount;
        }
        finalPendingCount = count;
        finalEvent.invitedUserIds = ['jordan']; 
      }
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
        }
      }
      finalPendingCount = count;
      finalEvent.invitedUserIds = ids;
      finalEvent.goingCount = 1;
      finalEvent.currentUserStatus = 'hosting';

    } else {
      finalPendingCount = 0;
      finalEvent.goingCount = 1;
      finalEvent.currentUserStatus = 'hosting';
    }

    finalEvent.pendingCount = finalPendingCount;

    // We keep goingCount 1 initially because the host is going.
    INITIAL_EVENTS.push(finalEvent);
    setEvents(prev => [...prev, finalEvent]);
    
    setActiveEventId(finalEvent.id);
    setSheetOpen(false); // Make sure the sheet closes
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

  const activeEvent = activeEventId ? events.find(e => e.id === activeEventId) : null;
  const activeOrg = activeOrgId ? MOCK_ORGANIZATIONS[activeOrgId] : null;

  const pendingInvites = events.filter(e => e.currentUserStatus === 'pending' && ['private', 'members_only', 'invite_only'].includes(e.visibility));
  const hasInvites = pendingInvites.length > 0;

  const managedOrgs = activeUser.organizations
    .filter((o: any) => ['officer', 'social_chair', 'admin'].includes(o.role))
    .map((o: any) => MOCK_ORGANIZATIONS[o.organizationId])
    .filter(Boolean);
  const isAdmin = managedOrgs.length > 0;
  
  // Disable old swipeable invites onboarding
  const showSwipeableInvites = false;

  return (
    <div className="screen" style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: 'var(--ligo-paper)' }}>
      
      {showSwipeableInvites && (
        <SwipeableInvites 
          invites={pendingInvites} 
          onComplete={() => setHasCompletedOnboarding(true)} 
          onRsvp={handleRsvp} 
        />
      )}

      {view === 'main' && !showSwipeableInvites && (
        <div className="scroll" style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <div style={{ paddingTop: 'max(env(safe-area-inset-top, 56px), 56px)', paddingLeft: 20, paddingRight: 20, paddingBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ligo-orange)', marginBottom: 4 }}>
                CAMPUS · GEORGETOWN
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, fontFamily: 'var(--font-display)', letterSpacing: '-1px', color: '#111' }}>
                  What's Happening<br/>on Campus
                </h1>
                <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', color: '#111' }}>
                  <EVI.Search style={{ width: 24, height: 24 }} />
                </div>
              </div>
            </div>
            
            {/* Top Tab Bar */}
            <div style={{ display: 'flex', gap: isAdmin ? 16 : 24, padding: '0 20px' }}>
              <button 
                onClick={() => setMainTab('home')} 
                style={{ paddingBottom: 16, fontSize: isAdmin ? 15 : 16, fontWeight: 700, color: mainTab === 'home' ? 'var(--ink)' : 'rgba(20,17,13,0.4)', background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
                Explore
                {mainTab === 'home' && <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, background: 'var(--ink)', borderRadius: 2 }} />}
              </button>
              
              <button 
                onClick={() => setMainTab('invites')} 
                style={{ paddingBottom: 16, marginRight: pendingInvites.length > 0 ? 16 : 0, fontSize: isAdmin ? 15 : 16, fontWeight: 700, color: mainTab === 'invites' ? 'var(--ink)' : 'rgba(20,17,13,0.4)', background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
                My Events
                {pendingInvites.length > 0 && (
                  <div style={{ position: 'absolute', top: -4, right: -14, background: 'var(--ligo-orange)', color: '#fff', fontSize: 10, fontWeight: 800, borderRadius: 10, padding: '2px 6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {pendingInvites.length}
                  </div>
                )}
                {mainTab === 'invites' && <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, background: 'var(--ink)', borderRadius: 2 }} />}
              </button>

              {isAdmin && (
                <button 
                  onClick={() => {
                    setActiveOrgId(managedOrgs[0].id);
                    setView('organization');
                  }} 
                  style={{ paddingBottom: 16, fontSize: 15, fontWeight: 700, color: 'rgba(20,17,13,0.4)', background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
                  Manage
                </button>
              )}
            </div>
          </div>
          <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
            {mainTab === 'home' && (
              <HomeFeedView 
                events={events} 
                user={activeUser} 
                orgs={MOCK_ORGANIZATIONS}
                onOpenEvent={(id) => { setActiveEventId(id); setView('event-detail'); }}
                onOpenOrgWorkspace={(id) => { setActiveOrgId(id); setView('organization'); }}
              />
            )}

            {mainTab === 'invites' && (
              <InvitesView 
                events={events}
                onOpenEvent={(id) => { setActiveEventId(id); setView('event-detail'); }}
                onAction={handleRsvp}
              />
            )}

          </div>
        </div>
      )}

      {view === 'organization' && activeOrg && (
        <OrganizationWorkspace 
          org={activeOrg} 
          events={events} 
          onBack={() => { setActiveOrgId(null); setView('main'); }}
          onManageEvent={(id) => { setActiveEventId(id); setView('manage-event'); }}
          onCreateEvent={() => setSheetOpen(true)}
          onInviteMembers={() => setImportContactsOpen(true)}
        />
      )}

      {view === 'manage-event' && activeEvent && (
        <ManageEventView 
          event={activeEvent} 
          onBack={() => setView(activeOrgId ? 'organization' : 'main')} 
          onToast={flash}
        />
      )}

      {view === 'event-detail' && activeEvent && (
        <EventDetailView 
          e={activeEvent} 
          onBack={() => setView('main')} 
          onRsvpAction={(a) => handleRsvp(activeEvent.id, a)}
        />
      )}

      {view === 'publish-confirmation' && activeEvent && (
        <div className="screen-fade" style={{ background: 'var(--ligo-paper)', minHeight: '100%', position: 'absolute', inset: 0, zIndex: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--orange)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
            <EVI.Check style={{ width: 40, height: 40 }} />
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, fontFamily: 'var(--font-display)', margin: '0 0 16px 0', lineHeight: 1, textTransform: 'uppercase' }}>It&apos;s Live.</h1>
          <p style={{ fontSize: 16, color: 'rgba(20,17,13,0.6)', fontWeight: 500, marginBottom: 48, maxWidth: 300, lineHeight: 1.4 }}>
            {activeEvent.visibility === 'members_only' || activeEvent.visibility === 'invite_only' 
              ? `Invites are being delivered to your guests.` 
              : `Your event is now live on the Georgetown feed.`}
          </p>
          <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <button 
              onClick={simulateTimeJumpAndGoToDashboard} 
              style={{ width: '100%', padding: '18px 24px', background: 'var(--ink)', color: '#fff', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none', borderRadius: 40, cursor: 'pointer' }}>
              Go to Dashboard
            </button>
            <button 
              onClick={() => setView(activeOrgId ? 'organization' : 'main')} 
              style={{ width: '100%', padding: '18px 24px', background: 'transparent', color: 'var(--ink)', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none', cursor: 'pointer' }}>
              Back to feed
            </button>
          </div>
        </div>
      )}

      {view === 'organization' && activeUser.organizations.some((o: any) => ['officer', 'social_chair', 'admin'].includes(o.role)) && (
        <button 
          onClick={() => setSheetOpen(true)} 
          style={{ position: 'absolute', bottom: 100, right: 20, zIndex: 30, background: 'var(--ink)', color: '#fff', padding: '16px 24px', borderRadius: 40, fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
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
          onClose={() => {
            setImportContactsOpen(false);
            flash('Invitations sent successfully');
          }} 
        />
      )}

      {toast && (
        <div style={{ position: 'absolute', top: 40, left: 20, right: 20, background: 'var(--ink)', color: '#fff', padding: 16, fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', zIndex: 100, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'var(--orange)' }}><EVI.Check /></span>{toast}
        </div>
      )}
    </div>
  );
}
