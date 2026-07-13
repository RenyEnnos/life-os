# LifeOS Forensic Architecture and AI-Bloat Audit

Status: working draft  
Authority: issue #83 under recovery program #82  
Owner: repository maintainer  
Executor: read-only terminal analysis agent  
Branch: `agent/forensic-audit-83`  
Last reviewed: 2026-07-13

> This document is an evidence report, not an architecture decision and not an implementation authorization.

## 1. Mission

Produce a reproducible forensic account of the current LifeOS repository so the maintainer can decide what to keep, simplify, merge, archive, rewrite, or remove without confusing historical code with dead code.

The audit must inspect the current `main` baseline represented by commit `727ad712ca33e5b3f9d185acb0536d8d8a36dc99` plus audit-only commits on this branch.

## 2. Non-negotiable constraints

The executor may:

- read repository files and Git history;
- run non-destructive searches and static analysis;
- install project dependencies only when required to reproduce existing checks;
- run existing lint, typecheck, test, build, Playwright, Docker, bundle, and dependency-analysis commands;
- add evidence and conclusions to this report;
- commit updates to this report on `agent/forensic-audit-83`.

The executor must not:

- edit product code, tests, workflows, configuration, lockfiles, schemas, migrations, assets, or canonical documentation;
- add or remove dependencies;
- run destructive migrations or mutate remote services;
- use production secrets or real user data;
- fix failures encountered during the audit;
- create another branch or pull request;
- merge or close this pull request;
- classify code as dead only because it is hidden from navigation;
- select web, Electron, Prisma, JSON, SQLite, or Supabase as the winner;
- turn a recommendation into an approved decision;
- open implementation issues automatically.

Temporary local files must remain untracked. Before every commit, verify that the only tracked diff is this report.

## 3. Required evidence discipline

Every material statement must be marked as one of:

- **Observed fact** — directly supported by a file, symbol, command, test, issue, PR, or commit;
- **Inference** — a reasoned interpretation with uncertainty stated;
- **Recommendation** — a proposed action with benefit, cost, risk, and reversibility;
- **Human decision required** — a choice the agent must not make.

For command evidence, record:

- exact command;
- exit code;
- relevant output summary;
- environment limitation;
- what the command proves;
- what it does not prove.

Do not paste secrets, tokens, full environment dumps, dependency cache paths, or excessive logs.

## 4. Required repository coverage

Inspect at minimum:

- `README.md`;
- `AGENTS.md`;
- `CONTRIBUTING.md`;
- `package.json` and lockfile;
- `docs/mvp/**`;
- `docs/governance/**`;
- `docs/adr/**`;
- `docs/prd/**` and other root-level product or readiness documents;
- `plans/**`;
- `src/config/routes/**`;
- `src/app/layout/**`;
- `src/features/**`;
- `src/shared/**`;
- `shared/**`;
- `api/**`;
- `electron/**`;
- `prisma/**`;
- Supabase configuration and migrations;
- PWA, Android/Capacitor, Docker, Storybook, monitoring, analytics, and AI integrations;
- `.github/workflows/**`;
- unit, integration, E2E, smoke, performance, accessibility, and security tests;
- open recovery issues, especially #68 and #82–#100;
- structural PRs #71–#81 and governance PR #99 when history is needed.

## 5. Confirmed baseline findings

These findings have already been observed through repository inspection. Reproduce, refine, or refute them with terminal evidence.

### 5.1 Visible product surface is narrow

**Observed fact — high confidence.**

`src/config/routes/index.tsx`, `src/config/routes/access.ts`, and `src/app/layout/navItems.ts` expose authentication, settings, and the `/mvp` loop. Broader-suite routes such as tasks, habits, finance, health, university, AI assistant, focus, and gamification are redirected instead of being primary reachable product surfaces.

Open question: determine whether hidden modules remain reachable through imports, direct nested routes, Electron entrypoints, tests, background jobs, or generated bundles.

### 5.2 Runtime and transport remain dual

**Observed fact — high confidence.**

`src/features/mvp/api/mvp.api.ts` chooses per operation between an Electron IPC bridge and HTTP endpoints. The same MVP behavior therefore has at least two transport paths.

Open question: identify contract drift, validation differences, error semantic differences, and test coverage parity between HTTP and IPC.

### 5.3 Persistence is selected by runtime and environment

**Observed fact — high confidence.**

- Web/API can use `FileBackedMvpRepository` or `PrismaBackedMvpRepository`.
- Electron MVP handlers instantiate `FileBackedMvpRepository` under the Electron user-data directory.
- Desktop authentication/session code also references SQLite, Supabase, and local fallback behavior.

Open question: produce the full matrix `runtime -> identity -> transport -> persistence -> migration path -> release evidence`.

### 5.4 Current authoritative E2E proves Electron, not the declared web product

**Observed fact — high confidence.**

`playwright.release.config.ts` runs `tests/e2e/smoke.spec.ts`. That smoke launches Electron, uses `window.api.mvp`, manipulates desktop session storage, and persists an MVP JSON file. It does not boot Express, exercise HTTP, validate Prisma, or prove browser deployment.

