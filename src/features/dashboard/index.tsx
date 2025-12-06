import { PageTitle } from '@/components/ui/PageTitle';
import { useHabits } from '@/features/habits/hooks/useHabits';
import { useTasks } from '@/features/tasks/hooks/useTasks';
import type { Habit, Task } from '@/shared/types';
import { EmptyState } from '@/components/ui/EmptyState';
import { Activity, Plus, CheckCircle2, ListTodo, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { BentoGrid, BentoItem } from '@/components/ui/BentoGrid';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/GlassToast';
import { NeonChart } from '@/components/ui/NeonCharts';

const mockActivityData = [
    { name: 'Seg', value: 4 },
    { name: 'Ter', value: 3 },
    { name: 'Qua', value: 7 },
    { name: 'Qui', value: 5 },
    { name: 'Sex', value: 8 },
    { name: 'Sab', value: 6 },
    { name: 'Dom', value: 9 },
];

const mockProductivityData = [
    { name: 'W1', value: 65 },
    { name: 'W2', value: 59 },
    { name: 'W3', value: 80 },
    { name: 'W4', value: 81 },
];

export default function DashboardPage() {
    const { habits } = useHabits();
    const { tasks } = useTasks();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const activeHabits = habits?.filter((h: Habit) => h.active).length || 0;
    const pendingTasks = tasks?.filter((t: Task) => !t.completed).length || 0;
    const hasData = (habits?.length || 0) > 0 || (tasks?.length || 0) > 0;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <PageTitle title="DASHBOARD" subtitle="Visão geral do sistema." />
                <Button onClick={() => showToast('Sistema Operacional: Online', 'success')} variant="outline" size="sm">
                    TEST TOAST
                </Button>
            </div>

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
                <BentoGrid>
                    {/* Welcome / Status Card */}
                    <BentoItem colSpan={3} className="bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-white glow-text">Bem-vindo de volta.</h2>
                                <p className="text-gray-400">Seus sistemas estão operando normalmente.</p>
                            </div>
                            <Zap className="w-12 h-12 text-yellow-400 animate-pulse" />
                        </div>
                    </BentoItem>

                    {/* Habits Stats */}
                    <BentoItem colSpan={2} onClick={() => navigate('/habits')} className="cursor-pointer group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Activity className="w-24 h-24" />
                        </div>
                        <div className="flex flex-col h-full justify-between relative z-10">
                            <div className="flex items-center gap-2 text-primary">
                                <Activity className="w-5 h-5" />
                                <span className="font-mono text-sm tracking-wider">HÁBITOS ATIVOS</span>
                            </div>
                            <div>
                                <div className="text-5xl font-bold text-white glow-text mb-2">
                                    {activeHabits}
                                </div>
                                <div className="text-sm text-gray-400">
                                    Protocolos em execução hoje.
                                </div>
                            </div>
                            <div className="w-full bg-gray-800 h-1 mt-4 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '60%' }} // Mock progress for now
                                    className="h-full bg-primary"
                                />
                            </div>
                        </div>
                    </BentoItem>

                    {/* Tasks Stats */}
                    <BentoItem colSpan={1} onClick={() => navigate('/tasks')} className="cursor-pointer group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <ListTodo className="w-24 h-24" />
                        </div>
                        <div className="flex flex-col h-full justify-between relative z-10">
                            <div className="flex items-center gap-2 text-secondary">
                                <ListTodo className="w-5 h-5" />
                                <span className="font-mono text-sm tracking-wider">TAREFAS</span>
                            </div>
                            <div>
                                <div className="text-5xl font-bold text-white glow-text mb-2">
                                    {pendingTasks}
                                </div>
                                <div className="text-sm text-gray-400">
                                    Pendentes.
                                </div>
                            </div>
                        </div>
                    </BentoItem>

                    {/* Neon Charts */}
                    <BentoItem colSpan={2} className="p-0 border-none bg-transparent">
                        <NeonChart
                            title="Atividade Semanal"
                            data={mockActivityData}
                            color="#22d3ee"
                            className="h-full"
                        />
                    </BentoItem>
                    <BentoItem colSpan={2} className="p-0 border-none bg-transparent">
                        <NeonChart
                            title="Produtividade"
                            data={mockProductivityData}
                            type="bar"
                            color="#a855f7"
                            className="h-full"
                        />
                    </BentoItem>
                </BentoGrid>
            )}
        </div>
    );
}
