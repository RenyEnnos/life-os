export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export interface FetchOptions extends RequestInit {
  method?: HttpMethod
  timeoutMs?: number
}

export class ApiError extends Error {
  status: number;
  details?: any;

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export async function fetchJSON<T = unknown>(url: string, options: FetchOptions = {}): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 15000)

  // Build request options properly to avoid overwrites
  const { headers: optionHeaders, timeoutMs, ...restOptions } = options
  const requestOptions: RequestInit = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(optionHeaders || {}),
    },
    signal: controller.signal,
    ...restOptions,
  }

  try {
    const res = await fetch(url, requestOptions)
    const contentType = res.headers.get("content-type") || ""
    const isJson = contentType.includes("application/json")
    const body = isJson ? await res.json() : await res.text()

    if (!res.ok) {
      const message = isJson ? (body?.message || body?.error || "Erro na requisição") : (body || "Erro na requisição")
      console.warn(`[HTTP] Error ${res.status} on ${url}:`, message, isJson ? body : '')

      if (isJson && body?.details) {
        throw new ApiError(message, res.status, body.details)
      }

      throw new ApiError(message, res.status)
    }
    return body as T
  } catch (err: any) {
    // Log operacional errors (4xx) as warnings, not errors to avoid console noise
    if (err instanceof ApiError && err.status < 500) {
      console.warn(`[HTTP] Validation/Client error on ${url}:`, err.message);
    } else {
      console.error(`[HTTP] Fetch failed for ${url}:`, err);
    }

    if (err instanceof ApiError) {
      throw err;
    }
    if (err?.name === "AbortError") {
      throw new Error("Tempo de requisição excedido")
    }
    if (err?.message?.includes("Failed to fetch")) {
      throw new Error("Falha na conexão com o servidor. Verifique se o backend está rodando.")
    }
    throw err
  } finally {
    clearTimeout(timeout)
  }
}

export function getJSON<T = unknown>(url: string, headers?: Record<string, string>) {
  return fetchJSON<T>(url, { method: "GET", headers })
}

export function postJSON<T = unknown>(url: string, data?: unknown, headers?: Record<string, string>) {
  return fetchJSON<T>(url, { method: "POST", body: data ? JSON.stringify(data) : undefined, headers })
}

export function patchJSON<T = unknown>(url: string, data?: unknown, headers?: Record<string, string>) {
  return fetchJSON<T>(url, { method: "PATCH", body: data ? JSON.stringify(data) : undefined, headers })
}

export function putJSON<T = unknown>(url: string, data?: unknown, headers?: Record<string, string>) {
  return fetchJSON<T>(url, { method: "PUT", body: data ? JSON.stringify(data) : undefined, headers })
}

export function delJSON<T = unknown>(url: string, headers?: Record<string, string>) {
  return fetchJSON<T>(url, { method: "DELETE", headers })
}

export type ApiClient = {
  get<T = unknown>(url: string, headers?: Record<string, string>): Promise<T>
  post<T = unknown>(url: string, data?: unknown, headers?: Record<string, string>): Promise<T>
  put<T = unknown>(url: string, data?: unknown, headers?: Record<string, string>): Promise<T>
  patch<T = unknown>(url: string, data?: unknown, headers?: Record<string, string>): Promise<T>
  delete<T = unknown>(url: string, headers?: Record<string, string>): Promise<T>
}

export const apiClient: ApiClient = {
  get: getJSON,
  post: postJSON,
  put: putJSON,
  patch: patchJSON,
  delete: delJSON,
}

export const apiFetch = fetchJSON

export function resolveApiUrl(path: string): string {
  if (!path) return ""
  if (/^https?:\/\//i.test(path)) return path
  const base = (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_BASE_URL) || ""
  const cleanedPath = path.replace(/^\/+/, "")
  if (base) {
    return `${String(base).replace(/\/+$/, "")}/${cleanedPath}`
  }
  const origin = typeof window !== "undefined" ? window.location.origin : ""
  return origin ? `${origin}/${cleanedPath}` : `/${cleanedPath}`
}
