# Release Verification Ladder

## Evidence lanes

- `npm run test:e2e` is the authoritative release lane. It builds the browser SPA and Express server, then runs `tests/e2e/canonical.spec.ts` in Chromium against the canonical `/mvp` journey.
- `npm run test:e2e:electron-advisory` is advisory Electron smoke. Electron is not the canonical runtime.
- `npm run test:e2e:advisory` contains broader browser coverage that is useful for triage but is not merge evidence.
- `npm run test`, `npm run typecheck`, `npm run lint`, `npm run build`, and `npm run build:server` protect behavior, static correctness, and buildability.

`src/shared/lib/__tests__/releaseGate.test.ts` protects this wiring. Do not promote advisory output or raw Playwright pass counts into release evidence.

## Local development ladder

The package scripts select `local-dev` explicitly. Run:

1. `npm run typecheck`
2. `npm run lint`
3. `npm run test`
4. `npm run build`
5. `npm run build:server`
6. `npm run test:e2e`

`npm run build` still requires `LIFEOS_OPERATING_MODE=local-dev` when invoked directly outside a script or CI environment.

## Controlled-demo configuration evidence

A controlled-demo candidate must fail closed unless all required runtime values are supplied. Build and inspect the public artifact with:

```bash
LIFEOS_OPERATING_MODE=controlled-demo npm run build
npm run verify:controlled-demo-artifact
```

At runtime, also provide:

- `NODE_ENV=production`
- one exact HTTPS `ALLOWED_ORIGIN`
- a unique `LIFEOS_SESSION_SECRET` of at least 32 characters
- explicit, unique, email-bound `LIFEOS_INVITES`
- `LIFEOS_MVP_REPOSITORY=file`
- no `DATABASE_URL`

The controlled-demo policy rejects the known fallback invite, client bypass/admin flags, unreviewed vendor configuration, a service-role key, implicit persistence, public source maps, and the development badge. Error diagnostics name the invalid variable without printing its value.

The artifact check and a rendered Compose configuration prove only repository configuration. They do not prove HTTPS termination, host access control, secret uniqueness, expiry, rotation, wipe/backup execution, or a deployed canonical journey.

## Readiness boundary

Only `local-dev` is currently supported. A controlled demo remains unsupported until every controlled-demo gate in `docs/security/2026-07-16-operating-modes-threat-model.md` is evidenced for the actual deployment. Partner beta and public production require separate gates and are not implied by a green build or CI run.
