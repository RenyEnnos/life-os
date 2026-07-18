/**
 * Google Analytics 4 Integration
 * Provides tracking for user interactions and page views
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function initializeAnalytics(): void {
  // External analytics is intentionally disabled for the supported MVP modes.
}

/**
 * Track a page view
 * Call this when the route changes
 */
export function trackPageView(_path: string, _title?: string): void {
  // External analytics is intentionally disabled for the supported MVP modes.
}

/**
 * Track a custom event
 */
export function trackEvent(
  _eventName: string,
  _parameters?: Record<string, string | number | boolean>
): void {
  // External analytics is intentionally disabled for the supported MVP modes.
}

/**
 * Track user interactions
 */
export const AnalyticsEvents = {
  // Authentication
  LOGIN: 'login',
  LOGOUT: 'logout',
  REGISTER: 'sign_up',

  // Tasks
  TASK_CREATED: 'task_created',
  TASK_COMPLETED: 'task_completed',
  TASK_DELETED: 'task_deleted',

  // Habits
  HABIT_CREATED: 'habit_created',
  HABIT_COMPLETED: 'habit_completed',
  HABIT_STREAK: 'habit_streak_achieved',

  // Features
  FEATURE_USED: 'feature_used',
  WIDGET_INTERACTION: 'widget_interaction',

  // Gamification
  LEVEL_UP: 'level_up',
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',

  // AI
  AI_ASSISTANT_USED: 'ai_assistant_used',
  AI_SUGGESTION_CLICKED: 'ai_suggestion_clicked',

  // Settings
  SETTINGS_CHANGED: 'settings_changed',
  LANGUAGE_CHANGED: 'language_changed',
  THEME_CHANGED: 'theme_changed',

  // Performance
  APP_LOAD_TIME: 'app_load_time',
  ERROR_OCCURRED: 'error_occurred',
} as const;
