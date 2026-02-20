import { memo } from 'react';
import { Check, Trash2, Calendar as CalendarIcon, Moon } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Task } from '@/shared/types';
import { clsx } from 'clsx';
import { MagicCard } from '@/shared/ui/premium/MagicCard';
import { BorderBeam } from '@/shared/ui/premium/BorderBeam';
import { useSanctuaryStore } from '@/shared/stores/sanctuaryStore';

interface PremiumTaskCardProps {
    task: Task;
    onToggle: () => void;
    onDelete: () => void;
}

export const PremiumTaskCard = memo(function PremiumTaskCard({ task, onToggle, onDelete }: PremiumTaskCardProps) {
    const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !task.completed;
    const isHighPriority = isOverdue; // Simplified priority logic for visual flair
    const enterSanctuary = useSanctuaryStore((s) => s.enter);

    const handleEnterSanctuary = () => {
        enterSanctuary(task.id, task.title);
    };

    return (
        <MagicCard
            className={clsx(
                "group flex items-center gap-4 transition-all duration-300 p-0 overflow-visible",
                task.completed ? "opacity-60" : "hover:scale-[1.01]"
            )}
            gradientColor={isOverdue ? "#EF4444" : "#22C55E"}
            gradientOpacity={0.2}
        >
            <div className="relative flex items-center gap-4 p-4 w-full h-full z-10">
                <button
                    onClick={onToggle}
                    aria-label={task.completed ? `Mark task "${task.title}" as incomplete` : `Mark task "${task.title}" as complete`}
                    className={clsx(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                        task.completed
                            ? "bg-green-500 border-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.6)]"
                            : "border-white/20 hover:border-green-500 hover:shadow-[0_0_10px_rgba(34,197,94,0.4)] bg-transparent"
                    )}
                >
                    {task.completed && <Check size={14} strokeWidth={4} />}
                </button>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className={clsx(
                            "font-mono font-medium truncate",
                            task.completed ? "line-through text-muted-foreground" : "text-foreground",
                            isOverdue && !task.completed && "text-red-400"
                        )}>
                            {task.title}
                        </h3>
                        {isOverdue && !task.completed && (
                            <span className="text-[10px] bg-red-500/10 border border-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-mono uppercase shadow-[0_0_10px_rgba(239,68,68,0.2)]">
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
                            <span className="truncate max-w-[200px] opacity-70">{task.description}</span>
                        )}
                    </div>
                </div>

                {/* Sanctuary Mode Button */}
                {!task.completed && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleEnterSanctuary}
                        className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-purple-400 hover:bg-purple-500/10 transition-all"
                        title="Enter Sanctuary"
                        aria-label={`Enter Sanctuary for task: "${task.title}"`}
                    >
                        <Moon size={16} />
                    </Button>
                )}

                {/* Delete Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onDelete}
                    className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    aria-label={`Delete task: "${task.title}"`}
                >
                    <Trash2 size={16} />
                </Button>
            </div>

            {/* Premium Effect: Border Beam for high priority or active items */}
            {isHighPriority && !task.completed && (
                <BorderBeam
                    size={300}
                    duration={8}
                    colorFrom="#FF0000"
                    colorTo="#990000"
                    className="opacity-50"
                />
            )}

            {/* Subtle beam for normal active tasks */}
            {!task.completed && !isHighPriority && (
                <BorderBeam
                    size={200}
                    duration={12}
                    colorFrom="#22c55e"
                    colorTo="#000000"
                    className="opacity-20"
                />
            )}
        </MagicCard>
    );
});
