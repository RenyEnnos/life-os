---
type: reference
status: active
last_updated: 2026-04-27
tags: [reference]
---

# Release Verification Ladder

## Findings First

1. Browser Playwright coverage is quarantined and is not release evidence.
   - Fresh reproduction on 2026-03-20: `npx playwright test tests/e2e/auth.spec.ts --project=advisory-chromium` failed because register/login never left `/register` and `/login`, and logout timed out waiting for a nonexistent `Logout` button.
   - Those browser specs are now explicitly marked as quarantined placeholders in `tests/e2e/*.spec.ts` and moved behind the advisory lane.

2. The authoritative Playwright release gate is Electron smoke only.
   - `npm run test:e2e` now routes to `playwright.release.config.ts`.
   - The release config runs `tests/e2e/smoke.spec.ts` only and does not boot the browser web server.
   - That smoke lane is now constrained to the canonical `/mvp` loop and no longer treats broader-suite routes as release proof.

3. A regression test now protects the gate wiring.
   - `src/shared/lib/__tests__/releaseGate.test.ts` fails if `npm run test:e2e` is pointed back at the browser config or if smoke leaks into the advisory lane.

## Lane Definitions

- `npm run test:e2e`
  - Authoritative release evidence.
  - Runs the Electron smoke lane only.
  - Must stay green before any release claim that depends on desktop runtime verification.
  - Only proves the MVP loop: login, onboarding, weekly planning, daily execution, and reflection.

- `npm run test:e2e:advisory`
  - Non-blocking browser placeholder lane.
  - Exists for triage and future rewrite work.
  - Must not be cited as release confidence.

- `npm run test`
  - Unit and integration coverage.
  - Required for regression protection around business logic and release-gate wiring.

- `npm run typecheck`
  - Required static verification.

- `npm run lint`
  - Required static verification.

## Release Ladder

Run these in order:

1. `npm run test:e2e`
2. `npm run test`
3. `npm run typecheck`
4. `npm run lint`

Do not upgrade advisory browser output, skipped browser placeholders, or weak assertions into release evidence.

## Current Recommendations

- Rewrite quarantined browser specs only after the browser surface has seeded auth, deterministic fixtures, and assertions that prove user-visible behavior.
- Keep release conversations anchored to the authoritative lane, not to total Playwright pass counts.
- Treat any future attempt to merge smoke and browser placeholders back into one default command as a release-risk regression.
- Treat any future attempt to reintroduce `tasks`, `habits`, or other broader-suite routes into authoritative smoke as a release-risk regression.
