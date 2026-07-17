# LifeOS operating modes and trust-boundary decision

Status: provisional
Date: 2026-07-16
Decision owner: repository maintainer
Operational author: Codex under the autonomous recovery mandate
Related issues: #82, #83, #85, #86, #87, #89, #106

## Decision

LifeOS currently supports one operating mode: **local-dev** — one operator, disposable data and loopback access. The repository enforces an explicit `LIFEOS_OPERATING_MODE` at build/startup and contains a fail-closed **controlled-demo candidate profile**, but repository enforcement alone does not make a deployed demo supported.

**controlled-demo** is the next supportable mode: a short-lived, access-limited demonstration using synthetic or explicitly non-sensitive data. It remains unsupported until its gate in this document passes. **partner-beta** and **public-production** are also unsupported until their gates are implemented and verified. A Docker target, production build, public URL, PWA artifact, or green development suite does not change those classifications.

This is a reversible operational decision, not a claim that the current code is generally secure or remotely exploitable. Findings below distinguish observed behavior from deployment-dependent risk.

## Product, assets, actors and boundaries

The current product boundary is the invite-only weekly loop over the provisional canonical browser + Express + HTTP runtime in ADR-0001.

Protected assets include:

- credentials, password hashes, session tokens and invite claims;
- identity mappings across web, Electron and Supabase;
- onboarding answers, goals, commitments, plans, daily check-ins, reflections and feedback;
- local JSON files, Electron SQLite and optional Prisma/Postgres records;
- server, database and third-party credentials;
- logs, analytics, source maps and exported data that may reveal personal information.

Relevant actors are the local operator, an invited participant, a demo viewer, an unauthenticated network client, an authenticated user attempting cross-account access, an administrator, and a person with local-machine access.

Trust boundaries:

| Boundary | Observed mechanism | Security meaning |
|---|---|---|
| Browser to Express | HTTP, CORS allowlist, JWT bearer or signed cookie | Canonical remote trust boundary; server authentication is meaningful, client route visibility is not authorization |
| Express to auth JSON | `FileBackedAuthRepository` | Stores hashes, invite claims and user metadata; process-local file access is the trust boundary |
| Express to MVP JSON | `FileBackedMvpRepository` | User-keyed workspaces; strict reads and atomic replacement are serialized per path inside one Node process |
| Express to Prisma/Postgres | `PrismaBackedMvpRepository` | Explicit relational boundary selected only by `LIFEOS_MVP_REPOSITORY=prisma`; live deployment evidence is still required |
| Electron renderer to main | preload bridge and IPC handlers | Experimental local boundary; renderer input remains untrusted even without a network hop |
| Electron to Supabase | anon client plus persisted session tokens | Optional cloud identity/data boundary; RLS evidence does not make every desktop path canonical |
| Electron to SQLite/JSON | `lifeos.db`, desktop MVP JSON, `safeStorage` when available | Local-device boundary; plaintext fallback tokens are observed when OS encryption is unavailable |
| Build/runtime to vendors | Sentry, analytics, badges and source maps when configured | Potential metadata/code disclosure boundary; actual transmission depends on configuration and use |

## Threat model by operating mode

| Mode | Intended users/data | Main threats | Required boundary | Current disposition |
|---|---|---|---|---|
| local-dev | operator; disposable synthetic data | accidental LAN exposure, reuse of known invite, local file disclosure, mistaken production claim | loopback/firewall, explicit development environment, throwaway secrets and data | **supported** with constraints below |
| controlled-demo | named viewers; synthetic or non-sensitive data; fixed duration | shared invite leakage, host exposure, stale accounts/data, logs or vendor telemetry, denial of demo | unique rotated invite, strong session secret, explicit origin/host, no public indexing, backup/wipe plan, operator present | **unsupported until the controlled-demo gate passes** |
| partner-beta | invited real users; persistent personal data | account takeover, cross-user access, data loss, privilege escalation, abuse, failed deletion/recovery | server authorization, durable concurrency-safe store, lifecycle operations, rate/size limits, monitoring and incident owner | **unsupported** until all beta gates pass |
| public-production | untrusted internet; personal data at scale | all beta threats plus enumeration, automated abuse, capacity attacks, legal/privacy and operational failure | reviewed production architecture, full abuse controls, tested recovery, privacy operations and on-call ownership | **not a desired/current state**; requires a new decision |

## Identity, authentication and authorization

### Canonical web identity

