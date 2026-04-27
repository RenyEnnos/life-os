> Superseded on 2026-03-28 by `docs/mvp/canonical-mvp.md` and `docs/mvp/route-map.md`.
>
> Historical QA snapshot only. Keep for audit trail, but do not treat this file as current MVP scope authority.

# QA Release Audit - 2026-03-19

## Findings First

### 1. Browser Playwright coverage is not credible release evidence

Evidence:

- `npx playwright test --project=chromium` produced 9 failures and 2 passes.
- The only stable end-to-end evidence in this repo is the Electron smoke project in `tests/e2e/smoke.spec.ts`.
- Release docs correctly frame the MVP as desktop local-first, but the default Playwright harness still boots the browser web client in `playwright.config.ts`.

Examples of broken browser assumptions:

- `tests/e2e/auth.spec.ts` expects `/dashboard` redirects after register/login, but both tests stayed on `/register` and `/login`.
- `tests/e2e/finances.spec.ts` assumes a seeded browser user and fails before reaching `/dashboard`.
- `tests/e2e/dashboard.spec.ts` expects `Focus Session` or `Pomodoro`, but the locator never resolves.
- `tests/e2e/features.spec.ts` fails on generic `nav` assertions for `/finances`, `/habits`, and `/tasks`.

Impact:

- `npm run test:e2e` mixes broken browser coverage with the actual desktop smoke path.
- Any release confidence based on the browser suite would be misleading.

### 2. Some E2E tests can pass without proving the intended behavior

Evidence:

- `tests/e2e/habits.spec.ts` returns early when the add button is missing, so the test can pass without creating or deleting anything.
- `tests/e2e/features.spec.ts` contains defensive `test.skip()` branches when auth redirects to `/login`.
- `tests/e2e/features.spec.ts` also has weak assertions like `expect(page.locator('body')).toBeVisible()`, which do not validate product behavior.

Impact:

- Current pass counts overstate confidence.
- These tests are better described as placeholders than regression protection.

### 3. Integration coverage is now broad with no skipped integration suites

Evidence from the current `npm run test:integration` gate:

- 8 test files passed.
- 23 tests passed.
- 0 tests skipped.

Restored deterministic page-level coverage now exists for:

- `src/features/dashboard/__tests__/DashboardPage.int.test.tsx`
- `src/features/finances/__tests__/FinancesPage.int.test.tsx`
- `src/features/calendar/__tests__/CalendarPage.int.test.tsx`
- `src/features/journal/__tests__/JournalPage.int.test.tsx`
- `src/features/rewards/__tests__/RewardsPage.int.test.tsx`
- `src/features/auth/__tests__/AuthFlow.int.test.tsx` for complete logout and stale 401 session cleanup during bootstrap

Auth session persistence is now covered in `src/features/auth/__tests__/AuthFlow.int.test.tsx` using the current Zustand + IndexedDB storage contract (no localStorage dependency).

One stale finance assumption was also removed from the audit path: the old skipped integration expected `/finances?new=true` to auto-open the transaction modal, but the current page contract only opens that modal from the visible `Nova Transação` CTA.

Impact:

- The repo now has deterministic integration evidence for dashboard, finances, calendar, journal, rewards, plus auth login/logout, stale-session cleanup, and persisted-storage contract behavior.
- Release confidence is materially stronger; the main remaining QA risk is still browser Playwright credibility for non-desktop surfaces.

### 4. Desktop smoke is the only evidence-backed release path today, and it must stay inside the MVP loop

Evidence:

- `npx playwright test tests/e2e/smoke.spec.ts --project=smoke --grep "desktop smoke: Life OS main window"` passed.
- `tests/e2e/smoke.spec.ts` now covers Electron launch, local desktop login into `/mvp`, onboarding capture, weekly plan generation and confirmation, daily execution, reflection capture, and persisted MVP workspace state.
- `src/features/mvp/__tests__/MvpLoop.int.test.tsx` needed an explicit `15s` timeout to stop timing out inside the aggregated integration gate, even though it already passed in isolation.
- The packaged Linux artifact exists under `release/0.1.0/`, including `Life OS-0.1.0.AppImage` and `linux-unpacked/life-os`.

Impact:

- The desktop runtime remains the only working release lane.
- Confidence must be tied to the canonical MVP surfaces, not to the broader productivity suite.

## Verification Ladder

Use this order for honest release confidence:

1. Electron smoke in `tests/e2e/smoke.spec.ts`
2. High-signal unit and IPC tests for desktop-specific branches
3. Restored integration coverage for dashboard, finances, calendar, journal, and rewards
4. Browser Playwright only after the browser surface is explicitly supported and seeded

## Recommended Next Actions

1. Quarantine or relabel browser Playwright specs so they are not presented as release evidence.
2. Replace false-positive E2E patterns with deterministic assertions or explicit skips with rationale.
3. Keep release messaging frozen to desktop local-first until browser and auth flows are actually proven.
