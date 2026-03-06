/**
 * Error Message Translation Utilities
 * Provides user-friendly Portuguese error messages based on error codes and HTTP status codes
 */

import { ApiError } from '../api/http'
import { HttpStatus } from '../constants/httpStatus'

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

export function getErrorMessage(code: string): string {
  const numericCode = Number(code)
  return ERROR_CODE_MESSAGES[code] || HTTP_STATUS_MESSAGES[numericCode] || 'Erro desconhecido. Tente novamente.'
}

export function getHttpErrorMessage(status: number): string {
  return HTTP_STATUS_MESSAGES[status] || `Erro ${status}. Tente novamente.`
}

export function getApiErrorMessage(error: ApiError | Error): string {
  if (error instanceof ApiError && Array.isArray(error.details)) {
    return getValidationErrorMessage(error.details)
  }

  const errWithCode = error as { code?: string }
  if (errWithCode.code) {
    return getErrorMessage(errWithCode.code)
  }

  if (error instanceof ApiError) {
    return getHttpErrorMessage(error.status)
  }

  if (error.message && !error.message.includes('Erro na requisição')) {
    return error.message
  }

  return 'Ocorreu um erro. Tente novamente.'
}

export function getValidationErrorMessage(details: Array<{ field?: string; message: string }>): string {
  if (!details || details.length === 0) {
    return 'Os dados fornecidos são inválidos.'
  }

  if (details.length === 1) {
    const detail = details[0]
    if (detail.field) {
      const label = FIELD_LABELS[detail.field] || detail.field
      return `${label}: ${detail.message}`
    }
    return detail.message
  }

  const firstError = details[0]
  if (firstError.field) {
    const label = FIELD_LABELS[firstError.field] || firstError.field
    return `${label}: ${firstError.message} (${details.length} erro${details.length > 1 ? 's' : ''})`
  }

  return firstError.message
}

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

export function isNetworkError(error: Error): boolean {
  const networkErrorMessages = [
    'Failed to fetch',
    'NetworkError',
    'Tempo de requisição excedido',
    'Falha na conexão',
  ]

  return networkErrorMessages.some(msg => error.message.includes(msg))
}

export function isValidationError(error: Error | ApiError): boolean {
  if (error instanceof ApiError) {
    return error.status === HttpStatus.BAD_REQUEST || error.status === HttpStatus.UNPROCESSABLE
  }

  const code = (error as { code?: string }).code
  return code === 'VALIDATION_ERROR' || code === 'BAD_REQUEST' || error.message.includes('inválid')
}

export function isAuthError(error: Error | ApiError): boolean {
  if (error instanceof ApiError) {
    return error.status === HttpStatus.UNAUTHORIZED || error.status === HttpStatus.FORBIDDEN
  }

  const code = (error as { code?: string }).code
  return code === 'AUTHENTICATION_ERROR' || code === 'AUTHORIZATION_ERROR'
}

export function isNotFoundError(error: Error | ApiError): boolean {
  if (error instanceof ApiError) {
    return error.status === HttpStatus.NOT_FOUND
  }

  const code = (error as { code?: string }).code
  return code === 'NOT_FOUND' || Boolean(code?.endsWith('_NOT_FOUND'))
}

export function isServerError(error: Error | ApiError): boolean {
  if (error instanceof ApiError) {
    return error.status >= HttpStatus.INTERNAL_SERVER_ERROR && error.status < 600
  }

  const code = (error as { code?: string }).code
  return code === 'INTERNAL_ERROR' || code === 'SERVER_ERROR' || code === 'SERVICE_UNAVAILABLE'
}
