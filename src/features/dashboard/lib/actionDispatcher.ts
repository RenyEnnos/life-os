import { habitsApi } from '@/features/habits/api/habits.api';
import { tasksApi } from '@/features/tasks/api/tasks.api';
import { useUIStore } from '@/shared/stores/uiStore';

export type SynapseAction = {
    type: 'HABIT_LOG' | 'TASK_COMPLETE' | 'NAVIGATE' | 'OPEN_MODAL';
    payload: any;
};

/**
 * Dispatcher para executar ações reais baseadas em sugestões da IA.
 */
export const actionDispatcher = {
    async execute(action: SynapseAction) {
        console.log('[ActionDispatcher] Executing:', action);
        
        switch (action.type) {
            case 'HABIT_LOG':
                const today = new Date().toISOString().split('T')[0];
                return await habitsApi.log('current-user', action.payload.habitId, action.payload.value || 1, today);
            
            case 'TASK_COMPLETE':
                return await tasksApi.update(action.payload.taskId, { completed: true, status: 'done' });
            
            case 'OPEN_MODAL':
                const uiStore = useUIStore.getState();
                uiStore.openModal(action.payload.modalType, action.payload.data);
                return true;

            default:
                console.warn('[ActionDispatcher] Unknown action type:', action.type);
                return false;
        }
    }
};
