import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from './index';

/**
 * Component that automatically tracks page views on route changes
 * Include this in your App component
 */
export function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname, document.title);
  }, [location.pathname, location.search]);

  return null;
}
