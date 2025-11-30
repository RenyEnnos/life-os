import { apiFetch } from './api'

export const apiClient = {
    get: <T>(url: string) => apiFetch<T>(url, { method: 'GET' }),
    post: <T>(url: string, body: unknown) => apiFetch<T>(url, { method: 'POST', body: JSON.stringify(body) }),
    put: <T>(url: string, body: unknown) => apiFetch<T>(url, { method: 'PUT', body: JSON.stringify(body) }),
    delete: <T>(url: string) => apiFetch<T>(url, { method: 'DELETE' }),
    patch: <T>(url: string, body: unknown) => apiFetch<T>(url, { method: 'PATCH', body: JSON.stringify(body) }),
}
