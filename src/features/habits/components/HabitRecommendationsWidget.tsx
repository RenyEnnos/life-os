import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '@/shared/api/http';
import { useAuth } from '@/features/auth/contexts/AuthContext';

interface HabitRecommendation {
    title: string;
    rationale: string;
    benefits: string;
    frequency: string;
    category: 'productivity' | 'health' | 'wellness' | 'finance';
}

export const HabitRecommendationsWidget = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [dismissed, setDismissed] = React.useState<string[]>(() => {
        const saved = localStorage.getItem(`dismissed-habits-${user?.id}`);
        return saved ? JSON.parse(saved) : [];
    });

    const { data: recommendations = [], isLoading, refetch } = useQuery<HabitRecommendation[]>({
        queryKey: ['habit-recommendations', user?.id, dismissed.length],
        queryFn: () => apiClient.get(`/api/habits/recommendations?dismissed=${dismissed.join(',')}`),
        enabled: !!user,
        staleTime: 1000 * 60 * 30, // 30 minutes
    });

    const handleDismiss = (title: string) => {
        const newDismissed = [...dismissed, title];
        setDismissed(newDismissed);
        localStorage.setItem(`dismissed-habits-${user?.id}`, JSON.stringify(newDismissed));
        // Refetch will be triggered by quantumKey change
    };

    const addHabitMutation = useMutation({
        mutationFn: (rec: HabitRecommendation) =>
            apiClient.post('/api/habits', {
                title: rec.title,
                description: `${rec.rationale}. Benefícios: ${rec.benefits}`,
                frequency: rec.frequency.toLowerCase().includes('diário') ? 'daily' : 'weekly',
                active: true
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] });
            // Remove from local list or refetch
            refetch();
        }
    });

    if (isLoading) {
        return (
            <div className="w-full flex gap-4 overflow-x-auto pb-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="min-w-[300px] h-[180px] glass-panel p-6 rounded-2xl animate-pulse bg-white/5" />
                ))}
            </div>
        );
    }

    if (recommendations.length === 0) return null;

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                    AI Recommendations
                </h3>
                <button
                    onClick={() => refetch()}
                    className="text-[10px] font-bold text-white/40 hover:text-white transition-colors uppercase tracking-widest"
                >
                    Refresh
                </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                <AnimatePresence mode="popLayout">
                    {recommendations.map((rec, idx) => (
                        <motion.div
                            key={rec.title}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: idx * 0.1 }}
                            className="min-w-[320px] max-w-[320px] glass-panel p-6 rounded-2xl border-primary/20 hover:border-primary/40 transition-all flex flex-col justify-between gap-4"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${rec.category === 'health' ? 'bg-green-500/20 text-green-500' :
                                        rec.category === 'productivity' ? 'bg-primary/20 text-primary' :
                                            'bg-blue-500/20 text-blue-500'
                                        }`}>
                                        {rec.category}
                                    </span>
                                    <span className="text-[10px] font-bold text-white/40">{rec.frequency}</span>
                                </div>
                                <h4 className="font-bold text-white mb-1">{rec.title}</h4>
                                <p className="text-xs text-white/60 leading-relaxed italic">"{rec.rationale}"</p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => addHabitMutation.mutate(rec)}
                                    disabled={addHabitMutation.isPending}
                                    className="flex-1 py-2 bg-primary/20 hover:bg-primary text-primary hover:text-white border border-primary/30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all transition-all duration-300"
                                >
                                    {addHabitMutation.isPending ? 'Adding...' : 'Accept'}
                                </button>
                                <button
                                    onClick={() => handleDismiss(rec.title)}
                                    className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </section>
    );
};
