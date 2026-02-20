import type { Request, Response, NextFunction } from 'express'
import * as Sentry from '@sentry/node'

/**
 * Base application error class
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message)
    Object.setPrototypeOf(this, AppError.prototype)
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * Validation error (400)
 */
export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed') {
    super(400, message)
  }
}

/**
 * Authentication error (401)
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(401, message)
  }
}

/**
 * Authorization error (403)
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(403, message)
  }
}

/**
 * Not found error (404)
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(404, message)
  }
}

/**
 * Conflict error (409)
 */
export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(409, message)
  }
}

/**
 * Rate limit error (429)
 */
export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(429, message)
  }
}

/**
 * Internal server error (500)
 */
export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(500, message)
  }
}

/**
 * Service unavailable error (503)
 */
export class ServiceUnavailableError extends AppError {
  constructor(message: string = 'Service temporarily unavailable') {
    super(503, message)
  }
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
  const details = isDevelopment && error instanceof Error
    ? {
        message: error.message,
        stack: error.stack,
      }
    : undefined

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
