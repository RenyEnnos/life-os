import { useState, useEffect } from 'react';
import { apiFetch } from '@/shared/api/http';
import { Sparkles, BrainCircuit, AlertCircle, ArrowRight, ShieldAlert } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import ReactMarkdown from 'react-markdown';
import { ReactNode } from 'react';
import { useRiskFactors } from '../hooks/useRiskFactors';

export function AIInsightsWidget() {
    const [insights, setInsights] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { data: riskFactors, isLoading: isRisksLoading } = useRiskFactors();

    const generateInsights = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await apiFetch<{ insights: string }>('/api/insights/cross-domain', {
                method: 'POST'
            });
            setInsights(data.insights);
        } catch (err) {
            setError('Failed to generate insights.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!insights && !isLoading) {
            generateInsights();
        }
    }, []);

    return (
        <div className="flex flex-col gap-6 h-full">
            {/* Cross-Domain Insights */}
            <div className="w-full glass rounded-2xl p-6 border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent relative overflow-hidden group">
                <div className="absolute top-0 right-0 -m-8 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />

                <div className="flex items-start justify-between mb-4 relative z-10">
                    <div>
                        <h3 className="font-bold text-lg flex items-center gap-2 text-primary">
                            <Sparkles size={18} />
                            Neural Insights
                        </h3>
                    </div>
                    <button
                        onClick={generateInsights}
                        disabled={isLoading}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
                    >
                        <BrainCircuit size={18} className={cn(isLoading && "animate-pulse text-primary")} />
                    </button>
                </div>

                <div className="relative z-10 min-h-[100px]">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <BrainCircuit size={24} className="animate-spin text-primary opacity-50" />
                        </div>
                    ) : insights ? (
                        <div className="prose prose-invert prose-sm max-w-none text-white/80">
                            <ReactMarkdown
                                components={{
                                    ul: ({ children }: { children?: ReactNode }) => <ul className="space-y-2 mt-2 list-none p-0">{children}</ul>,
                                    li: ({ children }: { children?: ReactNode }) => (
                                        <li className="flex items-start gap-3 bg-black/20 p-3 rounded-xl border border-white/5">
                                            <ArrowRight size={14} className="mt-1 text-primary shrink-0 opacity-70" />
                                            <div className="flex-1">{children}</div>
                                        </li>
                                    ),
                                    strong: ({ children }: { children?: ReactNode }) => <strong className="text-primary font-bold">{children}</strong>
                                }}
                            >
                                {insights}
                            </ReactMarkdown>
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Risk Analysis Section */}
            <div className="w-full glass rounded-2xl p-6 border border-red-500/20 bg-red-500/5 relative overflow-hidden flex-1">
                <div className="flex items-center gap-2 mb-4">
                    <ShieldAlert size={18} className="text-red-400" />
                    <h3 className="font-bold text-lg text-white/90">Análise de Risco</h3>
                </div>

                <div className="space-y-4">
                    {isRisksLoading ? (
                        <div className="space-y-3">
                            {[1, 2].map(i => <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />)}
                        </div>
                    ) : riskFactors && riskFactors.length > 0 ? (
                        riskFactors.map((risk, idx) => (
                            <div key={idx} className="flex flex-col gap-2 p-3 rounded-xl bg-black/30 border border-white/5">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black text-white/40 uppercase tracking-widest">{risk.factor}</span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
                                        {Math.round(risk.probability * 100)}% Prob.
                                    </span>
                                </div>
                                <p className="text-sm font-bold text-white/90">{risk.impact}</p>
                                <div className="flex items-center gap-2 mt-1 text-[11px] text-primary/80 font-medium">
                                    <ArrowRight size={10} />
                                    {risk.suggestion}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-xs text-white/30 italic">Nenhum fator de risco crítico identificado hoje.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
