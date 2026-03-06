import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { JournalEntry } from '@/shared/types';
import { indexedDBStorage } from './storage';

type ModalType = 'action' | 'mission' | 'ritual' | 'journal' | 'search' | null;

type ModalDataMap = {
    action: { id?: string } | null;
    mission: { id?: string } | null;
    ritual: { id?: string } | null;
    journal: JournalEntry | null;
    search: null;
};

type ModalData<T extends ModalType> = T extends keyof ModalDataMap ? ModalDataMap[T] : null;

interface UIStore {
    activeModal: ModalType;
    modalData: ModalDataMap[keyof ModalDataMap] | null;
    _hasHydrated: boolean;
    openModal: <T extends NonNullable<ModalType>>(type: T, data?: ModalData<T>) => void;
    closeModal: () => void;
    setHasHydrated: (state: boolean) => void;
}

export const useUIStore = create<UIStore>()(
    persist(
        (set) => ({
            activeModal: null,
            modalData: null,
            _hasHydrated: false,
            openModal: (type, data = undefined) => set({ activeModal: type, modalData: data }),
            closeModal: () => set({ activeModal: null, modalData: null }),
            setHasHydrated: (state) => set({ _hasHydrated: state }),
        }),
        {
            name: 'life-os-ui',
            storage: createJSONStorage(() => indexedDBStorage),
            onRehydrateStorage: () => {
                return (state, error) => {
                    if (error) {
                        console.error("Erro ao reidratar uiStore:", error);
                    }
                    if (state) {
                        state.setHasHydrated(true);
                    } else {
                        setTimeout(() => {
                            useUIStore.getState().setHasHydrated(true);
                        }, 0);
                    }
                };
            },
            // Não persistir estado de modais abertos, apenas configurações se houver
            partialize: (state) => ({}), 
        }
    )
);
