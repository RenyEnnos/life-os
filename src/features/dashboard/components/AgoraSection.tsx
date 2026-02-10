import { useMemo } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { motion, useReducedMotion } from 'framer-motion';
import { useDashboardData } from '@/features/dashboard/hooks/useDashboardData';
import { cn } from '@/shared/lib/cn';
import type { Task, VitalLoadSummary } from '@/shared/types';
import { aiApi } from '@/features/ai-assistant/api/ai.api';
import type { SynapseSuggestion } from '@/features/ai-assistant/types';
import { useAuth } from '@/features/auth/contexts/AuthContext';

type DayPart = 'morning' | 'afternoon' | 'night';

type AgoraCTA = {
    id: string;
    title: string;
    description: string;
    actionLabel: string;
    accent: string;
    source?: 'synapse' | 'fallback';
    suggestionId?: string;
};

const dayPartCopy: Record<DayPart, { title: string; subtitle: string; gradient: string }> = {
    morning: {
        title: 'Agora — Manhã',
        subtitle: 'Escolhas leves: foco + ritual',
        gradient: 'radial-gradient(circle at 20% 20%, rgba(56,189,248,0.28), transparent 55%)'
    },
    afternoon: {
        title: 'Agora — Tarde',
        subtitle: 'Execução guiada com pausas',
        gradient: 'radial-gradient(circle at 80% 10%, rgba(52,211,153,0.2), transparent 55%)'
    },
    night: {
        title: 'Agora — Noite',
        subtitle: 'Reflexão e desacelerar',
        gradient: 'radial-gradient(circle at 50% 10%, rgba(129,140,248,0.24), transparent 60%)'
    }
};

// Helper removed as unused



function getDayPart(now = new Date()): DayPart {
    const hour = now.getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    return 'night';
}

export function AgoraSection() {
    const { user } = useAuth();
    const prefersReducedMotion = useReducedMotion();
    const { habitConsistency, vitalLoad, isLoading } = useDashboardData();
    const dayPart = getDayPart();
    const { data: synapseData, isLoading: suggestionsLoading } = useQuery({
        queryKey: ['synapse-suggestions'],
        queryFn: aiApi.getSuggestions,
        enabled: !!user
    });
    const feedback = useMutation({
        mutationFn: aiApi.sendSuggestionFeedback
    });

    const ctas = useMemo(() => {
        const suggestions = synapseData?.suggestions || [];
        return mapSuggestionsToCTAs(suggestions);
    }, [synapseData?.suggestions]);

    const loading = isLoading || suggestionsLoading;

    return (
        <section data-testid="agora-section" className="relative mb-10 overflow-hidden rounded-3xl border border-white/10 bg-black">
            <div className={cn(
                'absolute inset-0 pointer-events-none',
                'bg-gradient-to-br from-white/5 via-white/0 to-white/0'
            )} />
            <div className="absolute inset-0 blur-3xl opacity-70 pointer-events-none"
                style={{ background: dayPartCopy[dayPart].gradient }}
            />

            <div className="relative px-6 py-6 lg:px-10 lg:py-8">
                <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Nexus</p>
                        <h1 className="text-3xl lg:text-4xl font-light text-white tracking-tight">{dayPartCopy[dayPart].title}</h1>
                        <p className="text-sm text-zinc-400 mt-1">{dayPartCopy[dayPart].subtitle}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <VitalBadge vitalLoad={vitalLoad} />
                        <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2 text-xs text-zinc-300">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            Ritmo de hábitos: {habitConsistency?.percentage ?? 0}%
                        </div>
                    </div>
                </header>

                <div className="grid gap-4 md:grid-cols-3">
                    {loading && (
                        <>
                            {[0, 1, 2].map((i) => (
                                <div key={i} className="h-28 rounded-2xl bg-white/5 border border-white/5 animate-pulse" />
                            ))}
                        </>
                    )}
                    {!loading && ctas.length === 0 && (
                        <div className="col-span-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-zinc-300">
                            O Synapse está analisando seu contexto... ou talvez você esteja livre por agora.
                        </div>
                    )}
                    {!loading && ctas.slice(0, 3).map((cta, idx) => (
                        <motion.div
                            key={cta.id}
                            initial={prefersReducedMotion ? false : { y: 16, opacity: 0 }}
                            animate={prefersReducedMotion ? {} : { y: 0, opacity: 1 }}
                            transition={{ duration: 0.24, delay: idx * 0.05 }}
                            whileHover={prefersReducedMotion ? {} : { scale: 1.01 }}
                            className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-4"
                            onClick={() => {
                                if (cta.suggestionId) {
                                    feedback.mutate({ suggestionId: cta.suggestionId, action: 'accepted', source: cta.source });
                                }
                            }}
                        >
                            <div className={cn(
                                'absolute inset-0 opacity-60 pointer-events-none',
                                'bg-gradient-to-br',
                                cta.accent
                            )} />
                            <div className="relative flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{cta.actionLabel}</p>
                                    {cta.source === 'synapse' && (
                                        <span className="text-[10px] text-emerald-300/80 font-semibold">Synapse</span>
                                    )}
                                </div>
                                <h3 className="text-lg text-white font-medium leading-snug">{cta.title}</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed">{cta.description}</p>
                                {cta.suggestionId && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            className="self-start rounded-full px-3 py-1 text-[11px] font-semibold text-black bg-white hover:bg-zinc-200 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                feedback.mutate({ suggestionId: cta.suggestionId!, action: 'accepted', source: cta.source });
                                            }}
                                        >
                                            Executar
                                        </button>
                                        <button
                                            type="button"
                                            className="text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                feedback.mutate({ suggestionId: cta.suggestionId!, action: 'dismissed', source: cta.source });
                                            }}
                                        >
                                            Ignorar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// buildCTAs removed to enforce backend reliance

function VitalBadge({ vitalLoad }: { vitalLoad: VitalLoadSummary }) {
    const color = vitalLoad.state === 'overloaded'
        ? 'bg-amber-500/20 border-amber-400/40 text-amber-100'
        : vitalLoad.state === 'underloaded'
            ? 'bg-blue-500/15 border-blue-400/40 text-blue-100'
            : 'bg-emerald-500/15 border-emerald-400/30 text-emerald-100';

    return (
        <div className={cn(
            'rounded-full px-4 py-2 text-xs font-medium flex items-center gap-2 backdrop-blur',
            'border',
            color
        )}>
            <span className="w-2 h-2 rounded-full bg-current" />
            {vitalLoad.label}
        </div>
    );
}

function mapSuggestionsToCTAs(suggestions: SynapseSuggestion[]): AgoraCTA[] {
    const accents = [
        'from-indigo-500/25 via-cyan-500/10 to-transparent',
        'from-emerald-500/20 via-teal-500/10 to-transparent',
        'from-amber-500/20 via-orange-500/10 to-transparent'
    ];

    return suggestions.slice(0, 3).map((s, idx) => ({
        id: `syn-${s.id}`,
        title: s.title,
        description: s.rationale,
        actionLabel: s.action_label || 'Agir',
        accent: accents[idx] || accents[0],
        source: 'synapse',
        suggestionId: s.id
    }));
}
