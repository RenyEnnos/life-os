---
type: api
status: active
last_updated: 2026-04-27
tags: [api, endpoints, rest]
---

# Authentication API

All authentication endpoints are prefixed with `/api/auth`. Registration and login are rate-limited to 10 requests per 15-minute window per IP.

## POST /api/auth/register

Register a new account with a valid invite code.

**Rate limited:** Yes (10 req/15 min)

### Request Body

| Field        | Type   | Required | Validation        | Description              |
| ------------ | ------ | -------- | ----------------- | ------------------------ |
| `email`      | string | Yes      | Valid email       | User's email address     |
| `password`   | string | Yes      | Min 8 characters  | Account password         |
| `name`       | string | Yes      | Min 1 character   | User's full name         |
| `inviteCode` | string | Yes      | Min 1 character   | Invite code from admin   |

### Response

**201 Created**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "usr_abc123",
      "email": "partner@example.com",
      "user_metadata": {
        "full_name": "Design Partner",
        "nickname": "Design Partner",
        "invite_code": "LIFEOS-INVITE",
        "is_invited_partner": true,
        "theme": "dark",
        "onboarding_completed": false,
        "created_at": "2026-01-15T10:30:00.000Z",
        "updated_at": "2026-01-15T10:30:00.000Z"
      }
    }
  }
}
```

### Errors

| Status | Code   | Description                        |
| ------ | ------ | ---------------------------------- |
| 400    | -      | Validation failed (invalid input)  |
| 400    | -      | `"User already registered"`        |
| 400    | -      | `"Invite not found for this email"` |
| 400    | -      | `"Invite already claimed"`         |
| 429    | -      | `"Too many attempts, please try again later"` |

---

## POST /api/auth/login

Authenticate with email and password.

**Rate limited:** Yes (10 req/15 min)

### Request Body

| Field      | Type   | Required | Validation       | Description    |
| ---------- | ------ | -------- | ---------------- | -------------- |
| `email`    | string | Yes      | Valid email      | Email address  |
| `password` | string | Yes      | Min 1 character  | Account password |

### Response

**200 OK**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "usr_abc123",
      "email": "partner@example.com",
      "user_metadata": {
        "full_name": "Design Partner",
        "nickname": "Design Partner",
        "invite_code": "LIFEOS-INVITE",
        "is_invited_partner": true,
        "theme": "dark",
        "onboarding_completed": true,
        "created_at": "2026-01-15T10:30:00.000Z",
        "updated_at": "2026-01-15T10:30:00.000Z"
      }
    }
  }
}
```

### Errors

| Status | Code   | Description                        |
| ------ | ------ | ---------------------------------- |
| 400    | -      | Validation failed (invalid input)  |
| 401    | -      | `"Invalid login credentials"`      |
| 429    | -      | `"Too many attempts, please try again later"` |

---

## GET /api/auth/verify

Verify the current session. Returns the authenticated user if the session token is valid.

**Requires authentication:** Yes (Bearer token or session cookie)

### Request

No request body. Token must be provided via:

- `Authorization: Bearer <token>` header, or
- `lifeos_session` cookie

### Response

**200 OK**

```json
{
  "id": "usr_abc123",
  "email": "partner@example.com",
  "user_metadata": {
    "full_name": "Design Partner",
    "nickname": "Design Partner",
    "invite_code": "LIFEOS-INVITE",
    "is_invited_partner": true,
    "theme": "dark",
    "onboarding_completed": true,
    "created_at": "2026-01-15T10:30:00.000Z",
    "updated_at": "2026-01-15T10:30:00.000Z"
  }
}
```

> **Note:** The verify endpoint returns the user object directly (not wrapped in `success`/`data`).

### Errors

| Status | Code   | Description                    |
| ------ | ------ | ------------------------------ |
| 401    | -      | `"Authentication required"`    |

---

## POST /api/auth/logout

Clear the session cookie and end the current session.

**Requires authentication:** No (but typically called by authenticated users)

### Request

No request body.

### Response

**200 OK**

```json
{
  "success": true,
  "data": {
    "message": "Logged out"
  }
}
```

### Errors

None. Always returns 200.

---

## PATCH /api/auth/profile

Update the authenticated user's profile.

**Requires authentication:** Yes (Bearer token or session cookie)

### Request Body

| Field   | Type   | Required | Validation                      | Description     |
| ------- | ------ | -------- | ------------------------------- | --------------- |
| `name`  | string | No       | Must be a string if provided    | New display name |
| `theme` | string | No       | `"light"` or `"dark"` if provided | UI theme        |

At least one field must be provided.

### Response

**200 OK**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_abc123",
      "email": "partner@example.com",
      "user_metadata": {
        "full_name": "New Name",
        "nickname": "New Name",
        "invite_code": "LIFEOS-INVITE",
        "is_invited_partner": true,
        "theme": "light",
        "onboarding_completed": true,
        "created_at": "2026-01-15T10:30:00.000Z",
        "updated_at": "2026-04-27T14:00:00.000Z"
      }
    }
  }
}
```

### Errors

| Status | Code   | Description                    |
| ------ | ------ | ------------------------------ |
| 401    | -      | `"Authentication required"`    |
