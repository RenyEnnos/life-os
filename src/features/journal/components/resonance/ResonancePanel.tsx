import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, TrendingDown, Minus, Tag } from 'lucide-react';
import { useJournalInsights } from '../../hooks/useJournalInsights';
import { MoodIndicator } from './MoodIndicator';
import './resonance.css';

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
            <div className="resonance-panel resonance-loading">
                <Sparkles size={20} className="resonance-loading-icon" />
                <span>Analisando...</span>
            </div>
        );
    }

    if (!insights?.length && !weeklySummary) {
        return (
            <div className="resonance-panel resonance-empty">
                <Sparkles size={20} />
                <span>Continue escrevendo para ver insights</span>
            </div>
        );
    }

    return (
        <motion.div
            className="resonance-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="resonance-header">
                <Sparkles size={16} />
                <span>Ressonância Neural</span>
            </div>

            {/* Current Mood */}
            {currentMood !== null && (
                <div className="resonance-section">
                    <div className="resonance-section-title">Humor Atual</div>
                    <div className="resonance-mood-row">
                        <MoodIndicator score={currentMood} size="large" />
                        <div className="resonance-mood-info">
                            <span className="resonance-mood-score">{currentMood}/10</span>
                            <span className="resonance-mood-label">
                                {currentMood >= 7 ? 'Positivo' : currentMood >= 4 ? 'Neutro' : 'Baixo'}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Mood Trend */}
            {moodTrend && moodTrend.length >= 3 && (
                <div className="resonance-section">
                    <div className="resonance-section-title">Tendência (7 dias)</div>
                    <div className="resonance-trend">
                        <div className="resonance-trend-bars">
                            {moodTrend.map((point, i) => (
                                <div
                                    key={i}
                                    className="resonance-trend-bar"
                                    style={{
                                        height: `${point.score * 10}%`,
                                        backgroundColor: `hsl(${point.score * 12}, 70%, 50%)`
                                    }}
                                    title={`${point.date}: ${point.score}`}
                                />
                            ))}
                        </div>
                        <div className="resonance-trend-direction">
                            {trendDirection === 'up' && <TrendingUp size={14} className="trend-up" />}
                            {trendDirection === 'down' && <TrendingDown size={14} className="trend-down" />}
                            {trendDirection === 'neutral' && <Minus size={14} className="trend-neutral" />}
                        </div>
                    </div>
                </div>
            )}

            {/* Themes */}
            {themes.length > 0 && (
                <div className="resonance-section">
                    <div className="resonance-section-title">Temas Detectados</div>
                    <div className="resonance-themes">
                        {themes.map((theme, i) => (
                            <span key={i} className="resonance-theme-tag">
                                <Tag size={10} />
                                {theme}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Weekly Summary */}
            {showWeekly && weeklySummary?.content?.summary && (
                <div className="resonance-section resonance-weekly">
                    <div className="resonance-section-title">Resumo Semanal</div>
                    <p className="resonance-summary">
                        {weeklySummary.content.summary}
                    </p>
                    {weeklySummary.content.recommendations?.slice(0, 2).map((rec, i) => (
                        <div key={i} className="resonance-recommendation">
                            <Sparkles size={12} />
                            <span>{rec}</span>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}

export default ResonancePanel;
