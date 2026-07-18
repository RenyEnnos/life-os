/**
 * Performance Monitoring with Web Vitals
 * Tracks Core Web Vitals and custom performance metrics
 */

import { onCLS, onFCP, onLCP, onTTFB, onINP, Metric } from 'web-vitals';


/**
 * Send metrics to analytics
 */
function sendToAnalytics(metric: Metric) {
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
  onFCP(sendToAnalytics);
  onLCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
  
  // INP is the new metric replacing FID
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
      void (resource as PerformanceResourceTiming);
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
          'DOM Processing': navigation.domComplete - navigation.domInteractive,
          'Total Load Time': navigation.loadEventEnd - navigation.startTime,
        };
        
        console.table(metrics);
      }
    }, 0);
  });
}
