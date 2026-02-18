// Mock Supabase environment variables for testing
process.env.SUPABASE_URL = 'http://localhost:54321'
process.env.SUPABASE_ANON_KEY = 'mock-anon-key'
/* eslint-disable @typescript-eslint/no-explicit-any */
process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock-service-role-key'

import '@testing-library/jest-dom/vitest'
import { beforeAll, afterEach, afterAll, vi } from 'vitest'
import { server } from './src/test/msw/server'

// Mock Supabase client to avoid network requests in integration tests
vi.mock('./api/lib/supabase', () => {
  const users: any[] = []

  return {
    supabase: {
      from: (table: string) => ({
        select: () => ({
          eq: (field: string, value: any) => ({
            single: () => {
              if (table === 'users' && field === 'email') {
                const user = users.find(u => u.email === value)
                return Promise.resolve({ data: user || null, error: null })
              }
              if (table === 'users' && field === 'id') {
                const user = users.find(u => u.id === value)
                return Promise.resolve({ data: user || null, error: null })
              }
              return Promise.resolve({ data: null, error: null })
            },
            maybeSingle: () => {
               if (table === 'users' && field === 'email') {
                const user = users.find(u => u.email === value)
                return Promise.resolve({ data: user || null, error: null })
              }
              return Promise.resolve({ data: null, error: null })
            },
          }),
        }),
        insert: (data: any) => ({
          select: () => ({
            single: () => {
              const userData = Array.isArray(data) ? data[0] : data
              const newUser = {
                id: 'mock-user-id-' + Math.random().toString(36).substring(7),
                ...userData,
                created_at: new Date().toISOString()
              }
              if (table === 'users') {
                 users.push(newUser)
              }
              return Promise.resolve({
                data: newUser,
                error: null
              })
            }
          })
        }),
        update: (updates: any) => ({
          eq: (field: string, value: any) => ({
            select: () => ({
              single: () => {
                if (table === 'users' && field === 'id') {
                  const idx = users.findIndex(u => u.id === value)
                  if (idx !== -1) {
                    users[idx] = { ...users[idx], ...updates }
                    return Promise.resolve({ data: users[idx], error: null })
                  }
                }
                return Promise.resolve({ data: {}, error: null })
              }
            })
          })
        })
      }),
    }
  }
})

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
