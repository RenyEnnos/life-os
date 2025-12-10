import { CheckSquare, MoreHorizontal } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { cn } from '@/shared/lib/cn';

const mockTasks = [
    { id: 1, title: 'Review PR #42 for Deep Glass', time: '10:00 AM', tag: 'Dev' },
    { id: 2, title: 'University Physics Exam', time: '2:00 PM', tag: 'Uni' },
    { id: 3, title: 'Meditate', time: '8:00 PM', tag: 'Health' },
];

export const Zone2_Today = ({ className }: { className?: string }) => {
    return (
        <BentoCard
            title="Today's Mission"
            icon={<CheckSquare size={16} />}
            action={<button className="text-zinc-500 hover:text-zinc-300"><MoreHorizontal size={16} /></button>}
            className={cn("col-span-1 h-full min-h-[200px]", className)}
            noPadding
        >
            <div className="flex flex-col">
                {mockTasks.map((task, i) => (
                    <div
                        key={task.id}
                        className={cn(
                            "group flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer",
                            i === mockTasks.length - 1 && "border-0"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded border border-white/20 group-hover:border-emerald-500/50 transition-colors flex items-center justify-center" />
                            <span className="text-sm text-zinc-300 group-hover:text-zinc-100 transition-colors">{task.title}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                            <span className="text-zinc-600 font-mono">{task.time}</span>
                            <span className="px-1.5 py-0.5 rounded bg-white/5 text-zinc-500 border border-white/5 uppercase text-[10px] tracking-wider">
                                {task.tag}
                            </span>
                        </div>
                    </div>
                ))}
                {mockTasks.length === 0 && (
                    <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm italic p-6">
                        No missions remaining.
                    </div>
                )}
            </div>
        </BentoCard>
    );
};
