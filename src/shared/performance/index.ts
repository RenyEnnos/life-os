/**
 * Performance Monitoring with Web Vitals
 * Tracks Core Web Vitals and custom performance metrics
 */

import { onCLS, onFID, onFCP, onLCP, onTTFB, onINP, Metric } from 'web-vitals';

// Web Vitals thresholds based on Google's recommendations
const THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
};

type VitalName = 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB' | 'INP';

/**
 * Get rating based on metric value and thresholds
 */
function getRating(name: VitalName, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name];
  if (!threshold) return 'needs-improvement';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Send metrics to analytics
 */
function sendToAnalytics(metric: Metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
  });

  // Send to Google Analytics if available
  if (window.gtag) {
    window.gtag('event', 'web_vitals', {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.value),
      metric_name: metric.name,
      metric_rating: metric.rating,
      metric_delta: metric.delta,
      custom_parameter_1: metric.navigationType,
    });
  }

  // Send to your analytics endpoint (optional)
  if (import.meta.env.VITE_ANALYTICS_ENDPOINT) {
    navigator.sendBeacon(import.meta.env.VITE_ANALYTICS_ENDPOINT, body);
  }

  // Log in development
  if (import.meta.env.DEV) {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
    });
  }
}

/**
 * Initialize Web Vitals monitoring
 */
export function initializeWebVitals() {
  // Core Web Vitals
  onCLS(sendToAnalytics);
  onFID(sendToAnalytics);
  onFCP(sendToAnalytics);
  onLCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
  
  // INP is the new metric replacing FID (experimental)
  if ('onINP' in window) {
    onINP(sendToAnalytics);
  }
}

/**
 * Track custom performance marks
 */
export function markPerformance(name: string) {
  if ('performance' in window && 'mark' in performance) {
    performance.mark(name);
  }
}

/**
 * Measure between two marks
 */
export function measurePerformance(name: string, startMark: string, endMark: string) {
  if ('performance' in window && 'measure' in performance) {
    try {
      performance.measure(name, startMark, endMark);
      const entries = performance.getEntriesByName(name);
      const lastEntry = entries[entries.length - 1];
      
      if (lastEntry) {
        // Send to analytics
        if (window.gtag) {
          window.gtag('event', 'custom_performance', {
            event_category: 'Performance',
            event_label: name,
            value: Math.round(lastEntry.duration),
            metric_name: name,
          });
        }
        
        return lastEntry.duration;
      }
    } catch (e) {
      console.error('Performance measurement failed:', e);
    }
  }
  return null;
}

/**
 * Track resource loading times
 */
export function trackResourceLoading() {
  if ('performance' in window && 'getEntriesByType' in performance) {
    const resources = performance.getEntriesByType('resource');
    
    resources.forEach((resource) => {
      const res = resource as PerformanceResourceTiming;
      
      // Only track significant resources (scripts, styles, images > 100kb)
      if (res.transferSize > 100000) {
        const duration = res.responseEnd - res.startTime;
        
        if (window.gtag) {
          window.gtag('event', 'resource_load', {
            event_category: 'Performance',
            event_label: res.name,
            value: Math.round(duration),
            resource_type: res.initiatorType,
            resource_size: res.transferSize,
          });
        }
      }
    });
  }
}

/**
 * Get overall performance score
 */
export function getPerformanceScore(): number {
  if (!('performance' in window)) return 0;
  
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (!navigation) return 0;
  
  const loadTime = navigation.loadEventEnd - navigation.startTime;
  
  // Score based on load time (lower is better)
  // < 1s = 100, < 2s = 90, < 3s = 80, < 5s = 60, > 5s = 40
  if (loadTime < 1000) return 100;
  if (loadTime < 2000) return 90;
  if (loadTime < 3000) return 80;
  if (loadTime < 5000) return 60;
  return 40;
}

/**
 * Report performance metrics to console in a table format
 */
export function reportPerformanceMetrics() {
  if (import.meta.env.PROD) return;
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        const metrics = {
          'DNS Lookup': navigation.domainLookupEnd - navigation.domainLookupStart,
          'TCP Connection': navigation.connectEnd - navigation.connectStart,
          'Server Response': navigation.responseEnd - navigation.requestStart,
          'DOM Processing': navigation.domComplete - navigation.domLoading,
          'Total Load Time': navigation.loadEventEnd - navigation.startTime,
        };
        
        console.table(metrics);
      }
    }, 0);
  });
}
