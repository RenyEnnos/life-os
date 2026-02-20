/**
 * Error Message Translation Utilities
 * Provides user-friendly Portuguese error messages based on error codes and HTTP status codes
 */

import { ApiError } from '../api/http'

/**
 * Error code to user-friendly message mapping (Portuguese)
 */
const ERROR_CODE_MESSAGES: Record<string, string> = {
  // Validation errors (400)
  VALIDATION_ERROR: 'Os dados fornecidos são inválidos. Por favor, verifique e tente novamente.',
  INVALID_CHAT_REQUEST: 'Dados de chat inválidos.',
  INVALID_TAGS_REQUEST: 'Dados de tags inválidos.',
  INVALID_SWOT_REQUEST: 'Dados de SWOT inválidos.',
  INVALID_PLAN_REQUEST: 'Dados de plano inválidos.',
  INVALID_SUMMARY_REQUEST: 'Dados de resumo inválidos.',
  INVALID_PARSE_REQUEST: 'Dados de análise inválidos.',
  BAD_REQUEST: 'Requisição inválida. Verifique os dados enviados.',

  // Authentication & Authorization errors (401, 403)
  AUTHENTICATION_ERROR: 'Não autenticado. Por favor, faça login para continuar.',
  AUTHORIZATION_ERROR: 'Você não tem permissão para realizar esta ação.',
  WRONG_PASSWORD: 'Senha incorreta.',
  ACCOUNT_LOCKED: 'Conta temporariamente bloqueada devido a muitas tentativas. Tente novamente mais tarde.',

  // Not found errors (404)
  NOT_FOUND: 'Recurso não encontrado.',
  USER_NOT_FOUND: 'Usuário não encontrado.',
  HABIT_NOT_FOUND: 'Hábito não encontrado.',
  TASK_NOT_FOUND: 'Tarefa não encontrada.',

  // Conflict errors (409)
  CONFLICT_ERROR: 'Conflito de dados. O recurso já existe ou está em uso.',
  USER_EXISTS: 'Este usuário já está cadastrado.',

  // Rate limit errors (429)
  RATE_LIMIT_ERROR: 'Muitas requisições. Por favor, aguarde um momento antes de tentar novamente.',

  // Business logic errors (422)
  BUSINESS_LOGIC_ERROR: 'Operação não permitida.',

  // Server errors (500, 503)
  INTERNAL_ERROR: 'Erro interno do servidor. Tente novamente.',
  SERVER_ERROR: 'Erro interno do servidor. Tente novamente.',
  SERVICE_UNAVAILABLE: 'Serviço temporariamente indisponível. Tente novamente.',

  // Specific API operation errors
  // Auth
  REGISTER_FAILED: 'Falha ao criar conta. Tente novamente.',

  // Journal
  FETCH_FAILED: 'Falha ao buscar entradas de diário.',
  CREATE_FAILED: 'Falha ao criar entrada.',
  UPDATE_FAILED: 'Falha ao atualizar entrada.',
  DELETE_FAILED: 'Falha ao excluir entrada.',

  // Tasks
  TASKS_FETCH_FAILED: 'Falha ao buscar tarefas.',
  TASKS_SUMMARY_FAILED: 'Falha ao buscar resumo de tarefas.',
  TASK_CREATE_FAILED: 'Falha ao criar tarefa.',
  TASK_UPDATE_FAILED: 'Falha ao atualizar tarefa.',
  TASK_DELETE_FAILED: 'Falha ao excluir tarefa.',

  // Habits
  HABITS_LIST_FAILED: 'Falha ao buscar hábitos.',
  HABIT_CREATE_FAILED: 'Falha ao criar hábito.',
  HABIT_UPDATE_FAILED: 'Falha ao atualizar hábito.',
  HABIT_DELETE_FAILED: 'Falha ao excluir hábito.',
  HABIT_LOGS_FETCH_FAILED: 'Falha ao buscar registros de hábito.',
  HABIT_LOG_FAILED: 'Falha ao registrar hábito.',

  // AI/Analysis
  CHAT_ERROR: 'Erro no chat. Tente novamente.',
  TAGS_ERROR: 'Erro ao gerar tags. Tente novamente.',
  SWOT_ERROR: 'Erro ao gerar análise SWOT. Tente novamente.',
  PLAN_ERROR: 'Erro ao criar plano. Tente novamente.',
  SUMMARY_ERROR: 'Erro ao gerar resumo. Tente novamente.',
  PARSE_TASK_ERROR: 'Erro ao analisar tarefa. Tente novamente.',
  LOGS_ERROR: 'Erro ao buscar logs. Tente novamente.',
}

/**
 * HTTP status code to generic message mapping (Portuguese)
 */
const HTTP_STATUS_MESSAGES: Record<number, string> = {
  400: 'Requisição inválida. Verifique os dados enviados.',
  401: 'Não autenticado. Faça login para continuar.',
  403: 'Você não tem permissão para esta ação.',
  404: 'Recurso não encontrado.',
  409: 'Conflito de dados. O recurso já existe.',
  422: 'Operação não permitida.',
  429: 'Muitas requisições. Aguarde antes de tentar novamente.',
  500: 'Erro interno do servidor. Tente novamente.',
  503: 'Serviço temporariamente indisponível.',
}

/**
 * Field name to Portuguese label mapping
 */
