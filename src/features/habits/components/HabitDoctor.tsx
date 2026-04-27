import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Stethoscope, Sparkles, RefreshCw, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Habit } from '../types';
import { Badge } from '@/shared/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import { habitsApi } from '../api/habits.api';
import { useToast } from '@/shared/ui/useToast';

interface HabitDoctorProps {
    habits: Habit[];
}

export function HabitDoctor({ habits }: HabitDoctorProps) {
    const [analyzing, setAnalyzing] = useState(false);
    const [executingAction, setExecutingAction] = useState(false);
    const [insight, setInsight] = useState<{ 
        type: 'success' | 'warning' | 'info', 
        message: string, 
        detail: string,
        action?: { type: string, habitId?: string, value?: any, label: string }
    } | null>(null);
    const { showToast } = useToast();

    const executeInsightAction = async () => {
        if (!insight?.action) {
            return false;
        }

        switch (insight.action.type) {
            case 'HABIT_LOG': {
                if (!insight.action.habitId) {
                    throw new Error('Habit Doctor returned an invalid habit action');
                }

                const today = new Date().toISOString().split('T')[0];
                await habitsApi.log('current-user', insight.action.habitId, Number(insight.action.value) || 1, today);
                return true;
            }
            default:
                return false;
        }
    };

    const runDiagnosis = async () => {
        if (!habits.length) return;
        
        setAnalyzing(true);
        setInsight(null);

        try {
            // Prepare context for AI
            const habitsContext = JSON.stringify(habits.map(h => ({
                id: h.id,
                name: h.name || h.title,
                active: h.active,
                frequency: h.frequency,
                streak: (h as any).streak_current || 0,
                type: h.type,
                target: h.target_value || (h as any).goal
            })));

            const result = await habitsApi.getDiagnosis(habitsContext);
            setInsight(result);
        } catch (error) {
            console.error('Habit Doctor Analysis failed:', error);
            setInsight({
                type: 'warning',
                message: "Nexus Desconectado",
                detail: "Não foi possível realizar a análise no momento. Tente novamente em alguns minutos."
            });
        } finally {
            setAnalyzing(false);
        }
    };

    const handleExecuteAction = async () => {
        if (!insight?.action) return;
        setExecutingAction(true);
        try {
            const success = await executeInsightAction();
            if (success) {
                showToast('Ação executada com sucesso', 'success');
                setInsight(null);
            } else {
                showToast('Ação sugerida fora do escopo do MVP', 'info');
            }
        } catch (error) {
            showToast('Falha ao executar ação', 'error');
        } finally {
            setExecutingAction(false);
        }
    };

    return (
        <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg text-indigo-300 flex items-center gap-2">
                    <Stethoscope size={20} />
                    Habit Doctor <Badge variant="outline" className="text-[10px] h-5">AI BETA</Badge>
                </CardTitle>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={runDiagnosis}
                    disabled={analyzing}
                    className="h-8 w-8 p-0 rounded-full hover:bg-indigo-500/20"
                    aria-label="Refresh habit diagnosis"
                >
                    <RefreshCw size={14} className={analyzing ? "animate-spin" : ""} />
                </Button>
            </CardHeader>
            <CardContent>
                <div className="min-h-[80px] flex items-center justify-center">
                    {analyzing ? (
                        <div className="flex flex-col items-center gap-2 text-indigo-400/70 text-sm">
                            <Sparkles size={16} className="animate-pulse" />
                            <span>Analyzing protocols...</span>
                        </div>
                    ) : insight ? (
                        <AnimatePresence>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="w-full text-left bg-black/20 p-3 rounded-lg border border-white/5"
                            >
                                <div className="flex items-start gap-3">
                                    {insight.type === 'warning' && <AlertTriangle className="text-yellow-500 mt-0.5" size={18} />}
                                    {insight.type === 'success' && <CheckCircle className="text-green-500 mt-0.5" size={18} />}
                                    {insight.type === 'info' && <Sparkles className="text-blue-500 mt-0.5" size={18} />}
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm text-white mb-1">{insight.message}</h4>
                                        <p className="text-xs text-zinc-400 leading-relaxed mb-3">{insight.detail}</p>
                                        
                                        {insight.action && (
                                            <Button 
                                                size="sm" 
                                                className="h-7 text-[10px] uppercase tracking-wider font-bold gap-2"
                                                onClick={handleExecuteAction}
                                                disabled={executingAction}
                                            >
                                                {executingAction ? 'Executando...' : insight.action.label}
                                                {!executingAction && <ArrowRight size={12} />}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    ) : (
                        <p className="text-xs text-center text-zinc-500">
                            Run diagnosis to get AI insights on your routine consistency and health.
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
