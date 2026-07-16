# LifeOS CI, test and release-evidence audit

Status: validated evidence report
Date: 2026-07-16
Audit owner: Codex under the autonomous recovery mandate
Related issues: #82, #83, #85, #86, #87, #100

## Executive verdict

LifeOS has no coherent release pipeline today.

- The canonical runtime is browser + Express + HTTP, but no browser E2E executes.
- The workflow named `Quality Gate` is invalid YAML and creates zero jobs.
- The two green PR checks, `test` and `rls`, execute substantially the same Vitest suite; no RLS policy test exists.
- The manual Docker smoke targets the wrong container port and would prove only API health even after that correction.
- The image copies browser assets but starts an API-only server that does not serve them.
- The scheduled Lighthouse audit can never run on its declared date and references a missing config.
- `main` has no branch protection and the repository has no ruleset, so no check is required by GitHub.

These are evidence failures, not proof that every underlying feature is broken. Only `local-dev` is currently supported by #87. No workflow, build artifact or Docker target should be called release evidence until the correction gates below pass.

## Authority and target contract

ADR-0001 makes browser + Express + HTTP the provisional canonical runtime. Its authoritative E2E is an invited user completing the weekly loop through the browser against the supported server/persistence fixture. The #87 security decision supports only local-dev; controlled-demo remains blocked by #106.

Therefore the minimum release-evidence target is:

1. deterministic install and static checks;
2. unit/integration/API contract tests;
3. web client and server builds;
4. server startup and health against an explicit fixture;
5. browser E2E through invite registration/login, onboarding, plan generation/confirmation, daily execution/check-in, reflection and feedback;
6. negative authentication/tenant evidence appropriate to the supported mode;
7. one coherent artifact/process/port contract with rollback instructions.

Electron, PWA, Storybook, performance and accessibility may provide useful advisory evidence, but cannot prove the canonical release unless separately promoted by an accepted contract.

## Workflow inventory

| Workflow/job | Trigger | Actual command/capability | Runtime proved | Classification | Evidence gap/action |
|---|---|---|---|---|---|
| `ci.yml` / `quality-gate` | push and PR to `main` | Intended lockfile, install, typecheck, lint, `Vitest`, web build, `Electron` build and `Electron` smoke | none today | **cenographic/broken** | YAML line 35 contains an unquoted colon in the `run` scalar; GitHub creates a failed run with zero jobs and names it by file path |
| `test.yml` / `test` | push/PR to `main`, `staging` | `npm ci`; `npm run test`; upload `coverage/` | `Node`/`jsdom` plus in-process API tests | **functional but artifact misleading** | `Vitest` is not invoked with coverage, so upload does not establish coverage; duplicates the intended CI test lane |
| `ci-rls.yml` / `rls` | push/PR to `main` | `npm ci`; full `npm run test -- --coverage` with `Supabase` env names | same general `Node`/`jsdom`/API suite | **functional command, false name/duplicate** | current Actions secret-name list and run values are empty; test setup mocks `Supabase`; no RLS/policy test or live operation exists |
| `docker-acceptance-smoke.yml` / `docker-smoke` | manual | builds, runs image as `3000:3000`, curls `/api/health` | intended API container only | **manual and broken** | image defaults to 3001; session secret is absent; browser assets are not served; no workflow execution was found |
| `lighthouse-scheduled.yml` / `lighthouse` | impossible cron plus manual | build; global LHCI install; missing production config | intended browser performance | **scheduled cenographic/disabled by inactivity; manual broken** | remote workflow is disabled for inactivity; `0 2 31 2 *` means 31 February; `lighthouserc.production.json` is absent; no served URL starts |
| `sync-labels.yml` / `sync-labels` | manual | validates and applies `.github/labels.json` through GitHub API | governance only | **manual and functional; dispatch succeeded** | useful, but never a product/release check |

### Observed GitHub execution

Recent PRs consistently show green `test` and `rls` checks; corresponding branch and `main` pushes create an immediate failed `.github/workflows/ci.yml` run with zero jobs. The invalid workflow does not emit a PR job/check. Its push failure is a workflow-definition failure, not a failed quality assertion. `TestSprite Pre-Check` reports `No tests detected`, and Sourcery currently reports a weekly rate limit; both are external integrations, not repository release lanes.

GitHub API evidence on 2026-07-16:

- `GET /branches/main/protection` returned 404 `Branch not protected`;
- `GET /rulesets` returned an empty array;
- recent `.github/workflows/ci.yml` runs contain zero jobs and no logs;
- `test` and `rls` execute on PR and again after merge, duplicating cost without distinct ownership.

