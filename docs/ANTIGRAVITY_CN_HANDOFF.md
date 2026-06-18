# Antigravity handoff — Connection Night (v1 hardcoded demo)

**Branch:** `v1`  
**Date:** June 2026  
**Status:** CN preview is wired end-to-end with hardcoded data for all 9 Georgetown demo profiles. Supabase roster matching is still future work.

---

## What we shipped

Connection Night is no longer a separate home route. It lives **inside the nightly reveal** when Night Preview **CN** is selected (`ligo:demo:night = "cn"`).

### CN reveal flow (6 parts)

When **CN** is on, the Aurora acts are **skipped entirely**. User goes straight into Connection Night:

| Part | Component | What it shows |
|------|-----------|----------------|
| I | `ActConnectionIntro` | Custom CN intro — "Someone on campus gets it." References locked answer, explains 3 taste-matches, Vibe/Spark/Pass |
| II | `ActConnectionSealed` | Avatar ring, match count, tonight's pick chip |
| III–V | `ActConnectionPerson` ×3 | Per-person reading, shared pick/lane, Vibe / Spark / Pass |
| VI | `ActConnectionDone` | Summary of actions sent |

**Not shown in CN mode:** Look up, The Answer, Your Light, Sky, Tomorrow (those are Aurora-only).

### Normal nights (N1–N10 or LIVE)

Unchanged: 5 Aurora acts via `RevealScreen` + `RevealShell` with `REVEAL_COLORS`.

---

## How to test

1. `npm run dev` → open home (usually `localhost:3000` or next free port).
2. In **Night Preview** toolbar above the phone, tap **CN** (pink button). Page reloads.
3. Switch profile if needed (top bar) — all 9 profiles have demo rosters.
4. Lock in a daily answer → 5s countdown (`REVEAL_COUNTDOWN_SECONDS`) → reveal auto-opens, or tap **Tonight's reveal** to open manually.
5. Swipe/tap through: intro → sealed → 3 people → done.
6. **LIVE** (reset icon) or deselect CN to return to Aurora-only nights.

---

## New files

| File | Purpose |
|------|---------|
| `lib/connectionNightDemo.ts` | Hardcoded rosters for all 9 profiles (3 matches each), mutual graph, `getConnectionNightDemoResponse()` |
| `components/reveal/ConnectionNightActs.tsx` | `ActConnectionIntro`, `ActConnectionSealed`, `ActConnectionPerson`, `ActConnectionDone` |
| `docs/CONNECTION_NIGHT_HARDCODED_PLAN.md` | Implementation plan + phase checklist |
| `docs/ANTIGRAVITY_CN_HANDOFF.md` | This document |

---

## Modified files (high signal)

| File | Change |
|------|--------|
| `app/page.tsx` | **CN** button in Night Preview; `ligo:demo:night = "cn"` |
| `components/RevealScreen.tsx` | CN-only step list when preview on; `CONNECTION_COLORS`; skips Aurora acts; no cinematic intro in CN mode |
| `components/reveal/RevealOpeningIntro.tsx` | Fixed stuck orange-dot bug (timer reset on re-render); tap-to-skip |
| `hooks/useConnectionNight.ts` | Falls back to demo when API empty, `meta.empty`, CN preview, or fetch error |
| `components/HomeScreen.tsx` | Reveal countdown for **all** profiles (not Marcus-only); Clear answer; profile session isolation; `RevealScreen` integration |
| `lib/revealConstants.ts` | `CONNECTION_NIGHT_PREVIEW_KEY`, `isConnectionNightPreview()`, countdown 5s |
| `lib/gameQuestions.ts` | `getDayIndex()` ignores `"cn"` preview value |
| `lib/usePersistentState.ts` | Reset state when storage key changes (fixes profile-switch bleed) |
| `README.md`, `docs/V1_DIRECTION.md`, `docs/V1_STARTING_POINT.md` | CN status + links to plan doc |

---

## Demo data notes

- **Tonight's pick (demo):** Frank Ocean / "Self Control" for all profiles (`connectionNightDemo.ts`).
- **Rosters:** 3 directed matches per viewer with `why_copy` per edge. Graph is mutual where intended (e.g. Cole ↔ Caroline).
- **Shared pick cards:** Reuses `lib/sharedPickRule.ts` for pairs like Cole+Caroline, Cole+Charlotte.
- **API:** `/api/connection-night?profile=cole` returns empty on v1 Supabase — hook uses demo fallback automatically.

Example roster (Marcus): Maddie, Cole, Jordan.

---

## Key flags & storage

| Key | Value | Meaning |
|-----|-------|---------|
| `ligo:demo:night` | `"cn"` | Connection Night preview on |
| `ligo:demo:night` | `0`–`9` | Aurora night N1–N10 preview |
| `ligo:demo:night` | *(removed)* | LIVE / calendar night |
| `ligo:daily:{profileId}:answered` | `true` | Locked daily answer |
| `ligo:daily:{profileId}:answer` | `"..."` | Answer text |
| `ligo:reveal:{profileId}:unlocked` | `true` | Can open reveal |
| `ligo:cn:actions:{profileId}` | `{0:"vibe",...}` | CN slide actions per person index |

---

## Bug fixes included in this slice

1. **Stuck orange dot on reveal open** — `RevealOpeningIntro` timers were resetting every parent re-render because `onComplete` was in the effect dependency array. Fixed with ref + mount-once timers; CN mode skips intro entirely.
2. **Reveal without locked answer** — Gated on `hasLockedAnswer` (`answered && answer.trim()`).
3. **Profile switch bleed** — `usePersistentState` rehydrates on key change; `HomeProfileSession` keyed by `activeUserId`.
4. **CN preview breaking `getDayIndex()`** — `"cn"` no longer parsed as night index.

---

## Product direction (context)

- **Every night:** Aurora reveal ("Look up, Georgetown") — hero moment.
- **1–2× per week (future):** Connection Night surfaces inside that reveal unpredictably — not a home button.
- **v1 demo:** CN only appears when **CN** Night Preview is selected; no real scheduler yet.

See also: [V1_DIRECTION.md](./V1_DIRECTION.md), [CONNECTION_NIGHT_HARDCODED_PLAN.md](./CONNECTION_NIGHT_HARDCODED_PLAN.md).

---

## Not done yet (intentional)

- [ ] Real 1–2×/week CN scheduler (surprise nights)
- [ ] Supabase `connection_roster` as source of truth (replace demo fallback)
- [ ] Meetup sheet from CN done slide
- [ ] Align tonight's pick with user's actual locked daily answer (demo uses Frank Ocean globally)
- [ ] Profile gate / anonymity rules for production
- [ ] Share sheet content for CN acts (still Aurora-oriented)

---

## Code entry points

```
Night Preview CN
  → localStorage ligo:demo:night = "cn"
  → isConnectionNightPreview() in lib/revealConstants.ts

Reveal open
  → HomeScreen state === 'reveal'
  → RevealScreen
      → useConnectionNight(activeUserId)  // demo fallback
      → cnSteps: intro + sealed + people + done
      → RevealShell (CONNECTION_COLORS, tap to advance)

Demo data
  → getConnectionNightDemoResponse(profileId)
  → mapRosterToPeople() in lib/connectionNight.ts
```

---

## Commit scope

This handoff covers the Connection Night hardcoded demo slice: CN preview toolbar, demo rosters, reveal integration, CN-only intro flow, and related home/reveal bug fixes on branch `v1`.