For the canonical web runtime, the current identity source is `FileBackedAuthRepository`: registration claims an email-bound invite, bcrypt stores the password hash, and Express issues a seven-day JWT as an HTTP-only same-site cookie while also returning the token in the JSON response and accepting it as a bearer token. `/api/mvp/*` verifies the token, reloads the user, and compares a persisted session version before selecting a user-scoped workspace. Logout increments that version and therefore revokes every existing cookie and copied bearer token for the account. This global-logout policy is deliberate until a real per-device session requirement exists.

The invite grants the right to create one account for the matching email. Once registered, the server session grants access to that user's MVP workspace. Invite metadata in the browser is neither authentication nor continuing authorization.

### Client gates are presentation only

`src/config/routes/access.ts` allows MVP UI access based on development mode, localhost, browser flags or user metadata. It allows the internal admin UI based on development mode, localhost or a browser flag. These conditions only show or route UI. They do not establish an administrator role. `GET /api/mvp/admin/overview` separately requires a valid web session whose normalized email exactly matches a valid entry in `LIFEOS_ADMIN_EMAILS`; an empty or malformed allowlist denies all users.

Therefore:

- local UI bypasses are permitted only in local-dev;
- controlled-demo may not use a build with bypass flags enabled;
- partner-beta/public must reject such builds;
- the only supported admin capability is the read-only overview authorized by the server allowlist; there is no admin reset or cross-user aggregation;
- hiding the navigation item or route is never acceptance evidence for authorization.

### Electron identity

Electron is experimental under ADR-0001. When Supabase is configured it uses Supabase sessions; otherwise its login/register handlers accept local credentials and create deterministic local identities and bearer-like tokens. Tokens are stored in SQLite and encrypted with Electron `safeStorage` when available, but stored without that encryption when it is unavailable. Smoke-test identities are test fixtures only. None of these identities may be promoted into web beta accounts by copying tokens; migration requires explicit identity mapping and reauthentication.

## Fallback classification

| Mechanism | local-dev | controlled-demo | partner-beta/public | Required disposition |
|---|---|---|---|---|
| Known fallback invite `partner@lifeos.local` / `LIFEOS-INVITE` | permitted with disposable loopback data | prohibited | prohibited | make fallback development-only and fail closed elsewhere |
| Explicit `LIFEOS_INVITES` seeds | permitted | permitted only with unique, rotated, email-bound seeds | beta requires managed invite lifecycle | validate configuration and avoid logging values |
| `VITE_BYPASS_MVP_INVITE_GATE` | permitted | prohibited | prohibited | release/build check must reject true |
| `VITE_ENABLE_INTERNAL_MVP_ADMIN` / `DEV` / `localhost` admin | permitted as UI convenience | prohibited as authority | prohibited | replace privileged operations with server authorization before beta |
| File-backed auth and MVP JSON | permitted single-process with strict/atomic files | permitted only for disposable, single-instance demo | prohibited for persistent multi-user beta | use the tested file-to-Prisma migration |
| Automatic Prisma selection from `DATABASE_URL` | prohibited | prohibited | prohibited | `LIFEOS_MVP_REPOSITORY` is the only selector |
| Electron local auth fallback | permitted in experimental local runtime | prohibited for shared demo | prohibited | retain only as explicit offline-development mode or remove via scoped issue |
| Plaintext Electron token fallback when `safeStorage` is unavailable | avoid | prohibited | prohibited | fail closed for any supported shared/persistent mode |
| Synthetic smoke credentials | permitted in isolated tests | prohibited in deployed data | prohibited | test-only environment gate; never seed release data |
| Broad Vite development host acceptance | loopback/firewall only | prohibited | prohibited | configure explicit host before any shared deployment |
| Production source maps | permitted locally | default off | off unless access-controlled upload has an owner | separate artifact upload from public serving |
| Vendor analytics/Sentry/badges | off by default | opt-in with synthetic data | privacy review and minimization required | document payload, consent, retention and owner first |
| Redis default password and service-role variables in Compose | local throwaway only | prohibited | prohibited | no weak defaults; mount only secrets actually consumed by the selected service |

## Configuration and fail-closed policy

Unknown or contradictory environment configuration must fail closed. No production-like environment may silently fall back to local auth, known invites, JSON persistence or browser bypasses.

