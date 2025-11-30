/** @vitest-environment jsdom */
import { describe, it, expect } from 'vitest'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import LoginPage from '../LoginPage'
import { AuthProvider } from '@/contexts/AuthContext'
import { BrowserRouter } from 'react-router-dom'

describe('Theme persistence', () => {
  it('persists theme to localStorage and document class', () => {
    render(<BrowserRouter><AuthProvider><LoginPage /></AuthProvider></BrowserRouter>)
    const btn = screen.getByRole('button', { name: /alternar tema/i })
    fireEvent.click(btn)
    const t = localStorage.getItem('theme')
    expect(!!t).toBe(true)
    expect(['light','dark'].includes(t!)).toBe(true)
    expect(document.documentElement.classList.contains(t!)).toBe(true)
  })
})
