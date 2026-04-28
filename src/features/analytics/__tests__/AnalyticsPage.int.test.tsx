import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { AnalyticsDashboard } from '../pages/AnalyticsDashboard'

vi.mock('framer-motion', async () => {
  const React = await vi.importActual<typeof import('react')>('react')
  const MotionDiv = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & Record<string, any>>(
    ({ children, ...props }, ref) => {
      const { initial, animate, variants, whileHover, whileTap, transition, ...domProps } = props
      return <div ref={ref} {...domProps}>{children}</div>
    }
  )
  MotionDiv.displayName = 'MotionDiv'
  return { motion: { div: MotionDiv }, AnimatePresence: ({ children }: { children: any }) => <>{children}</> }
})

vi.mock('@/features/auth/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'u1', email: 'test@example.com' },
    profile: { nickname: 'Test User' },
  }),
}))

vi.mock('@/features/analytics/hooks/useAnalyticsData', () => ({
  useAnalyticsData: vi.fn(),
}))

vi.mock('@/features/analytics/components/MetricsTrendChart', () => ({
  MetricsTrendChart: ({ data }: { data: unknown[] }) => (
    <div data-testid="metrics-trend-chart">Metrics Trend Chart ({data.length} points)</div>
  ),
}))

vi.mock('@/features/analytics/components/HabitConsistencyHeatmap', () => ({
  HabitConsistencyHeatmap: ({ data }: { data: unknown[] }) => (
    <div data-testid="habit-consistency-heatmap">Habit Consistency Heatmap ({data.length} points)</div>
  ),
}))

vi.mock('@/features/analytics/components/CorrelationScatterChart', () => ({
  CorrelationScatterChart: ({ data }: { data: unknown[] }) => (
    <div data-testid="correlation-scatter-chart">Correlation Scatter ({data.length} points)</div>
  ),
}))

vi.mock('@/features/analytics/components/LifeScoreForecastChart', () => ({
  LifeScoreForecastChart: () => <div data-testid="life-score-forecast">Life Score Forecast</div>,
}))

vi.mock('@/features/analytics/components/AIInsightsWidget', () => ({
  AIInsightsWidget: () => <div data-testid="ai-insights-widget">AI Insights Widget</div>,
}))

import { useAnalyticsData } from '../hooks/useAnalyticsData'

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return ({ children }: { children: any }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  )
}

const mockMetrics = Array.from({ length: 30 }, (_, i) => ({
  date: `2025-01-${String(i + 1).padStart(2, '0')}`,
  productivity: Math.floor(Math.random() * 10),
  habitAdherence: Math.floor(Math.random() * 100),
  sleepScore: Math.floor(Math.random() * 90),
}))

describe('AnalyticsPage integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state while data is being fetched', () => {
    vi.mocked(useAnalyticsData).mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: false,
      refetch: vi.fn(),
    } as any)

    render(<AnalyticsDashboard />, { wrapper: createWrapper() })
    expect(screen.getByText(/analytics & insights/i)).toBeInTheDocument()
  })

  it('renders charts when data is available', () => {
    vi.mocked(useAnalyticsData).mockReturnValue({
      data: mockMetrics,
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    } as any)

    render(<AnalyticsDashboard />, { wrapper: createWrapper() })

    expect(screen.getByTestId('metrics-trend-chart')).toBeInTheDocument()
    expect(screen.getByTestId('habit-consistency-heatmap')).toBeInTheDocument()
    expect(screen.getByTestId('correlation-scatter-chart')).toBeInTheDocument()
    expect(screen.getByTestId('life-score-forecast')).toBeInTheDocument()
    expect(screen.getByTestId('ai-insights-widget')).toBeInTheDocument()
  })

  it('shows empty state when no metrics are available', () => {
    vi.mocked(useAnalyticsData).mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    } as any)

    render(<AnalyticsDashboard />, { wrapper: createWrapper() })

    expect(screen.getByText(/no analytics data available yet/i)).toBeInTheDocument()
    expect(screen.queryByTestId('metrics-trend-chart')).not.toBeInTheDocument()
  })

  it('calls refetch when Refresh Data is clicked', async () => {
    const refetch = vi.fn()
    vi.mocked(useAnalyticsData).mockReturnValue({
      data: mockMetrics,
      isLoading: false,
      isFetching: false,
      refetch,
    } as any)

    render(<AnalyticsDashboard />, { wrapper: createWrapper() })

    const refreshButton = screen.getByRole('button', { name: /refresh data/i })
    refreshButton.click()

    expect(refetch).toHaveBeenCalled()
  })
})
