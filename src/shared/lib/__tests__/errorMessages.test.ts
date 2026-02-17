/**
 * Tests for errorMessages.ts
 */

import { describe, it, expect } from 'vitest'
import {
  getErrorMessage,
  getHttpErrorMessage,
  getApiErrorMessage,
  getValidationErrorMessage,
  formatFieldError,
  isNetworkError,
  isValidationError,
  isAuthError,
  isNotFoundError,
  isServerError,
} from '../errorMessages'
import { ApiError } from '../../api/http'

describe('errorMessages', () => {
  describe('getErrorMessage', () => {
    it('should return message for known error code', () => {
      expect(getErrorMessage('VALIDATION_ERROR')).toBe('Os dados fornecidos são inválidos. Por favor, verifique e tente novamente.')
      expect(getErrorMessage('USER_EXISTS')).toBe('Este usuário já está cadastrado.')
      expect(getErrorMessage('TASK_NOT_FOUND')).toBe('Tarefa não encontrada.')
    })

    it('should return message for HTTP status code as string', () => {
      expect(getErrorMessage('404')).toBe('Recurso não encontrado.')
      expect(getErrorMessage('401')).toBe('Não autenticado. Faça login para continuar.')
      expect(getErrorMessage('500')).toBe('Erro interno do servidor. Tente novamente.')
    })

    it('should return default message for unknown error code', () => {
      expect(getErrorMessage('UNKNOWN_ERROR_CODE')).toBe('Erro desconhecido. Tente novamente.')
      expect(getErrorMessage('RANDOM_CODE')).toBe('Erro desconhecido. Tente novamente.')
    })
  })

  describe('getHttpErrorMessage', () => {
    it('should return message for known HTTP status codes', () => {
      expect(getHttpErrorMessage(400)).toBe('Requisição inválida. Verifique os dados enviados.')
      expect(getHttpErrorMessage(401)).toBe('Não autenticado. Faça login para continuar.')
      expect(getHttpErrorMessage(403)).toBe('Você não tem permissão para esta ação.')
      expect(getHttpErrorMessage(404)).toBe('Recurso não encontrado.')
      expect(getHttpErrorMessage(409)).toBe('Conflito de dados. O recurso já existe.')
      expect(getHttpErrorMessage(429)).toBe('Muitas requisições. Aguarde antes de tentar novamente.')
      expect(getHttpErrorMessage(500)).toBe('Erro interno do servidor. Tente novamente.')
      expect(getHttpErrorMessage(503)).toBe('Serviço temporariamente indisponível.')
    })

    it('should return generic message for unknown status codes', () => {
      expect(getHttpErrorMessage(418)).toBe('Erro 418. Tente novamente.')
      expect(getHttpErrorMessage(499)).toBe('Erro 499. Tente novamente.')
    })
  })

  describe('getApiErrorMessage', () => {
    it('should return validation details when available', () => {
      const error = new ApiError('Validation failed', 400, [
        { field: 'email', message: 'Invalid email format' },
      ])
      expect(getApiErrorMessage(error)).toBe('e-mail: Invalid email format')
    })

    it('should return multiple validation errors with count', () => {
      const error = new ApiError('Validation failed', 400, [
        { field: 'title', message: 'Title is required' },
        { field: 'content', message: 'Content is required' },
      ])
      expect(getApiErrorMessage(error)).toContain('título:')
      expect(getApiErrorMessage(error)).toContain('2 erros')
    })

    it('should return error message from code property', () => {
      const error = new Error('Some error') as Error & { code: string }
      error.code = 'USER_EXISTS'
      expect(getApiErrorMessage(error)).toBe('Este usuário já está cadastrado.')
    })

    it('should return HTTP status message for ApiError without code', () => {
      const error = new ApiError('Some error', 404)
      expect(getApiErrorMessage(error)).toBe('Recurso não encontrado.')
    })

    it('should return error message itself if user-friendly', () => {
      const error = new Error('Custom user-friendly error message')
      expect(getApiErrorMessage(error)).toBe('Custom user-friendly error message')
    })

    it('should return generic message for generic errors', () => {
      const error = new Error('Erro na requisição')
      expect(getApiErrorMessage(error)).toBe('Ocorreu um erro. Tente novamente.')
    })
  })

  describe('getValidationErrorMessage', () => {
    it('should return generic message for empty details', () => {
      expect(getValidationErrorMessage([])).toBe('Os dados fornecidos são inválidos.')
      expect(getValidationErrorMessage(undefined as unknown as [])).toBe('Os dados fornecidos são inválidos.')
    })

    it('should return single error message', () => {
      const details = [{ field: 'title', message: 'Title is required' }]
      expect(getValidationErrorMessage(details)).toBe('título: Title is required')
    })

    it('should return error without field', () => {
      const details = [{ message: 'Generic validation error' }]
      expect(getValidationErrorMessage(details)).toBe('Generic validation error')
    })

    it('should handle multiple errors', () => {
      const details = [
        { field: 'title', message: 'Title is required' },
        { field: 'content', message: 'Content is required' },
      ]
      const result = getValidationErrorMessage(details)
      expect(result).toContain('título:')
      expect(result).toContain('Title is required')
      expect(result).toContain('2 erros')
    })

    it('should use field name when no translation exists', () => {
      const details = [{ field: 'customField', message: 'Error' }]
      expect(getValidationErrorMessage(details)).toBe('customField: Error')
    })
  })

  describe('formatFieldError', () => {
    it('should format required field error', () => {
      expect(formatFieldError('title', 'REQUIRED')).toBe('O campo título é obrigatório')
      expect(formatFieldError('email', 'REQUIRED')).toBe('O campo e-mail é obrigatório')
    })

    it('should format too short error', () => {
      expect(formatFieldError('title', 'TOO_SHORT', { min: '5' }))
        .toBe('O campo título deve ter pelo menos 5 caracteres')
    })

    it('should format too long error', () => {
      expect(formatFieldError('description', 'TOO_LONG', { max: '500' }))
        .toBe('O campo descrição deve ter no máximo 500 caracteres')
    })

    it('should format invalid format error', () => {
      expect(formatFieldError('email', 'INVALID_FORMAT'))
        .toBe('O formato do campo e-mail é inválido')
    })

    it('should format min value error', () => {
      expect(formatFieldError('goal', 'MIN_VALUE', { min: '0' }))
        .toBe('O valor mínimo para meta é 0')
    })

    it('should format max value error', () => {
      expect(formatFieldError('value', 'MAX_VALUE', { max: '100' }))
        .toBe('O valor máximo para valor é 100')
    })

    it('should use field name when no translation exists', () => {
      expect(formatFieldError('customField', 'REQUIRED'))
        .toBe('O campo customField é obrigatório')
    })

    it('should use default template for unknown error type', () => {
      expect(formatFieldError('title', 'UNKNOWN_TYPE' as any))
        .toBe('O campo título é inválido')
    })
  })

  describe('isNetworkError', () => {
    it('should identify network errors', () => {
      expect(isNetworkError(new Error('Failed to fetch'))).toBe(true)
      expect(isNetworkError(new Error('NetworkError when fetching'))).toBe(true)
      expect(isNetworkError(new Error('Tempo de requisição excedido'))).toBe(true)
      expect(isNetworkError(new Error('Falha na conexão'))).toBe(true)
    })

    it('should return false for non-network errors', () => {
      expect(isNetworkError(new Error('Validation failed'))).toBe(false)
      expect(isNetworkError(new Error('User not found'))).toBe(false)
      expect(isNetworkError(new ApiError('Error', 404))).toBe(false)
    })
  })

  describe('isValidationError', () => {
    it('should identify validation errors from ApiError status', () => {
      expect(isValidationError(new ApiError('Error', 400))).toBe(true)
      expect(isValidationError(new ApiError('Error', 422))).toBe(true)
    })

    it('should identify validation errors from code', () => {
      const error1 = new Error('Error') as Error & { code: string }
      error1.code = 'VALIDATION_ERROR'
      expect(isValidationError(error1)).toBe(true)

      const error2 = new Error('Error') as Error & { code: string }
      error2.code = 'BAD_REQUEST'
      expect(isValidationError(error2)).toBe(true)
    })

    it('should identify validation errors from message', () => {
      expect(isValidationError(new Error('Dados inválidos'))).toBe(true)
      expect(isValidationError(new Error('Validation inválida failed'))).toBe(true)
    })

    it('should return false for non-validation errors', () => {
      expect(isValidationError(new ApiError('Error', 404))).toBe(false)
      expect(isValidationError(new ApiError('Error', 500))).toBe(false)
      expect(isValidationError(new Error('Some error'))).toBe(false)
    })
  })

  describe('isAuthError', () => {
    it('should identify auth errors from ApiError status', () => {
      expect(isAuthError(new ApiError('Error', 401))).toBe(true)
      expect(isAuthError(new ApiError('Error', 403))).toBe(true)
    })

    it('should identify auth errors from code', () => {
      const error1 = new Error('Error') as Error & { code: string }
      error1.code = 'AUTHENTICATION_ERROR'
      expect(isAuthError(error1)).toBe(true)

      const error2 = new Error('Error') as Error & { code: string }
      error2.code = 'AUTHORIZATION_ERROR'
      expect(isAuthError(error2)).toBe(true)
    })

    it('should return false for non-auth errors', () => {
      expect(isAuthError(new ApiError('Error', 404))).toBe(false)
      expect(isAuthError(new ApiError('Error', 500))).toBe(false)
      expect(isAuthError(new Error('Some error'))).toBe(false)
    })
  })

  describe('isNotFoundError', () => {
    it('should identify not found errors from ApiError status', () => {
      expect(isNotFoundError(new ApiError('Error', 404))).toBe(true)
    })

    it('should identify not found errors from code', () => {
      const error1 = new Error('Error') as Error & { code: string }
      error1.code = 'NOT_FOUND'
      expect(isNotFoundError(error1)).toBe(true)

      const error2 = new Error('Error') as Error & { code: string }
      error2.code = 'TASK_NOT_FOUND'
      expect(isNotFoundError(error2)).toBe(true)

      const error3 = new Error('Error') as Error & { code: string }
      error3.code = 'HABIT_NOT_FOUND'
      expect(isNotFoundError(error3)).toBe(true)
    })

    it('should return false for non-not found errors', () => {
      expect(isNotFoundError(new ApiError('Error', 400))).toBe(false)
      expect(isNotFoundError(new ApiError('Error', 500))).toBe(false)
      expect(isNotFoundError(new Error('Some error'))).toBe(false)
    })
  })

  describe('isServerError', () => {
    it('should identify server errors from ApiError status', () => {
      expect(isServerError(new ApiError('Error', 500))).toBe(true)
      expect(isServerError(new ApiError('Error', 503))).toBe(true)
      expect(isServerError(new ApiError('Error', 599))).toBe(true)
    })

    it('should identify server errors from code', () => {
      const error1 = new Error('Error') as Error & { code: string }
      error1.code = 'INTERNAL_ERROR'
      expect(isServerError(error1)).toBe(true)

      const error2 = new Error('Error') as Error & { code: string }
      error2.code = 'SERVER_ERROR'
      expect(isServerError(error2)).toBe(true)

      const error3 = new Error('Error') as Error & { code: string }
      error3.code = 'SERVICE_UNAVAILABLE'
      expect(isServerError(error3)).toBe(true)
    })

    it('should return false for non-server errors', () => {
      expect(isServerError(new ApiError('Error', 404))).toBe(false)
      expect(isServerError(new ApiError('Error', 400))).toBe(false)
      expect(isServerError(new Error('Some error'))).toBe(false)
    })
  })
})
