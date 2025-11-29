import { useState } from 'react';
import { Plus, Calendar as CalendarIcon, List } from 'lucide-react';
import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/Button';
import { useTasks } from '@/hooks/useTasks';
import { TaskItem } from './components/TaskItem';
import { CreateTaskDialog } from './components/CreateTaskDialog';
import { useAI } from '@/hooks/useAI';
import { clsx } from 'clsx';
import { Zap } from 'lucide-react';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';

export default function TasksPage() {
    const { tasks, isLoading, createTask, updateTask, deleteTask } = useTasks();
    const { generatePlan } = useAI();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [view, setView] = useState<'list' | 'calendar'>('list');
    const [plan, setPlan] = useState<Record<string, string[]> | null>(null);
    const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

    const handleGeneratePlan = async () => {
        if (!tasks || tasks.length === 0) {
            alert('Nenhuma tarefa para planejar.');
            return;
        }
        setIsGeneratingPlan(true);
        try {
            const context = tasks.map((t: any) => `${t.title} (Due: ${t.due_date || 'None'})`).join('\n');
            const result = await generatePlan.mutateAsync({ context });
            if (result.plan) {
                setPlan(result.plan);
            }
        } catch (error) {
            console.error('Failed to generate plan', error);
            alert('Falha ao gerar plano.');
        } finally {
            setIsGeneratingPlan(false);
        }
    };

    const handleToggle = (task: any) => {
        updateTask.mutate({
            id: task.id,
            updates: { completed: !task.completed }
        });
    };

    const handleDelete = (id: string) => {
        if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
            deleteTask.mutate(id);
        }
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const groupedTasks = tasks?.reduce((acc: any, task: any) => {
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

    const renderSection = (title: string, tasks: any[], colorClass = "text-foreground") => {
        if (!tasks?.length) return null;
        return (
            <section className="space-y-3">
                <h2 className={clsx("font-mono font-bold text-sm tracking-wider uppercase border-b border-border pb-1", colorClass)}>
                    {title} ({tasks.length})
                </h2>
                <div className="space-y-2">
                    {tasks.map((task: any) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onToggle={() => handleToggle(task)}
                            onDelete={() => handleDelete(task.id)}
                        />
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
                    <div className="flex gap-2">
                        <div className="bg-surface border border-border rounded-md p-1 flex gap-1">
                            <button
                                onClick={() => setView('list')}
                                className={clsx("p-1.5 rounded transition-colors", view === 'list' ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground")}
                                aria-label="Visualização em Lista"
                                title="Visualização em Lista"
                            >
                                <List size={18} />
                            </button>
                            <button
                                onClick={() => setView('calendar')}
                                className={clsx("p-1.5 rounded transition-colors", view === 'calendar' ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground")}
                                aria-label="Visualização em Calendário"
                                title="Visualização em Calendário"
                            >
                                <CalendarIcon size={18} />
                            </button>
                        </div>
                        <Button
                            variant="outline"
                            onClick={handleGeneratePlan}
                            disabled={isGeneratingPlan || !tasks?.length}
                            className="gap-2"
                        >
                            <Zap size={18} className={isGeneratingPlan ? "animate-pulse" : ""} />
                            {isGeneratingPlan ? 'PLANEJANDO...' : 'PLANO SEMANAL IA'}
                        </Button>
                        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                            <Plus size={18} />
                            NOVA TAREFA
                        </Button>
                    </div>
                }
            />

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader text="LOADING TASKS..." />
                </div>
            ) : view === 'list' ? (
                <div className="space-y-8 max-w-3xl">
                    {renderSection("ATRASADAS", groupedTasks?.overdue, "text-destructive")}
                    {renderSection("HOJE", groupedTasks?.today, "text-primary")}
                    {renderSection("SEM DATA", groupedTasks?.noDate)}
                    {renderSection("PRÓXIMAS", groupedTasks?.upcoming)}
                    {renderSection("CONCLUÍDAS", groupedTasks?.completed, "text-muted-foreground")}

                    {!tasks?.length && (
                        <EmptyState
                            icon={List}
                            title="BACKLOG VAZIO"
                            description="Nenhuma tarefa pendente. Adicione itens ao backlog para iniciar o fluxo."
                            action={
                                <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                                    <Plus size={16} /> CRIAR TAREFA
                                </Button>
                            }
                        />
                    )}
                </div>
            ) : (
                <div className="text-center py-20 border border-dashed border-border rounded-lg">
                    <p className="text-muted-foreground font-mono">Visualização de calendário em desenvolvimento.</p>
                </div>
            )}

            {plan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-card border border-primary/20 p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <h3 className="font-bold font-mono text-lg mb-4 flex items-center gap-2">
                            <Zap size={20} className="text-primary" />
                            PLANO SEMANAL SUGERIDO
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {Object.entries(plan).map(([day, items]) => (
                                <div key={day} className="border border-border rounded p-3 bg-surface/50">
                                    <h4 className="font-bold font-mono text-sm text-primary mb-2 uppercase">{day}</h4>
                                    <ul className="list-disc list-inside space-y-1 text-xs font-mono text-muted-foreground">
                                        {Array.isArray(items) && items.map((item, i) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        <Button onClick={() => setPlan(null)} className="w-full">FECHAR</Button>
                    </div>
                </div>
            )}

            <CreateTaskDialog
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSubmit={createTask.mutate}
            />
        </div>
    );
}