Issue #100 already owns branch protection, required checks and agent environments. No duplicate governance issue is needed.

## Command and build inventory

| Command | Intended owner | What it currently proves | What it does not prove | State |
|---|---|---|---|---|
| `npm run dev` / `dev:web` | local web development | starts `Express` watcher and `Vite` dev server | release artifact or shared-safe mode | functional local path |
| `server:dev` | local API | TypeScript API watcher | client, artifact or persistence readiness | functional local path |
| `client:dev` | local browser | `Vite` dev client on all interfaces | server/auth or safe host policy | functional but local-only |
| `build` | web build | declares TypeScript project build plus Vite/PWA browser assets; #83 recorded a successful historical run on unchanged source | runnable full-stack artifact | declared command with historical build evidence; not rerun here |
| `build:server` | server build | declares compiled CommonJS server artifact; #83 recorded a successful historical run on unchanged source | static web serving or deployment readiness | declared command with historical build evidence; not rerun here |
| `typecheck` / `check` | static | TypeScript no-emit checking | runtime behavior | duplicate aliases |
| `lint` | static | configured `ESLint` rules | correctness/release | functional static lane |
| `test` | `Node`/`jsdom`/API | configured `Vitest` suite | browser, `Electron` package, live DB/RLS or deployment | functional development evidence |
| `test:integration` | selected `jsdom` | feature integration files matching the glob | all integration tests or server/browser integration | narrow manual lane |
| `test:e2e` / `test:e2e:smoke` | `Electron` | declares `smoke.spec.ts` through `Electron` IPC/local fallback | web HTTP/auth, container or browser runtime | declared experimental lane; current execution unverified; duplicate aliases |
| `test:e2e:advisory` | browser | starts `Vite` client only | nothing today because all selected describes are skipped; also no `Express` server | quarantined/non-evidence |
| `electron:dev` / `electron:full` | experimental `Electron` | `Vite` `Electron`-mode development | packaged release | local experimental; duplicate alias |
| `electron:build` | experimental `Electron` | TypeScript/`Vite` plus installer packaging | canonical web release | advisory after independent repair |
| `android:dev` / `android:build` | unsupported Android | invokes `Capacitor` after web build | usable Android project/config | broken/incomplete; no `capacitor.config.*` |
| `prisma:generate` | optional persistence | `Prisma` client generation | migration or live database correctness | manual tooling |
| `prisma:migrate:dev` / `prisma:migrate:deploy` | optional persistence | `Prisma` migration commands | safe migration/rollback | manual; environment-dependent |
| `storybook` / `build-storybook` | component tooling | configured `Storybook` dev/static build when run | product route/release | manual advisory; ownership decision needed |
| `test:seed-perf-data` / `test:perf` | performance tooling | seed helper; latter redirects to `Electron` release config with a path | canonical web performance | misrouted/broken for web target |
| `lh` | performance tooling | references `scripts/lighthouse.js` | any `Lighthouse` result | broken; script absent |
| `analyze` | build tooling | references bundle analysis script | release | unverified manual tool |
| SEO generation commands | web tooling | sitemap/robots generation scripts | app runtime or deployment | manual, non-gating |
| `types:generate` | Supabase tooling | invokes Supabase CLI and writes generated types | RLS or live schema compatibility | manual/destructive-to-generated-file; explicit project required |

## Test evidence matrix

