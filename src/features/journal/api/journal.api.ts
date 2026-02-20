import { apiClient } from '@/shared/api/http';
import { JournalEntry, JournalInsight } from '@/shared/types';

/**
 * Validates journal entry ID format
 * @throws {Error} If ID is invalid
 */
function validateEntryId(id: string): void {
    if (!id || typeof id !== 'string' || id.trim() === '') {
        throw new Error('ID da entrada é obrigatório');
    }
}

/**
 * Validates journal entry data for creation/update
 * @throws {Error} If required fields are missing or invalid
 */
function validateEntryData(entry: Partial<JournalEntry>, requireContent = true): void {
    if (!entry || typeof entry !== 'object') {
        throw new Error('Dados da entrada são obrigatórios');
    }

    // Check content field if required
    if (requireContent && (!entry.content || typeof entry.content !== 'string' || entry.content.trim() === '')) {
        throw new Error('Conteúdo da entrada é obrigatório');
    }

    // Validate content length if provided
    if (entry.content !== undefined && entry.content !== null && entry.content.length > 10000) {
        throw new Error('Conteúdo da entrada deve ter no máximo 10000 caracteres');
    }

    // Validate title if provided
    if (entry.title !== undefined && entry.title !== null && typeof entry.title !== 'string') {
        throw new Error('Título deve ser uma string');
    }

    if (entry.title !== undefined && entry.title !== null && entry.title.length > 200) {
        throw new Error('Título deve ter no máximo 200 caracteres');
    }

    // Validate mood_score if provided
    if (entry.mood_score !== undefined && entry.mood_score !== null) {
        if (typeof entry.mood_score !== 'number' || entry.mood_score < 1 || entry.mood_score > 10) {
            throw new Error('Pontuação de humor deve ser um número entre 1 e 10');
        }
    }

    // Validate tags if provided
    if (entry.tags !== undefined && entry.tags !== null && !Array.isArray(entry.tags)) {
        throw new Error('Tags devem ser um array');
    }
}

/**
 * Journal API client with error handling
 * All methods propagate errors from the API layer for centralized handling
 */
export const journalApi = {
    /**
     * Get all journal entries, optionally filtered by date
     * @param _userId - User ID (deprecated, currently unused)
     * @param date - Optional date filter
     * @throws {ApiError} If fetch fails
     */
    list: async (_userId?: string, date?: string): Promise<JournalEntry[]> => {
        const params = date ? `?date=${date}` : '';
        const data = await apiClient.get<JournalEntry[]>(`/api/journal${params}`);
        return data;
    },

    /**
     * Create a new journal entry
     * @param entry - Journal entry data to create
     * @throws {Error} If validation fails
     * @throws {ApiError} If creation fails
     */
    create: async (entry: Partial<JournalEntry>): Promise<JournalEntry> => {
        // Validate input before making request
        validateEntryData(entry, true);

        const data = await apiClient.post<JournalEntry>('/api/journal', entry);
        return data;
    },

    /**
     * Update an existing journal entry
     * @param id - Entry ID to update
     * @param updates - Entry fields to update
     * @throws {Error} If validation fails
     * @throws {ApiError} If update fails
     */
    update: async (id: string, updates: Partial<JournalEntry>): Promise<JournalEntry> => {
        // Validate inputs before making request
        validateEntryId(id);
        validateEntryData(updates, false);

        const data = await apiClient.put<JournalEntry>(`/api/journal/${id}`, updates);
        return data;
    },

    /**
     * Delete a journal entry
     * @param id - Entry ID to delete
     * @throws {Error} If validation fails
     * @throws {ApiError} If deletion fails
     */
    delete: async (id: string): Promise<void> => {
        // Validate input before making request
        validateEntryId(id);

        await apiClient.delete(`/api/journal/${id}`);
    },

    /**
     * Analyze a journal entry to generate insights
     * @param entry - Journal entry to analyze
     * @throws {Error} If validation fails
     * @throws {ApiError} If analysis fails
     * @returns Journal insight or null if no insight generated
     */
    analyzeEntry: async (entry: JournalEntry): Promise<JournalInsight | null> => {
        // Validate input before making request
        if (!entry.id) {
            throw new Error('ID da entrada é obrigatório para análise');
        }

        const data = await apiClient.post<{ success: boolean; insight?: JournalInsight }>(
            `/api/resonance/analyze/${entry.id}`,
            {}
        );
        return data.insight ?? null;
    }
};
