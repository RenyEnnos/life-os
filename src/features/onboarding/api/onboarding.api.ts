import { apiClient } from '@/shared/api/http';
import { Onboarding } from '@/shared/types';

/**
 * Validates step format
 * @throws {Error} If step is invalid
 */
function validateStep(step: string): void {
    if (!step || typeof step !== 'string' || step.trim() === '') {
        throw new Error('Etapa é obrigatória');
    }
}

/**
 * Validates onboarding data for creation/update
 * @throws {Error} If required fields are missing or invalid
 */
function validateOnboardingData(data: Partial<Onboarding>): void {
    if (!data || typeof data !== 'object') {
        throw new Error('Dados de onboarding são obrigatórios');
    }

    if (data.current_step !== undefined) {
        if (typeof data.current_step !== 'string' || data.current_step.trim() === '') {
            throw new Error('Etapa atual deve ser uma string válida');
        }
    }

    if (data.steps_completed !== undefined) {
        if (typeof data.steps_completed !== 'object' || Array.isArray(data.steps_completed)) {
            throw new Error('Etapas concluídas deve ser um objeto');
        }
    }

    if (data.completed !== undefined && typeof data.completed !== 'boolean') {
        throw new Error('Status de conclusão deve ser um booleano');
    }

    if (data.skipped !== undefined && typeof data.skipped !== 'boolean') {
        throw new Error('Status de ignorado deve ser um booleano');
    }
}

/**
 * Validates step progress update data
 * @throws {Error} If required fields are missing or invalid
 */
function validateStepProgress(step: string, completed: boolean): void {
    validateStep(step);

    if (typeof completed !== 'boolean') {
        throw new Error('Status de conclusão é obrigatório e deve ser um booleano');
    }
}

/**
 * Onboarding API client with error handling
 * All methods propagate errors from the API layer for centralized handling
 */
export const onboardingApi = {
    /**
     * Get user onboarding progress
     * @throws {ApiError} If fetch fails
     */
    get: async (): Promise<Onboarding> => {
        const data = await apiClient.get<Onboarding>('/api/onboarding');
        return data;
    },

    /**
     * Create initial onboarding progress record
     * @param data - Onboarding data to create
     * @throws {Error} If validation fails
     * @throws {ApiError} If creation fails
     */
    create: async (data: Partial<Onboarding> = {}): Promise<Onboarding> => {
        // Validate input before making request
        validateOnboardingData(data);

        const responseData = await apiClient.post<Onboarding>('/api/onboarding', {
            current_step: data.current_step || 'welcome'
        });
        return responseData;
    },

    /**
     * Update onboarding progress
     * @param data - Onboarding fields to update
     * @throws {Error} If validation fails
     * @throws {ApiError} If update fails
     */
    update: async (data: Partial<Onboarding>): Promise<Onboarding> => {
        // Validate input before making request
        validateOnboardingData(data);

        const responseData = await apiClient.put<Onboarding>('/api/onboarding', data);
        return responseData;
    },

    /**
     * Update individual step progress
     * @param step - Step identifier
     * @param completed - Whether the step is completed
     * @throws {Error} If validation fails
     * @throws {ApiError} If update fails
     */
    updateStepProgress: async (step: string, completed: boolean): Promise<Onboarding> => {
        // Validate inputs before making request
        validateStepProgress(step, completed);

        const data = await apiClient.post<Onboarding>('/api/onboarding/progress', {
            step,
            completed
        });
        return data;
    }
};
