import '@testing-library/jest-dom/vitest'
import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from './src/test/msw/server'
import { resetMockMvpWorkspace } from './src/test/msw/handlers'

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }))
afterEach(() => {
  server.resetHandlers()
  resetMockMvpWorkspace()
})
afterAll(() => server.close())

// Mock browser-only globals when the suite runs in jsdom.
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

// Environment variables
process.env.VITE_SUPABASE_URL = 'http://localhost:54321';
process.env.VITE_SUPABASE_ANON_KEY = 'mock-key';
process.env.VITE_GA_MEASUREMENT_ID = 'G-TEST123456';

if (typeof window !== 'undefined') {
  window.api = window.api || {
    auth: { check: vi.fn(), login: vi.fn(), logout: vi.fn() },
    tasks: { getAll: vi.fn().mockResolvedValue([]), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
    mvp: {
      getWorkspace: vi.fn(),
      saveOnboarding: vi.fn(),
      generateWeeklyPlan: vi.fn(),
      confirmPlan: vi.fn(),
      updateActionStatus: vi.fn(),
      saveDailyCheckIn: vi.fn(),
      addReflection: vi.fn(),
      submitFeedback: vi.fn(),
      resetWorkspace: vi.fn(),
    },
    legacy: { request: vi.fn().mockResolvedValue({}) }
  };
}

// Stronger mock for supabase auth
vi.mock('@/shared/lib/supabase', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod as any,
    supabase: {
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
        signInWithPassword: vi.fn().mockResolvedValue({ data: { user: { id: 'test' }, session: {} }, error: null }),
        signUp: vi.fn().mockResolvedValue({ data: { user: { id: 'test' } }, error: null }),
        signOut: vi.fn().mockResolvedValue({ error: null }), onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } }))
      }
    }
  };
});

vi.mock('@supabase/supabase-js', () => {
    return {
        createClient: vi.fn(() => ({
            auth: {
                getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
                signInWithPassword: vi.fn().mockResolvedValue({ data: { user: { id: 'test', email: 'test@test.com' }, session: { access_token: '123' } }, error: null }),
                signUp: vi.fn().mockResolvedValue({ data: { user: { id: 'test' } }, error: null }),
                signOut: vi.fn().mockResolvedValue({ error: null })
            },
            from: vi.fn(() => ({
                select: vi.fn().mockReturnThis(),
                insert: vi.fn().mockReturnThis(),
                update: vi.fn().mockReturnThis(),
                delete: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({ data: {}, error: null })
            }))
        }))
    };
});