Open question: map every CI lane and state exactly what runtime and behavior it proves.

### 5.5 The `/mvp` workspace still presents implementation scaffolding

**Observed fact — high confidence.**

`src/features/mvp/pages/MvpWorkspacePage.tsx` and `src/features/mvp/data.ts` expose phases, readiness labels, a foundation checklist, repository paths, and immediate implementation work. The interface mixes end-user value with operator/developer status.

Open question: distinguish internal-only views, design-partner views, and accidental developer-facing copy.

### 5.6 Local/demo fallbacks are mixed with publishable claims

**Observed fact — high confidence.**

Examples to validate:

- default known invite in `api/authRepository.ts` when `LIFEOS_INVITES` is not configured;
- client-side invite and admin access signals based on localhost, development mode, metadata, and flags;
- JSON persistence that rewrites complete state;
- build and documentation language that may imply production readiness.

Open question: classify every fallback by local development, controlled demo, partner beta, public production, forbidden, or human decision required.

### 5.7 Dependency set reflects multiple historical products

**Observed fact — medium confidence pending consumer verification.**

`package.json` contains dependencies for Electron, Express, Prisma, Supabase, PWA/Workbox, Android/Capacitor scripts, charts, drag-and-drop, AI providers, monitoring, Storybook, legacy productivity surfaces, and multiple state/persistence approaches.

No dependency may be called unused until direct imports, dynamic imports, configuration consumers, scripts, generated code, build plugins, runtime loading, and tests have been checked.

## 6. Audit procedure

### Phase A — Establish reproducible baseline

Record:

- operating system and architecture;
- Node, npm, Git, Docker, Python, and `gh` versions when available;
- checked-out branch and commit;
- clean working-tree state;
- whether dependencies were already installed;
- commands that cannot run and why.

Suggested read-only commands:

```bash
git status --short --branch
git rev-parse HEAD
git log --oneline --decorate -20
node --version
npm --version
git --version
docker --version || true
python3 --version || true
```

### Phase B — Product reachability map

Determine:

- registered routes;
- navigation links;
- redirect-only routes;
- lazy-loaded modules;
- direct imports from hidden features;
- Electron-only entrypoints;
- background jobs and scheduled features;
- service worker/PWA reachable behavior;
- Android/Capacitor packaging reachability;
- test-only and Storybook-only surfaces.

Do not equate “not in sidebar” with “dead.”

### Phase C — Runtime and adapter graph

Map:

- browser renderer;
- Express server;
- Electron renderer, preload, main, and IPC;
- PWA/service worker;
- Android/Capacitor;
- HTTP clients;
- IPC bridges;
- repository interfaces and implementations;
- authentication providers and fallbacks;
- analytics, monitoring, and AI providers.

Produce a Mermaid graph or equivalent text graph in this report.

### Phase D — Persistence and data safety

For each persistence mechanism, record:

- implementation files;
- data stored;
- caller/runtime;
- default activation rule;
- schema or shape;
- atomicity and concurrency behavior;
- backup/export/delete behavior;
- migration path;
- corruption behavior;
- test coverage;
- production suitability claim, if any.

Explicitly cover JSON, Prisma/Postgres, SQLite, Supabase, IndexedDB/localStorage, Electron Store, and any additional mechanism found.

### Phase E — Dependency and script inventory

For every direct dependency and important script, classify:

- `ACTIVE_REQUIRED`;
- `ACTIVE_REPLACEABLE`;
- `LEGACY_SURFACE_ONLY`;
- `BUILD_OR_TOOLING_ONLY`;
- `DUPLICATED_CAPABILITY`;
- `NO_CONSUMER_FOUND`;
- `DECISION_REQUIRED`.

Record the evidence needed before removal. Search beyond static imports.

### Phase F — Tests, CI, release, Docker, and packaging

For each workflow/job/command, document:

- trigger;
- runtime exercised;
- behavior exercised;
- required environment/secrets;
- current success/failure;
- duplication;
- whether it is authoritative, advisory, manual, broken, legacy, or decision pending;
- false confidence risk.

Validate claims around:

- web build;
- server build;
- Electron packaging;
- browser E2E;
- Electron smoke;
- RLS/security tests;
- Docker ports, processes, static assets, healthcheck, and compose references;
- Lighthouse schedule;
- PWA and Android packaging;
- Storybook.

Do not fix failures.

### Phase G — Documentation authority map

Classify material documents as:

- `CANONICAL`;
- `ACTIVE_SUPPORTING`;
- `PROPOSAL`;
- `DECISION_PENDING`;
- `SUPERSEDED`;
- `HISTORICAL`;
- `DUPLICATE`;
- `CONTRADICTORY`;
- `DELETE_CANDIDATE`;
- `MISSING_REQUIRED`.

Identify retrieval hazards for AI agents, including obsolete files in central paths, contradictory “source of truth” claims, generated summaries, and unexpired plans.

