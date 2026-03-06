import { useQuery } from '@tanstack/react-query';
import { contextApi, SynapseContextResponse } from '../api/context.api';

export function useSynapseContext() {
  const { data, isLoading, error, refetch } = useQuery<SynapseContextResponse>({
    queryKey: ['synapse', 'briefing'],
    queryFn: () => contextApi.getSynapseBriefing(),
    staleTime: 1000 * 60 * 15, // 15 minutes - weather/market doesn't change every second
    refetchInterval: 1000 * 60 * 30, // 30 minutes auto-refresh
  });

  return {
    context: data?.data || null,
    isLoading,
    error,
    refresh: refetch
  };
}
