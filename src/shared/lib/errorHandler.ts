/**
 * Centralized Error Handler
 * Provides consistent error handling, logging, and transformation across the application
 */

import { ApiError } from '../api/http'
import {
  getApiErrorMessage,
  isNetworkError,
  isValidationError,
  isAuthError,
  isNotFoundError,
  isServerError,
} from './errorMessages'

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Error categories for better handling
 */
export enum ErrorCategory {
  NETWORK = 'network',
  VALIDATION = 'validation',
  AUTH = 'auth',
  NOT_FOUND = 'not_found',
  SERVER = 'server',
  UNKNOWN = 'unknown',
}

/**
 * Standardized error result
 */
export interface ErrorResult {
  message: string
  category: ErrorCategory
  severity: ErrorSeverity
  userMessage: string
  shouldRetry: boolean
  originalError: Error | ApiError
}

/**
 * Parse error and determine its category
 */
function categorizeError(error: Error | ApiError): ErrorCategory {
  // Check for abort/timeout errors first
  const errWithName = error as { name?: string }
  if (errWithName?.name === 'AbortError') {
    return ErrorCategory.NETWORK
  }

  if (isNetworkError(error)) {
    return ErrorCategory.NETWORK
  }
  if (isValidationError(error)) {
    return ErrorCategory.VALIDATION
  }
  if (isAuthError(error)) {
    return ErrorCategory.AUTH
  }
  if (isNotFoundError(error)) {
    return ErrorCategory.NOT_FOUND
  }
  if (isServerError(error)) {
    return ErrorCategory.SERVER
  }

  // Check for rate limit (429)
  if (error instanceof ApiError && error.status === 429) {
    return ErrorCategory.VALIDATION
  }

  return ErrorCategory.UNKNOWN
}

/**
 * Determine error severity based on category and status code
 */
function determineSeverity(error: Error | ApiError, category: ErrorCategory): ErrorSeverity {
  if (error instanceof ApiError) {
    if (error.status >= 500) {
      return ErrorSeverity.HIGH
    }
    if (error.status === 401 || error.status === 403) {
      return ErrorSeverity.MEDIUM
    }
    if (error.status === 404) {
      return ErrorSeverity.LOW
    }
    if (error.status >= 400 && error.status < 500) {
      return ErrorSeverity.LOW
    }
  }

  if (category === ErrorCategory.NETWORK) {
    return ErrorSeverity.MEDIUM
  }

  return ErrorSeverity.MEDIUM
}

/**
 * Determine if error is retryable
 */
function isRetryable(error: Error | ApiError, category: ErrorCategory): boolean {
  if (category === ErrorCategory.NETWORK) {
    return true
  }

  if (error instanceof ApiError) {
    // Retry on server errors (5xx) and rate limit (429)
    return error.status >= 500 || error.status === 429 || error.status === 408
  }

  return false
}

/**
 * Log error based on severity and category
 */
function logError(url: string, error: Error | ApiError, category: ErrorCategory, severity: ErrorSeverity): void {
  const context = `[ErrorHandler] ${category.toUpperCase()} on ${url}`

  if (error instanceof ApiError) {
    // Log 4xx as warnings to avoid console noise
    if (error.status < 500 && error.status >= 400) {
      console.warn(`${context}:`, error.message, error.details || '')
    } else {
      console.error(`${context}:`, error.message, error.status, error.details || '')
    }
  } else {
    // Non-API errors
    if (severity === ErrorSeverity.LOW) {
      console.warn(`${context}:`, error.message)
    } else if (severity === ErrorSeverity.MEDIUM) {
      console.warn(`${context}:`, error.message)
    } else {
      console.error(`${context}:`, error)
    }
  }
}

/**
 * Handle and transform errors consistently
 *
 * @param url - The URL or context where the error occurred
 * @param error - The error to handle
 * @returns ErrorResult with standardized information
 */
