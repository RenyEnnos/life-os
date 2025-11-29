import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'

export interface Task {
    id: string
    user_id: string
    title: string
    description?: string
    due_date?: string
    priority: 'low' | 'medium' | 'high'
    completed: boolean
    tags: string[]
    project_id?: string
    created_at: string
}

export function useTasks(filters?: any) {
    const queryClient = useQueryClient()

    const queryKey = ['tasks', filters]

    const query = useQuery({
        queryKey,
        queryFn: () => apiClient.get(`/api/tasks?${new URLSearchParams(filters).toString()}`),
    })

    const createTask = useMutation({
        mutationFn: (newTask: Partial<Task>) => apiClient.post('/api/tasks', newTask),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
        },
    })

    const updateTask = useMutation({
        mutationFn: ({ id, ...updates }: { id: string } & Partial<Task>) =>
            apiClient.put(`/api/tasks/${id}`, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
        },
    })

    const deleteTask = useMutation({
        mutationFn: (id: string) => apiClient.delete(`/api/tasks/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
        },
    })

    return {
        tasks: query.data as Task[] | undefined,
        isLoading: query.isLoading,
        error: query.error,
        createTask,
        updateTask,
        deleteTask,
    }
}
