import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import DashboardPage from '../index'

vi.mock('framer-motion', async () => {
  const React = await vi.importActual<typeof import('react')>('react')

  const MotionDiv = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
      children?: React.ReactNode
      initial?: unknown
      animate?: unknown
      variants?: unknown
      whileHover?: unknown
      whileTap?: unknown
      transition?: unknown
    }
  >(({ children, ...props }, ref) => {
    const {
      initial,
      animate,
      variants,
      whileHover,
      whileTap,
      transition,
      ...domProps
    } = props
    void initial
    void animate
    void variants
    void whileHover
    void whileTap
    void transition

    return (
      <div ref={ref} {...domProps}>
        {children}
      </div>
    )
  })

  MotionDiv.displayName = 'MotionDiv'

  return {
    motion: {
      div: MotionDiv,
    },
  }
})

vi.mock('@/features/auth/contexts/AuthContext', () => ({
  useAuth: () => ({
    profile: {
      nickname: 'Pedro',
      full_name: 'Pedro Example',
    },
  }),
}))

vi.mock('@/features/dashboard/widgets/HabitWidget', () => ({
  HabitWidget: () => <div data-testid="habit-widget">Habit Widget</div>,
}))

vi.mock('@/features/dashboard/widgets/TaskWidget', () => ({
  TaskWidget: () => <div data-testid="task-widget">Task Widget</div>,
}))

describe('DashboardPage integration', () => {
  it('renders the current dashboard shell with authenticated profile context', () => {
    render(<DashboardPage />)

    expect(screen.getByRole('heading', { name: /welcome back, pedro/i })).toBeVisible()
    expect(screen.getByText(/system status:/i)).toBeVisible()
    expect(screen.getByText(/all systems operational/i)).toBeVisible()
    expect(screen.getByText(/live executive dashboard/i)).toBeVisible()
    expect(screen.getByText(/current focus/i)).toBeVisible()
    expect(screen.getByText(/finalizar implementação gsd/i)).toBeVisible()
    expect(screen.getByText(/ai intelligence layer/i)).toBeVisible()
    expect(screen.getByText(/finance overview/i)).toBeVisible()
    expect(screen.getByText(/mvp surface/i)).toBeVisible()
    expect(screen.getByText(/boundary status/i)).toBeVisible()
    expect(screen.getByText(/manual insights/i)).toBeVisible()

    expect(screen.getByTestId('habit-widget')).toBeVisible()
    expect(screen.getByTestId('task-widget')).toBeVisible()
    expect(screen.getByText(/dashboard agora opera apenas com hábitos e tarefas/i)).toBeVisible()
    expect(screen.getByText(/camada de insights automáticos saiu da home/i)).toBeVisible()
  })
})
