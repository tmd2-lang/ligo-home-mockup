# v1 starting point — empty data canvas

**Read [V1_DIRECTION.md](./V1_DIRECTION.md) first** for product context — why v1 exists, the daily reveal loop, and roadmap.

v1 is a **clean slate** for building new product experiments. The UI shell, nine demo profiles, and profile-rich presentation data stay in TypeScript. Canon content tables (daily answers, connection roster, home feed, wrapped) are **not** seeded — APIs return empty 200 bundles. The **nightly Aurora reveal** uses hardcoded demo content in [`lib/revealData.ts`](../lib/revealData.ts) (10 nights) until spreadsheet import lands.

**v0** (tag `v0-demo-mockup`) remains the frozen full-canon demo at **https://ligo-v0.vercel.app**. See [DEPLOY_V0.md](./DEPLOY_V0.md) for deploy details.

**Local dev on branch `v1` uses v1 Supabase keys only.** Use the Vercel URL above for the full v0 demo — no need to run v0 locally.

---

## Philosophy

| Layer | v0 | v1 |
|-------|----|----|
| Supabase project | Existing project with full canon | **New** project, profiles only |
| Daily / Connection / Home APIs | Full spreadsheet data | Empty bundles (`meta.empty: true`) |
| Profile UI blobs | `lib/users.tsx` | Same — unchanged |
| Canon import scripts | `archive/v0/scripts/` | Not used on v1 branch |

v1 lets you add features (new tables, real auth, live Wrapped, etc.) without touching the frozen v0 demo or its Supabase data.

---

## Setup (local)

### 1. Create a new Supabase project

Create a fresh project in the [Supabase dashboard](https://supabase.com/dashboard). Do **not** reuse the v0 project.

### 2. Apply the v1 migration

Run `supabase/migrations/001_v1_profiles_only.sql` against the new project (SQL editor or `npm run db:migrate` with `DATABASE_URL` set).

This creates only the `profiles` table with public read RLS.

### 3. Configure `.env.local` for v1

Point at the **new** project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-v1-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<v1-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<v1-service-role-key>
```

Keep a separate copy of v0 keys (e.g. `.env.local.v0`) if you still run the frozen demo locally.

### 4. Seed profiles

```bash
npm run import:profiles
```

Dry run first if you like:

```bash
npm run import:profiles:dry
```

This inserts the nine demo profiles from `scripts/canon/constants.ts` → `PROFILE_IDENTITY`.

### 5. Run the app

```bash
npm run dev
```

Switch profiles from the home top bar. Expect:

- **Daily Pick** — demo question from `lib/revealConstants.ts` fallback (API empty)
- **Tonight's reveal** — Marcus: 10s countdown after lock-in, then Aurora auto-opens; replay from home card
- **Games Hub** — banner on home; trivia, ranking, soundmoji
- **Night Preview** — N1–N10 picker above the phone (internal demo tool)
- **News / Near you** — per-profile fidelity cards from `lib/homeFidelity.ts` (not stored in Supabase on v1)
- **Connection Night / Wrapped** — not on home (legacy carousel parked); Connection Night hardcoded plan: [CONNECTION_NIGHT_HARDCODED_PLAN.md](./CONNECTION_NIGHT_HARDCODED_PLAN.md)
- **Profile answer trail** — “No answers yet” (API empty)

APIs return HTTP 200 with empty payloads when content tables are missing or empty.

---

## Deploy v1 (optional)

Deploy from branch `v1` with v1 Supabase env vars on Vercel (or similar). Do not point a v1 deployment at the v0 Supabase project.

**v0 production URL:** https://ligo-v0.vercel.app

---

## Restoring full canon locally

To run the full spreadsheet demo again:

1. Checkout tag `v0-demo-mockup` or branch `v0-release`
2. Swap `.env.local` to v0 Supabase keys
3. Use scripts under `archive/v0/scripts/` and migrations under `archive/v0/supabase/`

Or skip local v0 entirely and use **https://ligo-v0.vercel.app**.
