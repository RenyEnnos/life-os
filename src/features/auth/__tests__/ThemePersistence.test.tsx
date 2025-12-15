/** @vitest-environment jsdom */
import { describe, it, expect } from 'vitest'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle } from '@/shared/ui/ThemeToggle'
import { AuthProvider } from '../contexts/AuthContext'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false },
    },
})

describe('Theme persistence', () => {
  it('persists theme to localStorage and document class', () => {
    render(
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AuthProvider>
                    <ThemeToggle />
                </AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    )
    const btn = screen.getByRole('button', { name: /alternar tema/i })
    fireEvent.click(btn)
    const t = localStorage.getItem('theme')
    expect(!!t).toBe(true)
    expect(['light','dark'].includes(t!)).toBe(true)
    expect(document.documentElement.classList.contains(t!)).toBe(true)
  })
})
