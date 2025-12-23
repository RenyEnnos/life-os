## 1. Audit Mapping
- [x] 1.1 Document unauthenticated routes and decide gating for `/api/dev/*` and `/api/db/*`.
- [x] 1.2 Remove Supabase mock fallback and require real configuration.

## 2. Security Hardening
- [x] 2.1 Remove `VITE_JWT_SECRET` fallback and require server-only `JWT_SECRET` outside tests.
- [x] 2.2 Add Zod validation for `/api/auth/profile` (reject unknown fields).
- [x] 2.3 Normalize auth rate-limit keys using normalized email addresses.
- [x] 2.4 Enforce production CORS allowlists (no private/localhost origins).
- [x] 2.5 Sanitize CSV export cells to prevent spreadsheet injection.
- [x] 2.6 Protect or disable diagnostic routes in production (`/api/dev/*`, `/api/db/*`).

## 3. Reliability Safeguards
- [x] 3.1 Remove Supabase mock fallback and fail fast on missing configuration.
- [x] 3.2 Surface Supabase configuration state in `/api/dev/status` and logs.

## 4. Validation
- [x] 4.1 Add/adjust tests for auth profile validation, CSV export sanitization, and missing-env startup behavior.
- [x] 4.2 Run lint and targeted tests for auth, export, and diagnostic routes.
