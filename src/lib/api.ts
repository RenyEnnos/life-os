export async function apiFetch<T = unknown>(url: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
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
}
