/**
 * Error Tracking and Handling
 * Enhanced error tracking with context and analytics integration
 */

import { trackEvent, AnalyticsEvents } from '@/shared/analytics';

interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

interface ErrorReport {
  message: string;
  stack?: string;
  name: string;
  timestamp: string;
  url: string;
  userAgent: string;
  context: ErrorContext;
}

/**
 * Custom error class with context
 */
export class AppError extends Error {
  context: ErrorContext;
  code?: string;

  constructor(
    message: string,
    context: ErrorContext = {},
    code?: string
  ) {
    super(message);
    this.name = 'AppError';
    this.context = context;
    this.code = code;

    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

/**
 * Capture and report an error
 */
export function captureError(error: Error | AppError | unknown, context?: ErrorContext) {
  const errorReport: ErrorReport = {
    message: error instanceof Error ? error.message : String(error),
    name: error instanceof Error ? error.name : 'UnknownError',
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    context: {
      component: context?.component || 'Unknown',
      action: context?.action || 'Unknown',
      userId: context?.userId,
      metadata: context?.metadata || {},
    },
  };

  // Send to analytics
  trackEvent(AnalyticsEvents.ERROR_OCCURRED, {
    error_name: errorReport.name,
    error_message: errorReport.message,
    component: errorReport.context.component,
    action: errorReport.context.action,
  });

  // Send to error tracking service (Sentry or similar)
  if (import.meta.env.VITE_SENTRY_DSN && window.Sentry) {
    const sentryError = error instanceof Error ? error : new Error(String(error));
    window.Sentry.withScope((scope) => {
      scope.setTag('component', errorReport.context.component || 'unknown');
      scope.setTag('action', errorReport.context.action || 'unknown');
      scope.setContext('app', errorReport.context.metadata);
      window.Sentry.captureException(sentryError);
    });
  }

  // Send to custom endpoint if configured
  if (import.meta.env.VITE_ERROR_ENDPOINT) {
    fetch(import.meta.env.VITE_ERROR_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorReport),
      keepalive: true,
    }).catch(() => {
      // Fail silently
    });
  }

  // Log in development
  if (import.meta.env.DEV) {
    console.error('[Error Captured]', errorReport);
  }

  return errorReport;
}

/**
 * Initialize global error handlers
 */
export function initializeErrorTracking() {
  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    captureError(event.error, {
      component: 'Global',
      action: 'uncaught_error',
    });
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    captureError(event.reason, {
      component: 'Global',
      action: 'unhandled_promise_rejection',
    });
  });

  // Handle React errors (needs to be used with Error Boundary)
  if (window.React) {
    const originalConsoleError = console.error;
    console.error = (...args: unknown[]) => {
      // Check if it's a React error
      const error = args.find(arg => arg instanceof Error);
      if (error) {
        captureError(error, {
          component: 'React',
          action: 'react_error',
        });
      }
      originalConsoleError.apply(console, args);
    };
  }
}

/**
 * Create a safe wrapper for async functions
 */
export function safeAsync<T>(
  fn: () => Promise<T>,
  context: ErrorContext
): Promise<T | undefined> {
  return fn().catch((error) => {
    captureError(error, context);
    return undefined;
  });
}

/**
 * Higher-order function to wrap components with error tracking
 */
export function withErrorTracking<P extends object>(
  Component: React.ComponentType<P>,
  context: ErrorContext
): React.FC<P> {
  return function WrappedComponent(props: P) {
    try {
      return Component(props);
    } catch (error) {
      captureError(error, context);
      throw error;
    }
  };
}

// TypeScript declaration for Sentry
declare global {
  interface Window {
    Sentry: {
      withScope: (callback: (scope: {
        setTag: (key: string, value: string) => void;
        setContext: (key: string, value: Record<string, unknown>) => void;
      }) => void) => void;
      captureException: (error: Error) => void;
    };
  }
}
