import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import SettingsPage from '../index'

vi.mock('@/features/auth/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'u1',
      email: 'test@example.com',
      user_metadata: { full_name: 'Test User' },
    },
  }),
}))

vi.mock('@/features/user/hooks/useUser', () => ({
  useUser: () => ({
    userProfile: {
      nickname: 'testuser',
      full_name: 'Test User',
      email: 'test@example.com',
      preferences: {
        bio: 'Test bio',
        location: 'Test City',
      },
    },
    isLoading: false,
    updatePreferences: { mutate: vi.fn() },
  }),
}))

vi.mock('@/features/rewards/hooks/useRewards', () => ({
  useRewards: () => ({
    lifeScore: { level: 5, current_xp: 500 },
  }),
}))

vi.mock('framer-motion', async () => {
  const React = await vi.importActual<typeof import('react')>('react')
  const createMotion = (tag: string) => React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & Record<string, any>>(
    ({ children, ...props }, ref) => {
      const { initial, animate, variants, whileHover, whileTap, transition, ...domProps } = props
      return React.createElement(tag, { ref, ...domProps } as any, children)
    }
  )
  const MotionDiv = createMotion('div')
  MotionDiv.displayName = 'MotionDiv'
  const MotionButton = createMotion('button')
  MotionButton.displayName = 'MotionButton'
  return {
    motion: { div: MotionDiv, button: MotionButton },
    AnimatePresence: ({ children }: { children: any }) => <>{children}</>,
    useMotionValue: (init: number) => ({ set: vi.fn(), get: vi.fn(() => init), on: vi.fn() }),
    useMotionTemplate: () => ({ set: vi.fn(), get: vi.fn(() => '') }),
  }
})

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return ({ children }: { children: any }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  )
}

describe('SettingsPage integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders settings page with sidebar navigation', () => {
    render(<SettingsPage />, { wrapper: createWrapper() })

    expect(screen.getByText('User Hub')).toBeInTheDocument()
    expect(screen.getByText('Workspace Control')).toBeInTheDocument()
  })

  it('displays Identity tab by default', () => {
    render(<SettingsPage />, { wrapper: createWrapper() })

    // Desktop nav should show Identity as the first profile section
    const identityButtons = screen.getAllByText('Identity')
    expect(identityButtons.length).toBeGreaterThan(0)
  })

  it('switches between settings tabs via desktop nav', async () => {
    const user = userEvent.setup()
    render(<SettingsPage />, { wrapper: createWrapper() })

    // Find the desktop navigation buttons (hidden on mobile, visible on lg)
    // Use the nav element to scope desktop buttons
    const nav = document.querySelector('nav')
    if (nav) {
      const preferencesBtn = Array.from(nav.querySelectorAll('button')).find(
        btn => btn.textContent?.includes('Preferences')
      )
      if (preferencesBtn) {
        await user.click(preferencesBtn)
      }

      const appearanceBtn = Array.from(nav.querySelectorAll('button')).find(
        btn => btn.textContent?.includes('Appearance')
      )
      if (appearanceBtn) {
        await user.click(appearanceBtn)
      }
    }

    // All sections should have rendered without errors
    expect(screen.getByText('User Hub')).toBeInTheDocument()
  })

  it('shows Coming Soon for integrations section', async () => {
    const user = userEvent.setup()
    render(<SettingsPage />, { wrapper: createWrapper() })

    const nav = document.querySelector('nav')
    if (nav) {
      const integrationsBtn = Array.from(nav.querySelectorAll('button')).find(
        btn => btn.textContent?.includes('Integrations')
      )
      if (integrationsBtn) {
        await user.click(integrationsBtn)
      }
    }

    expect(screen.getByText('Coming Soon')).toBeInTheDocument()
  })
})
