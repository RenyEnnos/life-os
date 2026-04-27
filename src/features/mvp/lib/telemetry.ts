import { AnalyticsEvents, trackEvent } from '@/shared/analytics';
import { captureError } from '@/shared/errors';

export const MvpTelemetryEvents = {
  ACTIVATION_COMPLETED: 'mvp_activation_completed',
  WEEKLY_REVIEW_COMPLETED: 'mvp_weekly_review_completed',
  WEEKLY_PLAN_GENERATED: 'mvp_weekly_plan_generated',
  WEEKLY_PLAN_CONFIRMED: 'mvp_weekly_plan_confirmed',
  DAILY_CHECKIN_COMPLETED: 'mvp_daily_checkin_completed',
  REFLECTION_COMPLETED: 'mvp_reflection_completed',
  USER_FEEDBACK_SUBMITTED: 'mvp_user_feedback_submitted',
} as const;

type MvpTelemetryEvent = (typeof MvpTelemetryEvents)[keyof typeof MvpTelemetryEvents];

export function trackMvpEvent(
  eventName: MvpTelemetryEvent,
  parameters?: Record<string, string | number | boolean>
): void {
  trackEvent(eventName, {
    product_area: 'mvp',
    ...parameters,
  });
}

export function captureMvpError(
  error: Error | unknown,
  action: string,
  metadata?: Record<string, unknown>
): void {
  captureError(error, {
    component: 'MvpWorkspace',
    action,
    metadata: {
      productArea: 'mvp',
      ...metadata,
    },
  });
}

export function trackMvpSurfaceViewed(surface: string): void {
  trackEvent(AnalyticsEvents.FEATURE_USED, {
    feature: `mvp:${surface}`,
    product_area: 'mvp',
  });
}
