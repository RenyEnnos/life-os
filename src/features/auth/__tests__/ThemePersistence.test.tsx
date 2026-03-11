/** @vitest-environment jsdom */
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle } from '@/shared/ui/ThemeToggle'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('light', 'dark')
})

describe('Theme persistence', () => {
  it('persists theme to localStorage and document class', () => {
    render(<ThemeToggle />)
    const btn = screen.getByRole('button', { name: /alternar tema/i })
    
    expect(document.documentElement.classList.contains('light') || document.documentElement.classList.contains('dark')).toBeTruthy()
    fireEvent.click(btn)
    const t = localStorage.getItem('theme')
    expect(t).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
