import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Stethoscope, Sparkles, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Habit } from '../types';
import { Badge } from '@/shared/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';

interface HabitDoctorProps {
    habits: Habit[];
    logs: Record<string, unknown>[];
}

export function HabitDoctor({ habits, logs }: HabitDoctorProps) {
    const [analyzing, setAnalyzing] = useState(false);
    const [insight, setInsight] = useState<{ type: 'success' | 'warning' | 'info', message: string, detail: string } | null>(null);

    const runDiagnosis = async () => {
        setAnalyzing(true);
        setInsight(null);

        // Simulate AI Analysis
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock Logic for Demo
        const activeHabits = habits.filter(h => h.active);

        if (activeHabits.length === 0) {
            setInsight({
                type: 'info',
                message: "No habits to analyze.",
                detail: "Start by creating some habits."
            });
        } else if (activeHabits.length > 5) {
            setInsight({
                type: 'warning',
                message: "High Cognitive Load",
                detail: `You have ${activeHabits.length} active habits. Consider focusing on the top 3 to prevent burnout.`
            });
        } else {
            setInsight({
                type: 'success',
                message: "Healthy Routine Balance",
                detail: "Your habit distribution across morning and evening is well-balanced."
            });
        }

        setAnalyzing(false);
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
                                    <div>
                                        <h4 className="font-bold text-sm text-white mb-1">{insight.message}</h4>
                                        <p className="text-xs text-zinc-400 leading-relaxed">{insight.detail}</p>
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
