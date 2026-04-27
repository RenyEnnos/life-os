---
type: reference
status: active
last_updated: 2026-04-27
tags: [security, policy]
---

# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.3.x   | :white_check_mark: |
| < 0.3   | :x:                |

Only the latest release in the 0.3.x line receives security patches. Older versions are not supported and should be upgraded immediately.

## Reporting a Vulnerability

If you discover a security vulnerability in LifeOS, please report it responsibly.

**Do not open a public GitHub issue for security vulnerabilities.**

Instead, send an email to:

```
security@lifeos.app
```

Include:

- Description of the vulnerability
- Steps to reproduce
- Potential impact assessment
- Suggested fix (if available)

### Response Timeline

| Action               | Timeline     |
| -------------------- | ------------ |
| Acknowledgement      | 48 hours     |
| Initial assessment   | 5 business days |
| Fix or mitigation    | 30 business days |
| Public disclosure    | After fix is released |

We follow coordinated disclosure. Please do not publicly disclose the vulnerability until a fix has been released and you have received confirmation from the maintainers.

## Security Architecture

### Local-First SQLite Storage

LifeOS stores all user data locally in SQLite via `better-sqlite3`. No data leaves the user's machine unless cloud sync (Supabase) is explicitly configured and enabled. The SQLite database file is stored in:

- **Production:** Electron `userData` directory (`lifeos.db`)
- **Development:** Project root (`lifeos.db`)

WAL (Write-Ahead Logging) mode is enabled for performance and crash safety.

### Authentication and Session Management

- **Invite-only registration:** New accounts require a valid invite code. The invite code is validated server-side during `POST /api/auth/register`.
- **Password hashing:** Passwords are hashed with bcrypt (10 rounds) before storage.
- **JWT session tokens:** Sessions are issued as JWT tokens signed with `LIFEOS_SESSION_SECRET` or `JWT_SECRET`. Tokens expire after 7 days.
- **HTTP-only cookies:** Session tokens are set as HTTP-only cookies with `SameSite=Lax` and `Secure` (in production). This prevents XSS access to session tokens.
- **Bearer token support:** The API also accepts tokens via the `Authorization: Bearer <token>` header for API clients.

### Electron Context Isolation

The Electron renderer process does not have direct access to Node.js APIs or the file system. All communication between renderer and main process goes through a preload script that exposes a narrow, typed API via `contextBridge.exposeInMainWorld`. This ensures:

- Renderer code cannot import Node.js modules directly
- IPC channels are explicitly defined and scoped
- No `nodeIntegration: true` or `webPreferences.nodeIntegration` in the main process

### Input Validation

All API endpoints validate input using Zod schemas. Invalid input is rejected with a `400` status before any business logic executes. Examples:

- `POST /api/auth/register`: validates `email` (valid format), `password` (min 8 chars), `name` (min 1 char), `inviteCode` (min 1 char)
- `POST /api/auth/login`: validates `email` (valid format), `password` (min 1 char)

### Rate Limiting

Authentication endpoints (`/api/auth/register`, `/api/auth/login`) are protected by rate limiting:

- **Window:** 15 minutes
- **Max requests:** 10 per window per IP
- **Response:** `429 Too Many Requests` with descriptive message

### CORS Policy

Cross-Origin Resource Sharing is configured with an explicit allowlist:

- `http://localhost:5173` (Vite dev server)
- `http://localhost:3001` (Express dev server)
- Custom origin via `ALLOWED_ORIGIN` environment variable

Credentials are allowed for authenticated requests. Requests from unrecognized origins are rejected.

### Security Headers (Helmet)

The Express API uses [Helmet](https://helmetjs.github.io/) to set standard HTTP security headers:

- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security` (in production)
- And other recommended headers

### Row Level Security (Supabase)

When Supabase cloud sync is enabled, Row Level Security (RLS) policies ensure that users can only access their own data. RLS is enforced at the database level, not the application level.

## Environment Variables

### Required

| Variable              | Description                                      |
| --------------------- | ------------------------------------------------ |
| `LIFEOS_SESSION_SECRET` | Secret key for signing JWT session tokens. Use a long, random string. |
| `JWT_SECRET`           | Fallback secret key for JWT signing (used if `LIFEOS_SESSION_SECRET` is not set). |

At least one of these **must** be set. The application will throw an error on startup if neither is configured.

### Optional

| Variable              | Description                                      |
| --------------------- | ------------------------------------------------ |
| `ALLOWED_ORIGIN`      | Additional CORS origin to allow (e.g., production domain). |
| `NODE_ENV`            | Set to `production` to enable secure cookies and suppress error details. |
| `LIFEOS_INVITES`      | JSON array or comma-separated list of invite seeds for registration. |
| `DATABASE_URL`        | PostgreSQL connection string for Prisma-backed storage. |
| `LIFEOS_MVP_REPOSITORY` | Set to `prisma` to use Prisma-backed MVP repository instead of file-backed. |
| `VITE_SUPABASE_URL`   | Supabase project URL for optional cloud sync. |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key for optional cloud sync. |

### Security Rules

- **Never commit `.env` files** to version control.
- **Never expose secrets** in client-side code, error messages, or logs.
- In production, error messages are sanitized to `"Internal server error"` to prevent information leakage.
- Session secrets should be at least 32 characters of random data.

## Dependencies

### Automated Scanning

- **npm audit** runs in CI on every push and pull request to `main`. Build fails on `high` or `critical` vulnerabilities.
- **Dependabot** is configured to open pull requests for dependency updates on a weekly schedule.

### Key Security-Related Dependencies

| Package         | Purpose                              |
| --------------- | ------------------------------------ |
| `bcryptjs`      | Password hashing (10 rounds)         |
| `jsonwebtoken`  | JWT token creation and verification  |
| `helmet`        | HTTP security headers                |
| `express-rate-limit` | Rate limiting for auth endpoints |
| `zod`           | Input validation schemas             |
| `better-sqlite3` | Local SQLite database               |

### Updating Dependencies

```bash
npm audit                    # Check for vulnerabilities
npm audit fix                # Auto-fix vulnerabilities
npm audit fix --force        # Force fix (may include breaking changes)
```

## Data Protection

### What We Store

- **Email and password hash** (bcrypt) for authentication
- **User preferences** (name, theme, onboarding status)
- **MVP data** (onboarding responses, weekly plans, action items, daily check-ins, reflections, feedback)
- **Task/habit/journal data** in the broader feature suite

### What We Do NOT Store

- Plaintext passwords (bcrypt-hashed only)
- Payment information (no payment processing)
- Analytics or tracking data (telemetry is opt-in and minimal)

### Data Deletion

Users can reset their workspace via `DELETE /api/mvp/workspace`, which removes all MVP-related data for the authenticated user.

## Compliance Considerations

LifeOS is a local-first desktop application. Because data is stored on the user's device by default, the application has a reduced GDPR/privacy footprint compared to cloud-only services. When Supabase sync is enabled, data is encrypted in transit (TLS) and at rest (Supabase infrastructure).

For questions about this security policy, contact `security@lifeos.app`.
