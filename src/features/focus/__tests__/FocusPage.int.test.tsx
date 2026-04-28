import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { FocusPage } from '../pages/FocusPage'
import { useFocusStore } from '../stores/useFocusStore'

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

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return ({ children }: { children: any }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  )
}

describe('FocusPage integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useFocusStore.setState({
      isFocusing: false,
      timerState: 'idle',
      startTime: null,
      label: null,
      activeTask: null,
      secondsRemaining: 25 * 60,
      duration: 25 * 60,
    })
  })

  it('renders the timer with default 25:00 state', () => {
    render(<FocusPage />, { wrapper: createWrapper() })

    expect(screen.getByText('25:00')).toBeInTheDocument()
    expect(screen.getByText(/deep work session/i)).toBeInTheDocument()
    expect(screen.getByText(/press start to begin/i)).toBeInTheDocument()
    expect(screen.getByText(/ready/i)).toBeInTheDocument()
  })

  it('starts timer when Start button is clicked', async () => {
    const user = userEvent.setup()
    render(<FocusPage />, { wrapper: createWrapper() })

    await user.click(screen.getByText('Start'))

    expect(screen.getByText(/focus active/i)).toBeInTheDocument()
    expect(screen.getByText(/stay focused/i)).toBeInTheDocument()
    expect(screen.getByText('Pause')).toBeInTheDocument()
  })

  it('pauses and resumes timer', async () => {
    const user = userEvent.setup()
    render(<FocusPage />, { wrapper: createWrapper() })

    // Start
    await user.click(screen.getByText('Start'))
    expect(screen.getByText('Pause')).toBeInTheDocument()

    // Pause
    await user.click(screen.getByText('Pause'))
    expect(screen.getAllByText(/paused/i).length).toBeGreaterThan(0)
    expect(screen.getByText('Resume')).toBeInTheDocument()

    // Resume
    await user.click(screen.getByText('Resume'))
    expect(screen.getByText(/focus active/i)).toBeInTheDocument()
    expect(screen.getByText('Pause')).toBeInTheDocument()
  })

  it('stops timer and returns to idle state', async () => {
    const user = userEvent.setup()
    render(<FocusPage />, { wrapper: createWrapper() })

    await user.click(screen.getByText('Start'))
    expect(screen.getByText(/focus active/i)).toBeInTheDocument()

    // Find stop button - it has the material-symbols-outlined class with "stop" text
    const stopButton = screen.getAllByRole('button').find(
      btn => btn.querySelector('.material-symbols-outlined')?.textContent === 'stop'
    )
    expect(stopButton).toBeTruthy()
    await user.click(stopButton!)

    expect(screen.getByText(/ready/i)).toBeInTheDocument()
    expect(screen.getByText('25:00')).toBeInTheDocument()
  })

  it('adds 5 minutes to the timer', async () => {
    const user = userEvent.setup()
    render(<FocusPage />, { wrapper: createWrapper() })

    await user.click(screen.getByText('Start'))

    const addTimeButton = screen.getByText('+5m')
    await user.click(addTimeButton)

    // 25:00 + 5:00 = 30:00
    expect(screen.getByText('30:00')).toBeInTheDocument()
  })
})