| Claim | Current evidence | Runtime | State | What is missing |
|---|---|---|---|---|
| TypeScript contracts compile | `typecheck`; also build commands | source/static | available locally; absent from any executing PR quality lane | repair/consolidate pipeline |
| Lint rules pass | `lint` | source/static | available locally; absent from executing PR quality lane | repair/consolidate pipeline |
| Domain and UI units behave | `Vitest` | `Node`/`jsdom` | green on PRs | classification by canonical versus legacy surface; no runtime proof |
| `Express` invite/auth/MVP contract behaves | `api/__tests__/auth.test.ts`, `mvp.test.ts` | in-process `Express` | included in `Vitest` with test secret | boundary fixture, live server and durable store evidence |
| MVP loop composes in UI state | `MvpLoop.int.test.tsx` | `jsdom`/mocked API | included in `Vitest` | real HTTP/browser/auth boundary |
| Browser weekly loop works | all browser `Playwright` describes skipped | Chromium/Firefox/WebKit | **no evidence** | authoritative browser E2E with `Express` and fixture |
| `Electron` opens | first `Electron` smoke test | compiled `Electron` app launched from the checkout | present but current workflow cannot start; installer is not exercised | repaired advisory `Electron` lane |
| `Electron` MVP loop persists | second smoke test through IPC/local JSON | `Electron` | script exists; CI intended grep selects only main-window test | advisory full smoke if explicitly run |
| `Supabase` RLS isolates tenants | environment variables plus general `Vitest` | none/live `Supabase` not contacted | **false signal** | selected RLS policy tests against disposable `Supabase`/`Postgres` fixture |
| Docker API starts | manual health curl | container/API | workflow broken before meaningful proof | correct env/port and run the container |
| Docker serves browser product | copied `dist/` only | container/web | **no evidence and current process does not serve it** | one web-serving topology and browser smoke |
| PWA builds | `VitePWA` output from web build | browser artifact | build-only evidence | install/update/offline tests before support claim |
| Accessibility | component tests and `Storybook` addon references | `jsdom`/tooling | partial/manual | agreed canonical-route checks; advisory until owned |
| Performance | missing `Lighthouse` config/script; `Electron`-misrouted perf command | none | **no evidence** | only add after a deployed/served canonical fixture exists |

`src/shared/lib/__tests__/releaseGate.test.ts` protects the current Electron-release versus browser-advisory wiring. That regression test is real, but after ADR-0001 it preserves the wrong authority and must change with the pipeline rather than being cited as product evidence.

## Docker and distribution reconciliation

### Ports and process

- `api/server.ts` defaults to port 3001.
- `Dockerfile` exposes and healthchecks 3001, then runs `node dist-server/api/server.js`.
- Compose sets `PORT=3000`, maps `3000:3000` and overrides the image healthcheck with a probe on 3000. That Compose service is internally port-consistent, although it unnecessarily differs from the image/default contract.
- The manual Docker workflow does **not** set `PORT`, but maps `3000:3000`; its server listens on container 3001, so the host curl cannot reach it.
- The manual workflow also omits the required session secret, so `api/app.ts` fails during module initialization before listening.

### Browser assets

The image builds and copies `dist/`, but `api/server.ts` only creates/listens to the API app. No `express.static`, SPA fallback or separate web-server process exists. Consequently:

- `/api/health` could prove only the API process;
- the image cannot currently prove or deliver the canonical browser UI;
- copying `dist/` is a false artifact signal;
- a future fix must choose one topology: Express serves the built SPA, or a separate explicit web server/proxy does so. Do not keep both without need.

### Compose and Nginx

Compose references `./nginx/nginx.conf` and `./nginx/ssl`, but no `nginx/` path exists in the repository. Starting the full compose application therefore lacks its declared proxy configuration. Redis is published with a known fallback password and the app receives a Supabase service-role variable without a proved canonical consumer; #106 owns those security-mode controls.

### Other distribution surfaces

- PWA output is a build feature only and remains experimental under ADR-0001.
- Android scripts have no usable Capacitor config and are unsupported.
- Electron packaging is experimental and cannot block/prove web release.
- Storybook is component tooling, not distribution.
- no repository deployment workflow or supported hosting contract was found.

## False signals of confidence

1. `Quality Gate` appears comprehensive but is invalid before job creation.
2. Green `rls` means general tests ran with environment names, not that RLS was exercised.
3. Green `test` does not include typecheck, lint, browser E2E or a web artifact.
4. Uploading `coverage/` in `test.yml` does not prove coverage was generated.
5. Electron smoke is named/referenced as a gate for a web-canonical product.
6. The CI grep intentionally executes only the Electron window-open test, not its full weekly-loop smoke.
7. A Docker build containing `dist/` does not mean the running server serves the UI.
8. `/api/health` proves neither browser assets nor auth/persistence correctness.
9. Compose's production naming does not overcome missing Nginx files or unsafe defaults.
10. A scheduled workflow does not run when its cron date is impossible.
11. Browser Playwright files do not count when their suites are skipped and only the Vite client starts.
12. PWA, Android, Storybook, Lighthouse and performance scripts do not establish owned release lanes merely by existing.
13. Green optional bot checks or external pre-checks do not replace repository-owned evidence.
14. With no protection/ruleset, even a meaningful green check is not a merge requirement.

## Minimum pipeline proposal

Keep one blocking workflow with stable responsibility and names:

