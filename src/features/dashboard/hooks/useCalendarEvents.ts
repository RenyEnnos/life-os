import { useEffect, useState, useCallback } from "react"
import { getJSON, postJSON } from "@/shared/api/http"

type CalendarEvent = {
  id: string
  summary?: string
  location?: string
  conferenceData?: unknown
  start?: { dateTime?: string; date?: string }
  end?: { dateTime?: string; date?: string }
}

export function useCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [authUrl, setAuthUrl] = useState<string | null>(null)

  const loadAuthUrl = useCallback(async () => {
    try {
      const data = await getJSON<{ url: string }>("/api/calendar/auth-url")
      setAuthUrl(data?.url || null)
    } catch {
      // Silencioso; podemos mostrar CTA de conectar quando tentar carregar eventos
    }
  }, [])

  const loadEvents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getJSON<CalendarEvent[]>("/api/calendar/events")
      setEvents(data || [])
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Não foi possível carregar eventos do calendário"
      setError(message)
      setEvents([])
      if (!authUrl) {
        await loadAuthUrl()
      }
    } finally {
      setLoading(false)
    }
  }, [authUrl, loadAuthUrl])

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  const connect = useCallback(async (code: string, state: string) => {
    await postJSON("/api/calendar/connect", { code, state })
    await loadEvents()
  }, [loadEvents])

  return { events, loading, error, authUrl, refresh: loadEvents, connect }
}
