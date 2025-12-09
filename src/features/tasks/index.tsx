import { useState } from 'react';
import { Plus, Calendar as CalendarIcon, List, Zap } from 'lucide-react';
import { PageTitle } from '@/shared/ui/PageTitle';
import { Button } from '@/shared/ui/Button';
import { useTasks } from '@/features/tasks/hooks/useTasks';
import { PremiumTaskCard } from './components/PremiumTaskCard';
import { CreateTaskDialog } from './components/CreateTaskDialog';
import { useAI } from '@/features/ai-assistant/hooks/useAI';
import { clsx } from 'clsx';
import Modal from '@/shared/ui/Modal';
import Tooltip from '@/shared/ui/Tooltip';
import { Loader } from '@/shared/ui/Loader';
import { EmptyState } from '@/shared/ui/EmptyState';
import type { Task } from '@/shared/types';
import type { Plan } from './types';
import { useStaggerAnimation } from '@/shared/hooks/useStaggerAnimation';
import { useToast } from '@/shared/ui/GlassToast';
import { ShimmerButton } from '@/shared/ui/premium/ShimmerButton';
import { Meteors } from '@/shared/ui/premium/Meteors';

export default function TasksPage() {
    const { tasks, isLoading, createTask, updateTask, deleteTask } = useTasks();
    const { generatePlan } = useAI();
    const { showToast } = useToast();
    const [view, setView] = useState<'list' | 'calendar'>('list');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [plan, setPlan] = useState<Plan | null>(null);
    const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    useStaggerAnimation('.task-item', [tasks, view]);

    const handleGeneratePlan = async () => {
        setIsGeneratingPlan(true);
        try {
            const context = tasks?.map((t: Task) => `${t.title} (Due: ${t.due_date || 'None'})`).join('\n');
            const result = await generatePlan.mutateAsync({ context: context || '' });
            if (result.plan) {
                setPlan(result.plan);
                showToast('Plano gerado com sucesso!', 'success');
            }
        } catch (error) {
            console.error('Failed to generate plan', error);
            showToast('Falha ao gerar plano.', 'error');
        } finally {
            setIsGeneratingPlan(false);
        }
    };

    const handleToggle = (task: Task) => {
        updateTask.mutate({
            id: task.id,
            updates: { completed: !task.completed }
        });
    };

    const handleDelete = () => {
        if (confirmDelete) {
            deleteTask.mutate(confirmDelete);
            setConfirmDelete(null);
            showToast('Tarefa excluída.', 'info');
        }
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const groupedTasks = tasks?.reduce((acc: Partial<Record<'completed' | 'noDate' | 'overdue' | 'today' | 'upcoming', Task[]>>, task: Task) => {
        if (task.completed) {
            if (!acc.completed) acc.completed = [];
            acc.completed.push(task);
            return acc;
        }

        if (!task.due_date) {
            if (!acc.noDate) acc.noDate = [];
            acc.noDate.push(task);
            return acc;
        }

        const dueDate = new Date(task.due_date);
        dueDate.setHours(0, 0, 0, 0);

        if (dueDate.getTime() < today.getTime()) {
            if (!acc.overdue) acc.overdue = [];
            acc.overdue.push(task);
        } else if (dueDate.getTime() === today.getTime()) {
            if (!acc.today) acc.today = [];
            acc.today.push(task);
        } else {
            if (!acc.upcoming) acc.upcoming = [];
            acc.upcoming.push(task);
        }
        return acc;
    }, {});

    const renderSection = (title: string, tasks: Task[] | undefined, colorClass = "text-foreground") => {
        if (!tasks?.length) return null;
        return (
            <section className="space-y-3">
                <h2 className={clsx("font-mono font-bold text-sm tracking-wider uppercase border-b border-border pb-1", colorClass)}>
                    {title} ({tasks.length})
                </h2>
                <div className="space-y-2">
                    {tasks.map((task: Task) => (
                        <div key={task.id} className="task-item opacity-0">
                            <PremiumTaskCard
                                task={task}
                                onToggle={() => handleToggle(task)}
                                onDelete={() => setConfirmDelete(task.id)}
                            />
                        </div>
                    ))}
                </div>
            </section>
        );
    };

    return (
        <div className="space-y-8 pb-20">
            <PageTitle
                title="TAREFAS"
                subtitle="Backlog de execução."
                action={
                    <div className="flex gap-2 items-center">
                        <div className="bg-surface border border-border rounded-md p-1 flex gap-1 h-fit">
                            <Tooltip content="Lista">
                                <button
                                    onClick={() => setView('list')}
                                    className={clsx("p-1.5 rounded transition-colors", view === 'list' ? "bg-primary/20 text-primary" : "text-mutedForeground hover:text-foreground")}
                                    aria-label="Visualização em Lista"
                                >
                                    <List size={18} />
                                </button>
                            </Tooltip>
                            <Tooltip content="Calendário">
                                <button
                                    onClick={() => setView('calendar')}
                                    className={clsx("p-1.5 rounded transition-colors", view === 'calendar' ? "bg-primary/20 text-primary" : "text-mutedForeground hover:text-foreground")}
                                    aria-label="Visualização em Calendário"
                                >
                                    <CalendarIcon size={18} />
                                </button>
                            </Tooltip>
                        </div>

                        <ShimmerButton
                            onClick={handleGeneratePlan}
                            disabled={isGeneratingPlan || !tasks?.length}
                            className="h-9 px-4 text-xs font-mono gap-2"
                            shimmerColor="#a855f7"
                            background="rgba(168, 85, 247, 0.2)"
                            borderRadius="8px"
                        >
                            <Zap size={14} className={isGeneratingPlan ? "animate-pulse" : ""} />
                            {isGeneratingPlan ? 'PLANEJANDO...' : 'PLANO IA'}
                        </ShimmerButton>

                        <ShimmerButton
                            onClick={() => setIsCreateOpen(true)}
                            className="h-9 px-4 text-xs font-mono gap-2"
                            shimmerColor="#22c55e"
                            background="rgba(34, 197, 94, 0.2)"
                            borderRadius="8px"
                        >
                            <Plus size={14} />
                            NOVA TAREFA
                        </ShimmerButton>
                    </div>
                }
            />

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader text="LOADING TASKS..." />
                </div>
            ) : view === 'list' ? (
                <div className="space-y-8 max-w-3xl">
                    {renderSection("ATRASADAS", groupedTasks?.overdue, "text-red-400")}
                    {renderSection("HOJE", groupedTasks?.today, "text-green-400")}
                    {renderSection("SEM DATA", groupedTasks?.noDate)}
                    {renderSection("PRÓXIMAS", groupedTasks?.upcoming)}
                    {renderSection("CONCLUÍDAS", groupedTasks?.completed, "text-muted-foreground")}

                    {!tasks?.length && (
                        <div className="relative overflow-hidden rounded-xl border border-border bg-surface/30">
                            <Meteors number={20} className="!-z-10" />
                            <EmptyState
                                icon={List}
                                title="BACKLOG VAZIO"
                                description="Nenhuma tarefa pendente. Adicione itens ao backlog para iniciar o fluxo."
                                action={
                                    <Button onClick={() => setIsCreateOpen(true)} className="gap-2 z-10 relative">
                                        <Plus size={16} /> CRIAR TAREFA
                                    </Button>
                                }
                            />
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-20 border border-dashed border-border rounded-lg relative overflow-hidden">
                    <Meteors number={10} />
                    <p className="text-muted-foreground font-mono relative z-10">Visualização de calendário em desenvolvimento.</p>
                </div>
            )}

            <Modal open={!!plan} onClose={() => setPlan(null)} title="Plano semanal sugerido">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {plan && Object.entries(plan).map(([day, items]) => (
                        <div key={day} className="border border-border rounded p-3 bg-surface/50">
                            <h4 className="font-semibold font-sans text-sm text-foreground mb-2">{day}</h4>
                            <ul className="list-disc list-inside space-y-1 text-xs text-mutedForeground">
                                {Array.isArray(items) && items.map((item: string, i: number) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <Button onClick={() => setPlan(null)} className="w-full">Fechar</Button>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Confirmar exclusão">
                <div className="space-y-4">
                    <p className="text-muted-foreground">Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.</p>
                    <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancelar</Button>
                        <Button variant="primary" className="bg-red-500 hover:bg-red-600 text-white border-red-500" onClick={handleDelete}>
                            Excluir Tarefa
                        </Button>
                    </div>
                </div>
            </Modal>

            <CreateTaskDialog
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSubmit={createTask.mutate}
            />
        </div>
    );
}
