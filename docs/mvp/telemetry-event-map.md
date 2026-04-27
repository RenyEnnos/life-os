---
type: reference
status: active
last_updated: 2026-04-27
tags: [mvp, product]
---

# MVP Telemetry Event Map

This document defines the production telemetry contract for the shipped LifeOS MVP loop.

## Transport

- Analytics events go through `gtag` when `VITE_GA_MEASUREMENT_ID` is configured.
- Error telemetry goes through Sentry when `VITE_SENTRY_DSN` is configured.
- Optional fallback error forwarding uses `VITE_ERROR_ENDPOINT`.

## Event Map

| Event | Trigger | Key properties |
| --- | --- | --- |
| `mvp_activation_completed` | Onboarding intake saved successfully | `goals_count`, `commitments_count`, `constraints_count`, `product_area` |
| `mvp_weekly_review_completed` | Weekly review inputs accepted and plan generation succeeds | `wins_count`, `unfinished_count`, `constraints_count`, `energy_level`, `product_area` |
| `mvp_weekly_plan_generated` | Weekly plan payload returns from the API | `priorities_count`, `actions_count`, `product_area` |
| `mvp_weekly_plan_confirmed` | Operator confirms the weekly plan | `plan_id`, `priorities_count`, `product_area` |
| `mvp_daily_checkin_completed` | Daily check-in saved successfully | `energy`, `focus`, `has_blockers`, `product_area` |
| `mvp_reflection_completed` | Daily or weekly reflection saved | `period`, `body_length`, `product_area` |
| `mvp_user_feedback_submitted` | Qualitative feedback submitted | `rating`, `message_length`, `product_area` |

## Error Capture

The MVP store reports action failures with `component=MvpWorkspace` and an `action` matching the failed operation:

- `hydrate_workspace`
- `save_onboarding`
- `run_weekly_review`
- `confirm_plan`
- `update_action_status`
- `save_daily_checkin`
- `add_reflection`
- `submit_feedback`

The global React error boundary also reports render failures with `component=ErrorBoundary` and `action=react_render_failure`.
