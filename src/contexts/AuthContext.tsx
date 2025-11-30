import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../../shared/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (credentials: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  updateThemePreference: (theme: 'light' | 'dark') => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const response = await fetch('/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
          const preferredTheme = (userData?.theme || userData?.preferences?.theme) as 'light' | 'dark' | undefined
          if (preferredTheme) {
            localStorage.setItem('theme', preferredTheme)
            document.documentElement.classList.remove('light', 'dark')
            document.documentElement.classList.add(preferredTheme)
          }
        } else {
          localStorage.removeItem('token')
        }
      }
    } catch (error) {
      console.error('Auth check error:', error)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  

  const login = async (credentials: LoginRequest) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const error = await response.json()
      const code = error.code ? String(error.code) : ''
      const message = error.error || 'Login failed'
      throw new Error(code || message)
    }

    const data: AuthResponse = await response.json()
    localStorage.setItem('token', data.token)
    setUser(data.user)
  }

  const register = async (credentials: RegisterRequest) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Registration failed')
    }

    const data: AuthResponse = await response.json()
    localStorage.setItem('token', data.token)
    setUser(data.user)
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      setUser(null)
    }
  }

  const updateThemePreference = async (theme: 'light' | 'dark') => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ preferences: { ...(user?.preferences || {}), theme } }),
      })
      if (response.ok) {
        const updated = await response.json()
        setUser((prev) => prev ? { ...prev, preferences: updated.preferences, theme: updated.theme } : updated)
        localStorage.setItem('theme', theme)
        document.documentElement.classList.remove('light', 'dark')
        document.documentElement.classList.add(theme)
      }
    } catch (error) {
      console.error('Update theme preference error:', error)
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateThemePreference,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
