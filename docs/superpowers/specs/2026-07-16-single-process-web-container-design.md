# Single-process web container design

## Status

Approved provisionally under the repository's autonomous execution mandate. This design implements issue #115 and does not claim controlled-demo, beta, or public readiness.

## Goal

Make the existing Express process the single runtime owner of the built SPA and `/api/*` routes. Align the image, Compose file, and manual acceptance smoke on port 3001, explicit non-production fixture configuration, and the image's inherited healthcheck.

## Chosen design

`createApp` accepts an optional static directory. When supplied, Express serves immutable files from that directory and returns its `index.html` for non-API GET routes. Requests under `/api` never receive the SPA fallback, so unknown API routes retain HTTP 404 behavior.

`api/server.ts` supplies the built `dist` directory. The Docker image continues to run `dist-server/api/server.js`, expose port 3001, and healthcheck `/api/health` on that port. No second web server is introduced.

Compose contains only the application service. It publishes 3001, requires `LIFEOS_SESSION_SECRET`, selects the file-backed MVP repository explicitly, and persists `/app/.data`. The unused Redis service and the Nginx service with nonexistent mounts are deleted.

The manual Docker smoke builds the image, runs it with a synthetic session secret and file-backed fixture, waits for the inherited container healthcheck, and verifies `/api/health`, `/`, a nested SPA route, and an unauthenticated API boundary. Cleanup and logs run even after failure.

## Alternatives considered

1. Add Nginx in front of Express. Rejected because it creates a second process, configuration surface, port contract, and health owner without a proved consumer.
2. Host the SPA separately from the API. Rejected for this slice because no deployment platform owns that topology and it would make canonical browser E2E coordinate two servers and additional CORS policy.
3. Keep the current API-only container. Rejected because copied browser assets would remain a false artifact signal and issue #114 would remain blocked.

## Data and security boundaries

The acceptance path uses synthetic fixture values only. `LIFEOS_SESSION_SECRET` remains mandatory and is never committed with a deployable value. File-backed state is mounted under `/app/.data`; Prisma, Supabase, Redis, and production credentials are outside this slice. The runtime remains supported only for local development until issue #106 establishes a stronger operating mode.

## Error handling

Missing static assets return normal 404 responses. Unknown `/api/*` routes never fall through to `index.html`. API errors continue through the existing Express error handler. Container startup still fails fast when no session secret is present.

## Verification

TDD starts with a Node/Supertest regression that creates a temporary static directory and proves:

- `/` and `/mvp/today` return the same SPA shell;
- `/api/health` remains JSON;
- an unknown `/api/*` route returns 404 and not the SPA shell.

Then the existing static/unit suite, typecheck, lint, web build, server build, Docker build, inherited healthcheck, HTTP smoke, Compose rendering, YAML parsing, and cleanup behavior are verified. The Docker workflow remains manual until its stability is proved; it is not a production release gate.

## Rollback

Revert the implementation commit. Do not restore Redis or Nginx declarations unless a concrete consumer and complete configuration are added. Reverting SPA serving reopens #114's two-server constraint and must be recorded explicitly.
