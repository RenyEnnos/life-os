import { useMemo } from 'react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { cn } from '@/shared/lib/cn';
import { subDays, eachDayOfInterval, format, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { HabitLog } from '@/features/habits/types';
import { Activity } from 'lucide-react';

interface HabitContributionGraphProps {
    logs: HabitLog[];
    className?: string;
}

export const HabitContributionGraph = ({ logs, className }: HabitContributionGraphProps) => {
    // Generate last 365 days (or appropriate range for the view)
    const days = useMemo(() => {
        const today = new Date();
        const start = subDays(today, 364); // Last year
        return eachDayOfInterval({ start, end: today });
    }, []);

    // Calculate intensity for each day
    // This could be simpler: 1 if any habit done, or count of habits done / total habits.
    // For now assuming binary "did something" or count.
    const getActivityLevel = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayLogs = logs.filter(l => l.date.startsWith(dateStr) && l.value > 0);

        if (dayLogs.length === 0) return 0;
        if (dayLogs.length <= 2) return 1;
        if (dayLogs.length <= 4) return 2;
        if (dayLogs.length <= 6) return 3;
        return 4;
    };

    // Group by weeks for the grid layout
    const weeks = useMemo(() => {
        const weeksArray: Date[][] = [];
        let currentWeek: Date[] = [];

        days.forEach(day => {
            if (getDay(day) === 0 && currentWeek.length > 0) {
                weeksArray.push(currentWeek);
                currentWeek = [];
            }
            currentWeek.push(day);
        });
        if (currentWeek.length > 0) weeksArray.push(currentWeek);
        return weeksArray;
    }, [days]);

    return (
        <BentoCard
            title="Consistência Anual"
            icon={Activity}
            className={cn("col-span-1 md:col-span-2 lg:col-span-4", className)}
        >
            <div className="flex flex-col gap-2 h-full justify-center">
                <div className="flex items-end gap-1 overflow-x-auto pb-2 hide-scrollbar">
                    {weeks.map((week, wIdx) => (
                        <div key={wIdx} className="flex flex-col gap-1">
                            {week.map((day) => {
                                const level = getActivityLevel(day);
                                return (
                                    <div
                                        key={day.toISOString()}
                                        title={`${format(day, "d 'de' MMMM", { locale: ptBR })}: ${level > 0 ? 'Concluído' : 'Sem registro'}`}
                                        className={cn(
                                            "w-3 h-3 rounded-[2px] transition-all hover:scale-125 hover:z-10",
                                            level === 0 ? "bg-white/[0.03]" :
                                                level === 1 ? "bg-primary/30" :
                                                    level === 2 ? "bg-primary/50" :
                                                        level === 3 ? "bg-primary/70" :
                                                            "bg-primary shadow-[0_0_8px_rgba(48,140,232,0.6)]"
                                        )}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-end gap-2 text-[10px] text-zinc-500 font-mono">
                    <span>Menos</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-[2px] bg-white/[0.03]" />
                        <div className="w-3 h-3 rounded-[2px] bg-primary/30" />
                        <div className="w-3 h-3 rounded-[2px] bg-primary/50" />
                        <div className="w-3 h-3 rounded-[2px] bg-primary/70" />
                        <div className="w-3 h-3 rounded-[2px] bg-primary" />
                    </div>
                    <span>Mais</span>
                </div>
            </div>
        </BentoCard>
    );
};
