export async function apiFetch(path: string, init: RequestInit = {}) {
  const token = localStorage.getItem('token')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string> || {}),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(path, { ...init, headers })
  if (!res.ok) {
    let msg = 'Request failed'
    try { const body = await res.json(); msg = body.error || msg } catch {}
    throw new Error(msg)
  }
  return res.json()
}
