# LifeOS

Status: CANONICAL \
Authority: repository entry and contributor quick start \
Audience: end user; contributor; AI agent \
Owner: repository maintainer \
Last reviewed: 2026-07-18 \
Review by: 2027-01-14 \
Update trigger: product surface, runtime, setup or key-path change \
Supersedes: none \
Superseded by: none \
Authorizes implementation: no

LifeOS is currently implemented in this repo as an invite-only weekly operating loop inside the existing React + Express application. This does not imply a shared or production release.

Use `docs/README.md` to select the current authority for each subject. Equal- or higher-authority conflicts are stop-and-report conditions, not an invitation to select the newest file.

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
- auth: file-backed invite registration and session cookies in both MVP repository modes
- MVP workspace/recovery persistence: explicitly selected with `LIFEOS_MVP_REPOSITORY=file|prisma`; Prisma changes only this store and also requires `DATABASE_URL`, which never selects a repository by itself

Important note:

- Electron code exists in this repo, but it is not the canonical MVP runtime because the default scripts, implemented weekly-loop API, and current route shell all center the web workspace.

## Quick Start

Install dependencies:

```bash
npm ci
```

Run the default app and API:

```bash
LIFEOS_SESSION_SECRET="$(openssl rand -hex 32)" npm run dev
```

The admin route is only presentation until the server authorizes the signed-in identity. To authorize exact accounts, set a comma-separated allowlist such as `LIFEOS_ADMIN_EMAILS=operator@example.com`. An empty or malformed allowlist denies every account; client flags, localhost, invite metadata, and Electron do not grant administrator authority.

The canonical HTTP server rejects JSON bodies above 32 KiB and validates every auth/profile/MVP write with strict bounded schemas. Cookie-authenticated unsafe requests require an exact allowed `Origin`; bearer tokens are explicit request authority. Logout revokes all existing web tokens for the account through a persisted session version. Express deliberately does not trust proxy headers in the supported direct single-process topology.

Canonical workspace reset is a two-step recovery operation, never a bodyless delete: password reauthentication plus the exact `RESET MY WORKSPACE` phrase prepares a versioned portable export and short-lived authorization; commit retains the recovery in the same repository mutation that clears data. `RESTORE MY WORKSPACE` restores a validated envelope, and the latest retained recovery remains available if the reset response is lost. The full web account lifecycle is documented in `docs/contracts/personal-data-lifecycle.md`; experimental Electron preservation/export is documented in `docs/operations/electron-to-web-export.md`, while Electron reset/import remains disabled and non-canonical.

The development scripts select `LIFEOS_OPERATING_MODE=local-dev`. Direct builds must select it explicitly:

```bash
LIFEOS_OPERATING_MODE=local-dev npm run build
```

Direct server starts must also select persistence explicitly. `LIFEOS_MVP_REPOSITORY=file` is local, single-process storage with strict corruption errors, atomic replacement, and a last-known-good `.bak`; `prisma` additionally requires `DATABASE_URL`. File-to-Prisma dry-run, backup, apply, verification, and guarded rollback are documented in `docs/operations/file-to-prisma-migration.md`.

Default local endpoints:

- app: `http://localhost:5173`
- api: `http://localhost:3001`

## Key Paths

- `src/features/mvp/`: weekly-loop MVP UI
- `api/app.ts`: implemented auth and MVP server contract
- `docs/README.md`: documentation authority and conflict index
- `docs/product/canonical-mvp.md`: canonical product framing
- `docs/contracts/mvp-route-map.md`: implemented route and API map

## Verification

- unit and integration tests: `npm run test`
- authoritative web browser journey: `npm run test:e2e`
- advisory Electron smoke: `npm run test:e2e:electron-advisory`
- advisory broad browser placeholders: `npm run test:e2e:advisory`
- type check: `npm run typecheck`
- lint: `npm run lint`

The release-verification ladder and the distinction between authoritative versus advisory Playwright lanes live in `docs/operations/release-verification-ladder.md`.

## Operating Modes

`local-dev` is the only currently supported mode. The repository also contains a fail-closed `controlled-demo` candidate profile. It requires production mode, an exact HTTPS origin, a unique session secret, explicit unique invite seeds, and explicit file persistence; it rejects known fallback credentials, UI bypasses, unreviewed vendors, service-role injection, public source maps, and development branding.

Build and inspect that candidate with:

```bash
LIFEOS_OPERATING_MODE=controlled-demo npm run build
npm run verify:controlled-demo-artifact
```

This does not authorize a shared deployment by itself. The actual host must also pass the expiry, access, rotation, wipe/backup, and deployed-browser evidence in `docs/security/2026-07-16-operating-modes-threat-model.md`. Partner beta and public production remain unsupported.

## CI Quality Gate Policy

- Canonical package manager is `npm`.
- The only accepted lockfile is `package-lock.json`.
- CI must install dependencies with `npm ci` (frozen lockfile behavior).
- Merge readiness is determined by `web / static-and-unit` and `web / canonical-e2e`.
- `web / static-and-unit` runs:
  - `npm run typecheck`
  - `npm run lint`
  - `npm run test`
  - `npm run build`
  - `npm run build:server`
- `web / canonical-e2e` runs the built SPA through Express with `npm run test:e2e`.
- Electron smoke remains advisory and separate from merge readiness.

## License

MIT
