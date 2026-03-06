import { create } from 'zustand';

export interface SyncConflict {
  id: string;
  itemId: string;
  table: string;
  localData: Record<string, unknown>;
  serverData: Record<string, unknown>;
  endpoint: string;
  method: string;
}

interface SyncConflictState {
  conflicts: SyncConflict[];
  addConflict: (conflict: SyncConflict) => void;
  resolveConflict: (id: string) => void;
  clearConflicts: () => void;
}

export const useSyncConflictStore = create<SyncConflictState>((set) => ({
  conflicts: [],
  addConflict: (conflict) => set((state) => ({
    conflicts: [...state.conflicts.filter(c => c.itemId !== conflict.itemId), conflict]
  })),
  resolveConflict: (id) => set((state) => ({
    conflicts: state.conflicts.filter((c) => c.id !== id)
  })),
  clearConflicts: () => set({ conflicts: [] }),
}));
