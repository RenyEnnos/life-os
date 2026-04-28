import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { HealthPage } from '../pages/HealthPage'

vi.mock('framer-motion', async () => {
  const React = await vi.importActual<typeof import('react')>('react')
  const MotionDiv = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & Record<string, any>>(
    ({ children, ...props }, ref) => {
      const { initial, animate, variants, whileHover, whileTap, transition, ...domProps } = props
      return <div ref={ref} {...domProps}>{children}</div>
    }
  )
  MotionDiv.displayName = 'MotionDiv'
  return { motion: { div: MotionDiv }, AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</> }
})

vi.mock('@/features/auth/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'u1', email: 'test@example.com' },
    profile: { nickname: 'Test User' },
  }),
}))

const mockMetrics = [
  { id: 'm1', user_id: 'u1', metric_type: 'sleep', value: 7.5, unit: 'hours', recorded_date: '2025-01-15', created_at: '2025-01-15T08:00:00Z' },
  { id: 'm2', user_id: 'u1', metric_type: 'steps', value: 8500, unit: 'steps', recorded_date: '2025-01-15', created_at: '2025-01-15T18:00:00Z' },
  { id: 'm3', user_id: 'u1', metric_type: 'heart_rate', value: 72, unit: 'bpm', recorded_date: '2025-01-15', created_at: '2025-01-15T09:00:00Z' },
]

const mockMedications = [
  { id: 'med1', user_id: 'u1', name: 'Omega-3', dosage: '1g', times: ['08:00'], active: true, created_at: '2025-01-01' },
  { id: 'med2', user_id: 'u1', name: 'Vitamin D', dosage: '2000IU', times: ['09:00'], active: true, created_at: '2025-01-01' },
]

const mockMutate = vi.fn()

vi.mock('../hooks/useHealth', () => ({
  useHealth: () => ({
    metrics: mockMetrics,
    medications: mockMedications,
    isLoading: false,
    createMetric: { mutate: mockMutate, isPending: false },
    createMedication: { mutate: mockMutate, isPending: false },
    updateMedication: { mutate: mockMutate, isPending: false },
    deleteMedication: { mutate: mockMutate, isPending: false },
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

describe('HealthPage integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders health center with metrics data', async () => {
    render(<HealthPage />, { wrapper: createWrapper() })

    expect(screen.getByText('Health Center')).toBeInTheDocument()
    expect(screen.getByText('Heart Rate')).toBeInTheDocument()
    expect(screen.getByText('Sleep Score')).toBeInTheDocument()
    expect(screen.getByText('Daily Steps')).toBeInTheDocument()
  })

  it('displays medications list', async () => {
    render(<HealthPage />, { wrapper: createWrapper() })

    expect(screen.getByText('Omega-3')).toBeInTheDocument()
    expect(screen.getByText('Vitamin D')).toBeInTheDocument()
  })

  it('opens log entry form and shows metric inputs', async () => {
    const user = userEvent.setup()
    render(<HealthPage />, { wrapper: createWrapper() })

    await user.click(screen.getByText('Add Log Entry'))

    expect(screen.getByPlaceholderText('Value')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/unit/i)).toBeInTheDocument()
    expect(screen.getByText('Save')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('cancels log entry form', async () => {
    const user = userEvent.setup()
    render(<HealthPage />, { wrapper: createWrapper() })

    await user.click(screen.getByText('Add Log Entry'))
    expect(screen.getByPlaceholderText('Value')).toBeInTheDocument()

    await user.click(screen.getByText('Cancel'))
    expect(screen.queryByPlaceholderText('Value')).not.toBeInTheDocument()
    expect(screen.getByText('Add Log Entry')).toBeInTheDocument()
  })
})
