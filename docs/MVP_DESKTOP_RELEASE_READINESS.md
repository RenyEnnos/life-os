# MVP Desktop Release Readiness

## Supported MVP Surface

The supported MVP surface is desktop local-first. This document is the canonical source for MVP release framing. Every release channel must use this exact boundary: verified Electron runtime only, no browser path, no sync claim, no web claim.

- In scope for this MVP release: the Electron plus SQLite plus IPC desktop runtime, plus the evidence-backed desktop flows listed in the next section.
- Out of scope for this MVP release: sync, cloud-backed behavior, browser delivery, and any web product framing.
- Non-blocking debt for this MVP release: known gaps that do not break the honest desktop local-first framing, but still must remain disclosed in release messaging.

## Proven Desktop Capabilities

- The supported MVP runtime remains the documented Electron plus SQLite plus IPC desktop path, with sync explicitly optional and out of scope by default (`README.md`, `docs/MVP_READINESS.md`, `electron/db/database.ts`).
- Desktop runtime launch is covered by the Playwright Electron smoke that opens the main window and asserts the app title in the supported runtime (`tests/e2e/smoke.spec.ts`).
- Authenticated desktop session restoration is covered by a seeded `auth_session` row, a successful `window.api.auth.check()`, and a post-login dashboard render with `WELCOME BACK` visible (`tests/e2e/smoke.spec.ts`, `electron/ipc/authHandler.ts`).
- Desktop login UI is covered only in smoke mode via `PLAYWRIGHT_TEST=1`, using the explicit smoke credentials and desktop auth fallback wired in the Electron auth handler (`tests/e2e/smoke.spec.ts`, `electron/ipc/authHandler.ts`).
- Protected navigation is covered by authenticated navigation to `#/tasks`, with the login container still absent after the route change (`tests/e2e/smoke.spec.ts`).
- Task creation is covered from the desktop tasks page, including visible task rendering and the `Tarefa criada.` success confirmation (`tests/e2e/smoke.spec.ts`).
- Health metric mutation is covered from the post-login desktop dashboard flow, with the inserted value verified against the local SQLite `health_metrics` table (`tests/e2e/smoke.spec.ts`).
- Habit creation is covered from the desktop habits page, with the created record verified against the local SQLite `habits` table (`tests/e2e/smoke.spec.ts`).

## Explicitly Out of Scope

- Sync and cloud-backed behavior, even though sync code exists, because that path still depends on separate desktop Supabase configuration and validation (`README.md`, `electron/sync/engine.ts`).
- Browser/web as the MVP surface, because the current recommendation is tied to the verified Electron runtime only (`README.md`, `docs/MVP_READINESS.md`).
- Any claim that desktop auth has been proven in a fully configured production Supabase environment. The current login UI proof remains smoke-only under `PLAYWRIGHT_TEST=1` (`tests/e2e/smoke.spec.ts`, `electron/ipc/authHandler.ts`).
- Broader product claims beyond the verified desktop local-first flow set above.

## Final Recommendation

This document, `docs/MVP_DESKTOP_RELEASE_READINESS.md`, is the final release-readiness artifact for the MVP decision.

Release-message freeze: all release notes, launch copy, README references, and stakeholder updates must describe the MVP only as desktop local-first. They must not imply sync readiness, browser delivery, web availability, or production-proven Supabase auth.

Verdict: go for a desktop local-first MVP, no-go for any broader release framing.

Evidence basis:

- The repo documentation and runtime architecture align on Electron plus SQLite plus IPC as the default MVP surface (`README.md`, `docs/MVP_READINESS.md`, `electron/db/database.ts`).
- The audited smoke evidence proves the core desktop local-first path that matters for this release framing: launch, restored session, protected navigation, task creation, habit creation, and local persistence checks (`tests/e2e/smoke.spec.ts`).

Blocking issues:

- None for the scoped desktop local-first release.
- Still blocking for broader claims: sync readiness, browser/web readiness, and any statement that production Supabase auth is fully proven.

Non-blocking issues:

- Browser-oriented E2E coverage is stale against the real Electron runtime and should not be used as release evidence.
- Sync code exists in the repo, but it still depends on separate desktop Supabase configuration and validation, so it remains non-blocking only because sync is excluded from this release framing.
- The desktop login UI proof is still smoke-only under `PLAYWRIGHT_TEST=1`, which is acceptable only if release messaging states that boundary plainly.

Release recommendation:

- Launch only as a desktop local-first MVP.
- Exclude sync, browser delivery, and production-auth-readiness claims from release messaging.
- Treat the current residual issues as blockers only if the team wants to market a wider product surface than the audited one.

Next step after the MVP decision:

- If the team accepts the MVP decision, use this artifact as the handoff reference and approve release messaging that stays strictly within the audited desktop local-first scope.
