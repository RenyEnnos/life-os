/** @vitest-environment jsdom */
import { describe, it, expect, beforeEach } from 'vitest'
import React from 'react'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import SettingsPage from '../index'
import { AuthProvider } from '@/features/auth/contexts/AuthProvider'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false },
    },
})

const mockUser = {
    id: '1',
    name: 'Alex Morgan',
    email: 'alex.morgan@focusdashboard.co',
}

describe('SettingsPage UI', () => {
    it('renders profile information', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <AuthProvider>
                        <SettingsPage />
                    </AuthProvider>
                </BrowserRouter>
            </QueryClientProvider>
        )

        expect(screen.getByText('Settings')).toBeInTheDocument()
        expect(screen.getByText('Manage your workspace')).toBeInTheDocument()
    })

    it('toggles email notifications', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <AuthProvider>
                        <SettingsPage />
                    </AuthProvider>
                </BrowserRouter>
            </QueryClientProvider>
        )

        const emailToggle = document.getElementById('emailNotifications') as HTMLInputElement
        expect(emailToggle).toBeTruthy()
        expect(emailToggle.checked).toBe(true)

        fireEvent.click(emailToggle)
        expect(emailToggle.checked).toBe(false)
    })

    it('toggles public profile', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <AuthProvider>
                        <SettingsPage />
                    </AuthProvider>
                </BrowserRouter>
            </QueryClientProvider>
        )

        const publicProfileToggle = document.getElementById('publicProfile') as HTMLInputElement
        expect(publicProfileToggle).toBeTruthy()
        expect(publicProfileToggle.checked).toBe(false)

        fireEvent.click(publicProfileToggle)
        expect(publicProfileToggle.checked).toBe(true)
    })

    it('toggles focus mode auto-start', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <AuthProvider>
                        <SettingsPage />
                    </AuthProvider>
                </BrowserRouter>
            </QueryClientProvider>
        )

        const autoFocusToggle = document.getElementById('autoFocus') as HTMLInputElement
        expect(autoFocusToggle).toBeTruthy()
        expect(autoFocusToggle.checked).toBe(true)

        fireEvent.click(autoFocusToggle)
        expect(autoFocusToggle.checked).toBe(false)
    })

    it('updates full name input', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <AuthProvider>
                        <SettingsPage />
                    </AuthProvider>
                </BrowserRouter>
            </QueryClientProvider>
        )

        const fullNameInput = screen.getByDisplayValue('Alex Morgan') as HTMLInputElement
        expect(fullNameInput.value).toBe('Alex Morgan')

        fireEvent.change(fullNameInput, { target: { value: 'Jane Doe' } })
        expect(fullNameInput.value).toBe('Jane Doe')
    })

    it('updates username input', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <AuthProvider>
                        <SettingsPage />
                    </AuthProvider>
                </BrowserRouter>
            </QueryClientProvider>
        )

        const usernameInput = screen.getByDisplayValue('alexm') as HTMLInputElement
        expect(usernameInput.value).toBe('alexm')

        fireEvent.change(usernameInput, { target: { value: 'janedoe' } })
        expect(usernameInput.value).toBe('janedoe')
    })

    it('updates bio textarea', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <AuthProvider>
                        <SettingsPage />
                    </AuthProvider>
                </BrowserRouter>
            </QueryClientProvider>
        )

        const bioTextarea = screen.getByDisplayValue(/Product Designer focusing/i) as HTMLTextAreaElement
        const initialValue = bioTextarea.value
        expect(initialValue.length).toBeGreaterThan(0)

        const newBio = 'This is my new bio.'
        fireEvent.change(bioTextarea, { target: { value: newBio } })
        expect(bioTextarea.value).toBe(newBio)
    })

    it('displays preference titles and descriptions', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <AuthProvider>
                        <SettingsPage />
                    </AuthProvider>
                </BrowserRouter>
            </QueryClientProvider>
        )

        expect(screen.getByText('Email Notifications')).toBeInTheDocument()
        expect(screen.getByText('Receive weekly digests about your productivity stats.')).toBeInTheDocument()

        expect(screen.getByText('Public Profile')).toBeInTheDocument()
        expect(screen.getByText('Allow others to see your focus streaks.')).toBeInTheDocument()

        expect(screen.getByText('Focus Mode Auto-Start')).toBeInTheDocument()
        expect(screen.getByText('Automatically enter DND when timer starts.')).toBeInTheDocument()
    })
})
