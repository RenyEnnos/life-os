import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

import { BentoCard } from '@/shared/ui/BentoCard';
import { NeonGradientCard } from '@/shared/ui/premium/NeonGradientCard';

import { useTasks } from '@/features/tasks/hooks/useTasks';
import { filterTasksByDynamicNow } from '@/shared/lib/dynamicNow/filters';

export const UrgentCard = () => {
    const navigate = useNavigate();
    const { tasks } = useTasks();

    // Apply "Dynamic Now" logic
    const { visibleTasks } = filterTasksByDynamicNow(tasks || []);
    const topTask = visibleTasks.length > 0 ? visibleTasks[0] : null;

    // Fallback if no tasks
    if (!topTask) {
        return (
            <BentoCard className="col-span-1 md:col-span-2 row-span-2 p-0" noPadding>
                <NeonGradientCard className="items-center justify-center text-center h-full border-none">
                    <div className="flex flex-col justify-between h-full p-4 w-full">
                        <div className="flex justify-between items-start mb-2 z-10 w-full">
                            <span className="text-xs font-bold bg-green-500/20 text-green-500 px-2 py-1 rounded">FREE</span>
                            <span className="text-xs text-gray-500 font-mono">NOW</span>
                        </div>
                        <div className="flex flex-col items-center justify-center flex-grow z-10">
                            <h3 className="text-xl font-bold text-white leading-tight mb-2">No Urgent Tasks</h3>
                            <p className="text-sm text-gray-400 mb-4 text-center">Enjoy your free time or capture a new idea.</p>
                        </div>
                        <Button
                            className="w-full text-xs mt-auto z-10 bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700"
                            size="sm"
                            onClick={() => navigate('/tasks')}
                        >
                            VIEW ALL TASKS
                        </Button>
                    </div>
                </NeonGradientCard>
            </BentoCard>
        );
    }

    return (
        <BentoCard className="col-span-1 md:col-span-2 row-span-2 p-0" noPadding>
            <NeonGradientCard className="items-center justify-center text-center h-full border-none">
                <div className="flex flex-col justify-between h-full p-4 w-full">
                    <div className="flex justify-between items-start mb-2 z-10 w-full">
                        <span className="text-xs font-bold bg-red-500/20 text-red-500 px-2 py-1 rounded">URGENT</span>
                        <span className="text-xs text-gray-500 font-mono">NOW</span>
                    </div>
                    <div className="flex flex-col items-center justify-center flex-grow z-10">
                        <h3 className="text-xl font-bold text-white leading-tight mb-2 line-clamp-2">{topTask.title}</h3>
                        {topTask.project_id && <p className="text-sm text-gray-400 mb-4 text-center">Project Task</p>}
                    </div>
                    <Button
                        className="w-full text-xs mt-auto z-10 bg-red-600 hover:bg-red-700 text-white border-none"
                        size="sm"
                        onClick={() => navigate('/tasks')} // Ideally go to specific task focus mode
                    >
                        START FOCUS
                    </Button>
                </div>
            </NeonGradientCard>
        </BentoCard>
    );
};

export const QuickActionsCard = () => {
    const navigate = useNavigate();

    return (
        <BentoCard
            className="col-span-1"
            title="Quick Actions"
        >
            <div className="grid grid-cols-2 gap-2 h-full">
                <Button
                    variant="outline"
                    size="sm"
                    className="h-full flex flex-col gap-2 bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800 hover:text-white"
                    onClick={() => navigate('/journal')}
                >
                    <span>📝</span>
                    <span className="text-xs">Note</span>
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-full flex flex-col gap-2 bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800 hover:text-white"
                    onClick={() => navigate('/tasks')}
                >
                    <span>⚡</span>
                    <span className="text-xs">Task</span>
                </Button>
            </div>
        </BentoCard>
    );
};

