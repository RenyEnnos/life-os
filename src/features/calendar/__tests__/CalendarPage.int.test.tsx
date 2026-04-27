import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CalendarPage from '../index'

describe('CalendarPage integration', () => {
  it('renders schedule shell, supports tab switch, and month navigation', () => {
    render(<CalendarPage />)

    expect(screen.getByRole('heading', { name: /Schedule/i })).toBeInTheDocument()
    expect(screen.getByText(/August 12 - August 18, 2024/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Deep Work/i).length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: /Join Call/i })).toBeInTheDocument()

    const weekTab = screen.getByRole('tab', { name: /Week/i })
    const monthTab = screen.getByRole('tab', { name: /Month/i })
    expect(weekTab).toHaveAttribute('aria-selected', 'true')
    fireEvent.click(monthTab)
    expect(monthTab).toHaveAttribute('aria-selected', 'true')
    expect(weekTab).toHaveAttribute('aria-selected', 'false')

    const monthLabel = screen.getByRole('heading', { level: 3, name: /2024/i })
    const initialMonth = monthLabel.textContent
    const nextMonthButton = screen.getByRole('button', { name: /chevron_right/i })
    fireEvent.click(nextMonthButton)
    expect(monthLabel.textContent).not.toBe(initialMonth)
  })
})
