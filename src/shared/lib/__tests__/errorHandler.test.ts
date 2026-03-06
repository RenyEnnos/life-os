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
  ErrorResult,
} from '../errorHandler'
import { ApiError } from '../../api/ApiError'

// Mock console methods
const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { })
const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

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
      expect(result.shouldRetry).toBe(false)
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

    it('should log 4xx errors as warnings', () => {
      const error = new ApiError('Bad request', 400)
      handleError('/api/test', error)

      expect(consoleWarnSpy).toHaveBeenCalled()
    })

    it('should log 5xx errors as errors', () => {
      const error = new ApiError('Internal server error', 500)
      handleError('/api/test', error)

      expect(consoleErrorSpy).toHaveBeenCalled()
    })
  })

  describe('createErrorHandler', () => {
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
      const result = {
        category: ErrorCategory.SERVER,
        severity: ErrorSeverity.HIGH,
      }
      expect(shouldReportError(result as ErrorResult)).toBe(true)
    })

    it('should return false for validation errors', () => {
      const result = {
        category: ErrorCategory.VALIDATION,
        severity: ErrorSeverity.LOW,
      }
      expect(shouldReportError(result as ErrorResult)).toBe(false)
    })
  })

  describe('shouldNotifyUser', () => {
    it('should return false for not found errors', () => {
      const result = {
        category: ErrorCategory.NOT_FOUND,
        severity: ErrorSeverity.LOW,
      }
      expect(shouldNotifyUser(result as ErrorResult)).toBe(false)
    })

    it('should return true for network errors', () => {
      const result = {
        category: ErrorCategory.NETWORK,
        severity: ErrorSeverity.MEDIUM,
      }
      expect(shouldNotifyUser(result as ErrorResult)).toBe(true)
    })
  })

  describe('getSuggestedAction', () => {
    it('should return suggestion for network errors', () => {
      const result = {
        category: ErrorCategory.NETWORK,
      }
      const action = getSuggestedAction(result as ErrorResult)
      expect(action).toContain('conexão')
    })
  })
})