| Check name | Required steps | Claim |
|---|---|---|
| `web / static-and-unit` | lockfile, `npm ci`, typecheck, lint, Vitest once, web build, server build | source and test fixtures compile; unit/integration/API contracts pass; artifacts build |
| `web / canonical-e2e` | start supported server/persistence fixture; serve built web; execute one browser project through invite/auth and full weekly loop plus critical negative boundary | canonical local/shared-mode behavior works end to end |
| `web / container-smoke` | only after a container topology is selected; build, start with explicit non-secret fixture, assert API health and browser asset/route | the shipped process and declared port serve the canonical artifact |

`web / canonical-e2e` cannot be invented by renaming Electron smoke. Until it exists and passes, the repository has development CI, not release evidence.

### Advisory lanes

- `experimental-electron / smoke`: full Electron smoke, non-blocking while Electron is experimental;
- `security / rls`: only if Supabase/Postgres is selected and real policy tests exist; otherwise delete/rename the duplicate workflow;
- `tooling / storybook`: manual or changed-path build if component tooling is retained;
- `web / lighthouse`: manual/scheduled only after a served canonical fixture and checked-in config exist;
- `web / accessibility`: focused canonical-route checks when an owner and threshold exist;
- PWA/offline and performance remain absent rather than cenographic until product support requires them.

## Naming and ownership policy

Check names use `<surface> / <evidence>` and remain stable because branch protection binds to names. A check name must identify exactly one owner and assertion:

- `web` — canonical browser/HTTP runtime;
- `experimental-electron` — non-canonical Electron evidence;
- `security` — a selected, real security boundary such as RLS;
- `tooling` — repository tooling that does not assert product release.

Do not use `quality-gate`, `test`, `rls`, `release`, `production` or `acceptance` without a documented assertion and fixture. Workflow filenames, display names, job names and required-check names should agree.

## Reversible correction sequence

1. #113 fixes the invalid YAML and consolidates duplicate static/unit work, including the false RLS ownership, into one web-named lane.
2. #114 adds the authoritative browser E2E against Express and a disposable supported fixture; Electron remains advisory.
3. #115 chooses the minimum container topology, aligns process/port/secret/health, serves the browser artifact and repairs the smoke; #106 owns shared-mode security configuration.
4. #116 removes or separately rehabilitates Lighthouse, Android/performance and other cenographic tooling. Absence is preferable to a fake capability.
5. After stable check names pass on PRs, #100 configures branch protection/rulesets and review requirements.
6. #89 updates the release ladder and active documentation.

Every implementation slice needs its own tests and rollback; no broad workflow rewrite is authorized by this report.

## GitHub configuration requiring human/platform action

The autonomous mandate authorizes repository administration where available, but the durable settings belong to #100 and may depend on account/plan permissions:

- create a `main` ruleset or branch protection;
- require pull requests and prevent direct pushes, including administrators unless emergency policy says otherwise;
- require the final stable `web / ...` checks, not current misleading names;
- require conversation resolution and at least one independent approval if the account supports it;
- configure allowed merge methods and stale-review behavior;
- define environments/secret ownership only for real deployment lanes;
- review/remove external apps that emit misleading checks or cannot access tests;
- avoid requiring RLS, TestSprite, Sourcery or Gemini until each has reliable ownership and behavior.

Do not bind protection to proposed check names before the workflows exist and have emitted those names successfully.

## Validation and limits

Confirmed by repository inspection and GitHub API:

- all six workflow files and their jobs/triggers were classified;
- the `ci.yml` parse error is reproduced locally at line 35 and matches GitHub zero-job failures;
- Docker process, ports, assets, healthchecks and required secret were traced;
- `nginx/nginx.conf`, Lighthouse configs/script and Capacitor config are absent;
- the Lighthouse schedule is impossible;
- current RLS runs use empty Supabase secrets, test setup mocks the clients, and test search found type imports but no RLS policy/live test;
- browser Playwright suites are skipped and Electron release config selects only `smoke.spec.ts`;
- branch protection is absent and rulesets are empty.

Not executed or not knowable from this audit:

- no live deployment, Docker smoke, Electron package, Storybook, Lighthouse, Android or Supabase service was run; the current checkout has no installed Playwright binary, so a fresh E2E listing was not treated as evidence;
- repository secrets were not read or exposed;
- account billing/plan restrictions and external-app internal behavior were not inferred;
- proposed browser/container lanes do not exist yet and are not claimed as passing.

The report is complete evidence for #86; implementation remains in the small follow-up issues and #100/#106/#89.
