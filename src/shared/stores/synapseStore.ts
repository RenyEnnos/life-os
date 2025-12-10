import { create } from 'zustand';

export type SynapseGroup = 'actions' | 'missions' | 'rituals' | 'resources' | 'memory' | 'nexus';

interface SynapseState {
    isOpen: boolean;
    query: string;
    activeGroup: SynapseGroup | null;

    // Actions
    open: () => void;
    close: () => void;
    toggle: () => void;
    setQuery: (query: string) => void;
    setActiveGroup: (group: SynapseGroup | null) => void;
}

export const useSynapseStore = create<SynapseState>()((set) => ({
    isOpen: false,
    query: '',
    activeGroup: null,

    open: () => set({ isOpen: true, query: '' }),
    close: () => set({ isOpen: false }),
    toggle: () => set((state) => ({ isOpen: !state.isOpen, query: state.isOpen ? state.query : '' })),
    setQuery: (query) => set({ query }),
    setActiveGroup: (activeGroup) => set({ activeGroup }),
}));
