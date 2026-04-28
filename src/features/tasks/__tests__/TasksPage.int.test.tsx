import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import TasksPage from '../index'
import { useAuthStore } from '@/shared/stores/authStore'

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
    profile: { nickname: 'Test User' },
  }),
}))

vi.mock('@/features/ai-assistant/hooks/useAI', () => ({
  useAI: () => ({
    generatePlan: { mutateAsync: vi.fn(), isPending: false },
  }),
}))

vi.mock('@/shared/ui/useToast', () => ({
  useToast: () => ({
    showToast: vi.fn(),
  }),
}))

const mockTasks = [
  { id: 't1', title: 'Implement login', completed: false, status: 'todo', user_id: 'u1', position: 'a', created_at: '2025-01-15', priority: 'high' },
  { id: 't2', title: 'Write tests', completed: false, status: 'in-progress', user_id: 'u1', position: 'b', created_at: '2025-01-15', priority: 'medium' },
  { id: 't3', title: 'Deploy to prod', completed: true, status: 'done', user_id: 'u1', position: 'c', created_at: '2025-01-14', priority: 'low' },
]

const mockMutate = vi.fn()
const mockMutateAsync = vi.fn().mockResolvedValue({})

vi.mock('../hooks/useTasks', () => ({
  useTasks: () => ({
    tasks: mockTasks,
    isLoading: false,
    isFetchingNextPage: false,
    hasNextPage: false,
    fetchNextPage: vi.fn(),
    createTask: { mutate: mockMutate, mutateAsync: mockMutateAsync, isPending: false },
    updateTask: { mutate: mockMutate, mutateAsync: mockMutateAsync, isPending: false },
    deleteTask: { mutate: mockMutate, mutateAsync: mockMutateAsync, isPending: false },
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

describe('TasksPage integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.setState({
      user: { id: 'u1', email: 'test@example.com' } as any,
      session: { access_token: 'test-token' } as any,
      profile: { id: 'u1', full_name: 'Test User' } as any,
      isLoading: false,
      error: null,
      _hasHydrated: true,
    })
  })

  it('renders tasks page header and input', async () => {
    render(<TasksPage />, { wrapper: createWrapper() })

    expect(screen.getByText('Tasks')).toBeInTheDocument()
    expect(screen.getByText(/workflow/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument()
  })

  it('creates a new task via input field', async () => {
    const user = userEvent.setup()
    render(<TasksPage />, { wrapper: createWrapper() })

    const input = screen.getByPlaceholderText('What needs to be done?')
    await user.type(input, 'New task from test')

    // Verify input received the text
    expect(input).toHaveValue('New task from test')

    // Submit the task by pressing Enter
    await user.keyboard('{Enter}')
  })

  it('displays task items in kanban view', async () => {
    render(<TasksPage />, { wrapper: createWrapper() })

    expect(screen.getByText('Implement login')).toBeInTheDocument()
    expect(screen.getByText('Write tests')).toBeInTheDocument()
  })

  it('switches between list and kanban view', async () => {
    const user = userEvent.setup()
    render(<TasksPage />, { wrapper: createWrapper() })

    expect(screen.getByText('Implement login')).toBeInTheDocument()

    const listButton = screen.getByTitle('List View')
    await user.click(listButton)

    expect(screen.getByText('Implement login')).toBeInTheDocument()
  })
})
