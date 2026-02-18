/**
 * Tests for errorHandler.ts
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  handleError,
  handleFetchError,
  createErrorHandler,
  shouldReportError,
  shouldNotifyUser,
  getSuggestedAction,
  ErrorCategory,
  ErrorSeverity,
} from '../errorHandler'
import { ApiError } from '../../api/http'

// Mock console methods
const consoleWarnSpy = vi.spyOn(console, 'warn')
const consoleErrorSpy = vi.spyOn(console, 'error')

describe('errorHandler', () => {
  beforeEach(() => {
    consoleWarnSpy.mockClear()
    consoleErrorSpy.mockClear()
  })

  afterEach(() => {
    consoleWarnSpy.mockClear()
    consoleErrorSpy.mockClear()
  })

  describe('handleError', () => {
    it('should handle ApiError with 400 status', () => {
      const error = new ApiError('Bad request', 400)
      const result = handleError('/api/test', error)

      expect(result.category).toBe(ErrorCategory.VALIDATION)
      expect(result.severity).toBe(ErrorSeverity.LOW)
      expect(result.userMessage).toBeDefined()
      expect(result.shouldRetry).toBe(false)
      expect(result.originalError).toBe(error)
    })

    it('should handle ApiError with 401 status', () => {
      const error = new ApiError('Unauthorized', 401)
      const result = handleError('/api/test', error)

      expect(result.category).toBe(ErrorCategory.AUTH)
      expect(result.severity).toBe(ErrorSeverity.MEDIUM)
      expect(result.shouldRetry).toBe(false)
    })

    it('should handle ApiError with 404 status', () => {
      const error = new ApiError('Not found', 404)
      const result = handleError('/api/test', error)

      expect(result.category).toBe(ErrorCategory.NOT_FOUND)
      expect(result.severity).toBe(ErrorSeverity.LOW)
      expect(result.shouldRetry).toBe(false)
    })

    it('should handle ApiError with 429 status', () => {
      const error = new ApiError('Too many requests', 429)
      const result = handleError('/api/test', error)

      expect(result.category).toBe(ErrorCategory.VALIDATION)
      expect(result.shouldRetry).toBe(true)
    })

    it('should handle ApiError with 500 status', () => {
      const error = new ApiError('Internal server error', 500)
      const result = handleError('/api/test', error)

      expect(result.category).toBe(ErrorCategory.SERVER)
      expect(result.severity).toBe(ErrorSeverity.HIGH)
      expect(result.shouldRetry).toBe(true)
    })

    it('should handle network error', () => {
      const error = new Error('Failed to fetch')
      const result = handleError('/api/test', error)

      expect(result.category).toBe(ErrorCategory.NETWORK)
      expect(result.severity).toBe(ErrorSeverity.MEDIUM)
      expect(result.shouldRetry).toBe(true)
    })

    it('should handle timeout error', () => {
      const error = { name: 'AbortError', message: 'Aborted' }
      const result = handleError('/api/test', error)

      expect(result.category).toBe(ErrorCategory.NETWORK)
      expect(result.severity).toBe(ErrorSeverity.MEDIUM)
      expect(result.shouldRetry).toBe(true)
    })

    it('should handle generic error', () => {
      const error = new Error('Unknown error')
      const result = handleError('/api/test', error)

      expect(result.category).toBe(ErrorCategory.UNKNOWN)
      expect(result.severity).toBe(ErrorSeverity.MEDIUM)
    })

    it('should handle non-Error objects', () => {
      const error = 'string error'
      const result = handleError('/api/test', error)

      expect(result.originalError).toBeInstanceOf(Error)
      expect(result.originalError.message).toBe('string error')
    })

    it('should log 4xx errors as warnings', () => {
      const error = new ApiError('Bad request', 400)
      handleError('/api/test', error)

      expect(consoleWarnSpy).toHaveBeenCalled()
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    it('should log 5xx errors as errors', () => {
      const error = new ApiError('Internal server error', 500)
      handleError('/api/test', error)

      expect(consoleErrorSpy).toHaveBeenCalled()
    })
  })

  describe('handleFetchError', () => {
    it('should return ApiError unchanged', () => {
      const error = new ApiError('Bad request', 400)
      const result = handleFetchError('/api/test', error)

      expect(result).toBe(error)
    })

    it('should convert AbortError to timeout error', () => {
      const error = { name: 'AbortError', message: 'Aborted' }
      const result = handleFetchError('/api/test', error)

      expect(result).toBeInstanceOf(Error)
      expect(result.message).toBe('Tempo de requisição excedido')
    })

    it('should convert Failed to fetch to network error', () => {
      const error = new Error('Failed to fetch')
      const result = handleFetchError('/api/test', error)

      expect(result).toBeInstanceOf(Error)
      expect(result.message).toContain('Falha na conexão')
    })

    it('should handle generic errors', () => {
      const error = new Error('Some error')
      const result = handleFetchError('/api/test', error)

      expect(result).toBeInstanceOf(Error)
    })
  })

  describe('createErrorHandler', () => {
    it('should create context-specific error handler', () => {
      const handler = createErrorHandler('AuthService.login')
      const error = new Error('Login failed')

      const result = handler(error)

      expect(result.message).toBe('Login failed')
      expect(result.originalError).toBe(error)
    })

    it('should include context in logs', () => {
      const handler = createErrorHandler('UserService.createUser')
      const error = new ApiError('Bad request', 400)

      handler(error)

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('UserService.createUser'),
        expect.any(String),
        expect.any(String)
      )
    })
  })

  describe('shouldReportError', () => {
    it('should return true for server errors', () => {
      const result: any = {
        category: ErrorCategory.SERVER,
        severity: ErrorSeverity.HIGH,
        userMessage: 'test',
        message: 'test',
        shouldRetry: true,
        originalError: new Error(),
      }

      expect(shouldReportError(result)).toBe(true)
    })

    it('should return true for unknown errors', () => {
      const result: any = {
        category: ErrorCategory.UNKNOWN,
        severity: ErrorSeverity.MEDIUM,
        userMessage: 'test',
        message: 'test',
        shouldRetry: false,
        originalError: new Error(),
      }

      expect(shouldReportError(result)).toBe(true)
    })

    it('should return true for high severity errors', () => {
      const result: any = {
        category: ErrorCategory.NETWORK,
        severity: ErrorSeverity.HIGH,
        userMessage: 'test',
        message: 'test',
        shouldRetry: true,
        originalError: new Error(),
      }

      expect(shouldReportError(result)).toBe(true)
    })

    it('should return false for validation errors', () => {
      const result: any = {
        category: ErrorCategory.VALIDATION,
        severity: ErrorSeverity.LOW,
        userMessage: 'test',
        message: 'test',
        shouldRetry: false,
        originalError: new Error(),
      }

      expect(shouldReportError(result)).toBe(false)
    })

    it('should return false for auth errors', () => {
      const result: any = {
        category: ErrorCategory.AUTH,
        severity: ErrorSeverity.MEDIUM,
        userMessage: 'test',
        message: 'test',
        shouldRetry: false,
        originalError: new Error(),
      }

      expect(shouldReportError(result)).toBe(false)
    })

    it('should return false for not found errors', () => {
      const result: any = {
        category: ErrorCategory.NOT_FOUND,
        severity: ErrorSeverity.LOW,
        userMessage: 'test',
        message: 'test',
        shouldRetry: false,
        originalError: new Error(),
      }

      expect(shouldReportError(result)).toBe(false)
    })
  })

  describe('shouldNotifyUser', () => {
    it('should return false for not found errors', () => {
      const result: any = {
        category: ErrorCategory.NOT_FOUND,
        severity: ErrorSeverity.LOW,
        userMessage: 'test',
        message: 'test',
        shouldRetry: false,
        originalError: new Error(),
      }

      expect(shouldNotifyUser(result)).toBe(false)
    })

    it('should return false for low severity errors', () => {
      const result: any = {
        category: ErrorCategory.VALIDATION,
        severity: ErrorSeverity.LOW,
        userMessage: 'test',
        message: 'test',
        shouldRetry: false,
        originalError: new Error(),
      }

      expect(shouldNotifyUser(result)).toBe(false)
    })

    it('should return true for network errors', () => {
      const result: any = {
        category: ErrorCategory.NETWORK,
        severity: ErrorSeverity.MEDIUM,
        userMessage: 'test',
        message: 'test',
        shouldRetry: true,
        originalError: new Error(),
      }

      expect(shouldNotifyUser(result)).toBe(true)
    })

    it('should return true for auth errors', () => {
      const result: any = {
        category: ErrorCategory.AUTH,
        severity: ErrorSeverity.MEDIUM,
        userMessage: 'test',
        message: 'test',
        shouldRetry: false,
        originalError: new Error(),
      }

      expect(shouldNotifyUser(result)).toBe(true)
    })

    it('should return true for server errors', () => {
      const result: any = {
        category: ErrorCategory.SERVER,
        severity: ErrorSeverity.HIGH,
        userMessage: 'test',
        message: 'test',
        shouldRetry: true,
        originalError: new Error(),
      }

      expect(shouldNotifyUser(result)).toBe(true)
    })
  })

  describe('getSuggestedAction', () => {
    it('should return suggestion for network errors', () => {
      const result: any = {
        category: ErrorCategory.NETWORK,
        severity: ErrorSeverity.MEDIUM,
        userMessage: 'test',
        message: 'test',
        shouldRetry: true,
        originalError: new Error(),
      }

      const action = getSuggestedAction(result)
      expect(action).toContain('conexão')
    })

    it('should return suggestion for validation errors', () => {
      const result: any = {
        category: ErrorCategory.VALIDATION,
        severity: ErrorSeverity.LOW,
        userMessage: 'test',
        message: 'test',
        shouldRetry: false,
        originalError: new Error(),
      }

      const action = getSuggestedAction(result)
      expect(action).toContain('Verifique')
    })

    it('should return suggestion for auth errors', () => {
      const result: any = {
        category: ErrorCategory.AUTH,
        severity: ErrorSeverity.MEDIUM,
        userMessage: 'test',
        message: 'test',
        shouldRetry: false,
        originalError: new Error(),
      }

      const action = getSuggestedAction(result)
      expect(action).toContain('login')
    })

    it('should return suggestion for not found errors', () => {
      const result: any = {
        category: ErrorCategory.NOT_FOUND,
        severity: ErrorSeverity.LOW,
        userMessage: 'test',
        message: 'test',
        shouldRetry: false,
        originalError: new Error(),
      }

      const action = getSuggestedAction(result)
      expect(action).toContain('não foi encontrado')
    })

    it('should return suggestion for retryable server errors', () => {
      const result: any = {
        category: ErrorCategory.SERVER,
        severity: ErrorSeverity.HIGH,
        userMessage: 'test',
        message: 'test',
        shouldRetry: true,
        originalError: new Error(),
      }

      const action = getSuggestedAction(result)
      expect(action).toContain('Aguarde')
    })

    it('should return suggestion for non-retryable server errors', () => {
      const result: any = {
        category: ErrorCategory.SERVER,
        severity: ErrorSeverity.HIGH,
        userMessage: 'test',
        message: 'test',
        shouldRetry: false,
        originalError: new Error(),
      }

      const action = getSuggestedAction(result)
      expect(action).toContain('mais tarde')
    })

    it('should return default suggestion for unknown errors', () => {
      const result: any = {
        category: ErrorCategory.UNKNOWN,
        severity: ErrorSeverity.MEDIUM,
        userMessage: 'test',
        message: 'test',
        shouldRetry: false,
        originalError: new Error(),
      }

      const action = getSuggestedAction(result)
      expect(action).toContain('suporte')
    })
  })

  describe('integration with errorMessages', () => {
    it('should provide user-friendly message for validation error', () => {
      const error = new ApiError('Validation failed', 400, [
        { field: 'title', message: 'Title is required' },
      ])
      const result = handleError('/api/tasks', error)

      expect(result.userMessage).toBeDefined()
      expect(typeof result.userMessage).toBe('string')
    })

    it('should provide user-friendly message for auth error', () => {
      const error = new ApiError('Unauthorized', 401)
      const result = handleError('/api/login', error)

      expect(result.userMessage).toContain('autentic')
    })

    it('should provide user-friendly message for 404', () => {
      const error = new ApiError('Not found', 404)
      const result = handleError('/api/tasks/123', error)

      expect(result.userMessage).toContain('não encontrado')
    })

    it('should provide user-friendly message for 500', () => {
      const error = new ApiError('Internal error', 500)
      const result = handleError('/api/tasks', error)

      expect(result.userMessage).toContain('servidor')
    })
  })
})
