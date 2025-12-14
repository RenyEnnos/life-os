import { MoreHorizontal, ListTodo, CheckCircle2 } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { cn } from '@/shared/lib/cn';

const mockTasks = [
    { id: 1, title: 'Review PR #42 for Deep Glass', time: '10:00', priority: 'high', completed: false },
    { id: 2, title: 'University Physics Exam', time: '14:00', priority: 'medium', completed: false },
    { id: 3, title: 'Meditate & Journal', time: '20:00', priority: 'low', completed: true },
    { id: 4, title: 'Weekly Planning', time: '21:00', priority: 'low', completed: false },
];

export const Zone2_Today = ({ className }: { className?: string }) => {
    return (
        <BentoCard
            title="TODAY'S MISSION"
            icon={<ListTodo size={16} className="text-zinc-500" />}
            action={<button className="text-zinc-600 hover:text-white transition-colors"><MoreHorizontal size={16} /></button>}
            className={cn("col-span-1 h-full min-h-[200px]", className)}
            noPadding
        >
            <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
                {mockTasks.map((task, i) => (
                    <div
                        key={task.id}
                        className={cn(
                            "group flex items-start gap-4 p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer",
                            task.completed && "opacity-50"
                        )}
                    >
                        {/* Checkbox / Status */}
                        <div className={cn(
                            "mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors",
                            task.completed
                                ? "bg-primary border-primary text-black"
                                : "border-zinc-700 group-hover:border-zinc-500 bg-transparent"
                        )}>
                            {task.completed && <CheckCircle2 size={14} />}
                        </div>

                        <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                            <span className={cn(
                                "text-sm font-medium truncate transition-colors",
                                task.completed ? "text-zinc-500 line-through" : "text-zinc-200 group-hover:text-white"
                            )}>
                                {task.title}
                            </span>
                            <div className="flex items-center gap-2 text-xs text-zinc-600">
                                <span className={cn(
                                    "w-1.5 h-1.5 rounded-full",
                                    task.priority === 'high' ? "bg-red-500" : task.priority === 'medium' ? "bg-yellow-500" : "bg-blue-500"
                                )} />
                                <span className="font-mono">{task.time}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </BentoCard>
    );
};
