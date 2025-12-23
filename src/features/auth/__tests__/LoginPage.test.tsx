/** @vitest-environment jsdom */
import { describe, it, expect } from 'vitest'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import LoginPage from '../components/LoginPage'
import { AuthProvider } from '../contexts/AuthProvider'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false },
    },
})

describe('LoginPage UI', () => {
  it('toggles password visibility', () => {
    render(
        <QueryClientProvider client={queryClient}>
            <BrowserRouter><AuthProvider><LoginPage /></AuthProvider></BrowserRouter>
        </QueryClientProvider>
    )
    const pwd = screen.getByLabelText('Senha') as HTMLInputElement
    expect(pwd.type).toBe('password')
    const eyeBtn = screen.getByRole('button', { name: /exibir senha|ocultar senha/i }) // Match aria-label broadly
    // Or just look for the icon button if aria-label is not set correctly.
    // Assuming the previous test failed because of QueryClient, not the selector.
    // But let's check aria-label in code later if it fails.
    fireEvent.click(eyeBtn)
    expect((screen.getByLabelText('Senha') as HTMLInputElement).type).toBe('text')
  })
})
