import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { aiApi } from '@/features/ai-assistant/api/ai.api';
import { BentoCard } from '@/shared/ui/BentoCard';
import { Sparkles, ArrowRight, Lightbulb, Zap } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/Button';

export function SynapseWidget() {
    const { data, isLoading } = useQuery({
        queryKey: ['synapse-suggestions'],
        queryFn: () => aiApi.getSuggestions(),
        refetchInterval: 60000, // Refresh every minute
    });

    const suggestions = data?.suggestions || [];

    return (
        <BentoCard 
            title="Synapse Insights" 
            icon={Sparkles}
            className="col-span-1 md:col-span-2 row-span-1 border-purple-500/20 bg-purple-500/[0.02]"
        >
            <div className="h-full flex flex-col justify-between py-2">
                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Zap className="animate-pulse text-purple-500/40" size={32} />
                    </div>
                ) : !suggestions.length ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
                        <Lightbulb size={24} className="mb-2" />
                        <p className="text-[10px] font-mono uppercase tracking-widest">Aguardando novos dados</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {suggestions.map((s) => (
                            <div key={s.id} className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-all group cursor-pointer">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                                        <Zap size={12} />
                                    </div>
                                    <ArrowRight size={12} className="text-zinc-600 group-hover:text-purple-400 transition-colors" />
                                </div>
                                <h4 className="text-[11px] font-bold text-white mb-1 line-clamp-1 group-hover:text-purple-300 transition-colors">
                                    {s.title}
                                </h4>
                                <p className="text-[9px] text-zinc-500 leading-tight line-clamp-2">
                                    {s.rationale}
                                </p>
                                <div className="mt-3 pt-2 border-t border-white/5">
                                    <span className="text-[8px] font-mono uppercase tracking-tighter text-purple-500/60 font-bold">
                                        {s.action_label}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </BentoCard>
    );
}
