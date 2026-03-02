import React from 'react';
import { BrainCircuit, Sparkles, Target, Zap, Calendar } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { useJournalInsights } from '../hooks/useJournalInsights';
import { motion } from 'framer-motion';

export function WeeklyReflectionCard() {
    const { weeklySummary, isLoading } = useJournalInsights();

    if (isLoading) {
        return <div className="h-64 bg-zinc-900/50 rounded-3xl animate-pulse" />;
    }

    if (!weeklySummary?.content?.summary) {
        return null;
    }

    const { summary, themes, recommendations } = weeklySummary.content;
    const mood_avg = (weeklySummary.content as any).mood_avg;

    return (
        <BentoCard 
            title="Reflexão Semanal AI" 
            icon={BrainCircuit}
            className="col-span-1 md:col-span-2 bg-primary/[0.02] border-primary/20"
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4">
                {/* Summary & Mood */}
                <div className="md:col-span-2 space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary">
                            <Sparkles size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Sintese do Nexus</span>
                        </div>
                        <p className="text-zinc-300 text-sm leading-relaxed font-light italic">
                            "{summary}"
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {themes?.map((theme: string) => (
                            <span key={theme} className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">
                                #{theme}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-6 border-l border-white/5 pl-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-zinc-500">
                            <Target size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Diretrizes</span>
                        </div>
                        
                        <div className="space-y-3">
                            {recommendations?.map((rec: string, i: number) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex gap-3 items-start"
                                >
                                    <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <Zap size={10} className="text-primary" />
                                    </div>
                                    <p className="text-[11px] text-zinc-400 leading-snug">
                                        {rec}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {mood_avg && (
                        <div className="pt-4 border-t border-white/5">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-zinc-500 font-mono">Média Emocional</span>
                                <span className="text-xl font-black text-white">{mood_avg.toFixed(1)}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </BentoCard>
    );
}
