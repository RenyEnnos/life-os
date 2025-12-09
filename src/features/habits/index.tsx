import { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Sun, Moon, Sunset, Clock } from 'lucide-react';
import { PageTitle } from '@/shared/ui/PageTitle';
import { Button } from '@/shared/ui/Button';
import { useHabits } from '@/features/habits/hooks/useHabits';
import { CreateHabitDialog } from './components/CreateHabitDialog';
import { HabitDoctor } from './components/HabitDoctor';
import { EmptyState } from '@/shared/ui/EmptyState';
import type { Habit, HabitLog } from '@/features/habits/types';
import { useSearchParams } from 'react-router-dom';
import { useStaggerAnimation } from '@/shared/hooks/useStaggerAnimation';
import { HabitCard } from './components/HabitCard';
import { calculateStreak } from './logic/streak';
import { Confetti } from '@/shared/ui/premium/Confetti';

export default function HabitsPage() {
    const { habits, logs, isLoading, createHabit, logHabit } = useHabits();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    useStaggerAnimation('.habit-item', [habits]);

    useEffect(() => {
        if (searchParams.get('action') === 'create') {
            setIsCreateOpen(true);
            setSearchParams({});
        }
    }, [searchParams, setSearchParams]);

    const today = new Date().toISOString().split('T')[0];

    const handleToggle = useCallback((habitId: string) => {
        const isCompleted = logs?.some((log: HabitLog) => log.habit_id === habitId && log.value > 0);

        // Optimistic Streak Calculation for Confetti
        if (!isCompleted) {
            const currentStreak = calculateStreak(logs, habitId);
            const nextStreak = currentStreak + 1;

            // Trigger confetti on 7-day milestones
            if (nextStreak > 0 && nextStreak % 7 === 0) {
                Confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { x: 0.5, y: 0.6 }
                });
            }
        }

        logHabit.mutate({
            id: habitId,
            value: isCompleted ? 0 : 1,
            date: today
        });
    }, [logs, logHabit, today]); // added today to deps as it is derived in render scope (should be outside or memoized)

    // Move today outside or useMemo if valid. today depends on clock only.
    // It's defined as const today = ... in render.

    const getIcon = (routine: string) => {
        switch (routine) {
            case 'morning': return <Sun className="w-5 h-5 text-yellow-500" />;
            case 'afternoon': return <Sunset className="w-5 h-5 text-orange-500" />;
            case 'evening': return <Moon className="w-5 h-5 text-blue-400" />;
            default: return <Clock className="w-5 h-5 text-gray-400" />;
        }
    };

    const getLabel = (routine: string) => {
        switch (routine) {
            case 'morning': return 'MANHÃ';
            case 'afternoon': return 'TARDE';
            case 'evening': return 'NOITE';
            default: return 'A QUALQUER HORA';
        }
    };

    const groupedHabits = useMemo(() => habits?.reduce((acc: Record<string, Habit[]>, habit: Habit) => {
        const routine = habit.routine || 'any';
        if (!acc[routine]) acc[routine] = [];
        acc[routine].push(habit);
        return acc;
    }, {} as Record<string, Habit[]>), [habits]);

    const routines = ['morning', 'afternoon', 'evening', 'any'];

    const createHandler = useCallback((id: string) => handleToggle(id), [handleToggle]);

    return (
        <div className="space-y-8 pb-20">
            <PageTitle
                title="HÁBITOS & ROTINAS"
                subtitle="Protocolos diários de execução."
                action={
                    <Button onClick={() => setIsCreateOpen(true)} className="gap-2 shadow-lg shadow-primary/20">
                        <Plus size={18} />
                        CRIAR HÁBITO
                    </Button>
                }
            />

            <HabitDoctor habits={habits || []} logs={logs || []} />

            {isLoading ? (
                <div className="text-center py-20 text-muted-foreground font-mono animate-pulse">
                    CARREGANDO SISTEMA...
                </div>
            ) : (
                <div className="space-y-12">
                    {routines.map(routine => {
                        const routineHabits = groupedHabits?.[routine];
                        if (!routineHabits?.length) return null;

                        return (
                            <section key={routine} className="space-y-6">
                                <div className="flex items-center gap-3 text-muted-foreground border-b border-white/10 pb-4">
                                    <div className="p-2 bg-white/5 rounded-lg">
                                        {getIcon(routine)}
                                    </div>
                                    <h2 className="font-mono font-bold tracking-widest text-lg">{getLabel(routine)}</h2>
                                </div>
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {routineHabits.map((habit: Habit) => {
                                        const isCompleted = !!logs?.some((log: HabitLog) => log.habit_id === habit.id && log.value > 0);
                                        const streak = calculateStreak(logs, habit.id);

                                        return (
                                            <div key={habit.id} className="habit-item opacity-0">
                                                <HabitCard
                                                    habit={habit}
                                                    isCompleted={isCompleted}
                                                    streak={streak}
                                                    onToggle={() => createHandler(habit.id)}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        );
                    })}

                    {!habits?.length && (
                        <EmptyState
                            icon={Sun}
                            title="SEM PROTOCOLOS"
                            description="Nenhuma rotina definida. Estabeleça seus protocolos diários."
                            action={
                                <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                                    <Plus size={16} /> CRIAR HÁBITO
                                </Button>
                            }
                        />
                    )}
                </div>
            )}

            <CreateHabitDialog
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSubmit={createHabit.mutate}
            />
        </div>
    );
}
