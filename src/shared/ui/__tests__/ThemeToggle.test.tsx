/** @vitest-environment jsdom */
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import ThemeToggle from '../ThemeToggle'

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.removeItem('theme')
    document.documentElement.classList.remove('light', 'dark')
  })

  it('não renderiza botão de alternância de tema', async () => {
    render(<ThemeToggle />)
    expect(screen.queryByRole('button', { name: /alternar tema/i })).toBeNull()
  })
})
