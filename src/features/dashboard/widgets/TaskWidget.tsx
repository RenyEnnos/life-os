import { useState } from 'react';
import { CheckCircle2, Circle, Plus, Play, Calendar } from 'lucide-react';
import { WidgetShell } from './WidgetShell';
import { useDashboardData } from '@/features/dashboard/hooks/useDashboardData';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '@/features/tasks/api/tasks.api';
import { cn } from '@/shared/lib/cn';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Task } from '@/shared/types';
import { useAuth } from '@/features/auth/contexts/AuthContext';

import { useFocusStore } from '@/features/focus/stores/useFocusStore';

export function TaskWidget() {
    const { agenda, isLoading } = useDashboardData(); // Agenda is strictly today's tasks
    const { user } = useAuth();
    const qc = useQueryClient();
    const [isAdding, setIsAdding] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    // Connect to focus store
    const startFocus = useFocusStore(state => state.startFocus);

    const toggleTask = useMutation({
        mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
            tasksApi.update(id, { completed }),
        onSettled: () => {
            qc.invalidateQueries({ queryKey: ['tasks'] });
        }
    });

    const createTask = useMutation({
        mutationFn: () => tasksApi.create({
            title: newTaskTitle,
            user_id: user?.id,
            due_date: new Date().toISOString() // Defaults to today
        }),
        onSettled: () => {
            qc.invalidateQueries({ queryKey: ['tasks'] });
            setNewTaskTitle('');
            setIsAdding(false);
        }
    });

    // We might want to see ALL active tasks, not just agenda?
    // useDashboardData returns 'tasks' (all) and 'agenda' (today).
    // For a widget, "Agenda" (Today) is usually best.

    return (
        <WidgetShell
            title="Missão do Dia"
            subtitle={`${agenda.filter(t => t.completed).length}/${agenda.length} Concluídas`}
            icon={<CheckCircle2 size={18} className="text-primary" />}
            className="h-full min-h-[320px]"
            action={
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
                >
                    <Plus size={18} className={cn("transition-transform", isAdding && "rotate-45")} />
                </button>
            }
        >
            <div className="flex flex-col h-full gap-2">
                {isAdding && (
                    <div className="flex gap-2 animate-in fade-in slide-in-from-top-2 mb-2">
                        <input
                            value={newTaskTitle}
                            onChange={e => setNewTaskTitle(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && newTaskTitle && createTask.mutate()}
                            placeholder="Nova tarefa..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary/50 outline-none"
                            autoFocus
                        />
                        <button
                            disabled={!newTaskTitle || createTask.isPending}
                            onClick={() => createTask.mutate()}
                            className="bg-primary/20 text-primary hover:bg-primary/30 p-2 rounded-lg transition-colors"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-2">
                    {isLoading && <p className="text-xs text-zinc-500">Carregando...</p>}

                    {!isLoading && agenda.length === 0 && !isAdding && (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-500 border border-dashed border-white/10 rounded-xl">
                            <Calendar size={24} className="mb-2 opacity-50" />
                            <p className="text-xs">Agenda livre hoje.</p>
                        </div>
                    )}

                    {agenda.map(task => (
                        <div key={task.id} className="group flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <button
                                    onClick={() => toggleTask.mutate({ id: task.id, completed: !task.completed })}
                                    className={cn(
                                        "flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                                        task.completed ? "bg-primary border-primary text-black" : "border-zinc-600 hover:border-zinc-400"
                                    )}
                                >
                                    {task.completed && <CheckCircle2 size={14} />}
                                </button>
                                <span className={cn(
                                    "text-sm truncate transition-opacity",
                                    task.completed ? "text-zinc-600 line-through" : "text-zinc-200"
                                )}>
                                    {task.title}
                                </span>
                            </div>

                            {!task.completed && (
                                <button
                                    className="opacity-0 group-hover:opacity-100 p-2 rounded-full bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all"
                                    title="Iniciar Foco"
                                    onClick={() => startFocus(task.id)}
                                >
                                    <Play size={14} fill="currentColor" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </WidgetShell>
    );
}
