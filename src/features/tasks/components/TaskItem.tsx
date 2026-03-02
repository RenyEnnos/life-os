import { Check, Trash2, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Task } from '@/shared/types';
import { cn } from '@/shared/lib/cn';
import { format } from 'date-fns';

interface TaskItemProps {
    task: Task;
    onToggle: () => void;
    onDelete: () => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
    const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !task.completed;
    const dueLabel = task.due_date ? format(new Date(task.due_date), 'HH:mm') : null;
    const dueDay = task.due_date ? format(new Date(task.due_date), 'eee') : null;

    return (
        <div className={cn(
            "group flex flex-col gap-3 p-4 bg-white/[0.03] border border-white/5 rounded-2xl transition-all duration-300 hover:bg-white/[0.06] hover:border-white/10",
            task.completed && "opacity-60 grayscale-[0.2]"
        )}>
            <div className="flex items-start gap-3">
                <button
                    onClick={onToggle}
                    aria-label={task.completed ? `Mark task "${task.title}" as incomplete` : `Mark task "${task.title}" as complete`}
                    className={cn(
                        "mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-300",
                        task.completed
                            ? "bg-primary border-primary text-white shadow-[0_0_10px_rgba(48,140,232,0.4)]"
                            : "border-white/10 hover:border-primary/50 bg-transparent text-transparent hover:text-primary/50"
                    )}
                >
                    <Check size={14} strokeWidth={4} className={cn(!task.completed && "opacity-0")} />
                </button>

                <div className="flex-1 min-w-0">
                    <h3 className={cn(
                        "text-sm font-medium transition-colors truncate",
                        task.completed ? "line-through text-zinc-500" : "text-zinc-200",
                        !task.completed && "group-hover:text-white"
                    )}>
                        {task.title}
                    </h3>
                    
                    {task.description && (
                        <p className="mt-1 text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                            {task.description}
                        </p>
                    )}
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onDelete}
                    className="opacity-0 group-hover:opacity-100 -mr-2 -mt-1 h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                >
                    <Trash2 size={14} />
                </Button>
            </div>

            <div className="flex items-center gap-2 mt-auto">
                {task.due_date && (
                    <div className={cn(
                        "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider",
                        isOverdue && !task.completed 
                            ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                            : "bg-white/5 text-zinc-500 border border-white/5"
                    )}>
                        <Clock size={10} />
                        <span>{dueDay}, {dueLabel}</span>
                    </div>
                )}
                
                {task.priority && (
                    <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        task.priority === 'high' ? 'bg-red-500' : 
                        task.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                    )} />
                )}

                {task.tags?.slice(0, 1).map(tag => (
                    <span key={tag} className="text-[10px] text-zinc-600 uppercase tracking-widest font-semibold ml-auto">
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
}