| Configuration | local-dev | controlled-demo | partner-beta | public-production |
|---|---|---|---|---|
| `NODE_ENV` | `development` at runtime; production builds permitted | `production` | `production` | `production` |
| `LIFEOS_SESSION_SECRET` | required, throwaway | required, strong and unique | required, managed and rotatable | required, managed and rotatable |
| `ALLOWED_ORIGIN` | optional loopback | required exact HTTPS origin | required exact HTTPS origin | required exact HTTPS origin(s) |
| `LIFEOS_INVITES` | optional; known fallback allowed | required unique seeds | required managed lifecycle until replaced | self-service/managed policy required by new decision |
| `LIFEOS_ADMIN_EMAILS` | optional; empty denies all | explicit exact emails if admin overview is used | replace or operationalize with managed role lifecycle | managed least-privilege roles required by new decision |
| bypass/admin Vite flags | may be true | must be absent/false | must be absent/false | must be absent/false |
| `LIFEOS_MVP_REPOSITORY` | explicit preferred | explicit `file` only for disposable single-instance demo | explicit durable store | explicit durable store |
| `DATABASE_URL` | optional | prohibited while the candidate profile requires `file` | required for Prisma mode, secret-managed | required, secret-managed |
| Supabase URL/anon key | optional experimental Electron | not part of canonical demo | explicit architecture decision | explicit architecture decision |
| service-role key | not needed by observed canonical Express path | must not be supplied without a proved server consumer | least-privilege secret only if required | least-privilege secret only if required |
| analytics/Sentry | off preferred | off unless explicitly reviewed | documented minimization/retention | documented minimization/retention |

The existing fail-fast requirement for `LIFEOS_SESSION_SECRET` or `JWT_SECRET` is retained. `LIFEOS_SESSION_SECRET` is the canonical name; the JWT alias is migration compatibility, not a second policy.

The shared validator in `shared/operatingMode.ts` is used by Vite and the Express startup path. For `controlled-demo`, it enforces the production environment, exact HTTPS origin, canonical strong session-secret input, explicit unique non-fallback invites, explicit file persistence, disabled UI bypasses, and absent unreviewed vendor/service-role variables. Vite additionally omits public source maps and the development badge, and the built-artifact verifier rejects those release markers. It cannot prove that an operator generated a never-before-used value or performed rotation, expiry, host restriction, backup, or wipe; those remain deployment evidence in the gate below.

## API, validation and abuse controls

Observed controls: Helmet, credentialed CORS with an origin allowlist, strict bounded Zod schemas on every canonical auth/profile/MVP write, a 32 KiB JSON limit, bcrypt, signed expiring versioned JWTs, exact-Origin enforcement for unsafe cookie-authenticated methods, a 10-per-15-minute direct-peer auth limiter, a 120-per-15-minute per-user write limiter, and a 20-per-hour per-user plan-generation limiter. Bearer authorization is explicit authority rather than ambient browser state. Express intentionally keeps `trust proxy=false`; forwarded client-IP headers do not influence these limits in the supported direct topology.

Observed destructive-recovery controls: canonical reset is two-step and password-reauthenticated, exact phrases are required, the prepared export is a strict versioned envelope, reset retains recovery atomically with deletion, stale preparation is rejected, and restore replaces the workspace transactionally. Reset and recovery have independent per-user throttles. The bodyless web reset surface is removed.

The supported Prisma topology for this control is one Node.js application process. Workspace mutations are serialized per user inside that process; coordination across multiple processes or repository instances remains part of #109's durable concurrency decision and is not claimed here.

Gaps that block partner-beta:

- the bearer-token response expands exposure beyond an HTTP-only cookie, although persisted global logout now revokes copied tokens;
- the read-only admin overview uses an exact server-side email allowlist, but managed role lifecycle and cross-user/cohort administration are not implemented;
- authentication errors reveal whether an invite is missing, claimed, or an account is registered; this is acceptable only for controlled invitation flows after abuse review;
- auth file persistence can lose concurrent writes or expose a partial file after process interruption;
- JSON files remain intentionally limited to one Node process; sharing a file across processes has no OS-level lock and is unsupported;
- retained workspace recovery covers the canonical visible MVP snapshot, not archived relational history, full account export/deletion, retention, or Electron data; #110 and #111 own those broader contracts.

Before beta, validate every path/body/enum/string/date/rating at the HTTP boundary; set request-size and per-route rate limits; keep repository checks as defense in depth; require explicit confirmation plus a recoverable backup/export for workspace reset; and add CSRF protection appropriate to cookie-authenticated writes. Do not add a generic validation framework: Zod and `express-rate-limit` are already installed.

## Personal data lifecycle

The MVP may store email, name, theme, invite history, onboarding profile, goals, commitments, weekly reviews/plans, action notes/status, daily check-ins, reflections, ratings, feedback and event timestamps. Electron legacy modules can hold broader journal, health, finance, task and university records, but those are outside the canonical product and must remain preserved during runtime migration.

Current code does not prove a user-facing export, account deletion, retention schedule, restore drill or cross-store migration. Workspace reset is not account deletion: it clears MVP workspace records but retains identity/invite state, and behavior differs by repository.

