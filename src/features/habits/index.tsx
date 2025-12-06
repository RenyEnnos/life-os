import { useState, useEffect } from 'react';
import { Plus, Sun, Moon, Sunset, Clock, CheckCircle2, Circle } from 'lucide-react';
import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/Button';
import { useHabits } from '@/features/habits/hooks/useHabits';
import { CreateHabitDialog } from './components/CreateHabitDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Habit } from '@/shared/types';
import { ActivityCard } from '@/components/ui/ActivityCard';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

type HabitLog = { habit_id: string; value: number }

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

    const today = new Date().toISOString().split('T')[0];

    const handleToggle = (habitId: string) => {
        const isCompleted = logs?.some((log: HabitLog) => log.habit_id === habitId && log.value > 0);
        logHabit.mutate({
            id: habitId,
            value: isCompleted ? 0 : 1,
            date: today
        });
    };

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

    const groupedHabits = habits?.reduce((acc: Record<string, Habit[]>, habit: Habit) => {
        const routine = habit.routine || 'any';
        if (!acc[routine]) acc[routine] = [];
        acc[routine].push(habit);
        return acc;
    }, {} as Record<string, Habit[]>);

    const routines = ['morning', 'afternoon', 'evening', 'any'];

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
                                        return (
                                            <div key={habit.id} onClick={() => handleToggle(habit.id)} className="cursor-pointer group">
                                                <ActivityCard
                                                    title={habit.title}
                                                    value={isCompleted ? "COMPLETO" : "PENDENTE"}
                                                    subtitle={habit.description || "Sem descrição"}
                                                    progress={isCompleted ? 100 : 0}
                                                    className={`transition-all duration-300 ${isCompleted ? 'border-primary/50 bg-primary/5' : 'border-transparent'}`}
                                                    icon={
                                                        isCompleted ?
                                                            <CheckCircle2 className="w-6 h-6 text-primary animate-bounce" /> :
                                                            <Circle className="w-6 h-6 text-gray-600 group-hover:text-primary/50 transition-colors" />
                                                    }
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
