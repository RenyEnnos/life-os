import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { ProjectsPage } from '../pages/ProjectsPage'

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
  return { motion: { div: MotionDiv, button: MotionButton }, AnimatePresence: ({ children }: { children: any }) => <>{children}</> }
})

vi.mock('@/features/auth/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'u1', email: 'test@example.com' },
    profile: { nickname: 'Test User' },
  }),
}))

const mockProjects = [
  { id: 'p1', title: 'LifeOS MVP', description: 'Build the MVP', status: 'active', priority: 'high', user_id: 'u1', created_at: '2025-01-01' },
  { id: 'p2', title: 'Dashboard Redesign', description: 'Redesign dashboard', status: 'on_hold', priority: 'medium', user_id: 'u1', created_at: '2025-01-02' },
  { id: 'p3', title: 'Documentation', description: 'Write docs', status: 'completed', priority: 'low', user_id: 'u1', created_at: '2025-01-03' },
]

const mockMutate = vi.fn()
vi.mock('../hooks/useProjects', () => ({
  useProjects: () => ({
    projects: mockProjects,
    isLoading: false,
    createProject: { mutate: mockMutate, isPending: false },
    updateProject: { mutate: mockMutate, isPending: false },
    deleteProject: { mutate: mockMutate, isPending: false },
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

describe('ProjectsPage integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders projects in board view by default', async () => {
    render(<ProjectsPage />, { wrapper: createWrapper() })

    expect(screen.getByText('LifeOS MVP')).toBeInTheDocument()
    expect(screen.getByText('Dashboard Redesign')).toBeInTheDocument()
    expect(screen.getByText(/to do \/ active/i)).toBeInTheDocument()
    expect(screen.getByText(/on hold/i)).toBeInTheDocument()
    expect(screen.getByText(/done/i)).toBeInTheDocument()
  })

  it('switches between board and list view', async () => {
    const user = userEvent.setup()
    render(<ProjectsPage />, { wrapper: createWrapper() })

    expect(screen.getByText('LifeOS MVP')).toBeInTheDocument()

    const listButton = screen.getByText('List View')
    await user.click(listButton)

    // Projects should still be visible in list mode (active filter)
    expect(screen.getByText('LifeOS MVP')).toBeInTheDocument()
    expect(screen.getByText('Dashboard Redesign')).toBeInTheDocument()
  })

  it('filters between active and archived projects', async () => {
    const user = userEvent.setup()
    render(<ProjectsPage />, { wrapper: createWrapper() })

    // Active view shows non-completed projects
    expect(screen.getByText('LifeOS MVP')).toBeInTheDocument()
    expect(screen.getByText('Dashboard Redesign')).toBeInTheDocument()

    // Switch to archived view - active projects should disappear
    await user.click(screen.getByText('Archived'))
    expect(screen.queryByText('LifeOS MVP')).not.toBeInTheDocument()
  })

  it('opens new project modal', async () => {
    const user = userEvent.setup()
    render(<ProjectsPage />, { wrapper: createWrapper() })

    await user.click(screen.getByText('New Project'))

    // ProjectModal should appear with form inputs
    await waitFor(() => {
      expect(screen.getByText('NOVO PROJETO')).toBeInTheDocument()
    })
  })

  it('shows project status actions on active projects', async () => {
    render(<ProjectsPage />, { wrapper: createWrapper() })

    // Complete and Hold buttons appear for each non-completed project
    expect(screen.getAllByText('Complete').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Hold').length).toBeGreaterThan(0)
  })
})
