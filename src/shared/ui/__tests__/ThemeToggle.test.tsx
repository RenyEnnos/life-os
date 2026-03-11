/** @vitest-environment jsdom */
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ThemeToggle from '../ThemeToggle'

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.removeItem('theme')
    document.documentElement.classList.remove('light', 'dark')
  })

  it('renders the theme toggle button and toggles theme on click', async () => {
    render(<ThemeToggle />)

    const button = screen.getByRole('button', { name: 'Alternar tema' })
    expect(button).toBeInTheDocument()

    // Capture initial theme from localStorage (set by useTheme on mount)
    let initialTheme: string = ''
    await waitFor(() => {
      const t = localStorage.getItem('theme')
      if (!t) throw new Error('theme not set yet')
      initialTheme = t
      expect(['light', 'dark']).toContain(t)
    })

    // Click to toggle theme
    fireEvent.click(button)

    // Validate that theme has been toggled in localStorage and in document classes
    await waitFor(() => {
      const t = localStorage.getItem('theme')
      if (!t) throw new Error('theme not set after toggle')
      expect(t).not.toBe(initialTheme)
      expect(document.documentElement.classList.contains(t)).toBeTruthy()
      expect(document.documentElement.classList.contains(initialTheme)).toBeFalsy()
    })
  })
})
