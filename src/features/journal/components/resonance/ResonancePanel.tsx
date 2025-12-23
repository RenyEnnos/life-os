import { Sparkles, TrendingUp, TrendingDown, Minus, Tag, BrainCircuit } from 'lucide-react';
import { useJournalInsights } from '../../hooks/useJournalInsights';
import { MoodIndicator } from './MoodIndicator';
import { BentoCard } from '@/shared/ui/BentoCard';

interface ResonancePanelProps {
    entryId?: string;
    showWeekly?: boolean;
}

/**
 * Neural Resonance Panel
 * 
 * Displays AI-generated insights for journal entries including
 * mood tracking, themes, and recommendations.
 */
export function ResonancePanel({ entryId, showWeekly = true }: ResonancePanelProps) {
    const {
        insights,
        weeklySummary,
        moodTrend,
        isLoading,
        getLatestMood,
        getThemes
    } = useJournalInsights({ entryId });

    const currentMood = entryId ? getLatestMood(entryId) : null;
    const themes = entryId ? getThemes(entryId) : [];

    // Calculate mood trend direction
    const getTrendDirection = () => {
        if (!moodTrend || moodTrend.length < 2) return 'neutral';
        const recent = moodTrend.slice(-3).reduce((a, b) => a + b.score, 0) / 3;
        const older = moodTrend.slice(0, 3).reduce((a, b) => a + b.score, 0) / 3;
        if (recent > older + 0.5) return 'up';
        if (recent < older - 0.5) return 'down';
        return 'neutral';
    };

    const trendDirection = getTrendDirection();

    if (isLoading) {
        return (
            <BentoCard title="ANÁLISE NEURAL" icon={BrainCircuit} className="h-full min-h-[400px]">
                <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground animate-pulse">
                    <Sparkles size={24} />
                    <span className="font-mono text-xs tracking-widest uppercase">Sincronizando...</span>
                </div>
            </BentoCard>
        );
    }

    if (!insights?.length && !weeklySummary) {
        return (
            <BentoCard title="ANÁLISE NEURAL" icon={BrainCircuit} className="h-full min-h-[400px]">
                <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                    <BrainCircuit size={24} />
                    <span className="font-mono text-xs tracking-widest uppercase text-center max-w-[200px]">
                        Aguardando dados para ressonância
                    </span>
                </div>
            </BentoCard>
        );
    }

    return (
        <div className="sticky top-4 space-y-4">
            {/* Current Mood */}
            {currentMood !== null && (
                <BentoCard title="ESTADO ATUAL" icon={Sparkles} className="min-h-[140px]">
                    <div className="flex items-center gap-4 mt-2">
                        <MoodIndicator score={currentMood} size="large" />
                        <div>
                            <div className="text-3xl font-bold font-mono text-white tabular-nums">{currentMood}/10</div>
                            <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                                {currentMood >= 7 ? 'Ressonância Alta' : currentMood >= 4 ? 'Estável' : 'Desalinhado'}
                            </div>
                        </div>
                    </div>
                </BentoCard>
            )}

            {/* Mood Trend */}
            {moodTrend && moodTrend.length >= 3 && (
                <BentoCard title="TENDÊNCIA (7 DIAS)" icon={TrendingUp} className="min-h-[160px]">
                    <div className="flex items-end gap-1 h-[60px] mt-4 w-full">
                        {moodTrend.map((point, i) => (
                            <div
                                key={i}
                                className="flex-1 rounded-t-sm bg-primary/20 hover:bg-primary/40 transition-colors relative group"
                                style={{
                                    height: `${(point.score / 10) * 100}%`,
                                }}
                            >
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black/90 text-[10px] text-white px-2 py-1 rounded border border-white/10 whitespace-nowrap z-50 pointer-events-none transition-opacity">
                                    {point.date}: {point.score}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Direção</span>
                        <div className="flex items-center gap-2 text-xs font-mono text-white">
                            {trendDirection === 'up' && <><TrendingUp size={14} className="text-green-400" /> Ascendente</>}
                            {trendDirection === 'down' && <><TrendingDown size={14} className="text-red-400" /> Descendente</>}
                            {trendDirection === 'neutral' && <><Minus size={14} className="text-zinc-500" /> Estável</>}
                        </div>
                    </div>
                </BentoCard>
            )}

            {/* Themes */}
            {themes.length > 0 && (
                <BentoCard title="PADRÕES TEMÁTICOS" icon={Tag} className="min-h-[120px]">
                    <div className="flex flex-wrap gap-2 mt-2">
                        {themes.map((theme, i) => (
                            <span key={i} className="text-[10px] font-mono uppercase tracking-wider bg-white/5 hover:bg-white/10 text-zinc-300 px-2 py-1 rounded border border-white/5 transition-colors cursor-default">
                                {theme}
                            </span>
                        ))}
                    </div>
                </BentoCard>
            )}

            {/* Weekly Summary */}
            {showWeekly && weeklySummary?.content?.summary && (
                <BentoCard title="SÍNTESE SEMANAL" icon={BrainCircuit}>
                    <p className="text-xs text-zinc-400 leading-relaxed font-mono border-l-2 border-primary/20 pl-3 my-2">
                        {weeklySummary.content.summary}
                    </p>
                    <div className="space-y-2 mt-4">
                        {weeklySummary.content.recommendations?.slice(0, 2).map((rec, i) => (
                            <div key={i} className="flex gap-2 items-start text-[11px] text-zinc-500 font-mono">
                                <Sparkles size={12} className="shrink-0 mt-0.5 text-primary/60" />
                                <span>{rec}</span>
                            </div>
                        ))}
                    </div>
                </BentoCard>
            )}
        </div>
    );
}

export default ResonancePanel;
