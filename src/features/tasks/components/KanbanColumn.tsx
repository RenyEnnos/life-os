import React from 'react';
import { Task, TaskStatus } from '@/shared/types';
import { TaskItem } from './TaskItem';
import { SortableTaskItem } from './SortableTaskItem';
import { cn } from '@/shared/lib/cn';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface KanbanColumnProps {
    title: string;
    status: TaskStatus;
    tasks: Task[];
    onToggle: (task: Task) => void;
    onDelete: (id: string) => void;
    className?: string;
}

export function KanbanColumn({ title, status, tasks, onToggle, onDelete, className }: KanbanColumnProps) {
    return (
        <div className={cn("flex flex-col h-full min-w-[300px] flex-1", className)}>
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                    <h3 className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">{title}</h3>
                    <span className="bg-white/5 border border-white/10 text-zinc-500 text-[10px] px-1.5 py-0.5 rounded-full">
                        {tasks.length}
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar min-h-[100px]">
                <SortableContext 
                    items={tasks.map(t => t.id)} 
                    strategy={verticalListSortingStrategy}
                >
                    {tasks.length > 0 ? (
                        tasks.map((task) => (
                            <SortableTaskItem
                                key={task.id}
                                id={task.id}
                                task={task}
                                onToggle={() => onToggle(task)}
                                onDelete={() => onDelete(task.id)}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.02]">
                            <p className="text-xs text-zinc-600 uppercase tracking-wider">No tasks</p>
                        </div>
                    )}
                </SortableContext>
            </div>
        </div>
    );
}
