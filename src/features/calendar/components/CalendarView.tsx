import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import type { Task } from '@/shared/types';

interface CalendarViewProps {
    tasks: Task[];
    currentDate: Date;
    onDateChange: (date: Date) => void;
    onToggleTask: (task: Task) => void;
}

export function CalendarView({ tasks, currentDate, onDateChange, onToggleTask }: CalendarViewProps) {
    const { days, monthName, year } = useMemo(() => {
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const startPadding = firstDay.getDay(); // 0 = Sunday
        const daysInMonth = lastDay.getDate();

        const days: (number | null)[] = [];

        // Padding for days before the first of the month
        for (let i = 0; i < startPadding; i++) {
            days.push(null);
        }

        // Actual days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }

        const monthName = currentDate.toLocaleDateString('pt-BR', { month: 'long' });
        const year = currentDate.getFullYear();

        return { days, monthName, year };
    }, [currentDate]);

    const tasksByDay = useMemo(() => {
        const map: Record<number, Task[]> = {};
        tasks?.forEach(task => {
            if (task.due_date) {
                const dueDate = new Date(task.due_date);
                if (dueDate.getMonth() === currentDate.getMonth() &&
                    dueDate.getFullYear() === currentDate.getFullYear()) {
                    const day = dueDate.getDate();
                    if (!map[day]) map[day] = [];
                    map[day].push(task);
                }
            }
        });
        return map;
    }, [tasks, currentDate]);

    const goToPrevMonth = () => {
        onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const today = new Date();
    const isToday = (day: number) =>
        day === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear();

    return (
        <div className="bg-surface/50 border border-border rounded-xl p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={goToPrevMonth}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                    <ChevronLeft size={20} />
                </button>
                <h3 className="font-mono font-bold text-lg capitalize">
                    {monthName} {year}
                </h3>
                <button
                    onClick={goToNextMonth}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Week days header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                    <div key={day} className="text-center text-xs text-muted-foreground font-mono py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
                {days.map((day, idx) => (
                    <div
                        key={idx}
                        className={clsx(
                            "min-h-[80px] p-1 rounded-lg border transition-colors",
                            day ? "border-white/5 hover:border-white/10 bg-black/20" : "border-transparent",
                            day && isToday(day) && "border-primary/50 bg-primary/10"
                        )}
                    >
                        {day && (
                            <>
                                <div className={clsx(
                                    "text-xs font-mono mb-1",
                                    isToday(day) ? "text-primary font-bold" : "text-muted-foreground"
                                )}>
                                    {day}
                                </div>
                                <div className="space-y-0.5">
                                    {tasksByDay[day]?.slice(0, 3).map(task => (
                                        <button
                                            key={task.id}
                                            onClick={() => onToggleTask(task)}
                                            className={clsx(
                                                "w-full text-left text-[10px] px-1 py-0.5 rounded truncate transition-all",
                                                task.completed
                                                    ? "bg-green-500/20 text-green-400 line-through"
                                                    : "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                                            )}
                                            title={task.title}
                                        >
                                            {task.title}
                                        </button>
                                    ))}
                                    {tasksByDay[day]?.length > 3 && (
                                        <div className="text-[10px] text-muted-foreground pl-1">
                                            +{tasksByDay[day].length - 3} mais
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
