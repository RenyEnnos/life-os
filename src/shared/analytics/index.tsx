/**
 * Google Analytics 4 Integration
 * Provides tracking for user interactions and page views
 */

// GA4 Measurement ID - Replace with your actual ID
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, unknown> | undefined
    ) => void;
    dataLayer: unknown[];
  }
}

/**
 * Initialize Google Analytics
 * Call this in your App component
 */
export function initializeAnalytics(): void {
  if (!GA_MEASUREMENT_ID) {
    console.warn('GA_MEASUREMENT_ID not found. Analytics disabled.');
    return;
  }

  // Load GA4 script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args) {
    window.dataLayer.push(args);
  };
  window.gtag('js', new Date().toISOString());
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false, // We'll handle page views manually
    cookie_flags: 'SameSite=None;Secure',
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
}

/**
 * Track a page view
 * Call this when the route changes
 */
export function trackPageView(path: string, title?: string): void {
  if (!window.gtag || !GA_MEASUREMENT_ID) return;

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href,
  });
}

/**
 * Track a custom event
 */
export function trackEvent(
  eventName: string,
  parameters?: Record<string, string | number | boolean>
): void {
  if (!window.gtag || !GA_MEASUREMENT_ID) return;

  window.gtag('event', eventName, {
    ...parameters,
    timestamp: new Date().toISOString(),
  });
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

/**
 * Hook to track page views automatically
 * Use in your router component
 */
export function useAnalytics() {
  return {
    trackPageView,
    trackEvent,
    events: AnalyticsEvents,
  };
}

/**
 * Analytics context for React
 */
import { createContext, useContext, ReactNode } from 'react';

interface AnalyticsContextType {
  trackPageView: (path: string, title?: string) => void;
  trackEvent: (eventName: string, parameters?: Record<string, string | number | boolean>) => void;
  events: typeof AnalyticsEvents;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const value = {
    trackPageView,
    trackEvent,
    events: AnalyticsEvents,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalyticsContext() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalyticsContext must be used within AnalyticsProvider');
  }
  return context;
}
