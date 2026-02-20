import type { Request, Response, NextFunction } from 'express'
import * as Sentry from '@sentry/node'
import {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  InternalServerError,
  ServiceUnavailableError,
} from '../lib/errorClasses'

// Re-export error classes for backward compatibility if needed, though direct import from lib is preferred
export {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  InternalServerError,
  ServiceUnavailableError,
}

/**
 * Type guard to check if error is an AppError
 */
function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

/**
 * Type guard to check if error has a status code
 */
function hasStatusCode(error: unknown): error is { statusCode: number } {
  return typeof error === 'object' && error !== null && 'statusCode' in error
}

/**
 * Get appropriate HTTP status code from error
 */
function getStatusCode(error: unknown): number {
  if (isAppError(error)) {
    return error.statusCode
  }
  if (hasStatusCode(error)) {
    return error.statusCode
  }

  // Handle specific error messages
  if (error instanceof Error) {
    if (error.message === 'CORS_NOT_ALLOWED' || error.message === 'Not allowed by CORS') {
      return 403
    }
  }

  // Default to 500 for unknown errors
  return 500
}

/**
 * Get user-friendly error message
 */
function getUserFriendlyMessage(error: unknown, statusCode: number): string {
  if (error instanceof Error) {
    // For operational errors, return the message
    if (isAppError(error) && error.isOperational) {
      return error.message
    }

    // For known error messages, return them
    if (error.message === 'CORS_NOT_ALLOWED') {
      return 'CORS origin not allowed'
    }
    if (error.message === 'Not allowed by CORS') {
      return 'CORS origin not allowed'
    }
  }

  // Default messages based on status code
  const defaultMessages: Record<number, string> = {
    400: 'Invalid request',
    401: 'Authentication required',
    402: 'Payment required',
    403: 'Access forbidden',
    404: 'Resource not found',
    409: 'Resource conflict',
    429: 'Too many requests',
    500: 'Internal server error',
    502: 'Bad gateway',
    503: 'Service unavailable',
    504: 'Gateway timeout',
  }

  return defaultMessages[statusCode] || 'An unexpected error occurred'
}

/**
 * Log error with appropriate level based on status code
 */
function logError(error: unknown, statusCode: number, req: Request): void {
  const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'

  if (isDevelopment) {
    // Detailed logging in development
    if (error instanceof Error) {
      console.error('Error:', {
        message: error.message,
        stack: error.stack,
        statusCode,
        path: req.path,
        method: req.method,
      })
    } else {
      console.error('Error:', {
        error,
        statusCode,
        path: req.path,
        method: req.method,
      })
    }
  } else {
    // Minimal logging in production
    const logLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info'
    const message = error instanceof Error ? error.message : String(error)

    if (logLevel === 'error') {
      console.error(`${logLevel.toUpperCase()}: ${message} - ${req.method} ${req.path}`)
    } else {
      console.warn(`${logLevel.toUpperCase()}: ${message} - ${req.method} ${req.path}`)
    }
  }
}

/**
 * Send error response
 */
function sendErrorResponse(res: Response, statusCode: number, message: string, details?: unknown): void {
  const response: {
    success: false
    error: string
    details?: unknown
  } = {
    success: false,
    error: message,
  }

  // Include details in development or for operational errors
  const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
  if (isDevelopment || details) {
    response.details = details
  }

  res.status(statusCode).json(response)
}

/**
 * Centralized error handler middleware
 */
export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  // Get status code
  const statusCode = getStatusCode(error)

  // Get user-friendly message
  const userMessage = getUserFriendlyMessage(error, statusCode)

  // Log error
  logError(error, statusCode, req)

  // Send to Sentry in production
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error instanceof Error ? error : new Error(String(error)))
  }

  // Prepare response details for development
  const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
  let details: unknown = undefined

  if (isAppError(error) && error.details) {
    details = error.details
  } else if (isDevelopment && error instanceof Error) {
    details = {
      message: error.message,
      stack: error.stack,
    }
  }

  // Send error response
  sendErrorResponse(res, statusCode, userMessage, details)
}

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

/**
 * Not found handler for undefined routes
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.path} not found`,
  })
}
