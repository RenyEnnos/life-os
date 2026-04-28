import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { HabitsPage } from '../pages/HabitsPage'

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

vi.mock('@/features/auth/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'u1', email: 'test@example.com' },
    profile: { nickname: 'Test User', level: 3, current_xp: 2500, points: 2500 },
  }),
}))

vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lucide-react')>()
  return {
    ...actual,
    Trophy: (props: any) => <span data-testid="icon-trophy" {...props} />,
    Target: (props: any) => <span data-testid="icon-target" {...props} />,
    Activity: (props: any) => <span data-testid="icon-activity" {...props} />,
  }
})

const mockHabits = [
  { id: 'h1', user_id: 'u1', name: 'Meditation', title: 'Meditation', frequency: ['daily'], streak: 5, streak_current: 5, routine: 'morning', schedule: { frequency: 'daily' }, type: 'binary', target_value: 1, goal: 1, completed: false },
  { id: 'h2', user_id: 'u1', name: 'Exercise', title: 'Exercise', frequency: ['daily'], streak: 3, streak_current: 3, routine: 'afternoon', schedule: { frequency: 'daily' }, type: 'binary', target_value: 1, goal: 1, completed: false },
]

const today = new Date().toISOString().split('T')[0]
const mockLogs = [
  { id: 'l1', habit_id: 'h1', user_id: 'u1', date: today, value: 1 },
]

const mockMutate = vi.fn()

vi.mock('../hooks/useHabits', () => ({
  useHabits: () => ({
    habits: mockHabits,
    logs: mockLogs,
    isLoading: false,
    isFetchingNextPage: false,
    hasNextPage: false,
    fetchNextPage: vi.fn(),
    createHabit: { mutate: mockMutate, isPending: false } as any,
    logHabit: { mutate: mockMutate, isPending: false } as any,
  }),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return ({ children }: { children: any }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  )
}

describe('HabitsPage integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders habit tracker header with user level', async () => {
    render(<HabitsPage />, { wrapper: createWrapper() })

    expect(screen.getByText(/habit tracker/i)).toBeInTheDocument()
    expect(screen.getByText(/level 3 strategist/i)).toBeInTheDocument()
  })

  it('displays habits in cards', async () => {
    render(<HabitsPage />, { wrapper: createWrapper() })

    expect(screen.getByText('Meditation')).toBeInTheDocument()
    expect(screen.getByText('Exercise')).toBeInTheDocument()
  })

  it('shows New Habit button that opens create dialog', async () => {
    const user = userEvent.setup()
    render(<HabitsPage />, { wrapper: createWrapper() })

    const newHabitButton = screen.getByText('New Habit')
    await user.click(newHabitButton)

    // CreateHabitDialog should open - look for its heading
    await waitFor(() => {
      expect(screen.getByText(/novo hábito/i)).toBeInTheDocument()
    })
  })

  it('displays empty state when no habits exist', async () => {
    vi.mocked(await import('../hooks/useHabits')).useHabits = (() => ({
      habits: [],
      logs: [],
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      createHabit: { mutate: vi.fn(), isPending: false } as any,
      logHabit: { mutate: vi.fn(), isPending: false } as any,
    })) as any

    render(<HabitsPage />, { wrapper: createWrapper() })

    expect(screen.getByText(/no protocols established/i)).toBeInTheDocument()
  })
})
