---
type: api
status: active
last_updated: 2026-04-27
tags: [api, endpoints, rest]
---

# MVP Workspace API

All MVP endpoints are prefixed with `/api/mvp` and require authentication. The authentication middleware extracts the JWT token, verifies it, loads the user, and attaches `authUser` to the request.

## GET /api/mvp/workspace

Get the current workspace snapshot for the authenticated user. This is the primary data endpoint that returns the full state of the user's weekly operating loop.

**Requires authentication:** Yes

### Request

No request body.

### Response

**200 OK**

```json
{
  "success": true,
  "data": {
    "onboarding": { ... },
    "plan": { ... },
    "execution": { ... },
    "analytics": { ... },
    "reflections": [ ... ],
    "feedback": [ ... ]
  }
}
```

The shape of `data` is defined by `MvpWorkspaceSnapshot` in `src/features/mvp/types.ts`.

### Errors

| Status | Code   | Description                    |
| ------ | ------ | ------------------------------ |
| 401    | -      | `"Authentication required"`    |
| 500    | -      | Internal server error          |

---

## DELETE /api/mvp/workspace

Reset the workspace for the authenticated user. Removes all onboarding data, plans, execution data, reflections, and feedback.

**Requires authentication:** Yes

### Request

No request body.

### Response

**200 OK**

```json
{
  "success": true,
  "data": { ... }
}
```

Returns the reset workspace snapshot.

### Errors

| Status | Code   | Description                    |
| ------ | ------ | ------------------------------ |
| 401    | -      | `"Authentication required"`    |
| 500    | -      | Internal server error          |

---

## PUT /api/mvp/onboarding

Save the user's onboarding data. This includes identity, goals, commitments, constraints, and planning context. Sets `onboardingCompleted` to `true` on the user profile.

**Requires authentication:** Yes

### Request Body

The request body is an onboarding draft object. Key fields are defined by `MvpOnboardingDraft` in `src/features/mvp/types.ts`.

### Response

**200 OK**

```json
{
  "success": true,
  "data": { ... }
}
```

Returns the saved onboarding snapshot.

### Errors

| Status | Code   | Description                    |
| ------ | ------ | ------------------------------ |
| 401    | -      | `"Authentication required"`    |
| 500    | -      | Internal server error          |

---

## POST /api/mvp/weekly-plans/generate

Generate a new weekly plan based on the user's onboarding context and review input.

**Requires authentication:** Yes

### Request Body

The request body is a review draft. Key fields are defined by `MvpReviewDraft` in `src/features/mvp/types.ts`. The `generatedAt` and `id` fields are generated server-side.

### Response

**200 OK**

```json
{
  "success": true,
  "data": { ... }
}
```

Returns the workspace snapshot with the newly generated plan.

### Errors

| Status | Code   | Description                    |
| ------ | ------ | ------------------------------ |
| 401    | -      | `"Authentication required"`    |
| 500    | -      | Internal server error          |

---

## POST /api/mvp/weekly-plans/:planId/confirm

Confirm a generated weekly plan, locking it in for execution.

**Requires authentication:** Yes

### Path Parameters

| Parameter | Type   | Description          |
| --------- | ------ | -------------------- |
| `planId`  | string | ID of the plan to confirm |

### Request

No request body.

### Response

**200 OK**

```json
{
  "success": true,
  "data": { ... }
}
```

Returns the workspace snapshot with the confirmed plan.

### Errors

| Status | Code   | Description                    |
| ------ | ------ | ------------------------------ |
| 401    | -      | `"Authentication required"`    |
| 500    | -      | Internal server error          |

---

## PATCH /api/mvp/action-items/:actionItemId

Update an action item within the current plan. Can update status and add notes.

**Requires authentication:** Yes

### Path Parameters

| Parameter        | Type   | Description             |
| ---------------- | ------ | ----------------------- |
| `actionItemId`   | string | ID of the action item   |

### Request Body

| Field    | Type   | Required | Validation                           | Description                          |
| -------- | ------ | -------- | ------------------------------------ | ------------------------------------ |
| `status` | string | No       | `"todo"`, `"done"`, or `"deferred"`  | New status for the action item       |
| `note`   | string | No       | Any string                           | Note or comment on the action item   |

### Response

**200 OK**

```json
{
  "success": true,
  "data": { ... }
}
```

Returns the workspace snapshot with the updated action item.

### Errors

| Status | Code   | Description                    |
| ------ | ------ | ------------------------------ |
| 401    | -      | `"Authentication required"`    |
| 500    | -      | Internal server error          |

---

## POST /api/mvp/daily-checkins

Save a daily check-in for the current execution cycle. Records what the user accomplished and their energy/mood.

**Requires authentication:** Yes

### Request Body

The request body is a daily check-in object. Key fields are defined by `MvpDailyCheckIn` in `src/features/mvp/types.ts`. The `createdAt` field is generated server-side.

### Response

**200 OK**

```json
{
  "success": true,
  "data": { ... }
}
```

Returns the workspace snapshot with the saved check-in and updated analytics.

### Errors

| Status | Code   | Description                    |
| ------ | ------ | ------------------------------ |
| 401    | -      | `"Authentication required"`    |
| 500    | -      | Internal server error          |

---

## POST /api/mvp/reflections

Add a reflection entry to the user's reflection history. Reflections capture end-of-week learnings and insights.

**Requires authentication:** Yes

### Request Body

| Field    | Type   | Required | Description                         |
| -------- | ------ | -------- | ----------------------------------- |
| `period` | string | Yes      | The period this reflection covers   |
| `body`   | string | Yes      | The reflection content              |

### Response

**200 OK**

```json
{
  "success": true,
  "data": { ... }
}
```

Returns the workspace snapshot with the updated reflections collection.

### Errors

| Status | Code   | Description                    |
| ------ | ------ | ------------------------------ |
| 401    | -      | `"Authentication required"`    |
| 500    | -      | Internal server error          |

---

## POST /api/mvp/feedback

Submit product feedback (rating and message).

**Requires authentication:** Yes

### Request Body

| Field     | Type   | Required | Validation      | Description                |
| --------- | ------ | -------- | --------------- | -------------------------- |
| `rating`  | number | Yes      | Any number      | Feedback rating (e.g., 1-5) |
| `message` | string | Yes      | Any string      | Feedback text              |

### Response

**200 OK**

```json
{
  "success": true,
  "data": { ... }
}
```

Returns the workspace snapshot with the updated feedback collection.

### Errors

| Status | Code   | Description                    |
| ------ | ------ | ------------------------------ |
| 401    | -      | `"Authentication required"`    |
| 500    | -      | Internal server error          |
