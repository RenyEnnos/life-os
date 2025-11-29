import { useState } from 'react';
import { Plus, Sun, Moon, Sunset, Clock } from 'lucide-react';
import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/Button';
import { useHabits } from '@/hooks/useHabits';
import { HabitItem } from './components/HabitItem';
import { CreateHabitDialog } from './components/CreateHabitDialog';
import { EmptyState } from '@/components/ui/EmptyState';

export default function HabitsPage() {
    const { habits, logs, isLoading, createHabit, logHabit } = useHabits();
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const today = new Date().toISOString().split('T')[0];

    const handleToggle = (habitId: string) => {
        const isCompleted = logs?.some((log: any) => log.habit_id === habitId && log.value > 0);
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

    const groupedHabits = habits?.reduce((acc: any, habit: any) => {
        const routine = habit.routine || 'any';
        if (!acc[routine]) acc[routine] = [];
        acc[routine].push(habit);
        return acc;
    }, {});

    const routines = ['morning', 'afternoon', 'evening', 'any'];

    return (
        <div className="space-y-8 pb-20">
            <PageTitle
                title="HÁBITOS & ROTINAS"
                subtitle="Protocolos diários de execução."
                action={
                    <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
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
                <div className="space-y-8">
                    {routines.map(routine => {
                        const routineHabits = groupedHabits?.[routine];
                        if (!routineHabits?.length) return null;

                        return (
                            <section key={routine} className="space-y-4">
                                <div className="flex items-center gap-2 text-muted-foreground border-b border-border pb-2">
                                    {getIcon(routine)}
                                    <h2 className="font-mono font-bold tracking-wider">{getLabel(routine)}</h2>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {routineHabits.map((habit: any) => (
                                        <HabitItem
                                            key={habit.id}
                                            habit={habit}
                                            completed={logs?.some((log: any) => log.habit_id === habit.id && log.value > 0)}
                                            onToggle={() => handleToggle(habit.id)}
                                        />
                                    ))}
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
