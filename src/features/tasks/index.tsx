import { useCallback, useMemo, useState } from 'react';
import { addDays, format, isBefore, isSameDay, startOfWeek } from 'date-fns';
import { Inbox, List, Ghost } from 'lucide-react';
import Modal from '@/shared/ui/Modal';
import { Loader } from '@/shared/ui/Loader';
import { useTasks } from './hooks/useTasks';
import { useAI } from '@/features/ai-assistant/hooks/useAI';
import { useToast } from '@/shared/ui/useToast';
import { cn } from '@/shared/lib/cn';
import type { Task } from '@/shared/types';

type Filter = 'all' | 'active' | 'completed';

const WEEK_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
function getPriorityColor(priority?: Task['priority']) {
    if (priority === 'high') return 'bg-red-500/80';
    if (priority === 'medium') return 'bg-yellow-500/80';
    if (priority === 'low') return 'bg-blue-500/80';
    return 'bg-zinc-500/50';
}

function formatDue(task: Task, today: Date) {
    if (!task.due_date) return 'No due date';
    const due = new Date(task.due_date);
    if (Number.isNaN(due.getTime())) return 'No due date';
    if (isSameDay(due, today)) return `Due ${format(due, 'HH:mm')}`;
    return `Due ${format(due, 'eee, HH:mm')}`;
}

function normalizeDate(value?: string | null) {
    if (!value) return null;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
}