Partner-beta requires:

1. documented purpose and retention for each collected field;
2. authenticated export in a portable format;
3. account deletion covering auth, MVP data, logs and downstream processors, with a stated backup-retention exception;
4. encrypted backups, restore test, owner and recovery objectives;
5. migration ledger, counts/invariants, dry run and rollback as specified in ADR-0001;
6. no reuse of desktop tokens or silent merging by email alone.

## Observability and privacy

Logs must not contain passwords, invite codes, session/bearer tokens, raw request bodies, reflection text or third-party secret values. Stable pseudonymous IDs and event names are sufficient for operational diagnosis. Production error responses already suppress exception details when `NODE_ENV=production`; the server console may still receive the underlying error and therefore needs a redaction policy before beta. Current Sentry setup samples all traces and all error replays when a DSN enables it, so merely setting the DSN is not an approved privacy policy.

Sentry, analytics, source maps and vendor UI are disabled for supported shared modes until their exact payload, legal basis/consent where applicable, retention, access owner and deletion process are documented. Source maps may be uploaded privately to an error service after review; they should not be publicly served by default.

## Ordered remediation backlog

Each item is independently reviewable and must not be bundled into this decision:

| Order | Issue | Slice | Proof required | Blocks |
|---|---|---|---|---|
| 1 | #106 | Environment-mode guard plus shared-deployment secret/vendor controls; coordinate CI/Docker evidence with #86 | configuration tests, startup/build failure, secret scan and built-artifact inspection | controlled-demo, beta |
| 2 | #107 | Server-side admin authorization or removal of admin surface from shared builds | negative/positive API tests; UI test only as secondary evidence | beta |
| 3 | #108 | Zod boundary schemas, JSON size limits, rate limits, session/CSRF policy and recoverable destructive reset | invalid/oversized/throttled requests, copied-token/logout, cross-origin denial and recovery tests | beta |
| 4 | #109 | Durable persistence decision and migration from JSON, including corrupt-read failure, atomicity/concurrency, backup and restore | corruption/concurrent-write tests, migration dry run, invariants and restore drill | beta |
| 5 | #110 | Data export, account deletion, retention, redacted logs and reviewed downstream processors | end-to-end lifecycle tests and operator runbook | beta |
| 6 | #111 | Electron local-token/fallback confinement and data export before any archival | safeStorage failure tests, inventory/export evidence, no token migration | runtime retirement |

The lazier safe path is to complete #106 for controlled demos while keeping beta unsupported; beta work starts only when real design partners require persistent personal data.

## Readiness gates

### Controlled-demo gate

- production-mode build on an access-limited HTTPS host;
- unique session secret and invite seeds, rotated after the demo;
- bypass/admin flags absent and no known fallback invite;
- synthetic or explicitly non-sensitive data only;
- exact origin/host, no public indexing, operator and expiry date named;
- logs/vendors reviewed, backup or wipe procedure tested;
- canonical browser flow passes against the deployed fixture.

### Partner-beta gate

All controlled-demo gates plus:

- server-side authorization for every privileged operation and no client-only authority;
- durable concurrency-safe persistence with tested backup, restore and migration rollback;
- input/path/body schemas, request size, CSRF and abuse/rate controls;
- export, deletion, retention and support/incident runbooks;
- secret rotation and least-privilege deployment configuration;
- privacy inventory for logs and every processor;
- authoritative browser E2E for invite, auth, weekly loop, cross-user denial, destructive recovery and data lifecycle;
- no unresolved critical/high finding for the deployed mode;
- named human owner for incidents and user requests.

### Public-production gate

Public production is not approved by satisfying the beta list. It requires a new product decision, updated threat model, capacity/abuse plan, legal/privacy review and explicit maintainer ratification.

## Evidence limits and rollback

This document was derived from repository code and configuration, not a live production environment. It does not establish whether any current deployment is internet-accessible, whether environment values are strong, or whether third-party services receive data.

Rollback trigger: the maintainer rejects these mode classifications or deployment evidence contradicts a factual premise. Rollback action: mark this document superseded, keep partner-beta/public unsupported, and replace it with an evidence-backed decision before changing startup policy or data paths.

## Validation

This decision is validated when:

- every fallback and trust surface above has a confirmed repository locator;
- independent security review finds no material factual omission;
- small remediation issues exist with owners, dependencies and proof requirements;
- active documentation does not claim partner-beta or public-production support;
- #86 maps CI/Docker evidence to the supported modes without weakening these gates.

Until the controlled-demo deployment gate passes against an actual fixture, only local-dev is supported.
