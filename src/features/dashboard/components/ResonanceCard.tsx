import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useJournalInsights } from '@/features/journal/hooks/useJournalInsights';
import { cn } from '@/shared/lib/cn';

/**
 * ResonanceCard - Compact Neural Resonance widget for Dashboard
 * Shows mood score, trend direction, and latest advice
 */
export function ResonanceCard({ className }: { className?: string }) {
    const { weeklySummary, moodTrend, isLoading } = useJournalInsights();

    // Calculate trend direction
    const getTrendDirection = () => {
        if (!moodTrend || moodTrend.length < 2) return 'neutral';
        const recent = moodTrend.slice(-3).reduce((a, b) => a + b.score, 0) / Math.min(3, moodTrend.length);
        const older = moodTrend.slice(0, Math.min(3, moodTrend.length)).reduce((a, b) => a + b.score, 0) / Math.min(3, moodTrend.length);
        if (recent > older + 0.5) return 'up';
        if (recent < older - 0.5) return 'down';
        return 'neutral';
    };

    const trendDirection = getTrendDirection();
    const latestMood = moodTrend && moodTrend.length > 0
        ? moodTrend[moodTrend.length - 1].score
        : null;

    // Get mood color
    const getMoodColor = (score: number | null) => {
        if (score === null) return 'text-muted-foreground';
        if (score >= 7) return 'text-green-400';
        if (score >= 4) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getMoodBgColor = (score: number | null) => {
        if (score === null) return 'bg-muted/20';
        if (score >= 7) return 'bg-green-500/20';
        if (score >= 4) return 'bg-yellow-500/20';
        return 'bg-red-500/20';
    };

    const getMoodLabel = (score: number | null) => {
        if (score === null) return 'Sem dados';
        if (score >= 8) return 'Excelente';
        if (score >= 6) return 'Bom';
        if (score >= 4) return 'Neutro';
        if (score >= 2) return 'Baixo';
        return 'Crítico';
    };

    if (isLoading) {
        return (
            <div className={cn("animate-pulse bg-muted/20 rounded-xl h-full", className)} />
        );
    }

    return (
        <div className={cn("flex flex-col h-full gap-4", className)}>
            {/* Top Row: Mood Score + Trend */}
            <div className="flex items-center justify-between">
                {/* Mood Score */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-3"
                >
                    <div className={cn(
                        "flex items-center justify-center w-12 h-12 rounded-xl",
                        getMoodBgColor(latestMood)
                    )}>
                        <span className={cn("text-xl font-bold", getMoodColor(latestMood))}>
                            {latestMood ?? '—'}
                        </span>
                    </div>
                    <div>
                        <div className={cn("text-sm font-medium", getMoodColor(latestMood))}>
                            {getMoodLabel(latestMood)}
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
                            Humor Atual
                        </div>
                    </div>
                </motion.div>

                {/* Trend Indicator */}
                {moodTrend && moodTrend.length >= 2 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="flex items-center gap-2"
                    >
                        {/* Mini trend bars */}
                        <div className="flex items-end gap-[2px] h-8">
                            {moodTrend.slice(-5).map((point, i) => (
                                <div
                                    key={i}
                                    className="w-1 rounded-full transition-all"
                                    style={{
                                        height: `${(point.score / 10) * 100}%`,
                                        backgroundColor: `hsl(${point.score * 12}, 70%, 50%)`
                                    }}
                                />
                            ))}
                        </div>

                        {/* Direction icon */}
                        <div className={cn(
                            "p-1.5 rounded-lg",
                            trendDirection === 'up' && 'bg-green-500/20',
                            trendDirection === 'down' && 'bg-red-500/20',
                            trendDirection === 'neutral' && 'bg-muted/20'
                        )}>
                            {trendDirection === 'up' && <TrendingUp size={14} className="text-green-400" />}
                            {trendDirection === 'down' && <TrendingDown size={14} className="text-red-400" />}
                            {trendDirection === 'neutral' && <Minus size={14} className="text-muted-foreground" />}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Bottom Row: Weekly Insight */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="flex-1 flex flex-col"
            >
                {weeklySummary?.content?.summary ? (
                    <div className="flex items-start gap-2">
                        <Sparkles size={12} className="text-purple-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {weeklySummary.content.summary}
                        </p>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Sparkles size={12} className="opacity-50" />
                        <span className="text-xs italic">
                            Continue escrevendo no Journal para ver insights
                        </span>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
