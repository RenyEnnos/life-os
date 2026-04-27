---
type: api
status: active
last_updated: 2026-04-27
tags: [api, endpoints, rest]
---

# LifeOS API Reference

## Overview

The LifeOS API is an Express-based HTTP API that powers the invite-only weekly operating loop. It runs locally as part of the Electron desktop application or as a standalone development server.

**Base URL (development):**

```
http://localhost:3001
```

**Base URL (Electron):**

```
IPC-based (no HTTP port; calls routed through electron main process)
```

## Authentication

The API uses JWT session tokens for authentication. Tokens are issued upon successful registration or login.

### Token Transmission

Tokens can be sent in two ways:

1. **HTTP-only cookie** (default for browser/Express): Set automatically on login/register via the `lifeos_session` cookie.
2. **Authorization header** (for API clients): `Authorization: Bearer <token>`

### Session Lifecycle

- Tokens expire after **7 days**.
- Tokens are signed with `LIFEOS_SESSION_SECRET` or `JWT_SECRET`.
- Logout clears the session cookie.

## Standard Response Format

All endpoints return JSON responses in one of two shapes:

### Success

```json
{
  "success": true,
  "data": { ... }
}
```

### Error

```json
{
  "success": false,
  "error": "Human-readable error message"
}
```

### HTTP Status Codes

| Code  | Meaning                |
| ----- | ---------------------- |
| 200   | Success                |
| 201   | Created                |
| 400   | Bad request / validation failure |
| 401   | Authentication required / invalid credentials |
| 429   | Too many requests (rate limited) |
| 500   | Internal server error  |

## Rate Limiting

Authentication endpoints (`/api/auth/register`, `/api/auth/login`) are rate-limited:

- **Window:** 15 minutes
- **Max requests:** 10 per window per IP
- Exceeding the limit returns `429` with message: `"Too many attempts, please try again later"`

## Input Validation

All request bodies are validated using Zod schemas. Invalid input is rejected with a `400` status before any business logic executes.

## Endpoints

### Health

| Method | Path            | Auth | Description        |
| ------ | --------------- | ---- | ------------------ |
| GET    | `/api/health`   | No   | Health check       |

### Authentication

| Method | Path                | Auth | Description           |
| ------ | ------------------- | ---- | --------------------- |
| POST   | `/api/auth/register` | No* | Register new account  |
| POST   | `/api/auth/login`    | No* | Login                 |
| GET    | `/api/auth/verify`   | Yes | Verify session        |
| POST   | `/api/auth/logout`   | No  | Logout                |
| PATCH  | `/api/auth/profile`  | Yes | Update profile        |

*Rate-limited (10 req/15 min)

### MVP Workspace

All MVP endpoints require authentication.

| Method | Path                                        | Description                  |
| ------ | ------------------------------------------- | ---------------------------- |
| GET    | `/api/mvp/workspace`                        | Get workspace snapshot       |
| DELETE | `/api/mvp/workspace`                        | Reset workspace              |
| PUT    | `/api/mvp/onboarding`                       | Save onboarding data         |
| POST   | `/api/mvp/weekly-plans/generate`            | Generate a weekly plan       |
| POST   | `/api/mvp/weekly-plans/:planId/confirm`     | Confirm a weekly plan        |
| PATCH  | `/api/mvp/action-items/:actionItemId`       | Update an action item        |
| POST   | `/api/mvp/daily-checkins`                   | Save a daily check-in        |
| POST   | `/api/mvp/reflections`                      | Add a reflection entry       |
| POST   | `/api/mvp/feedback`                         | Submit product feedback      |

See [authentication.md](./authentication.md) and [mvp-workspace.md](./mvp-workspace.md) for detailed endpoint documentation.
