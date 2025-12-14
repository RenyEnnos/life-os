import { clearAuthToken, getAuthToken } from './authToken';

const API_BASE_URL = (import.meta.env?.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || '';

export const resolveApiUrl = (url: string) => {
  if (/^https?:\/\//i.test(url)) return url;
  if (!API_BASE_URL) return url;
  return url.startsWith('/') ? `${API_BASE_URL}${url}` : `${API_BASE_URL}/${url}`;
};

export async function apiFetch<T = unknown>(url: string, options: RequestInit = {}): Promise<T> {
  const { headers: requestHeaders = {}, credentials, ...rest } = options;
  const headers = new Headers(requestHeaders as HeadersInit);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getAuthToken();
  if (token && !headers.has('authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(resolveApiUrl(url), {
    ...rest,
    credentials: credentials ?? 'include',
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthToken();
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const apiClient = {
  get: <T>(url: string) => apiFetch<T>(url, { method: 'GET' }),
  post: <T>(url: string, body: unknown) => apiFetch<T>(url, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(url: string, body: unknown) => apiFetch<T>(url, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(url: string) => apiFetch<T>(url, { method: 'DELETE' }),
  patch: <T>(url: string, body: unknown) => apiFetch<T>(url, { method: 'PATCH', body: JSON.stringify(body) }),
};
