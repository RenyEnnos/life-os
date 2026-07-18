# LifeOS contributor setup

Status: ACTIVE_SUPPORTING \
Authority: canonical local-development commands and configuration \
Audience: contributor; AI agent \
Owner: repository maintainer \
Last reviewed: 2026-07-18 \
Review by: 2026-10-16 \
Update trigger: runtime, package script, environment, port or persistence change \
Supersedes: desktop-first setup in this path \
Superseded by: none \
Authorizes implementation: no

## Supported boundary

The canonical development runtime is the React/Vite client plus the Express API. `local-dev` is the only supported operating mode. Electron remains an experimental adapter and Supabase is not required by the canonical weekly loop. The web application is server-backed; offline data correctness is not claimed.

Use Node.js 20 and the committed npm lockfile:

```bash
npm ci
```

## Start the canonical application

The API requires a session secret. The package scripts select `local-dev`; the server script also selects file-backed MVP persistence.

```bash
LIFEOS_SESSION_SECRET="$(openssl rand -hex 32)" npm run dev
```

Open:

- web application: `http://localhost:5173`
- API health: `http://localhost:3001/api/health`

Vite proxies same-origin `/api` requests to port 3001, so `VITE_API_BASE_URL` is not needed for this flow. A root `.env` is loaded by Vite for client/build values, but the Express process does not load it automatically; pass server-only values through the shell or process environment.

## Persistence and identity

Web authentication always uses the private file-backed auth repository at `.data/auth-state.json` unless `LIFEOS_AUTH_DATA_FILE` overrides the path.

`LIFEOS_MVP_REPOSITORY` selects only workspace and recovery persistence:

- `file`: `.data/mvp-workspace.json`, or `MVP_DATA_FILE`; local, single-process use;
- `prisma`: requires `DATABASE_URL`; changes the MVP store only and does not move web auth out of JSON.

`DATABASE_URL` never selects Prisma by itself. Direct server starts must set `LIFEOS_OPERATING_MODE=local-dev` and `LIFEOS_MVP_REPOSITORY=file|prisma` explicitly.

## Build and verification

```bash
LIFEOS_OPERATING_MODE=local-dev npm run build
npm run build:server
npm run typecheck
npm run lint
LIFEOS_SESSION_SECRET="$(openssl rand -hex 32)" npm run test
npm run test:e2e
```

The web client build is written to `dist/`; the server build is written to `dist-server/`. The web build emits an advisory manifest and service worker for static application assets. Offline authentication/data correctness, installability, update migration and release support are not validated.

## Experimental Electron adapter

`npm run electron:dev` starts the separate experimental Electron path. `npm run electron:build` may create packaging artifacts in `release/`, but neither command proves a supported desktop release. Use `npm run test:e2e:electron-advisory` only as advisory evidence.
