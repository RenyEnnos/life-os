# HTTP Boundary and Session Hardening Design

Status: approved for autonomous execution
Date: 2026-07-17
Issues: #108, #123

## Decision

Harden the canonical Express server without adding dependencies or a second authentication system. Every request shape is parsed by strict Zod schemas before repository access. The global JSON parser accepts at most 32 KiB. Existing `express-rate-limit` protects authentication by source IP and authenticated writes by persisted user ID.

The server continues to trust no proxy. This is deliberate for the supported direct single-process deployment: forwarded client headers never influence throttling. A future proxy topology must name exact trusted hops or networks before changing this policy.

## Request contracts

All objects reject unknown keys. Path IDs are trimmed strings of 1 to 128 characters. Emails are valid and at most 254 characters. Passwords are bounded at 128 characters and are never trimmed.

- registration: password 8–128; name 1–100; invite code 1–128;
- login: non-empty password up to 128;
- profile: optional name 1–100 and theme `light|dark`, with at least one field;
- onboarding: display name 1–100; short context fields up to 200; planning pain up to 2,000; at most 20 non-empty items of up to 300 characters in each list;
- weekly review: the same list bounds; focus area up to 200; integer energy 1–5; notes up to 2,000;
- action update: status `todo|done|deferred`, note up to 2,000, and at least one field;
- daily check-in: a real `YYYY-MM-DD` calendar date, integer energy/focus 1–5, blockers/note up to 2,000;
- reflection: period `daily|weekly`, body 1–4,000;
- feedback: integer rating 1–5, message 1–4,000;
- empty-body endpoints reject non-empty bodies.

Validation failures return 400 and never call a repository. Payloads over 32 KiB return 413. Malformed JSON remains a 400 rather than leaking an internal error.

## Session and CSRF policy

Each persisted user has `sessionVersion`, defaulting legacy records to zero. JWTs carry that version. Verification, profile access, logout, and all MVP routes reload the user by signed `sub` and require an exact version match. Logout increments the persisted version before clearing the cookie, invalidating every copied bearer and cookie token for that account. This deliberately implements global logout; per-device sessions are out of scope until a real product requirement exists.

Token extraction records whether authority came from `Authorization: Bearer` or the HTTP-only cookie. For unsafe authenticated methods, cookie authority requires an `Origin` exactly present in the server allowlist. Bearer authority does not require Origin because browsers do not attach that header ambiently. CORS remains a response/browser control and is not treated as authorization.

## Throttling

- register/login: 10 attempts per 15 minutes by direct peer IP;
- authenticated ordinary writes: 120 per 15 minutes by user ID;
- expensive plan generation: 20 per hour by user ID;
- reset/recovery receives its own stricter limiter in #124.

Rate-limit responses use 429. GET workspace/admin reads are not given a speculative limiter.

## Scope and follow-up

#123 does not implement reset recovery. #124 retains the parent acceptance for password reauthentication, exact confirmation, portable export, and file/Prisma recovery. #109 owns durable concurrency-safe persistence; #110 owns full account lifecycle/export. Electron payload validation is part of #111 unless it can reuse these schemas without changing the canonical web contract.

## Verification

Focused API tests must prove bounds, unknown-key rejection, 413 handling, repository non-mutation, rate limits, cookie Origin denial, bearer behavior, copied-token invalidation after logout, legacy session-version compatibility, and untrusted forwarded headers. Full unit/integration tests, typecheck, lint, web/server builds, canonical browser E2E, and independent security review remain merge gates.

