import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, trackEvent, AnalyticsEvents } from './index';

interface PageTrackingOptions {
  trackTimeOnPage?: boolean;
  customProperties?: Record<string, string | number | boolean>;
}

/**
 * Hook to track detailed page metrics
 */
export function usePageTracking(options: PageTrackingOptions = {}) {
  const location = useLocation();
  const { trackTimeOnPage = true, customProperties } = options;

  useEffect(() => {
    const startTime = Date.now();
    
    // Track page view
    trackPageView(location.pathname, document.title);
    
    // Track custom event for feature usage
    trackEvent(AnalyticsEvents.FEATURE_USED, {
      feature: location.pathname,
      ...customProperties,
    });

    // Track time on page
    if (trackTimeOnPage) {
      return () => {
        const timeOnPage = Date.now() - startTime;
        trackEvent('time_on_page', {
          page: location.pathname,
          duration_ms: timeOnPage,
          duration_seconds: Math.round(timeOnPage / 1000),
        });
      };
    }
  }, [location.pathname, trackTimeOnPage, customProperties]);
}
