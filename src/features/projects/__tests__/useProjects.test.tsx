import { renderHook, waitFor } from '@testing-library/react';
import { useProjects } from '../hooks/useProjects';
import { apiFetch } from '@/shared/api/http';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';

const mockUseAuth = vi.fn();

vi.mock('@/shared/api/http', () => ({
    apiFetch: vi.fn(),
}));

vi.mock('@/features/auth/contexts/AuthContext', () => ({
    useAuth: (...args: any[]) => mockUseAuth(...args),
}));

const mockedApiFetch = vi.mocked(apiFetch);

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useProjects', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        queryClient.clear();
        mockUseAuth.mockReturnValue({ user: { id: 'user-123' } });
    });

    it('fetches projects list', async () => {
        const mockProjects = [
            { id: '1', title: 'Project A', status: 'active' },
            { id: '2', title: 'Project B', status: 'completed' },
        ];
        mockedApiFetch.mockResolvedValue(mockProjects as any);

        const { result } = renderHook(() => useProjects(), { wrapper });
        await waitFor(() => expect(result.current.projects).toBeDefined());

        expect(result.current.projects).toEqual(mockProjects);
    });

    it('returns undefined projects when no user', async () => {
        mockUseAuth.mockReturnValue({ user: null });

        const { result } = renderHook(() => useProjects(), { wrapper });
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.projects).toBeUndefined();
    });

    it('createProject calls apiFetch with POST', async () => {
        mockedApiFetch.mockResolvedValue({ id: '3' } as any);

        const { result } = renderHook(() => useProjects(), { wrapper });
        await waitFor(() => expect(result.current.projects).toBeDefined());

        await result.current.createProject.mutateAsync({ title: 'New Project' });

        expect(mockedApiFetch).toHaveBeenCalledWith(
            '/api/projects',
            expect.objectContaining({ method: 'POST' })
        );
    });

    it('deleteProject calls apiFetch with DELETE', async () => {
        mockedApiFetch.mockResolvedValue([{ id: '1', title: 'A' }] as any);

        const { result } = renderHook(() => useProjects(), { wrapper });
        await waitFor(() => expect(result.current.projects).toBeDefined());

        mockedApiFetch.mockResolvedValue(undefined as any);
        await result.current.deleteProject.mutateAsync('1');

        expect(mockedApiFetch).toHaveBeenCalledWith(
            '/api/projects/1',
            expect.objectContaining({ method: 'DELETE' })
        );
    });
});
