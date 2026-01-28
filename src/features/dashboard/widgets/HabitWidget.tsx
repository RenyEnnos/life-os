import { useState } from 'react';
import { Activity, Check, Plus } from 'lucide-react';
import { WidgetShell } from './WidgetShell';
import { useDashboardData } from '@/features/dashboard/hooks/useDashboardData';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { habitsApi } from '@/features/habits/api/habits.api';
import { cn } from '@/shared/lib/cn';
import type { Habit } from '@/shared/types';

export function HabitWidget() {
    const { habits, habitConsistency, isLoading } = useDashboardData();
    const qc = useQueryClient();
    const [selectedHabitId, setSelectedHabitId] = useState('');

    const logHabit = useMutation({
        mutationFn: (habitId: string) => {
            const today = new Date().toISOString().split('T')[0];
            return habitsApi.log('current', habitId, 1, today);
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: ['habits'] });
            setSelectedHabitId('');
        }
    });

    const resolveHabitTitle = (habit: Habit) => habit.name || 'Hábito';

    // Sort habits: prioritize incomplete ones for today (logic handled by backend usually, but simple sort here)
    const sortedHabits = [...habits].sort((a, b) => (a.streak_current || 0) > (b.streak_current || 0) ? -1 : 1);

    return (
        <WidgetShell
            title="Hábitos"
            subtitle={`${habitConsistency?.percentage || 0}% Consistência`}
            icon={<Activity size={18} className="text-sky-400" />}
            className="h-full min-h-[320px]"
        >
            <div className="flex flex-col h-full gap-4">
                {/* Consistency Chart */}
                <div className="flex items-end gap-1 h-16 pt-2">
                    {habitConsistency?.weeklyData.map((v, idx) => (
                        <div
                            key={idx}
                            className="flex-1 bg-white/10 rounded-sm relative group"
                            style={{ height: `${Math.max(v * 20, 4)}px` }}
                        >
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/80 text-[10px] text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                {v} logs
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Log */}
                <div className="flex flex-col gap-2 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                    {isLoading && <p className="text-xs text-zinc-500">Carregando...</p>}
                    {!isLoading && sortedHabits.map(habit => (
                        <button
                            key={habit.id}
                            onClick={() => logHabit.mutate(habit.id)}
                            disabled={logHabit.isPending}
                            className="group flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 text-left"
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                                    habit.attribute === 'BODY' && "bg-emerald-500/10 text-emerald-400",
                                    habit.attribute === 'MIND' && "bg-sky-500/10 text-sky-400",
                                    habit.attribute === 'SPIRIT' && "bg-purple-500/10 text-purple-400",
                                    habit.attribute === 'OUTPUT' && "bg-amber-500/10 text-amber-400",
                                    !habit.attribute && "bg-zinc-800 text-zinc-400"
                                )}>
                                    <span className="text-xs font-bold">{habit.streak_current || 0}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">{resolveHabitTitle(habit)}</span>
                                    <span className="text-[10px] text-zinc-600 uppercase tracking-wider">{habit.attribute || 'Geral'}</span>
                                </div>
                            </div>
                            <div className={cn(
                                "transition-all duration-300 p-1.5 rounded-full",
                                habit.completed
                                    ? "opacity-100 bg-primary text-black"
                                    : "opacity-0 group-hover:opacity-100 bg-primary/20 text-primary"
                            )}>
                                <Check size={14} />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </WidgetShell>
    );
}
