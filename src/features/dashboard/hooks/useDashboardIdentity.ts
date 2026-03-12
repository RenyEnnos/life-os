import { useMemo } from 'react'
import { useAuth } from '@/features/auth/contexts/AuthContext'

type Identity = {
  id: string
  email: string
  name?: string
  avatar_url?: string
  preferences?: Record<string, unknown>
}

export function useDashboardIdentity() {
  const { user, profile, loading } = useAuth()

  const identity = useMemo<Identity | null>(() => {
    if (!user) {
      return null
    }

    return {
      id: user.id,
      email: user.email || '',
      name: profile?.full_name || user.user_metadata?.full_name,
      avatar_url: user.user_metadata?.avatar_url,
      preferences: undefined,
    }
  }, [profile?.full_name, user])

  return { user: identity, loading }
}
