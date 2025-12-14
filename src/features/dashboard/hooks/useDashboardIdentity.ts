import { useEffect, useState, useCallback } from "react"
import { getJSON } from "@/shared/api/http"

type Identity = {
  id: string
  email: string
  name?: string
  avatar_url?: string
  preferences?: Record<string, unknown>
}

export function useDashboardIdentity() {
  const [user, setUser] = useState<Identity | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getJSON<Identity>("/api/auth/verify")
      setUser(data || null)
    } catch (e: any) {
      setError(e?.message || "Não foi possível carregar perfil")
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const refresh = useCallback(() => load(), [load])

  return { user, loading, error, refresh }
}
