import { Check, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Task } from '@/shared/types';
import { clsx } from 'clsx';

interface TaskItemProps {
    task: Task;
    onToggle: () => void;
    onDelete: () => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
    const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !task.completed;

    return (
        <Card className={clsx(
            "p-4 flex items-center gap-4 transition-all duration-300 group",
            task.completed ? "bg-surface/50 border-border opacity-60" : "bg-card border-border hover:border-primary/50",
            isOverdue && !task.completed && "border-destructive/50"
        )}>
            <button
                onClick={onToggle}
                aria-label={task.completed ? "Mark task as incomplete" : "Mark task as complete"}
                className={clsx(
                    "w-6 h-6 rounded-sm border-2 flex items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                    task.completed
                        ? "bg-primary border-primary text-black shadow-[0_0_10px_rgba(13,242,13,0.5)]"
                        : "border-muted-foreground hover:border-primary hover:shadow-[0_0_5px_rgba(13,242,13,0.3)] bg-transparent"
                )}
            >
                {task.completed && <Check size={16} strokeWidth={4} />}
            </button>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h3 className={clsx(
                        "font-mono font-medium truncate",
                        task.completed ? "line-through text-muted-foreground" : "text-foreground",
                        isOverdue && !task.completed && "text-destructive"
                    )}>
                        {task.title}
                    </h3>
                    {isOverdue && !task.completed && (
                        <span className="text-[10px] bg-destructive/10 text-destructive px-1.5 py-0.5 rounded font-mono uppercase">
                            Atrasada
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground font-mono">
                    {task.due_date && (
                        <span className="flex items-center gap-1">
                            <CalendarIcon size={12} />
                            {new Date(task.due_date).toLocaleDateString('pt-BR')}
                        </span>
                    )}
                    {task.description && (
                        <span className="truncate max-w-[200px]">{task.description}</span>
                    )}
                </div>
            </div>

            <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                aria-label="Delete task"
                className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
            >
                <Trash2 size={16} />
            </Button>
        </Card>
    );
}
