/** @vitest-environment jsdom */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { OnboardingModal } from '../OnboardingModal'

// Mock the hooks
vi.mock('@/features/habits/hooks/useHabits', () => ({
    useHabits: vi.fn(() => ({
        createHabit: { mutate: vi.fn() }
    }))
}))

vi.mock('@/features/tasks/hooks/useTasks', () => ({
    useTasks: vi.fn(() => ({
        createTask: { mutate: vi.fn() }
    }))
}))

vi.mock('@/features/finances/hooks/useTransactions', () => ({
    useTransactions: vi.fn(() => ({
        createTransaction: { mutate: vi.fn() }
    }))
}))

vi.mock('@/shared/stores/onboardingStore', () => ({
    useOnboardingStore: vi.fn(() => ({
        completeOnboarding: vi.fn()
    }))
}))

// Mock the form components
vi.mock('@/features/habits/components/CreateHabitForm', () => ({
    CreateHabitForm: ({ onSubmit, onCancel }: any) => (
        <div data-testid="create-habit-form">
            <button onClick={() => onSubmit({ name: 'Test Habit' })}>Submit Habit</button>
            <button onClick={onCancel}>Cancel Habit</button>
        </div>
    )
}))

vi.mock('@/features/tasks/components/CreateTaskForm', () => ({
    CreateTaskForm: ({ onSubmit, onCancel }: any) => (
        <div data-testid="create-task-form">
            <button onClick={() => onSubmit({ title: 'Test Task' })}>Submit Task</button>
            <button onClick={onCancel}>Cancel Task</button>
        </div>
    )
}))

vi.mock('@/features/finances/components/TransactionForm', () => ({
    TransactionForm: ({ onSubmit, onCancel }: any) => (
        <div data-testid="create-transaction-form">
            <button onClick={() => onSubmit({ amount: 100 })}>Submit Transaction</button>
            <button onClick={onCancel}>Cancel Transaction</button>
        </div>
    )
}))

// Mock premium UI components
vi.mock('@/shared/ui/premium/AnimatedGradientText', () => ({
    AnimatedGradientText: ({ children }: any) => <span className="gradient-text">{children}</span>
}))

vi.mock('@/shared/ui/premium/ShimmerButton', () => ({
    ShimmerButton: ({ onClick, children, className }: any) => (
        <button onClick={onClick} className={className}>{children}</button>
    )
}))

vi.mock('@/shared/ui/premium/Confetti', () => ({
    Confetti: vi.fn()
}))

import { useOnboardingStore } from '@/shared/stores/onboardingStore'

