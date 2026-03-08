/** @vitest-environment jsdom */
import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'
import SettingsPage from '../index'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock hooks
vi.mock('@/features/auth/contexts/AuthContext', () => ({
    useAuth: () => ({
        user: { 
            id: '1', 
            email: 'alex@example.com',
            user_metadata: { full_name: 'Alex Morgan' }
        }
    })
}));

vi.mock('@/features/user/hooks/useUser', () => ({
    useUser: () => ({
        userProfile: {
            nickname: 'alexm',
            full_name: 'Alex Morgan',
            email: 'alex@example.com',
            preferences: {
                bio: 'Product Designer focusing on productivity tools.',
                location: 'San Francisco, CA'
            }
        },
        isLoading: false,
        updatePreferences: { mutate: vi.fn() }
    })
}));

vi.mock('@/features/rewards/hooks/useRewards', () => ({
    useRewards: () => ({
        lifeScore: { level: 5, current_xp: 500 }
    })
}));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false },
    },
})

describe('SettingsPage UI', () => {
    it.skip('renders user hub information', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <SettingsPage />
                </BrowserRouter>
            </QueryClientProvider>
        )

        expect(screen.getByText('User Hub')).toBeInTheDocument()
        expect(screen.getByText('Workspace Control')).toBeInTheDocument()
    })

    it.skip('renders profile identity in Identity tab', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <SettingsPage />
                </BrowserRouter>
            </QueryClientProvider>
        )

        // Using getAllByText and checking the first one or using a more specific query
        // The identity name should be in a heading
        const nameElements = screen.getAllByText('Alex Morgan');
        expect(nameElements.length).toBeGreaterThan(0);
        expect(screen.getByText('@alex')).toBeInTheDocument();
    })

    it.skip('displays navigation items', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <SettingsPage />
                </BrowserRouter>
            </QueryClientProvider>
        )

        // Use getAllByText for nav items that appear in both mobile and desktop views
        expect(screen.getAllByText('Identity').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Preferences').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Appearance').length).toBeGreaterThan(0)
    })
})
