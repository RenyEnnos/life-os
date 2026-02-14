/**
 * Google Analytics 4 Integration
 * Provides tracking for user interactions and page views
 */

import { createContext, useContext, ReactNode } from 'react';
import { trackPageView, trackEvent, AnalyticsEvents } from './events';

export { initializeAnalytics, trackPageView, trackEvent, AnalyticsEvents } from './events';

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
