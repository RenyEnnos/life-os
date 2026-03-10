import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { apiFetch } from '@/shared/api/http';
import type { Project } from '@/shared/types';

const PROJECTS_API_BASE = '/' + 'api/projects';

export function useProjects() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: projects, isLoading: loadingProjects } = useQuery<Project[]>({
        queryKey: ['projects', user?.id],
        queryFn: async () => {
            return apiFetch<Project[]>(PROJECTS_API_BASE);
        },
        enabled: !!user,
    });

    const createProject = useMutation({
        mutationFn: async (data: Partial<Project>) => {
            return apiFetch(PROJECTS_API_BASE, {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });

    const updateProject = useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Project> }) => {
            return apiFetch(`${PROJECTS_API_BASE}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updates),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });

    const deleteProject = useMutation({
        mutationFn: async (id: string) => {
            return apiFetch(`${PROJECTS_API_BASE}/${id}`, {
                method: 'DELETE',
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });

    // SWOT
    const useSwot = (projectId: string) => {
        type SwotEntry = { id: string; category: 'strength' | 'weakness' | 'opportunity' | 'threat'; content: string }
        const { data: swot, isLoading: loadingSwot } = useQuery<SwotEntry[]>({
            queryKey: ['swot', projectId],
            queryFn: async () => {
                if (!projectId) return [];
                return apiFetch<SwotEntry[]>(`${PROJECTS_API_BASE}/${projectId}/swot`);
            },
            enabled: !!user && !!projectId,
        });

        const addSwot = useMutation({
            mutationFn: async (data: Record<string, unknown>) => {
                return apiFetch(`${PROJECTS_API_BASE}/${projectId}/swot`, {
                    method: 'POST',
                    body: JSON.stringify(data),
                });
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['swot', projectId] });
            },
        });

        const deleteSwot = useMutation({
            mutationFn: async (swotId: string) => {
                return apiFetch(`${PROJECTS_API_BASE}/swot/${swotId}`, {
                    method: 'DELETE',
                });
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['swot', projectId] });
            },
        });

        return { swot, loadingSwot, addSwot, deleteSwot };
    };

    return {
        projects,
        isLoading: loadingProjects,
        createProject,
        updateProject,
        deleteProject,
        useSwot
    };
}