### Phase H — AI/tool bloat

Inspect for:

- tool badges and injected production elements;
- agent-specific plugins and config;
- generated wrappers or abstractions with no independent purpose;
- duplicated prompts and instruction files;
- artifacts copied between worktrees;
- integration SDKs without active capability;
- AI features represented in documentation but hidden or nonfunctional;
- comments and documents that describe behavior not present in code.

Avoid aesthetic judgments. Tie every classification to maintenance cost, runtime cost, security surface, or product ambiguity.

## 7. Required deliverables

### 7.1 Executive summary

Maximum 15 findings. Include severity, confidence, and decision dependency.

_TODO by audit agent._

### 7.2 Product reachability matrix

| Surface | Route/entrypoint | Visible navigation | Reachable by direct URL | Runtime | Current status | Evidence |
|---|---|---:|---:|---|---|---|
| MVP workspace | `/mvp` | Yes | Yes with access gate | Browser/Electron renderer | Active | `src/config/routes/index.tsx` |
| Settings | `/settings` | Yes | Yes after auth | Browser/Electron renderer | Active | `src/app/layout/navItems.ts` |
| Legacy suite routes | Multiple | No | Redirected in current router | Renderer | Hidden; consumers still require audit | `src/config/routes/access.ts` |

_Add every relevant surface._

### 7.3 Runtime, transport, identity, and persistence matrix

| Runtime | UI entry | Transport | Identity/session | MVP persistence | Release evidence | Status |
|---|---|---|---|---|---|---|
| Web | Vite/browser | HTTP | Express JWT/cookie + file auth repository | JSON or Prisma | Browser E2E currently advisory/quarantined | Decision required |
| Electron | Vite renderer | IPC | Supabase/SQLite/local fallback paths | JSON under user data | Electron Playwright smoke | Decision required |

_Validate and expand._

### 7.4 Component decision matrix

Use only these preliminary states:

- `KEEP`;
- `SIMPLIFY`;
- `MERGE`;
- `REMOVE_CANDIDATE`;
- `REWRITE_CANDIDATE`;
- `ARCHIVE`;
- `DECISION_REQUIRED`.

| Item | Category | Location | Consumers | Runtime | Preliminary state | Evidence | Removal risk | Required test/decision |
|---|---|---|---|---|---|---|---|---|

### 7.5 Dependency inventory

| Dependency | Static consumers | Dynamic/config consumers | Script/build use | Surface/runtime | Classification | Evidence before removal |
|---|---|---|---|---|---|---|

### 7.6 Workflow and release evidence matrix

| Workflow/command | Trigger | Runtime | What it proves | What it does not prove | Current state | Recommendation |
|---|---|---|---|---|---|---|

### 7.7 Documentation authority matrix

| Document | Current claim | Actual relevance | Conflicts with | Classification | Proposed action |
|---|---|---|---|---|---|

### 7.8 Security and operational-mode matrix

| Mechanism/fallback | Local dev | Controlled demo | Partner beta | Public production | Evidence | Decision required |
|---|---|---|---|---|---|---|

### 7.9 Human decision queue

Order decisions by dependency. At minimum address:

1. product and intended user;
2. canonical runtime;
3. supported non-canonical runtimes;
4. identity and authorization model;
5. persistence and migration contract;
6. release evidence;
7. operational modes;
8. legacy product surfaces;
9. AI capability role;
10. documentation authority.

### 7.10 Recommended backlog

Propose bounded issues only. Do not create them.

| Order | Proposed issue | Type | Blocked by | Risk | Suggested size | Why separate |
|---:|---|---|---|---|---|---|

### 7.11 Evidence register

| Conclusion | Classification | Evidence | Confidence | Limitation |
|---|---|---|---|---|

### 7.12 Commands executed

| Command | Exit code | Result summary | Proves | Does not prove |
|---|---:|---|---|---|

### 7.13 What could not be proven

_TODO by audit agent. This section is mandatory._

## 8. Completion gate

The audit is ready for maintainer review only when:

- the current `main` baseline is recorded;
- all required repository areas were inspected or explicitly marked unavailable;
- all direct dependencies and material scripts have a classification;
- web, Electron, PWA, Android, Express, HTTP, IPC, JSON, Prisma, SQLite, Supabase, browser storage, and Electron storage are explicitly covered;
- each workflow and release lane states what it proves and does not prove;
- conclusions distinguish fact, inference, recommendation, and human decision;
- no tracked file except this report was changed;
- the final section states what remains unproven;
- the agent stops without implementation.

## 9. Agent handoff command

The maintainer may give the terminal agent this instruction:

> Work on draft PR created from branch `agent/forensic-audit-83`. Read issue #83, issue #82, `AGENTS.md`, and `docs/audits/2026-07-13-lifeos-forensic-audit.md`. Execute the audit exactly as specified. Update only that report file, commit evidence-focused progress to the same branch, and do not modify product code or create another PR. Stop after the report is complete and ready for independent review.
