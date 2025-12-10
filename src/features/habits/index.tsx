import { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Activity, Flame, CheckCircle2, Sun, Moon, Sunset, Clock } from 'lucide-react';
import { PageTitle } from '@/shared/ui/PageTitle';
import { Button } from '@/shared/ui/Button';
import { BentoGrid, BentoCard } from '@/shared/ui/BentoCard';
import { useHabits } from '@/features/habits/hooks/useHabits';
import { CreateHabitDialog } from './components/CreateHabitDialog';
import { HabitDoctor } from './components/HabitDoctor';
import { EmptyState } from '@/shared/ui/EmptyState';
import type { Habit, HabitLog } from '@/features/habits/types';
import { useSearchParams } from 'react-router-dom';
import { HabitCard } from './components/HabitCard';
import { calculateStreak } from './logic/streak';
import { Confetti } from '@/shared/ui/premium/Confetti';

// --- HELPERS ---
const getRoutineIcon = (routine: string) => {
    switch (routine) {
        case 'morning': return <Sun className="w-5 h-5 text-yellow-500" />;
        case 'afternoon': return <Sunset className="w-5 h-5 text-orange-500" />;
        case 'evening': return <Moon className="w-5 h-5 text-blue-400" />;
        default: return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
};

const getRoutineLabel = (routine: string) => {
    switch (routine) {
        case 'morning': return 'MANHÃ';
        case 'afternoon': return 'TARDE';
        case 'evening': return 'NOITE';
        default: return 'A QUALQUER HORA';
    }
};

// --- MAIN PAGE ---
export default function HabitsPage() {
    const { habits, logs, isLoading, createHabit, logHabit } = useHabits();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (searchParams.get('action') === 'create') {
            setIsCreateOpen(true);
            setSearchParams({});
        }
    }, [searchParams, setSearchParams]);

    const today = useMemo(() => new Date().toISOString().split('T')[0], []);

    const handleToggle = useCallback((habitId: string) => {
        const isCompleted = logs?.some((log: HabitLog) => log.habit_id === habitId && log.value > 0);

        if (!isCompleted) {
            const currentStreak = calculateStreak(logs, habitId);
            const nextStreak = currentStreak + 1;
            if (nextStreak > 0 && nextStreak % 7 === 0) {
                Confetti({ particleCount: 150, spread: 70, origin: { x: 0.5, y: 0.6 } });
            }
        }

        logHabit.mutate({ id: habitId, value: isCompleted ? 0 : 1, date: today });
    }, [logs, logHabit, today]);

    // --- DERIVED STATE ---
    const groupedHabits = useMemo(() => habits?.reduce((acc: Record<string, Habit[]>, habit: Habit) => {
        const routine = habit.routine || 'any';
        if (!acc[routine]) acc[routine] = [];
        acc[routine].push(habit);
        return acc;
    }, {} as Record<string, Habit[]>), [habits]);

    const routines = ['morning', 'afternoon', 'evening', 'any'];

    // --- STATS ---
    const stats = useMemo(() => {
        if (!habits || !logs) return { consistencyScore: 0, maxStreak: 0, focusHabit: null };

        const todayLogs = logs.filter((l: HabitLog) => l.date.startsWith(today) && l.value > 0);
        const consistency = habits.length > 0 ? Math.round((todayLogs.length / habits.length) * 100) : 0;

        let maxStreak = 0;
        let focusHabit: Habit | null = null;
        habits.forEach((h: Habit) => {
            const s = calculateStreak(logs, h.id);
            if (s > maxStreak) {
                maxStreak = s;
                focusHabit = h;
            }
        });

        // Prefer incomplete habit as focus, or keep highest streak
        const incompleteHabits = habits.filter((h: Habit) =>
            !logs.some((l: HabitLog) => l.habit_id === h.id && l.date.startsWith(today) && l.value > 0)
        );
        if (incompleteHabits.length > 0) {
            focusHabit = incompleteHabits[0];
        }

        return { consistencyScore: consistency, maxStreak, focusHabit };
    }, [habits, logs, today]);

    // --- RENDER ---
    return (
        <div className="space-y-8 pb-20 px-4 md:px-0 max-w-[1600px] mx-auto">
            <PageTitle
                title="RITUAIS & HÁBITOS"
                subtitle="Consistência é a chave da maestria."
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
            ) : !habits?.length ? (
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
            ) : (
                <BentoGrid>
                    {/* --- CARD 1: Consistency Score (2x1) --- */}
                    <BentoCard
                        className="col-span-1 md:col-span-2"
                        title="Consistência Hoje"
                        icon={Activity}
                    >
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center space-y-2">
                                <span className="text-5xl font-bold text-[var(--color-success)]">
                                    {stats.consistencyScore}%
                                </span>
                                <p className="text-xs text-muted-foreground">
                                    {habits.length} hábitos ativos
                                </p>
                            </div>
                        </div>
                    </BentoCard>

                    {/* --- CARD 2: Streak (1x1) --- */}
                    <BentoCard title="Maior Sequência" icon={Flame}>
                        <div className="flex flex-col h-full justify-end">
                            <span className="text-5xl font-mono font-bold text-orange-500">
                                {stats.maxStreak}
                            </span>
                            <span className="text-sm text-muted-foreground">dias seguidos</span>
                        </div>
                    </BentoCard>

                    {/* --- CARD 3: Focus Habit (1x1) --- */}
                    {stats.focusHabit && (
                        <BentoCard
                            title={stats.focusHabit.title}
                            icon={CheckCircle2}
                            className="group hover:bg-surface-hover cursor-pointer"
                        >
                            <div className="h-full flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-lg font-medium">
                                        {logs?.some((l: HabitLog) => l.habit_id === stats.focusHabit!.id && l.date.startsWith(today) && l.value > 0)
                                            ? 'Concluído'
                                            : 'Pendente'}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        Próximo foco
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleToggle(stats.focusHabit!.id)}
                                    className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-[var(--color-success)] hover:border-[var(--color-success)] hover:text-black transition-all"
                                >
                                    <CheckCircle2 size={18} />
                                </button>
                            </div>
                        </BentoCard>
                    )}

                    {/* --- HABIT CARDS BY ROUTINE --- */}
                    {routines.map(routine => {
                        const routineHabits = groupedHabits?.[routine];
                        if (!routineHabits?.length) return null;

                        return routineHabits.map((habit: Habit) => {
                            const isCompleted = !!logs?.some((log: HabitLog) => log.habit_id === habit.id && log.value > 0);
                            const streak = calculateStreak(logs, habit.id);

                            return (
                                <BentoCard
                                    key={habit.id}
                                    title={habit.title}
                                    icon={() => getRoutineIcon(habit.routine)}
                                    headerAction={
                                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                                            {getRoutineLabel(habit.routine)}
                                        </span>
                                    }
                                >
                                    <HabitCard
                                        habit={habit}
                                        isCompleted={isCompleted}
                                        streak={streak}
                                        onToggle={() => handleToggle(habit.id)}
                                    />
                                </BentoCard>
                            );
                        });
                    })}
                </BentoGrid>
            )}

            <CreateHabitDialog
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSubmit={createHabit.mutate}
            />
        </div>
    );
}
