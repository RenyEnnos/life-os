import { PageTitle } from '@/components/ui/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useHabits } from '@/hooks/useHabits';
import { useTasks } from '@/hooks/useTasks';
import type { Habit, Task } from '@/shared/types';
import { EmptyState } from '@/components/ui/EmptyState';
import { Activity, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
    const { habits } = useHabits();
    const { tasks } = useTasks();
    const navigate = useNavigate();

    const hasData = (habits?.length || 0) > 0 || (tasks?.length || 0) > 0;

    return (
        <div className="space-y-6">
            <PageTitle title="DASHBOARD" subtitle="Visão geral do sistema." />

            {!hasData ? (
                <EmptyState
                    icon={Activity}
                    title="SISTEMA INICIALIZADO"
                    description="Nenhuma métrica disponível. Adicione hábitos ou tarefas para gerar dados."
                    action={
                        <div className="flex gap-2 justify-center">
                            <Button onClick={() => navigate('/habits')} variant="outline" className="gap-2">
                                <Plus size={16} /> CRIAR HÁBITO
                            </Button>
                            <Button onClick={() => navigate('/tasks')} className="gap-2">
                                <Plus size={16} /> CRIAR TAREFA
                            </Button>
                        </div>
                    }
                />
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">HÁBITOS HOJE</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {habits?.filter((h: Habit) => h.active).length || 0}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">TAREFAS PENDENTES</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {tasks?.filter((t: Task) => !t.completed).length || 0}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
