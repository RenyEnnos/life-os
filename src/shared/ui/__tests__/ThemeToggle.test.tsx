/** @vitest-environment jsdom */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ThemeToggle from '../ThemeToggle'
import { AuthProvider } from '@/features/auth/contexts/AuthContext'
import { BrowserRouter } from 'react-router-dom'

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => ({ preferences: { theme: 'light' }, theme: 'light' }) })) as unknown as typeof fetch)
    localStorage.removeItem('theme')
    document.documentElement.classList.remove('light', 'dark')
  })

  it('toggles theme and persists to localStorage', async () => {
    render(<BrowserRouter><AuthProvider><ThemeToggle /></AuthProvider></BrowserRouter>)
    const btn = screen.getByRole('button', { name: /alternar tema/i })
    fireEvent.click(btn)
    const t = localStorage.getItem('theme')
    expect(!!t).toBe(true)
    expect(['light', 'dark'].includes(t!)).toBe(true)
    expect(document.documentElement.classList.contains(t!)).toBe(true)
  })
})
