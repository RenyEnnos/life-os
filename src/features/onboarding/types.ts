export type OnboardingStep = 'welcome' | 'focus' | 'habit' | 'task' | 'finance' | 'ready';

export const ONBOARDING_STEPS: OnboardingStep[] = [
    'welcome',
    'focus',
    'habit',
    'task',
    'finance',
    'ready',
];

export interface OnboardingStepConfig {
    id: OnboardingStep;
    label: string;
    description: string;
}

export const STEP_CONFIGS: OnboardingStepConfig[] = [
    { id: 'welcome', label: 'Bem-vindo', description: 'Conheça o Life OS' },
    { id: 'focus', label: 'Foco', description: 'Defina sua prioridade' },
    { id: 'habit', label: 'Hábito', description: 'Crie seu primeiro hábito' },
    { id: 'task', label: 'Tarefa', description: 'Adicione uma tarefa' },
    { id: 'finance', label: 'Finanças', description: 'Registre uma transação' },
    { id: 'ready', label: 'Pronto', description: 'Sistema online' },
];

export interface TourStep {
    target: string;
    title: string;
    content: string;
    placement?: 'top' | 'bottom' | 'left' | 'right';
}

export interface FeatureTutorialStep {
    title: string;
    description: string;
    action?: string;
    icon?: string;
}
