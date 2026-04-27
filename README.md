# LifeOS

LifeOS is currently shipped in this repo as an invite-only weekly operating loop inside the existing React + Express application.

The canonical MVP framing lives in `docs/mvp/canonical-mvp.md`. If another document disagrees with that file, treat the other document as stale unless it explicitly says otherwise.

## Current Product Boundary

In scope for the canonical MVP:

- invite-gated account creation and login
- the `/mvp` workspace and its four user-facing loop surfaces:
  - onboarding
  - weekly review
  - today
  - reflection
- an internal-only admin analytics surface at `/mvp/admin`
- the current `/api/mvp/*` contract in `api/app.ts`

Out of scope for the canonical MVP:

- marketing LifeOS as a broad productivity suite
- treating the dashboard, habits, calendar, journal, health, finances, projects, university, focus, AI assistant, or gamification routes as MVP-defining surfaces
- claiming Electron is the default shipped runtime
- sync or cloud-readiness claims beyond the implemented MVP contract

## Runtime

Default development and build flow:

- frontend: React 18 + Vite
- backend: Express
- auth: file-backed invite registration and session cookies by default
- MVP persistence: file-backed repository by default, Prisma-backed when `DATABASE_URL` or `LIFEOS_MVP_REPOSITORY=prisma` is configured

Important note:

- Electron code exists in this repo, but it is not the canonical MVP runtime because the default scripts, implemented weekly-loop API, and current route shell all center the web workspace.

## Quick Start

Install dependencies:

```bash
npm install
```

Run the default app and API:

```bash
npm run dev
```

Default local endpoints:

- app: `http://localhost:5173`
- api: `http://localhost:3001`

## Key Paths

- `src/features/mvp/`: weekly-loop MVP UI
- `api/app.ts`: implemented auth and MVP server contract
- `docs/mvp/canonical-mvp.md`: canonical product framing
- `docs/mvp/route-map.md`: implemented route and API map
- `plans/2026-03-20-canonical-mvp-doc-rewrite.md`: rewrite decision memo

## Verification

- unit and integration tests: `npm run test`
- authoritative Electron release smoke: `npm run test:e2e`
- advisory browser placeholders only: `npm run test:e2e:advisory`
- type check: `npm run typecheck`
- lint: `npm run lint`

The release-verification ladder and the distinction between authoritative versus advisory Playwright lanes live in `docs/release-verification-ladder.md`.

## CI Quality Gate Policy

- Canonical package manager is `npm`.
- The only accepted lockfile is `package-lock.json`.
- CI must install dependencies with `npm ci` (frozen lockfile behavior).
- Merge readiness is determined by the `quality-gate` check, which runs:
  - `npm run typecheck`
  - `npm run lint`
  - `npm run test`
  - `npm run build`
  - a minimal Electron smoke assertion: `npm run test:e2e -- --grep "desktop smoke: Life OS main window"`

## License

MIT
