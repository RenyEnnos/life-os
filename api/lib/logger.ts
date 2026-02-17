/**
 * Structured Logger with Request ID Tracking
 * Provides centralized logging with request context, user information, and structured output
 */
import pino from 'pino'
import type { Request } from 'express'
import type { AuthRequest } from '../middleware/auth'
import { randomUUID } from 'crypto'

// Log levels matching pino
export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'

// Request context interface
export interface RequestContext {
  requestId: string
  userId?: string
  email?: string
  ip?: string
  userAgent?: string
  method?: string
  path?: string
  [key: string]: unknown
}

// Logger metadata interface
export interface LogMetadata {
  [key: string]: unknown
}

// Base pino logger configuration
const isProduction = process.env.NODE_ENV === 'production'
const isTest = process.env.NODE_ENV === 'test'

const baseLogger = pino({
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  // Redact sensitive data
  redact: ['req.headers.authorization', 'req.headers.cookie', 'req.body.password', 'req.body.password_hash'],
  serializers: {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
    err: pino.stdSerializers.err
  }
})

/**
 * Generate or retrieve request ID from headers
 * Uses X-Request-ID header or generates a new UUID
 */
export function getRequestId(req?: Request): string {
  if (!req) return randomUUID()

  const requestIdHeader = req.headers['x-request-id'] as string
  if (requestIdHeader) return requestIdHeader

  return randomUUID()
}

/**
 * Extract context from Express Request
 * Includes user info (if authenticated), IP, user agent, method, and path
 */
export function extractRequestContext(req: Request | AuthRequest): RequestContext {
  const requestId = getRequestId(req)

  // Extract user information if available (from AuthRequest)
  const userId = (req as AuthRequest).user?.id
  const email = (req as AuthRequest).user?.email

  // Extract client info
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || req.socket.remoteAddress || 'unknown'
  const userAgent = req.headers['user-agent'] || 'unknown'
  const method = req.method
  const path = req.path

  return {
    requestId,
    userId,
    email,
    ip,
    userAgent,
    method,
    path
  }
}

/**
 * Main Logger Class
 * Provides structured logging with request context tracking
 */
class StructuredLogger {
  private logger: pino.Logger

  constructor() {
    this.logger = baseLogger
  }

  /**
   * Create a child logger with request context
   * All logs from this child will include the request context
   */
  withRequest(req: Request | AuthRequest): pino.Logger {
    const context = extractRequestContext(req)
    return this.logger.child(context)
  }

  /**
   * Create a child logger with custom context
   */
  withContext(context: Record<string, unknown>): pino.Logger {
    return this.logger.child(context)
  }

  /**
   * Log info message with optional metadata
   */
  info(message: string, metadata?: LogMetadata): void
  info(req: Request | AuthRequest, message: string, metadata?: LogMetadata): void
  info(first: string | Request | AuthRequest, second?: string | LogMetadata, third?: LogMetadata): void {
    if (typeof first === 'string') {
      this.logger.info({ meta: second as LogMetadata | undefined }, first)
    } else {
      const logger = this.withRequest(first)
      const message = second as string
      logger.info({ meta: third }, message)
    }
  }

  /**
   * Log warning message with optional metadata
   */
  warn(message: string, metadata?: LogMetadata): void
  warn(req: Request | AuthRequest, message: string, metadata?: LogMetadata): void
  warn(first: string | Request | AuthRequest, second?: string | LogMetadata, third?: LogMetadata): void {
    if (typeof first === 'string') {
      this.logger.warn({ meta: second as LogMetadata | undefined }, first)
    } else {
      const logger = this.withRequest(first)
      const message = second as string
      logger.warn({ meta: third }, message)
    }
  }

  /**
   * Log error message with optional metadata
   * Automatically captures error stack trace if Error object is provided
   */
  error(message: string, error?: Error | unknown, metadata?: LogMetadata): void
  error(req: Request | AuthRequest, message: string, error?: Error | unknown, metadata?: LogMetadata): void
  error(
    first: string | Request | AuthRequest,
    second?: string | Error | LogMetadata,
    third?: Error | LogMetadata,
    fourth?: LogMetadata
  ): void {
    if (typeof first === 'string') {
      const message = first
      const err = second instanceof Error ? second : undefined
      const meta = (second instanceof Error ? third : second) as LogMetadata | undefined
      this.logger.error({ err, meta }, message)
    } else {
      const logger = this.withRequest(first)
      const message = second as string
      const err = third instanceof Error ? third : undefined
      const meta = (third instanceof Error ? fourth : third) as LogMetadata | undefined
      logger.error({ err, meta }, message)
    }
  }

  /**
   * Log debug message with optional metadata
   * Only logs in non-production environments
   */
  debug(message: string, metadata?: LogMetadata): void
  debug(req: Request | AuthRequest, message: string, metadata?: LogMetadata): void
  debug(first: string | Request | AuthRequest, second?: string | LogMetadata, third?: LogMetadata): void {
    if (isProduction) return // Skip debug logs in production

    if (typeof first === 'string') {
      this.logger.debug({ meta: second as LogMetadata | undefined }, first)
    } else {
      const logger = this.withRequest(first)
      const message = second as string
      logger.debug({ meta: third }, message)
    }
  }

  /**
   * Log HTTP request details
   */
  logHttpRequest(req: Request | AuthRequest, statusCode: number, responseTime?: number): void {
    const context = extractRequestContext(req)
    const logger = this.withRequest(req)

    const meta: LogMetadata = {
      statusCode,
      responseTime
    }

    if (statusCode >= 500) {
      logger.error({ meta }, 'HTTP request completed with server error')
    } else if (statusCode >= 400) {
      logger.warn({ meta }, 'HTTP request completed with client error')
    } else {
      logger.info({ meta }, 'HTTP request completed successfully')
    }
  }

  /**
   * Log authentication event
   */
  logAuth(
    req: Request | AuthRequest,
    email: string,
    status: 'success' | 'fail',
    metadata?: { code?: string; reason?: string; [key: string]: unknown }
  ): void {
    const logger = this.withRequest(req)
    const level = status === 'success' ? 'info' : 'warn'

    logger[level]({
      meta: {
        email,
        authStatus: status,
        ...metadata
      }
    }, `Authentication ${status}`)
  }

  /**
   * Log database operation
   */
  logDbOperation(
    req: Request | AuthRequest | undefined,
    table: string,
    action: 'insert' | 'update' | 'delete' | 'select',
    metadata?: LogMetadata
  ): void {
    if (req) {
      const logger = this.withRequest(req)
      logger.debug({ meta: { table, action, ...metadata } }, `Database ${action} on ${table}`)
    } else {
      this.logger.debug({ meta: { table, action, ...metadata } }, `Database ${action} on ${table}`)
    }
  }

  /**
   * Log validation error
   */
  logValidationError(req: Request | AuthRequest, errors: Array<{ field?: string; message: string }>): void {
    const logger = this.withRequest(req)
    logger.warn({ meta: { validationErrors: errors } }, 'Validation failed')
  }

  /**
   * Log business logic error
   */
  logBusinessError(req: Request | AuthRequest, message: string, metadata?: LogMetadata): void {
    const logger = this.withRequest(req)
    logger.warn({ meta: metadata }, message)
  }

  /**
   * Get the underlying pino logger instance
   */
  getRawLogger(): pino.Logger {
    return this.logger
  }
}

// Create and export singleton instance
const structuredLogger = new StructuredLogger()

// Export both the class (for creating instances) and the default instance
export { StructuredLogger }
export default structuredLogger
