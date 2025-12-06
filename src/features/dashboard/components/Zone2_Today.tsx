import { Card } from '@/shared/ui/Card';
import { BentoGrid, BentoItem } from '@/shared/ui/BentoGrid';
import { Activity, ListTodo } from 'lucide-react';
import { NeonChart } from '@/shared/ui/NeonCharts';
import { useHabits } from '@/features/habits/hooks/useHabits';
import { useTasks } from '@/features/tasks/hooks/useTasks';
import { Habit, Task } from '@/shared/types';
import { useNavigate } from 'react-router-dom';

const mockActivityData = [
    { name: 'Mon', value: 4 },
    { name: 'Tue', value: 3 },
    { name: 'Wed', value: 7 },
    { name: 'Thu', value: 5 },
    { name: 'Fri', value: 8 },
    { name: 'Sat', value: 6 },
    { name: 'Sun', value: 9 },
];

export const Zone2_Today = () => {
    const { habits } = useHabits();
    const { tasks } = useTasks();
    const navigate = useNavigate();

    const activeHabits = habits?.filter((h: Habit) => h.active).length || 0;
    const pendingTasks = tasks?.filter((t: Task) => !t.completed).length || 0;

    // Calculate daily completion (mock calculation for now, needs real log data)
    const dailyCompletion = habits?.length ? Math.round((activeHabits / habits.length) * 100) : 0;

    return (
        <div className="col-span-12 lg:col-span-6 space-y-4">
            <h2 className="text-sm font-mono text-gray-500 tracking-widest uppercase">02 // TODAY</h2>

            <BentoGrid className="auto-rows-[180px]">
                {/* Main Focus / Status */}
                <BentoItem colSpan={2} onClick={() => navigate('/habits')} className="cursor-pointer relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity className="w-24 h-24" />
                    </div>
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <h3 className="text-2xl font-bold text-white">System Status: <span className="text-green-400">OPTIMAL</span></h3>
                        <div className="text-4xl font-mono text-primary">{dailyCompletion}%</div>
                        <p className="text-xs text-gray-400">Daily Protocol Completion</p>
                    </div>
                </BentoItem>

                {/* Stats */}
                <BentoItem colSpan={1} onClick={() => navigate('/tasks')} className="cursor-pointer bg-zinc-900/40 group">
                    <div className="flex flex-col items-center justify-center h-full group-hover:bg-zinc-800/50 transition-colors rounded-xl">
                        <ListTodo className="w-8 h-8 text-secondary mb-2" />
                        <span className="text-2xl font-bold text-white">{pendingTasks}</span>
                        <span className="text-xs text-gray-500">Tasks Left</span>
                    </div>
                </BentoItem>

                {/* Chart */}
                <BentoItem colSpan={3}>
                    <NeonChart
                        title="Weekly Momentum"
                        data={mockActivityData}
                        color="#22d3ee"
                        className="h-full"
                    />
                </BentoItem>
            </BentoGrid>
        </div>
    );
};
