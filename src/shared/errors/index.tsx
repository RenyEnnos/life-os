/**
 * Error Tracking and Handling
 * Enhanced error tracking with context and analytics integration
 */

import { AppError, type ErrorContext } from './AppError';
interface ErrorReport {
  name: string;
  code: string;
  timestamp: string;
  context: {
    component: string;
    action: string;
  };
}

const safeLabel = (value: unknown, fallback: string) =>
  typeof value === 'string' && /^[A-Za-z0-9_.:-]{1,64}$/.test(value) ? value : fallback;

export function captureError(error: Error | AppError | unknown, context?: ErrorContext) {
  const errorReport: ErrorReport = {
    name: safeLabel(error instanceof Error ? error.name : undefined, 'UnknownError'),
    code: safeLabel(error instanceof AppError ? error.code : undefined, 'UNCLASSIFIED'),
    timestamp: new Date().toISOString(),
    context: {
      component: safeLabel(context?.component, 'Unknown'),
      action: safeLabel(context?.action, 'Unknown'),
    },
  };

  if (import.meta.env.DEV) {
    console.error('[AppError]', JSON.stringify(errorReport));
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
      return <Component {...props} />;
    } catch (error) {
      captureError(error, context);
      throw error;
    }
  };
}
