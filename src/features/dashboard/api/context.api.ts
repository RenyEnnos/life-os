import { apiClient } from '@/shared/api/http'

export interface SynapseContextResponse {
  success: boolean;
  data: {
    market: {
      bitcoin?: { usd: number; usd_24h_change: number };
      ethereum?: { usd: number; usd_24h_change: number };
    } | null;
    weather: {
      temp: number;
      condition: string;
      summary: string;
      location: string;
    } | null;
    news: Array<{
      title: string;
      source: string;
      url: string;
    }>;
    avatar_url: string;
  };
}

export const contextApi = {
  getSynapseBriefing: (lat?: number, lon?: number) => {
    const params = lat && lon ? `?lat=${lat}&lon=${lon}` : '';
    return apiClient.get<SynapseContextResponse>(`/api/context/synapse-briefing${params}`);
  }
}
