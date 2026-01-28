import {
    CheckSquare,
    Target,
    Repeat,
    Wallet,
    BookOpen,
    Sparkles,
    LayoutDashboard,
    Plus,
    Search,
    Moon,
} from 'lucide-react';
import { SynapseCommand } from './types';
import { useSanctuaryStore } from '../../stores/sanctuaryStore';
import { useUIStore } from '../../stores/uiStore';

/**
 * Static command definitions organized by Life OS nomenclature groups.
 * These are navigation and quick-action commands.
 * Pattern-matched commands are handled separately in patterns.ts
 */
import { NavigateFunction } from 'react-router-dom';

export const getStaticCommands = (navigate: NavigateFunction): SynapseCommand[] => [
    // Actions (Tasks)
    {
        id: 'go-actions',
        label: 'Go to Actions',
        description: 'View all your actions',
        icon: CheckSquare,
        group: 'actions',
        shortcut: ['G', 'A'],
        action: () => { navigate('/tasks'); },
        keywords: ['tasks', 'todo', 'actions'],
    },
    {
        id: 'new-action',
        label: 'New Action',
        description: 'Create a new action item',
        icon: Plus,
        group: 'actions',
        shortcut: ['N', 'A'],
        action: () => { useUIStore.getState().openModal('action'); },
        keywords: ['task', 'todo', 'add', 'create'],
    },

    // Missions (Projects)
    {
        id: 'go-missions',
        label: 'Go to Missions',
        description: 'View all your missions',
        icon: Target,
        group: 'missions',
        shortcut: ['G', 'M'],
        action: () => { navigate('/projects'); },
        keywords: ['projects', 'goals', 'missions'],
    },
    {
        id: 'new-mission',
        label: 'New Mission',
        description: 'Create a new mission',
        icon: Plus,
        group: 'missions',
        action: () => { useUIStore.getState().openModal('mission'); },
        keywords: ['project', 'goal', 'add', 'create'],
    },

    // Rituals (Habits)
    {
        id: 'go-rituals',
        label: 'Go to Rituals',
        description: 'View all your rituals',
        icon: Repeat,
        group: 'rituals',
        shortcut: ['G', 'R'],
        action: () => { navigate('/habits'); },
        keywords: ['habits', 'routines', 'rituals'],
    },
    {
        id: 'new-ritual',
        label: 'New Ritual',
        description: 'Create a new ritual',
        icon: Plus,
        group: 'rituals',
        action: () => { useUIStore.getState().openModal('ritual'); },
        keywords: ['habit', 'routine', 'add', 'create'],
    },

    // Resources (Finances)
    {
        id: 'go-resources',
        label: 'Go to Resources',
        description: 'View your financial resources',
        icon: Wallet,
        group: 'resources',
        shortcut: ['G', 'F'],
        action: () => { navigate('/finances'); },
        keywords: ['finances', 'money', 'budget', 'resources'],
    },
    {
        id: 'new-transaction',
        label: 'New Transaction',
        description: 'Record a new transaction',
        icon: Plus,
        group: 'resources',
        action: () => { navigate('/finances?new=true'); },
        keywords: ['expense', 'income', 'add', 'create'],
    },

    // Memory (Journal)
    {
        id: 'go-memory',
        label: 'Go to Memory',
        description: 'Access your second brain',
        icon: BookOpen,
        group: 'memory',
        shortcut: ['G', 'J'],
        action: () => { navigate('/journal'); },
        keywords: ['journal', 'notes', 'memory', 'diary'],
    },
    {
        id: 'new-memory',
        label: 'New Memory Entry',
        description: 'Create a new journal entry',
        icon: Plus,
        group: 'memory',
        action: () => { useUIStore.getState().openModal('journal'); },
        keywords: ['journal', 'note', 'add', 'create'],
    },

    // Nexus (AI Assistant)
    {
        id: 'ask-nexus',
        label: 'Ask Nexus',
        description: 'Get AI assistance',
        icon: Sparkles,
        group: 'nexus',
        shortcut: ['A', 'N'],
        action: () => { navigate('/ai-assistant'); },
        keywords: ['ai', 'assistant', 'help', 'nexus', 'chat'],
    },
    {
        id: 'search-all',
        label: 'Search Everything',
        description: 'Global search across all data',
        icon: Search,
        group: 'nexus',
        shortcut: ['/', '/'],
        action: () => { useUIStore.getState().openModal('search'); },
        keywords: ['search', 'find', 'query'],
    },
    {
        id: 'enter-sanctuary',
        label: 'Enter Sanctuary',
        description: 'Focus mode with ambient audio',
        icon: Moon,
        group: 'nexus',
        shortcut: ['E', 'S'],
        action: () => { useSanctuaryStore.getState().enter('focus', 'Deep Focus'); },
        keywords: ['focus', 'sanctuary', 'concentrate', 'zen', 'noise'],
    },

    // Navigation - Horizon (Dashboard)
    {
        id: 'go-horizon',
        label: 'Go to Horizon',
        description: 'Return to your dashboard',
        icon: LayoutDashboard,
        group: 'actions',
        shortcut: ['G', 'H'],
        action: () => { navigate('/'); },
        keywords: ['home', 'dashboard', 'horizon', 'overview'],
    },
];

/**
 * Get commands filtered by group
 */
export function getCommandsByGroup(group: string, commands: SynapseCommand[]): SynapseCommand[] {
    return commands.filter((cmd) => cmd.group === group);
}

/**
 * Search commands by query (fuzzy match on label, description, keywords)
 */
export function searchCommands(query: string, commands: SynapseCommand[]): SynapseCommand[] {
    if (!query.trim()) return commands;

    const normalizedQuery = query.toLowerCase().trim();

    return commands.filter((cmd) => {
        const searchTargets = [
            cmd.label,
            cmd.description || '',
            ...(cmd.keywords || []),
        ].map((s) => s.toLowerCase());

        return searchTargets.some((target) => target.includes(normalizedQuery));
    });
}
