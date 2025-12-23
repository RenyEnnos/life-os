# Change: Audit Codebase Consistency

## Why
A codebase-wide audit is needed to identify and remediate security, reliability, and consistency issues that are currently drifting from the OpenSpec expectations.

## Directive
Review the current codebase end-to-end and surface problems or inconsistencies. This proposal captures the remediation plan for the highest-risk findings, with a strict no-mocks policy.

## What Changes
- Fail fast when server secrets or Supabase credentials are missing; no mock fallback.
- Protect or disable diagnostic endpoints in production.
- Enforce strict CORS allowlists in production (no private/localhost origins).
- Sanitize CSV exports to prevent spreadsheet injection.
- Validate mutation payloads (notably auth profile updates) with shared Zod schemas.
- Align auth rate-limiting behavior with normalized emails.

## Impact
- Affected specs: harden-security, improve-reliability, fix-code-quality.
- Affected code: `api/lib/supabase.ts`, `api/app.ts`, `api/routes/auth.ts`, `api/routes/dev.ts`, `api/routes/db.ts`, `api/routes/export.ts`, shared schemas.