const FIELD_LABELS: Record<string, string> = {
  title: 'título',
  description: 'descrição',
  email: 'e-mail',
  password: 'senha',
  content: 'conteúdo',
  date: 'data',
  status: 'status',
  priority: 'prioridade',
  type: 'tipo',
  goal: 'meta',
  value: 'valor',
}

/**
 * Validation error type to message template
 */
const VALIDATION_ERROR_TEMPLATES: Record<string, string> = {
  REQUIRED: 'O campo {{field}} é obrigatório',
  TOO_SHORT: 'O campo {{field}} deve ter pelo menos {{min}} caracteres',
  TOO_LONG: 'O campo {{field}} deve ter no máximo {{max}} caracteres',
  INVALID: 'O valor do campo {{field}} é inválido',
  INVALID_FORMAT: 'O formato do campo {{field}} é inválido',
  INVALID_EMAIL: 'O e-mail fornecido é inválido',
  INVALID_DATE: 'A data fornecida é inválida',
  INVALID_NUMBER: 'O valor deve ser um número válido',
  MIN_VALUE: 'O valor mínimo para {{field}} é {{min}}',
  MAX_VALUE: 'O valor máximo para {{field}} é {{max}}',
}

/**
 * Get user-friendly error message from error code
 */
export function getErrorMessage(code: string): string {
  return ERROR_CODE_MESSAGES[code] || HTTP_STATUS_MESSAGES[parseInt(code)] || 'Erro desconhecido. Tente novamente.'
}

/**
 * Get user-friendly error message from HTTP status code
 */
export function getHttpErrorMessage(status: number): string {
  return HTTP_STATUS_MESSAGES[status] || `Erro ${status}. Tente novamente.`
}

/**
 * Get error message from ApiError instance
 */
export function getApiErrorMessage(error: ApiError | Error): string {
  if (error instanceof ApiError && error.details) {
    // If there are validation details, return those
    if (Array.isArray(error.details)) {
      return getValidationErrorMessage(error.details)
    }
  }

  // Check if error has a code property
  const errWithCode = error as { code?: string }
  if (errWithCode.code) {
    return getErrorMessage(errWithCode.code)
  }

  // Fall back to status code for ApiError
  if (error instanceof ApiError) {
    return getHttpErrorMessage(error.status)
  }

  // Return the error message itself if it exists and is user-friendly
  if (error.message && !error.message.includes('Erro na requisição')) {
    return error.message
  }

  return 'Ocorreu um erro. Tente novamente.'
}

/**
 * Get validation error message from error details
 */
export function getValidationErrorMessage(details: Array<{ field?: string; message: string }>): string {
  if (!details || details.length === 0) {
    return 'Os dados fornecidos são inválidos.'
  }

  // If there's only one error, return it
  if (details.length === 1) {
    const detail = details[0]
    if (detail.field) {
      const label = FIELD_LABELS[detail.field] || detail.field
      return `${label}: ${detail.message}`
    }
    return detail.message
  }

  // Multiple errors - return the first one with field info
  const firstError = details[0]
  if (firstError.field) {
    const label = FIELD_LABELS[firstError.field] || firstError.field
    return `${label}: ${firstError.message} (${details.length} erro${details.length > 1 ? 's' : ''})`
  }

  return firstError.message
}

/**
 * Format field validation error with template
 */
export function formatFieldError(
  field: string,
  type: keyof typeof VALIDATION_ERROR_TEMPLATES,
  params?: Record<string, unknown>
): string {
  const label = FIELD_LABELS[field] || field
  const template = VALIDATION_ERROR_TEMPLATES[type] || 'O campo {{field}} é inválido'

  let message = template.replace('{{field}}', label)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      message = message.replace(`{{${key}}}`, String(value))
    })
  }

  return message
}

/**
 * Check if error is a network/connection error
 */
export function isNetworkError(error: Error): boolean {
  const networkErrorMessages = [
    'Failed to fetch',
    'NetworkError',
    'Tempo de requisição excedido',
    'Falha na conexão',
  ]

  return networkErrorMessages.some(msg => error.message.includes(msg))
}

/**
 * Check if error is a validation error
 */
export function isValidationError(error: Error | ApiError): boolean {
  if (error instanceof ApiError) {
    return error.status === 400 || error.status === 422
  }

  const errWithCode = error as { code?: string }
  return errWithCode.code === 'VALIDATION_ERROR' ||
    errWithCode.code === 'BAD_REQUEST'
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: Error | ApiError): boolean {
  if (error instanceof ApiError) {
    return error.status === 401 || error.status === 403
  }

  const errWithCode = error as { code?: string }
  return errWithCode.code === 'AUTHENTICATION_ERROR' ||
    errWithCode.code === 'AUTHORIZATION_ERROR'
}

/**
 * Check if error is a not found error
 */
export function isNotFoundError(error: Error | ApiError): boolean {
  if (error instanceof ApiError) {
    return error.status === 404
  }

  const errWithCode = error as { code?: string }
  return Boolean(
    errWithCode.code === 'NOT_FOUND' ||
    (errWithCode.code && errWithCode.code.endsWith('_NOT_FOUND'))
  )
}

/**
 * Check if error is a server error (5xx)
 */
export function isServerError(error: Error | ApiError): boolean {
  if (error instanceof ApiError) {
    return error.status >= 500 && error.status < 600
  }

  const errWithCode = error as { code?: string }
  return errWithCode.code === 'INTERNAL_ERROR' ||
    errWithCode.code === 'SERVER_ERROR' ||
    errWithCode.code === 'SERVICE_UNAVAILABLE'
}