describe('OnboardingModal UI', () => {
    const mockOnClose = vi.fn()
    const mockCompleteOnboarding = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(useOnboardingStore).mockReturnValue({
            completeOnboarding: mockCompleteOnboarding
        })
    })

    it('does not render when isOpen is false', () => {
        const { container } = render(
            <OnboardingModal isOpen={false} onClose={mockOnClose} />
        )

        expect(container.firstChild).toBeNull()
    })

    it('renders welcome step when isOpen is true', () => {
        render(
            <OnboardingModal isOpen={true} onClose={mockOnClose} />
        )

        expect(screen.getByText('LIFE OS')).toBeInTheDocument()
        expect(screen.getByText('Sistema Operacional Pessoal')).toBeInTheDocument()
        expect(screen.getByText(/INICIAR CONFIGURAÇÃO/i)).toBeInTheDocument()
    })

    it('navigates to focus step when clicking iniciar configuração', () => {
        render(
            <OnboardingModal isOpen={true} onClose={mockOnClose} />
        )

        const startButton = screen.getByText(/INICIAR CONFIGURAÇÃO/i)
        fireEvent.click(startButton)

        expect(screen.getByText(/DEFINIR FOCO PRIMÁRIO/i)).toBeInTheDocument()
        expect(screen.getByText(/PRODUTIVIDADE/i)).toBeInTheDocument()
        expect(screen.getByText(/BIO-RITMO/i)).toBeInTheDocument()
        expect(screen.getByText(/CAPITAL/i)).toBeInTheDocument()
    })

    it('selects focus option and enables confirm button', () => {
        render(
            <OnboardingModal isOpen={true} onClose={mockOnClose} />
        )

        // Navigate to focus step
        fireEvent.click(screen.getByText(/INICIAR CONFIGURAÇÃO/i))

        const productivityButton = screen.getByText(/PRODUTIVIDADE/i)
        fireEvent.click(productivityButton)

        const confirmButton = screen.getByText(/CONFIRMAR/i)
        expect(confirmButton).toBeInTheDocument()
    })

    it('navigates through steps when clicking confirm', () => {
        render(
            <OnboardingModal isOpen={true} onClose={mockOnClose} />
        )

        // Navigate to focus step
        fireEvent.click(screen.getByText(/INICIAR CONFIGURAÇÃO/i))

        // Select focus
        fireEvent.click(screen.getByText(/PRODUTIVIDADE/i))

        // Confirm and go to habit step
        fireEvent.click(screen.getByText(/CONFIRMAR/i))
        expect(screen.getByText(/QUICK WIN: HÁBITO/i)).toBeInTheDocument()
    })

    it('shows habit form with skip option', () => {
        render(
            <OnboardingModal isOpen={true} onClose={mockOnClose} />
        )

        // Navigate to habit step
        fireEvent.click(screen.getByText(/INICIAR CONFIGURAÇÃO/i))
        fireEvent.click(screen.getByText(/PRODUTIVIDADE/i))
        fireEvent.click(screen.getByText(/CONFIRMAR/i))

        expect(screen.getByText(/QUICK WIN: HÁBITO/i)).toBeInTheDocument()
        expect(screen.getByTestId('create-habit-form')).toBeInTheDocument()
        expect(screen.getByText(/Pular por enquanto/i)).toBeInTheDocument()
    })

    it('submits habit form and navigates to task step', () => {
        render(
            <OnboardingModal isOpen={true} onClose={mockOnClose} />
        )

        // Navigate to habit step
        fireEvent.click(screen.getByText(/INICIAR CONFIGURAÇÃO/i))
        fireEvent.click(screen.getByText(/PRODUTIVIDADE/i))
        fireEvent.click(screen.getByText(/CONFIRMAR/i))

        // Submit habit form
        const submitButton = screen.getByText(/Submit Habit/i)
        fireEvent.click(submitButton)

        expect(screen.getByText(/QUICK WIN: TAREFA/i)).toBeInTheDocument()
    })

    it('skips habit step and goes to task step', () => {
        render(
            <OnboardingModal isOpen={true} onClose={mockOnClose} />
        )

        // Navigate to habit step
        fireEvent.click(screen.getByText(/INICIAR CONFIGURAÇÃO/i))
        fireEvent.click(screen.getByText(/PRODUTIVIDADE/i))
        fireEvent.click(screen.getByText(/CONFIRMAR/i))

        // Skip habit step
        fireEvent.click(screen.getByText(/Pular por enquanto/i))

        expect(screen.getByText(/QUICK WIN: TAREFA/i)).toBeInTheDocument()
    })

    it('shows task form with skip option', () => {
        render(
            <OnboardingModal isOpen={true} onClose={mockOnClose} />
        )

        // Navigate to task step
        fireEvent.click(screen.getByText(/INICIAR CONFIGURAÇÃO/i))
        fireEvent.click(screen.getByText(/PRODUTIVIDADE/i))
        fireEvent.click(screen.getByText(/CONFIRMAR/i))
        fireEvent.click(screen.getByText(/Pular por enquanto/i))

        expect(screen.getByText(/QUICK WIN: TAREFA/i)).toBeInTheDocument()
        expect(screen.getByTestId('create-task-form')).toBeInTheDocument()
        expect(screen.getByText(/Pular por enquanto/i)).toBeInTheDocument()
    })

    it('submits task form and navigates to finance step', () => {
        render(
            <OnboardingModal isOpen={true} onClose={mockOnClose} />
        )

        // Navigate to task step
        fireEvent.click(screen.getByText(/INICIAR CONFIGURAÇÃO/i))
        fireEvent.click(screen.getByText(/PRODUTIVIDADE/i))
        fireEvent.click(screen.getByText(/CONFIRMAR/i))
        fireEvent.click(screen.getByText(/Pular por enquanto/i))

        // Submit task form
        const submitButton = screen.getByText(/Submit Task/i)
        fireEvent.click(submitButton)

        expect(screen.getByText(/QUICK WIN: FINANÇAS/i)).toBeInTheDocument()
    })

    it('skips task step and goes to finance step', () => {
        render(
            <OnboardingModal isOpen={true} onClose={mockOnClose} />
        )

        // Navigate to task step
        fireEvent.click(screen.getByText(/INICIAR CONFIGURAÇÃO/i))
        fireEvent.click(screen.getByText(/PRODUTIVIDADE/i))
        fireEvent.click(screen.getByText(/CONFIRMAR/i))
        fireEvent.click(screen.getByText(/Pular por enquanto/i))

        // Skip task step
        fireEvent.click(screen.getByText(/Pular por enquanto/i))

        expect(screen.getByText(/QUICK WIN: FINANÇAS/i)).toBeInTheDocument()
    })

    it('shows finance form with skip option', () => {
        render(
            <OnboardingModal isOpen={true} onClose={mockOnClose} />
        )

        // Navigate to finance step
        fireEvent.click(screen.getByText(/INICIAR CONFIGURAÇÃO/i))
        fireEvent.click(screen.getByText(/PRODUTIVIDADE/i))
        fireEvent.click(screen.getByText(/CONFIRMAR/i))
        fireEvent.click(screen.getByText(/Pular por enquanto/i))
        fireEvent.click(screen.getByText(/Pular por enquanto/i))

        expect(screen.getByText(/QUICK WIN: FINANÇAS/i)).toBeInTheDocument()
        expect(screen.getByTestId('create-transaction-form')).toBeInTheDocument()
        expect(screen.getByText(/Pular por enquanto/i)).toBeInTheDocument()
    })

    it('submits finance form and navigates to ready step', () => {
        render(
            <OnboardingModal isOpen={true} onClose={mockOnClose} />
        )

        // Navigate to finance step
        fireEvent.click(screen.getByText(/INICIAR CONFIGURAÇÃO/i))
        fireEvent.click(screen.getByText(/PRODUTIVIDADE/i))
        fireEvent.click(screen.getByText(/CONFIRMAR/i))
        fireEvent.click(screen.getByText(/Pular por enquanto/i))
        fireEvent.click(screen.getByText(/Pular por enquanto/i))

        // Submit finance form
        const submitButton = screen.getByText(/Submit Transaction/i)
        fireEvent.click(submitButton)

        expect(screen.getByText(/SISTEMA ONLINE/i)).toBeInTheDocument()
    })

    it('skips finance step and goes to ready step', () => {
        render(
            <OnboardingModal isOpen={true} onClose={mockOnClose} />
        )

        // Navigate to finance step
        fireEvent.click(screen.getByText(/INICIAR CONFIGURAÇÃO/i))
        fireEvent.click(screen.getByText(/PRODUTIVIDADE/i))
        fireEvent.click(screen.getByText(/CONFIRMAR/i))
        fireEvent.click(screen.getByText(/Pular por enquanto/i))
        fireEvent.click(screen.getByText(/Pular por enquanto/i))

        // Skip finance step
        fireEvent.click(screen.getByText(/Pular por enquanto/i))

        expect(screen.getByText(/SISTEMA ONLINE/i)).toBeInTheDocument()
    })

    it('shows ready step with completion message', () => {
        render(
            <OnboardingModal isOpen={true} onClose={mockOnClose} />
        )

        // Navigate to ready step
        fireEvent.click(screen.getByText(/INICIAR CONFIGURAÇÃO/i))
        fireEvent.click(screen.getByText(/PRODUTIVIDADE/i))
        fireEvent.click(screen.getByText(/CONFIRMAR/i))
        fireEvent.click(screen.getByText(/Pular por enquanto/i))
        fireEvent.click(screen.getByText(/Pular por enquanto/i))
        fireEvent.click(screen.getByText(/Pular por enquanto/i))

        expect(screen.getByText(/SISTEMA ONLINE/i)).toBeInTheDocument()
        expect(screen.getByText(/Você está no comando agora/i)).toBeInTheDocument()
        expect(screen.getByText(/ACESSAR TERMINAL/i)).toBeInTheDocument()
    })

    it('completes onboarding and closes when clicking acessar terminal', () => {
        render(
            <OnboardingModal isOpen={true} onClose={mockOnClose} />
        )

        // Navigate to ready step
        fireEvent.click(screen.getByText(/INICIAR CONFIGURAÇÃO/i))
        fireEvent.click(screen.getByText(/PRODUTIVIDADE/i))
        fireEvent.click(screen.getByText(/CONFIRMAR/i))
        fireEvent.click(screen.getByText(/Pular por enquanto/i))
        fireEvent.click(screen.getByText(/Pular por enquanto/i))
        fireEvent.click(screen.getByText(/Pular por enquanto/i))

        // Complete onboarding
        const completeButton = screen.getByText(/ACESSAR TERMINAL/i)
        fireEvent.click(completeButton)

        expect(mockCompleteOnboarding).toHaveBeenCalled()
        expect(mockOnClose).toHaveBeenCalled()
    })

    it('can skip from welcome step directly', () => {
        render(
            <OnboardingModal isOpen={true} onClose={mockOnClose} />
        )

        const skipButton = screen.getByText(/Pular e ir direto para o app/i)
        fireEvent.click(skipButton)

        expect(mockCompleteOnboarding).toHaveBeenCalled()
        expect(mockOnClose).toHaveBeenCalled()
    })

    it('displays progress indicators', () => {
        const { container } = render(
            <OnboardingModal isOpen={true} onClose={mockOnClose} />
        )

        // Check for progress dots (6 steps) - they are divs with specific classes
        const progressDots = container.querySelectorAll('.rounded-full.transition-all.duration-300')
        expect(progressDots.length).toBe(6)
    })
})
