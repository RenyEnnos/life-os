/**
 * Custom Error Classes
 * Domain-specific error types for better error handling and response formatting
 */

export interface ErrorDetails {
    field?: string;
    message: string;
}

/**
 * Base Application Error
 * All custom errors extend from this class
 */
export class AppError extends Error {
    statusCode: number;
    code: string;
    details?: ErrorDetails[];

    constructor(
        message: string,
        statusCode: number = 500,
        code: string = 'INTERNAL_ERROR',
        details?: ErrorDetails[]
    ) {
        super(message);
        this.name = 'AppError';
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;

        // Maintains proper stack trace for where our error was thrown
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AppError);
        }
    }
}

/**
 * Validation Error
 * Used when input validation fails (400 Bad Request)
 */
export class ValidationError extends AppError {
    constructor(message: string = 'Validation Failed', details?: ErrorDetails[]) {
        super(message, 400, 'VALIDATION_ERROR', details);
        this.name = 'ValidationError';
    }
}

/**
 * Not Found Error
 * Used when a requested resource doesn't exist (404 Not Found)
 */
export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found', resource?: string) {
        const details = resource ? [{ message: `${resource} not found` }] : undefined;
        super(message, 404, 'NOT_FOUND', details);
        this.name = 'NotFoundError';
    }
}

/**
 * Authentication Error
 * Used when authentication fails (401 Unauthorized)
 */
export class AuthenticationError extends AppError {
    constructor(message: string = 'Authentication failed') {
        super(message, 401, 'AUTHENTICATION_ERROR');
        this.name = 'AuthenticationError';
    }
}

/**
 * Authorization Error
 * Used when user lacks permission for an action (403 Forbidden)
 */
export class AuthorizationError extends AppError {
    constructor(message: string = 'Insufficient permissions') {
        super(message, 403, 'AUTHORIZATION_ERROR');
        this.name = 'AuthorizationError';
    }
}

/**
 * Conflict Error
 * Used when request conflicts with current state (409 Conflict)
 */
export class ConflictError extends AppError {
    constructor(message: string = 'Resource conflict', details?: ErrorDetails[]) {
        super(message, 409, 'CONFLICT_ERROR', details);
        this.name = 'ConflictError';
    }
}

/**
 * Rate Limit Error
 * Used when rate limit is exceeded (429 Too Many Requests)
 */
export class RateLimitError extends AppError {
    public retryAfter?: number;

    constructor(message: string = 'Rate limit exceeded', retryAfter?: number) {
        super(message, 429, 'RATE_LIMIT_ERROR');
        this.name = 'RateLimitError';
        this.retryAfter = retryAfter;
    }
}

/**
 * Business Logic Error
 * Used for business rule violations (422 Unprocessable Entity)
 */
export class BusinessLogicError extends AppError {
    constructor(message: string, details?: ErrorDetails[]) {
        super(message, 422, 'BUSINESS_LOGIC_ERROR', details);
        this.name = 'BusinessLogicError';
    }
}

/**
 * Service Unavailable Error
 * Used when a service is temporarily unavailable (503 Service Unavailable)
 */
export class ServiceUnavailableError extends AppError {
    constructor(message: string = 'Service temporarily unavailable') {
        super(message, 503, 'SERVICE_UNAVAILABLE');
        this.name = 'ServiceUnavailableError';
    }
}
