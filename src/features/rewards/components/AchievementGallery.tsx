import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { rewardsApi } from '../api/rewards.api';
import { AchievementCard } from './AchievementCard';
import { Trophy, Lock } from 'lucide-react';
import { Skeleton } from '@/shared/ui/Skeleton';

export function AchievementGallery() {
    const { data: achievements, isLoading } = useQuery({
        queryKey: ['achievements-catalog'],
        queryFn: () => rewardsApi.getAchievementsCatalog(),
    });

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-zinc-900 animate-pulse rounded-xl" />)}
            </div>
        );
    }

    const unlockedCount = achievements?.filter(a => a.unlocked).length || 0;
    const totalCount = achievements?.length || 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Trophy size={20} className="text-primary" />
                    Galeria de Conquistas
                </h2>
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">
                    {unlockedCount} / {totalCount} DESBLOQUEADAS
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements?.map((a) => (
                    <div key={a.id} className="relative group">
                        {!a.unlocked && (
                            <div className="absolute top-3 right-3 z-10 text-zinc-600">
                                <Lock size={14} />
                            </div>
                        )}
                        <AchievementCard 
                            achievement={a} 
                            unlocked={!!a.unlocked}
                            onClick={() => {}}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