export default function TasksPage() {
    const { tasks, isLoading, createTask, updateTask, deleteTask } = useTasks();
    const { generatePlan } = useAI();
    const { showToast } = useToast();

    const [filter, setFilter] = useState<Filter>('all');
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
    const [plan, setPlan] = useState<Record<string, string[]> | null>(null);
    const [isPlanning, setIsPlanning] = useState(false);

    const today = useMemo(() => {
        const t = new Date();
        t.setHours(0, 0, 0, 0);
        return t;
    }, []);

    const stats = useMemo(() => {
        const total = tasks?.length ?? 0;
        const completed = tasks?.filter((t) => t.completed).length ?? 0;
        const active = total - completed;
        const overdue = tasks?.filter((t) => {
            const due = normalizeDate(t.due_date);
            return !t.completed && due && isBefore(due, today);
        }).length ?? 0;
        const todayCount = tasks?.filter((t) => {
            const due = normalizeDate(t.due_date);
            return !t.completed && due && isSameDay(due, today);
        }).length ?? 0;
        const completionRate = total ? Math.round((completed / total) * 100) : 0;
        return { total, completed, active, overdue, todayCount, completionRate };
    }, [tasks, today]);

    const weeklyVelocity = useMemo(() => {
        const start = startOfWeek(today, { weekStartsOn: 1 });
        const counts = Array.from({ length: 7 }, (_, idx) => {
            const day = addDays(start, idx);
            return (tasks || []).filter((task) => {
                const reference = normalizeDate(task.due_date) || normalizeDate(task.created_at);
                return reference ? isSameDay(reference, day) : false;
            }).length;
        });
        const max = Math.max(...counts, 1);
        return { counts, max };
    }, [tasks, today]);

    const filteredTasks = useMemo(() => {
        let list = tasks || [];
        if (filter === 'active') list = list.filter((t) => !t.completed);
        if (filter === 'completed') list = list.filter((t) => t.completed);

        return list.slice().sort((a, b) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1;

            const aDue = normalizeDate(a.due_date);
            const bDue = normalizeDate(b.due_date);

            if (aDue && bDue && aDue.getTime() !== bDue.getTime()) {
                return aDue.getTime() - bDue.getTime();
            }
            if (aDue && !bDue) return -1;
            if (!aDue && bDue) return 1;

            const priorityOrder = { high: 0, medium: 1, low: 2 } as const;
            const aPriority = priorityOrder[(a.priority ?? 'low') as keyof typeof priorityOrder] ?? 3;
            const bPriority = priorityOrder[(b.priority ?? 'low') as keyof typeof priorityOrder] ?? 3;
            if (aPriority !== bPriority) return aPriority - bPriority;

            return a.title.localeCompare(b.title);
        });
    }, [filter, tasks]);

    const handleCreateTask = useCallback(async () => {
        const title = newTaskTitle.trim();
        if (!title) return;
        try {
            await createTask.mutateAsync({ title, completed: false });
            setNewTaskTitle('');
            showToast('Tarefa criada.', 'success');
        } catch (error) {
            console.error(error);
            showToast('Não foi possível criar a tarefa.', 'error');
        }
    }, [createTask, newTaskTitle, showToast]);

    const handleToggle = useCallback((task: Task) => {
        updateTask.mutate({
            id: task.id,
            updates: { completed: !task.completed }
        });
    }, [updateTask]);

    const handleDelete = useCallback(async () => {
        if (!confirmDelete) return;
        try {
            await deleteTask.mutateAsync(confirmDelete);
            showToast('Tarefa removida.', 'info');
        } catch (error) {
            console.error(error);
            showToast('Erro ao remover tarefa.', 'error');
        } finally {
            setConfirmDelete(null);
        }
    }, [confirmDelete, deleteTask, showToast]);

    const handleGeneratePlan = useCallback(async () => {
        if (!tasks?.length) return;
        setIsPlanning(true);
        try {
            const context = tasks
                .map((t) => `${t.title} | due: ${t.due_date || 'none'} | status: ${t.completed ? 'done' : 'open'}`)
                .join('\n');
            const response = await generatePlan.mutateAsync({ context });
            if (response?.plan) {
                setPlan(response.plan);
                showToast('Plano gerado com IA.', 'success');
            } else {
                showToast('Não foi possível gerar o plano.', 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('Não foi possível gerar o plano.', 'error');
        } finally {
            setIsPlanning(false);
        }
    }, [generatePlan, showToast, tasks]);

    const renderTask = (task: Task) => {
        const dueLabel = formatDue(task, today);
        const tag = task.tags?.[0] || task.priority || 'Task';

        return (
            <div
                key={task.id}
                className={cn(
                    "group flex items-center gap-4 p-4 border border-transparent hover:bg-white/5 hover:border-white/10 transition-all duration-300 cursor-pointer",
                    task.completed && "opacity-60"
                )}
            >
                <label className="relative flex items-center justify-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="task-checkbox peer h-5 w-5 appearance-none rounded-sm border border-white/15 bg-transparent checked:bg-primary checked:border-primary transition-all"
                        checked={!!task.completed}
                        onChange={() => handleToggle(task)}
                        disabled={updateTask.isPending}
                        aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
                    />
                    <span aria-hidden="true" className="material-symbols-outlined absolute pointer-events-none opacity-0 peer-checked:opacity-100 text-white text-[16px]">check</span>
                </label>

                <div className="flex flex-col flex-1 min-w-0">
                    <span className={cn(
                        "text-zinc-200 text-sm font-normal transition-colors truncate",
                        task.completed && "line-through text-zinc-500",
                        !task.completed && "group-hover:text-white"
                    )}>
                        {task.title}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-500 flex-wrap">
                        <span
                            className={cn("w-1.5 h-1.5 rounded-full", getPriorityColor(task.priority))}
                            title={`Priority: ${task.priority || 'none'}`}
                            aria-label={`Priority: ${task.priority || 'none'}`}
                        />
                        <span className="text-[10px] uppercase tracking-wider">{tag}</span>
                        <span className="text-zinc-700 text-[10px]">•</span>
                        <span className="text-zinc-600">{dueLabel}</span>
                    </div>
                </div>

                <button
                    type="button"
                    className={cn("opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity hover:text-white", deleteTask.isPending ? "text-zinc-500 cursor-not-allowed" : "text-zinc-600")}
                    onClick={() => setConfirmDelete(task.id)}
                    aria-label={`Delete task: ${task.title}`}
                    disabled={deleteTask.isPending}
                >
                    <span className="material-symbols-outlined text-[18px]">{deleteTask.isPending ? 'hourglass_top' : 'more_horiz'}</span>
                </button>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader text="CARREGANDO TAREFAS..." />
            </div>
        );
    }

    return (
        <div className="dashboard-shell relative h-full w-full overflow-hidden">
            

            <div className="relative flex h-screen w-full overflow-hidden z-10">
                {/* Sidebar Navigation removed - using global AppLayout Sidebar */}
                <main className="flex-1 h-full overflow-y-auto relative p-4 lg:p-10 flex flex-col gap-8 custom-scrollbar">
                    <div className="w-full flex flex-col gap-6 animate-enter">
                        <div className="flex items-end justify-between px-2">
                            <div>
                                <h2 className="text-[10px] text-zinc-500 font-medium tracking-widest uppercase mb-1">Workflow</h2>
                                <h1 className="text-3xl font-light text-white tracking-tight">Tasks</h1>
                            </div>
                            <div className="hidden md:block text-right">
                                <span className="text-xs text-zinc-600 font-medium tracking-wide">{format(new Date(), 'EEEE, dd LLL').toUpperCase()}</span>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-zinc-500 group-focus-within:text-primary transition-colors">radio_button_unchecked</span>
                            </div>
                            <input
                                type="text"
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleCreateTask(); }}
                                placeholder="What needs to be done?"
                                aria-label="Create new task"
                                className="w-full bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-2xl py-5 pl-14 pr-24 text-lg font-light text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-white/10 focus:ring-0 focus:bg-zinc-900/60 transition-all shadow-lg hover:border-white/10"
                            />
                            <div className="absolute inset-y-2 right-2 flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handleGeneratePlan}
                                    disabled={isPlanning || !tasks?.length}
                                    className={cn(
                                        "h-full px-3 rounded-xl text-xs font-semibold uppercase tracking-wide border border-white/5 transition-all",
                                        isPlanning ? "bg-white/10 text-zinc-500" : "bg-white/5 text-zinc-300 hover:bg-primary hover:text-white hover:border-primary"
                                    )}
                                >
                                    {isPlanning ? 'Planning...' : 'IA Plan'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCreateTask}
                                    disabled={createTask.isPending || !newTaskTitle.trim()}
                                    className={cn(
                                        "h-full aspect-square rounded-xl flex items-center justify-center transition-all border border-white/5",
                                        createTask.isPending ? "bg-white/10 text-zinc-500 cursor-not-allowed" : "bg-white/5 hover:bg-primary hover:text-white hover:border-primary text-zinc-400"
                                    )}
                                    aria-label="Add task"
                                >
                                    <span className="material-symbols-outlined text-[20px]">{createTask.isPending ? 'hourglass_top' : 'add'}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="lg:w-2/3 glass-card rounded-3xl bg-glass-surface backdrop-blur-xl border border-white/5 p-6 lg:p-8 flex flex-col relative overflow-hidden animate-enter animate-enter-delay-1">
                            <div className="flex justify-between items-center mb-6 z-10">
                                <h3 className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Mission Control</h3>
                                <div className="flex gap-2">
                                    {(['all', 'active', 'completed'] as Filter[]).map((f) => (
                                        <button
                                            key={f}
                                            type="button"
                                            onClick={() => setFilter(f)}
                                            aria-pressed={filter === f}
                                            className={cn(
                                                "px-2 py-1 rounded border text-[10px] uppercase tracking-wider transition-colors",
                                                filter === f
                                                    ? "bg-white/5 border-white/10 text-zinc-300"
                                                    : "border-transparent text-zinc-600 hover:text-zinc-400 hover:border-white/5"
                                            )}
                                        >
                                            {f === 'all' && 'All'}
                                            {f === 'active' && 'Active'}
                                            {f === 'completed' && 'Done'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                    <div className="flex flex-col divide-y divide-white/10 overflow-y-auto pr-2 custom-scrollbar z-10 h-full max-h-[600px]">
                        {filteredTasks.map(renderTask)}
                        {!filteredTasks.length && (
                            <div className="flex flex-col items-center justify-center py-12 text-zinc-500 animate-in fade-in zoom-in duration-300">
                                {filter === 'active' && (
                                    <>
                                        <Ghost className="w-12 h-12 mb-3 opacity-20 text-zinc-400" />
                                        <p className="text-sm font-medium">Tudo em dia!</p>
                                        <p className="text-xs text-zinc-600 mt-1">Nenhuma tarefa ativa. Hora de relaxar?</p>
                                    </>
                                )}
                                {filter === 'completed' && (
                                    <>
                                        <List className="w-12 h-12 mb-3 opacity-20 text-zinc-400" />
                                        <p className="text-sm font-medium">Nenhuma tarefa concluída.</p>
                                        <p className="text-xs text-zinc-600 mt-1">Conclua algumas tarefas para vê-las aqui.</p>
                                    </>
                                )}
                                {filter === 'all' && (
                                    <>
                                        <Inbox className="w-12 h-12 mb-3 opacity-20 text-zinc-400" />
                                        <p className="text-sm font-medium">Sua caixa de entrada está vazia.</p>
                                        <p className="text-xs text-zinc-600 mt-1">Pronto para começar? Adicione uma nova tarefa.</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-b-3xl" />
                        </div>

                        <div className="flex flex-col gap-6 lg:w-1/3">
                            <div className="glass-card flex-1 min-h-[220px] rounded-3xl bg-glass-surface backdrop-blur-xl border border-white/5 p-6 relative overflow-hidden flex flex-col justify-between animate-enter animate-enter-delay-2">
                                <div className="flex justify-between items-start z-10">
                                    <span className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Focus State</span>
                                    <span className="flex h-3 w-3 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500" />
                                    </span>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
                                    <div className="flex items-center justify-center gap-[3px] h-16 transform scale-y-75">
                                        {Array.from({ length: 10 }).map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={cn(
                                                    "w-1 bg-indigo-400/80 rounded-full",
                                                    idx % 2 === 0 ? "animate-[pulse_1s_ease-in-out_infinite]" : "animate-[pulse_1.3s_ease-in-out_infinite_0.1s]"
                                                )}
                                                style={{ height: `${6 + (idx % 5) * 3}px` }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="z-10 mt-auto">
                                    <p className="text-lg font-light text-white leading-tight">
                                        {stats.completionRate >= 70 ? 'Neural Resonance' : 'Momentum Building'}
                                    </p>
                                    <p className="text-zinc-500 text-xs mt-1">
                                        {stats.overdue > 0
                                            ? `${stats.overdue} overdue • ${stats.todayCount} today`
                                            : `Active: ${stats.active} • Completion ${stats.completionRate}%`}
                                    </p>
                                </div>
                            </div>

                            <div className="glass-card flex-1 min-h-[220px] rounded-3xl bg-glass-surface backdrop-blur-xl border border-white/5 p-6 flex flex-col justify-between animate-enter animate-enter-delay-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Velocity</span>
                                        <h4 className="text-2xl font-light text-white tracking-tighter">
                                            {stats.total ? `${Math.max(1, Math.round(stats.completed / 7))} ` : '0 '}
                                            <span className="text-sm text-zinc-500 font-normal">tasks/day</span>
                                        </h4>
                                    </div>
                                    <span className="material-symbols-outlined text-zinc-600">trending_up</span>
                                </div>
                                <div className="h-24 w-full flex items-end gap-2 mt-4">
                                    {weeklyVelocity.counts.map((count, idx) => {
                                        const height = `${(count / weeklyVelocity.max) * 90 + 10}%`;
                                        const isToday = idx === (new Date().getDay() + 6) % 7; // match labels starting Monday
                                        return (
                                            <div key={idx} className="group relative flex-1 h-full flex items-end">
                                                <div
                                                    className={cn(
                                                        "w-full rounded-sm transition-colors",
                                                        isToday ? "bg-primary/80 hover:bg-primary shadow-[0_0_15px_rgba(48,140,232,0.3)]" : "bg-zinc-800/50 hover:bg-zinc-700/50"
                                                    )}
                                                    style={{ height }}
                                                />
                                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {count}
                                                </div>
                                                <div className={cn(
                                                    "absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-zinc-400",
                                                    isToday && "text-white font-medium"
                                                )}>
                                                    {WEEK_LABELS[idx]}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <Modal open={!!plan} onClose={() => setPlan(null)} title="Plano semanal sugerido">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {plan && Object.entries(plan).map(([day, items]) => (
                        <div key={day} className="border border-border rounded p-3 bg-surface/50">
                            <h4 className="font-semibold font-sans text-sm text-foreground mb-2">{day}</h4>
                            <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                                {Array.isArray(items) && items.map((item: string, i: number) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={() => setPlan(null)}
                    className="w-full py-2 rounded-lg bg-primary text-black font-semibold hover:bg-primary/90 transition-colors"
                >
                    Fechar
                </button>
            </Modal>

            <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Confirmar exclusão">
                <div className="space-y-4">
                    <p className="text-muted-foreground">Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.</p>
                    <div className="flex gap-2 justify-end">
                        <button
                            type="button"
                            className="px-3 py-2 rounded-lg border border-white/10 text-zinc-200 hover:bg-white/5 transition-colors"
                            onClick={() => setConfirmDelete(null)}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className="px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                            onClick={handleDelete}
                        >
                            Excluir Tarefa
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
