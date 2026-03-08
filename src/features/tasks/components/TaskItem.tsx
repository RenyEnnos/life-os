import { Check, Trash2, Clock } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Task } from '@/shared/types';
import { cn } from '@/shared/lib/cn';
import { format } from 'date-fns';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { useEffect, useRef, memo } from 'react';
import { Confetti } from '@/shared/ui/premium/Confetti';
import { SyncBadge } from '@/shared/ui/SyncBadge';
import { haptics } from '@/shared/services/HapticsService';

interface TaskItemProps {
    task: Task;
    onToggle: () => void;
    onDelete: () => void;
}

export const TaskItem = memo(({ task, onToggle, onDelete }: TaskItemProps) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const prevCompleted = useRef(task.completed);

    useEffect(() => {
        if (!prevCompleted.current && task.completed && buttonRef.current) {
            haptics.impact();
            const rect = buttonRef.current.getBoundingClientRect();
            const x = (rect.left + rect.width / 2) / window.innerWidth;
            const y = (rect.top + rect.height / 2) / window.innerHeight;

            Confetti({
                particleCount: 30,
                spread: 50,
                origin: { x, y },
                colors: ["#3b82f6", "#ffffff", "#60a5fa"],
                ticks: 150,
                gravity: 1,
                decay: 0.94,
                startVelocity: 25,
            });
        }
        prevCompleted.current = task.completed;
    }, [task.completed]);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };

    const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !task.completed;
    const dueLabel = task.due_date ? format(new Date(task.due_date), 'HH:mm') : null;
    const dueDay = task.due_date ? format(new Date(task.due_date), 'eee') : null;

    return (
        <motion.div 
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            animate={!prevCompleted.current && task.completed ? {
                scale: [1, 1.02, 1],
                transition: { duration: 0.3 }
            } : {}}
            className={cn(
                "group flex flex-col gap-3 p-4 bg-white/[0.03] border border-white/5 rounded-2xl transition-all duration-300 hover:bg-white/[0.06] hover:border-white/10 cursor-grab active:cursor-grabbing",
                task.completed && "opacity-60 grayscale-[0.2]"
            )}
        >
            <div className="flex items-start gap-3">
                <button
                    ref={buttonRef}
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggle();
                    }}
                    aria-label={task.completed ? `Mark task "${task.title}" as incomplete` : `Mark task "${task.title}" as complete`}
                    className={cn(
                        "mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-300 shrink-0",
                        task.completed
                            ? "bg-primary border-primary text-black shadow-[0_0_10px_rgba(48,140,232,0.4)]"
                            : "border-white/10 hover:border-primary/50 bg-transparent text-transparent hover:text-primary/50"
                    )}
                >
                    <Check size={14} strokeWidth={4} className={cn(!task.completed && "opacity-0")} />
                </button>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className={cn(
                            "text-sm font-medium transition-colors truncate",
                            task.completed ? "line-through text-zinc-500" : "text-zinc-200",
                            !task.completed && "group-hover:text-white"
                        )}>
                            {task.title}
                        </h3>
                        <SyncBadge  />
                    </div>
                    
                    {task.description && (
                        <p className="mt-1 text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                            {task.description}
                        </p>
                    )}
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
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
        </motion.div>
    );
});