export function handleError(url: string, error: unknown): ErrorResult {
  // Ensure we have an Error object
  let normalizedError: Error | ApiError

  if (error instanceof Error) {
    normalizedError = error
  } else {
    // For plain objects with name property (like AbortError), create an Error with that name
    const errObj = error as { name?: string; message?: string }
    const message = errObj?.message || String(error)
    const newError = new Error(message)
    if (errObj?.name) {
      newError.name = errObj.name
    }
    normalizedError = newError
  }

  const category = categorizeError(normalizedError)
  const severity = determineSeverity(normalizedError, category)
  const userMessage = getApiErrorMessage(normalizedError)
  const shouldRetry = isRetryable(normalizedError, category)

  // Log the error
  logError(url, normalizedError, category, severity)

  return {
    message: normalizedError.message,
    category,
    severity,
    userMessage,
    shouldRetry,
    originalError: normalizedError,
  }
}

/**
 * Handle API fetch errors specifically
 * Converts various error types into ApiError or standardized Error
 *
 * @param url - The URL that was being fetched
 * @param error - The error that occurred
 * @returns ApiError or standardized Error
 */
export function handleFetchError(url: string, error: unknown): Error {
  // Already an ApiError, just log and return
  if (error instanceof ApiError) {
    const result = handleError(url, error)
    // Re-throw the original ApiError
    return error
  }

  // Handle AbortError (timeout)
  const errObj = error as { name?: string; message?: string }
  if (errObj?.name === 'AbortError') {
    const timeoutError = new Error('Tempo de requisição excedido')
    return handleError(url, timeoutError).originalError
  }

  // Handle network errors
  if (errObj?.message?.includes('Failed to fetch')) {
    const networkError = new Error(
      'Falha na conexão com o servidor. Verifique se o backend está rodando.'
    )
    return handleError(url, networkError).originalError
  }

  // Generic error
  return handleError(url, error).originalError
}

/**
 * Create an error handler for a specific context (e.g., a specific API endpoint)
 *
 * @param context - The context name for logging
 * @returns Function that handles errors for that context
 */
export function createErrorHandler(context: string) {
  return (error: unknown): ErrorResult => {
    return handleError(context, error)
  }
}

/**
 * Check if error should be reported to an error tracking service
 * (e.g., Sentry, LogRocket)
 *
 * @param result - The error result to check
 * @returns true if error should be reported
 */
export function shouldReportError(result: ErrorResult): boolean {
  // Only report server errors and unexpected errors
  return (
    result.category === ErrorCategory.SERVER ||
    result.category === ErrorCategory.UNKNOWN ||
    result.severity === ErrorSeverity.HIGH ||
    result.severity === ErrorSeverity.CRITICAL
  )
}

/**
 * Check if error should trigger a user notification (toast, etc.)
 *
 * @param result - The error result to check
 * @returns true if user should be notified
 */
export function shouldNotifyUser(result: ErrorResult): boolean {
  // Don't notify for 404s (already handled by UI) or low severity
  if (result.category === ErrorCategory.NOT_FOUND) {
    return false
  }

  // Notify for everything except low severity
  return result.severity !== ErrorSeverity.LOW
}

/**
 * Get a user-friendly action suggestion based on error category
 *
 * @param result - The error result
 * @returns Suggested action message or null
 */
export function getSuggestedAction(result: ErrorResult): string | null {
  switch (result.category) {
    case ErrorCategory.NETWORK:
      return 'Verifique sua conexão com a internet e tente novamente.'
    case ErrorCategory.VALIDATION:
      return 'Verifique os dados informados e tente novamente.'
    case ErrorCategory.AUTH:
      return 'Faça login novamente para continuar.'
    case ErrorCategory.NOT_FOUND:
      return 'O recurso solicitado não foi encontrado.'
    case ErrorCategory.SERVER:
      return result.shouldRetry
        ? 'Aguarde um momento e tente novamente.'
        : 'Ocorreu um erro no servidor. Tente novamente mais tarde.'
    default:
      return 'Tente novamente. Se o problema persistir, entre em contato com o suporte.'
  }
}
