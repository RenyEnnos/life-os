import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';

export function useProjects() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: projects, isLoading: loadingProjects } = useQuery({
        queryKey: ['projects', user?.id],
        queryFn: async () => {
            return apiFetch('/api/projects');
        },
        enabled: !!user,
    });

    const createProject = useMutation({
        mutationFn: async (data: any) => {
            return apiFetch('/api/projects', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });

    const updateProject = useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
            return apiFetch(`/api/projects/${id}`, {
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
            return apiFetch(`/api/projects/${id}`, {
                method: 'DELETE',
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });

    // SWOT
    const useSwot = (projectId: string) => {
        const { data: swot, isLoading: loadingSwot } = useQuery({
            queryKey: ['swot', projectId],
            queryFn: async () => {
                if (!projectId) return [];
                return apiFetch(`/api/projects/${projectId}/swot`);
            },
            enabled: !!user && !!projectId,
        });

        const addSwot = useMutation({
            mutationFn: async (data: any) => {
                return apiFetch(`/api/projects/${projectId}/swot`, {
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
                return apiFetch(`/api/projects/swot/${swotId}`, {
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
