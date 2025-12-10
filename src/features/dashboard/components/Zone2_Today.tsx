import { CheckSquare, MoreHorizontal, CalendarClock } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { cn } from '@/shared/lib/cn';

const mockTasks = [
    { id: 1, title: 'Review PR #42 for Deep Glass', time: '10:00', tag: 'DEV', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    { id: 2, title: 'University Physics Exam', time: '14:00', tag: 'UNI', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    { id: 3, title: 'Meditate & Journal', time: '20:00', tag: 'ZEN', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
];

export const Zone2_Today = ({ className }: { className?: string }) => {
    return (
        <BentoCard
            title="Today's Mission"
            icon={<CalendarClock size={16} className="text-blue-400" />}
            action={<button className="text-zinc-500 hover:text-zinc-300 transition-colors"><MoreHorizontal size={16} /></button>}
            className={cn("col-span-1 h-full min-h-[200px]", className)}
            noPadding
        >
            <div className="flex flex-col h-full">
                {mockTasks.map((task, i) => (
                    <div
                        key={task.id}
                        className={cn(
                            "group flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer",
                            i === mockTasks.length - 1 && "border-0"
                        )}
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-5 h-5 rounded-[6px] border border-white/20 group-hover:border-blue-500/50 transition-colors flex items-center justify-center shrink-0" />
                            <span className="text-sm text-zinc-300 group-hover:text-zinc-100 transition-colors truncate">{task.title}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs shrink-0 ml-2">
                            <span className="text-zinc-600 font-mono group-hover:text-zinc-500">{task.time}</span>
                            <span className={cn("px-1.5 py-0.5 rounded border uppercase text-[10px] tracking-wider font-medium", task.color)}>
                                {task.tag}
                            </span>
                        </div>
                    </div>
                ))}

                {/* Empty State Fill (opcional, para preencher altura) */}
                {mockTasks.length < 5 && (
                    <div className="flex-1 bg-white/[0.01]" />
                )}
            </div>
        </BentoCard>
    );
};
