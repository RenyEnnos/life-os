import { useState, useMemo } from 'react';
import { CheckCircle2, Circle, Plus, Play, Calendar } from 'lucide-react';
import { Widget } from '@/shared/ui/Widget';
import { useDashboardTasks } from '@/features/dashboard/hooks/useDashboardData';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '@/features/tasks/api/tasks.api';
import { cn } from '@/shared/lib/cn';
import { Task } from '@/shared/types';
import { useAuth } from '@/features/auth/contexts/AuthContext';

import { useFocusStore } from '@/features/focus/stores/useFocusStore';

const today = new Date().toISOString().split('T')[0];

export function TaskWidget() {
    const { data: tasks, isLoading } = useDashboardTasks();
    const { user } = useAuth();
    const qc = useQueryClient();
    const [isAdding, setIsAdding] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const agenda = useMemo(() => (tasks || [])
        .filter((t: any) => {
            const due = t.due_date
            return typeof due === 'string' && due.startsWith(today)
        })
        .slice(0, 5), [tasks]);

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

    return (
        <Widget
            title="Missão do Dia"
            subtitle={`${agenda.filter(t => t.completed).length}/${agenda.length} Concluídas`}
            icon={CheckCircle2}
            className="h-full min-h-[320px] col-span-1 row-span-2"
            isLoading={isLoading}
            isEmpty={!isLoading && agenda.length === 0 && !isAdding}
            emptyMessage="Agenda livre hoje."
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
        </Widget>
    );
}
