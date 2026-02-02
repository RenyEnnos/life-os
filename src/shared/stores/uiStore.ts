import { create } from 'zustand';
import type { JournalEntry, Task } from '@/shared/types';

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
    openModal: <T extends NonNullable<ModalType>>(type: T, data?: ModalData<T>) => void;
    closeModal: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
    activeModal: null,
    modalData: null,
    openModal: (type, data) => set({ activeModal: type, modalData: data ?? null }),
    closeModal: () => set({ activeModal: null, modalData: null }),
}));
