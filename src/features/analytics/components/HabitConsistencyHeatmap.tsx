import { useMemo } from 'react';
import { AnalyticsDataPoint } from '../hooks/useAnalyticsData';
import { format, parseISO, subDays } from 'date-fns';
import { cn } from '@/shared/lib/cn';

interface HabitConsistencyHeatmapProps {
    data: AnalyticsDataPoint[];
}

export function HabitConsistencyHeatmap({ data }: HabitConsistencyHeatmapProps) {

    // Create a 7x5 grid representing the last 30-35 days arranged by weeks
    const weeks = useMemo(() => {
        if (!data.length) return [];

        // Sort ascending, but for layout we want chunks of 7 (representing columns)
        const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));

        const columns: AnalyticsDataPoint[][] = [];
        let currentColumn: AnalyticsDataPoint[] = [];

        sorted.forEach((item, i) => {
            currentColumn.push(item);
            if (currentColumn.length === 7 || i === sorted.length - 1) {
                columns.push(currentColumn);
                currentColumn = [];
            }
        });

        return columns;
    }, [data]);

    const getColorClass = (adherence: number | undefined) => {
        if (adherence === undefined || adherence === 0) return 'bg-white/5 border-white/5';
        if (adherence < 30) return 'bg-primary/20 border-primary/20';
        if (adherence < 60) return 'bg-primary/50 border-primary/40 text-black';
        if (adherence < 90) return 'bg-primary/80 border-primary/60 text-black';
        return 'bg-primary border-primary shadow-[0_0_10px_rgba(255,255,255,0.2)] text-black';
    };

    return (
        <div className="w-full h-full min-h-[300px] flex flex-col">
            <div className="mb-4">
                <h3 className="font-bold text-lg">Habit Consistency</h3>
                <p className="text-xs text-white/50">Daily adherence percentage mapped out over the past {data.length} days.</p>
            </div>

            <div className="flex-1 w-full flex items-center justify-center overflow-x-auto custom-scrollbar pb-4 pt-2">
                <div className="flex gap-2">
                    {weeks.map((week, wIdx) => (
                        <div key={`week-${wIdx}`} className="flex flex-col gap-2">
                            {week.map((item, dIdx) => {
                                const perc = item.habitAdherence || 0;
                                const isToday = item.date === format(new Date(), 'yyyy-MM-dd');

                                return (
                                    <div
                                        key={`day-${item.date}`}
                                        className={cn(
                                            "w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg border text-[8px] sm:text-[10px] flex items-center justify-center font-bold tracking-tighter transition-all hover:scale-110",
                                            getColorClass(item.habitAdherence),
                                            isToday && "ring-2 ring-white ring-offset-2 ring-offset-black"
                                        )}
                                        title={`${format(parseISO(item.date), 'MMM dd')}: ${perc}%`}
                                    >
                                        {perc > 0 && perc}
                                    </div>
                                )
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-end gap-2 text-xs text-white/50">
                <span>Less</span>
                <div className="w-3 h-3 rounded-sm bg-white/5" />
                <div className="w-3 h-3 rounded-sm bg-primary/20" />
                <div className="w-3 h-3 rounded-sm bg-primary/50" />
                <div className="w-3 h-3 rounded-sm bg-primary/80" />
                <div className="w-3 h-3 rounded-sm bg-primary" />
                <span className="ml-1">More</span>
            </div>
        </div>
    );
}
