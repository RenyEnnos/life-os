import { ErrorSeverity, ErrorCategory } from '../lib/errorHandler';

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Custom error class with context, category, and severity
 */
export class AppError extends Error {
  context: ErrorContext;
  code?: string;
  category: ErrorCategory;
  severity: ErrorSeverity;

  constructor(
    message: string,
    options: {
      context?: ErrorContext;
      code?: string;
      category?: ErrorCategory;
      severity?: ErrorSeverity;
    } = {}
  ) {
    super(message);
    this.name = 'AppError';
    this.context = options.context || {};
    this.code = options.code;
    this.category = options.category || ErrorCategory.UNKNOWN;
    this.severity = options.severity || ErrorSeverity.MEDIUM;

    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}
