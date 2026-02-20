/** @vitest-environment jsdom */
import { describe, it, expect } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'
import ProfilePage from '../index'
import { AuthProvider } from '@/features/auth/contexts/AuthProvider'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false },
    },
})

describe('ProfilePage UI', () => {
  it('renders profile header', () => {
    render(
        <QueryClientProvider client={queryClient}>
            <BrowserRouter><AuthProvider><ProfilePage /></AuthProvider></BrowserRouter>
        </QueryClientProvider>
    )

    expect(screen.getByText('User Identity & Legacy')).toBeInTheDocument()
    expect(screen.getByText('Identity System')).toBeInTheDocument()
  })

  it('renders metric cards', () => {
    render(
        <QueryClientProvider client={queryClient}>
            <BrowserRouter><AuthProvider><ProfilePage /></AuthProvider></BrowserRouter>
        </QueryClientProvider>
    )

    expect(screen.getByText('Experience')).toBeInTheDocument()
    expect(screen.getByText('Momentum')).toBeInTheDocument()
    expect(screen.getByText('Total Focus')).toBeInTheDocument()
  })

  it('renders vault section', () => {
    render(
        <QueryClientProvider client={queryClient}>
            <BrowserRouter><AuthProvider><ProfilePage /></AuthProvider></BrowserRouter>
        </QueryClientProvider>
    )

    expect(screen.getByText('Data Vault')).toBeInTheDocument()
    expect(screen.getByText('Bio / Mission')).toBeInTheDocument()
    expect(screen.getByText('Base of Operations')).toBeInTheDocument()
    expect(screen.getByText('Digital Uplink')).toBeInTheDocument()
    expect(screen.getByText('Code Repository')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })
})
