import { apiFetch } from './api'

export const apiClient = {
    get: (url: string) => apiFetch(url, { method: 'GET' }),
    post: (url: string, body: any) => apiFetch(url, { method: 'POST', body: JSON.stringify(body) }),
    put: (url: string, body: any) => apiFetch(url, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (url: string) => apiFetch(url, { method: 'DELETE' }),
    patch: (url: string, body: any) => apiFetch(url, { method: 'PATCH', body: JSON.stringify(body) }),
}
