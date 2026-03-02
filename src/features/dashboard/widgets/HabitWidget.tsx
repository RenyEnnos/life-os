import { useState } from 'react';
import { Activity, Check, Plus, Minus } from 'lucide-react';
import { Widget } from '@/shared/ui/Widget';
import { useDashboardData } from '@/features/dashboard/hooks/useDashboardData';
import { useHabits } from '@/features/habits/hooks/useHabits';
import { cn } from '@/shared/lib/cn';
import type { Habit } from '@/shared/types';

export function HabitWidget() {
    const { habits, habitConsistency, isLoading } = useDashboardData();
    const { logHabit } = useHabits();
    const [selectedHabitId, setSelectedHabitId] = useState('');

    const resolveHabitTitle = (habit: Habit) => (habit as any).name || (habit as any).title || 'Hábito';

    // Sort habits: prioritize incomplete ones for today
    const sortedHabits = [...(habits || [])].sort((a, b) => ((a as any).streak_current || 0) > ((b as any).streak_current || 0) ? -1 : 1);

    return (
        <Widget
            title="Hábitos"
            subtitle={`${habitConsistency?.percentage || 0}% Consistência`}
            icon={Activity}
            className="h-full min-h-[320px] col-span-1 row-span-2"
            isLoading={isLoading}
            isEmpty={!isLoading && (!habits || habits.length === 0)}
            emptyMessage="Nenhum hábito rastreado hoje"
        >
            <div className="flex flex-col h-full gap-4">
                {/* Consistency Chart */}
                <div className="flex items-end gap-1 h-16 pt-2">
                    {habitConsistency?.weeklyData?.map((v, idx) => (
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
                    {sortedHabits.map(habit => {
                        const isNumeric = habit.type === 'numeric' || habit.type === ('quantified' as any);
                        const today = new Date().toISOString().split('T')[0];
                        const currentProgress = (habit as any).progress || 0;
                        const targetValue = (habit as any).target_value || (habit as any).goal || 1;
                        const attribute = (habit as any).attribute;

                        const handleLog = (e: React.MouseEvent, newValue: number) => {
                            e.stopPropagation();
                            logHabit.mutate({ id: habit.id, value: newValue, date: today });
                        };

                        return (
                            <div
                                key={habit.id}
                                className="group flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 text-left"
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                                        attribute === 'BODY' && "bg-emerald-500/10 text-emerald-400",
                                        attribute === 'MIND' && "bg-sky-500/10 text-sky-400",
                                        attribute === 'SPIRIT' && "bg-purple-500/10 text-purple-400",
                                        attribute === 'OUTPUT' && "bg-amber-500/10 text-amber-400",
                                        !attribute && "bg-zinc-800 text-zinc-400"
                                    )}>
                                        <span className="text-xs font-bold">{(habit as any).streak_current || 0}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">{resolveHabitTitle(habit)}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-zinc-600 uppercase tracking-wider">{attribute || 'Geral'}</span>
                                            {isNumeric && (
                                                <span className="text-[10px] text-zinc-500 font-medium">
                                                    {currentProgress}/{targetValue}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {isNumeric ? (
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={(e) => handleLog(e, Math.max(0, currentProgress - 1))}
                                            className="p-1.5 rounded hover:bg-white/10 text-zinc-500 hover:text-white transition-colors"
                                            disabled={logHabit.isPending}
                                            title="Decrementar"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <button
                                            onClick={(e) => handleLog(e, currentProgress + 1)}
                                            className="p-1.5 rounded hover:bg-white/10 text-primary transition-colors"
                                            disabled={logHabit.isPending}
                                            title="Incrementar"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={(e) => handleLog(e, (habit as any).completed ? 0 : 1)}
                                        disabled={logHabit.isPending}
                                        className={cn(
                                            "transition-all duration-300 p-1.5 rounded-full",
                                            (habit as any).completed
                                                ? "bg-primary text-black"
                                                : "opacity-0 group-hover:opacity-100 bg-primary/20 text-primary"
                                        )}
                                    >
                                        <Check size={14} />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </Widget>
    );
}
