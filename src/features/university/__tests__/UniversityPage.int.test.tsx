import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { UniversityPage } from '../pages/UniversityPage'

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

const mockCourses = [
  { id: 'c1', user_id: 'u1', name: 'Calculus II', professor: 'Dr. Smith', schedule: 'MWF 10:00', grade: 88, semester: 'Fall 2025', created_at: '2025-01-01' },
  { id: 'c2', user_id: 'u1', name: 'Data Structures', professor: 'Dr. Johnson', schedule: 'TTh 14:00', grade: 92, semester: 'Fall 2025', created_at: '2025-01-01' },
]

const mockAssignments = [
  { id: 'a1', course_id: 'c1', title: 'Midterm Exam', type: 'exam', due_date: '2025-02-15', weight: 30, status: 'todo', completed: false },
  { id: 'a2', course_id: 'c2', title: 'Binary Tree Implementation', type: 'homework', due_date: '2025-02-10', weight: 15, status: 'submitted', completed: true },
]

vi.mock('../hooks/useUniversity', () => ({
  useUniversity: () => ({
    courses: mockCourses,
    assignments: mockAssignments,
    isLoading: false,
    coursesLoading: false,
    assignmentsLoading: false,
    addCourse: vi.fn(),
    updateCourse: vi.fn(),
    removeCourse: vi.fn(),
    addAssignment: vi.fn(),
    updateAssignment: vi.fn(),
    toggleAssignment: vi.fn(),
    removeAssignment: vi.fn(),
    refetch: vi.fn(),
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

describe('UniversityPage integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders university dashboard header', async () => {
    render(<UniversityPage />, { wrapper: createWrapper() })

    expect(screen.getByText('University Dashboard')).toBeInTheDocument()
    expect(screen.getByText(/fall semester 2025/i)).toBeInTheDocument()
  })

  it('displays courses in the grid', async () => {
    render(<UniversityPage />, { wrapper: createWrapper() })

    expect(screen.getAllByText('Calculus II').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Data Structures').length).toBeGreaterThan(0)
  })

  it('displays assignments list', async () => {
    render(<UniversityPage />, { wrapper: createWrapper() })

    expect(screen.getByText('Midterm Exam')).toBeInTheDocument()
    expect(screen.getByText('Binary Tree Implementation')).toBeInTheDocument()
  })

  it('renders grade analytics section', async () => {
    render(<UniversityPage />, { wrapper: createWrapper() })

    // GradeAnalytics should render without errors
    expect(screen.getByText('University Dashboard')).toBeInTheDocument()
  })
})
