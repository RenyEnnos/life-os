import React from 'react';
import { BentoGridItem } from '@/shared/ui/premium/BentoGrid';
import { MagicCard } from '@/shared/ui/premium/MagicCard';
import { Activity, ListTodo } from 'lucide-react';
import { NeonChart } from '@/shared/ui/NeonCharts';
import { useHabits } from '@/features/habits/hooks/useHabits';
import { useTasks } from '@/features/tasks/hooks/useTasks';
import { QuickCapture } from '@/features/tasks/components/QuickCapture';
import { Habit, Task } from '@/shared/types';
import { useNavigate } from 'react-router-dom';
import { NumberTicker } from '@/shared/ui/premium/NumberTicker';

const mockActivityData = [
    { name: 'Mon', value: 4 },
    { name: 'Tue', value: 3 },
    { name: 'Wed', value: 7 },
    { name: 'Thu', value: 5 },
    { name: 'Fri', value: 8 },
    { name: 'Sat', value: 6 },
    { name: 'Sun', value: 9 },
];

export const StatusCard = () => {
    const { habits } = useHabits();
    const navigate = useNavigate();
    const activeHabits = habits?.filter((h: Habit) => h.active).length || 0;
    const dailyCompletion = habits?.length ? Math.round((activeHabits / habits.length) * 100) : 0;

    return (
        <BentoGridItem
            className="md:col-span-2 cursor-pointer"
            header={
                <MagicCard onClick={() => navigate('/habits')} className="items-center justify-center p-6 h-full bg-[#111]" gradientColor="#222">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity className="w-24 h-24" />
                    </div>
                    <div className="relative z-10 flex flex-col justify-between h-full w-full">
                        <h3 className="text-2xl font-bold text-white">System Status: <span className="text-green-400">OPTIMAL</span></h3>
                        <div className="text-4xl font-mono text-primary flex items-center">
                            <NumberTicker value={dailyCompletion} suffix="%" />
                        </div>
                        <p className="text-xs text-gray-400">Daily Protocol Completion</p>
                    </div>
                </MagicCard>
            }
        />
    );
};

export const StatsCard = () => {
    const { tasks } = useTasks();
    const navigate = useNavigate();
    const pendingTasks = tasks?.filter((t: Task) => !t.completed).length || 0;

    return (
        <BentoGridItem
            className="md:col-span-1 cursor-pointer"
            header={
                <MagicCard onClick={() => navigate('/tasks')} className="items-center justify-center p-6 h-full bg-[#111]" gradientColor="#222">
                    <div className="flex flex-col items-center justify-center h-full z-10 w-full">
                        <ListTodo className="w-8 h-8 text-secondary mb-2" />
                        <span className="text-2xl font-bold text-white">
                            <NumberTicker value={pendingTasks} />
                        </span>
                        <span className="text-xs text-gray-500">Tasks Left</span>
                    </div>
                </MagicCard>
            }
        />
    );
};

export const ChartCard = () => {
    return (
        <BentoGridItem
            className="md:col-span-3 bg-[#111] border-white/5"
            header={
                <NeonChart
                    title="WEEKLY MOMENTUM"
                    data={mockActivityData}
                    color="#a855f7"
                    className="h-full p-6"
                />
            }
        />
    );
};

export const QuickCaptureCard = () => {
    return (
        <BentoGridItem
            className="md:col-span-3 h-auto"
            header={<QuickCapture />}
        />
    );
}
