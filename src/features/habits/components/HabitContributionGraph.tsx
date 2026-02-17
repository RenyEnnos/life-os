import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
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

const WEEK_WIDTH = 16; // 12px (w-3) + 4px (gap-1)
const BUFFER_WEEKS = 8; // Render buffer weeks on each side

export const HabitContributionGraph = ({ logs, className }: HabitContributionGraphProps) => {
    const [visibleRange, setVisibleRange] = useState({ start: 0, end: 53 });
    const scrollContainerRef = useRef<HTMLDivElement>(null);

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

    // Calculate visible weeks based on scroll position
    const updateVisibleRange = useCallback(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const scrollLeft = container.scrollLeft;
        const containerWidth = container.clientWidth;

        const startWeek = Math.max(0, Math.floor(scrollLeft / WEEK_WIDTH) - BUFFER_WEEKS);
        const endWeek = Math.min(
            weeks.length,
            Math.ceil((scrollLeft + containerWidth) / WEEK_WIDTH) + BUFFER_WEEKS
        );

        setVisibleRange({ start: startWeek, end: endWeek });
    }, [weeks.length]);

    // Setup scroll listener
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        // Initial calculation
        updateVisibleRange();

        // Use requestAnimationFrame for smooth updates
        let rafId: number;
        const handleScroll = () => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(updateVisibleRange);
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', updateVisibleRange);

        return () => {
            container.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', updateVisibleRange);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [updateVisibleRange]);

    // Get visible weeks with buffer
    const visibleWeeks = useMemo(() => {
        return weeks.slice(visibleRange.start, visibleRange.end);
    }, [weeks, visibleRange]);

    return (
        <BentoCard
            title="Consistência Anual"
            icon={Activity}
            className={cn("col-span-1 md:col-span-2 lg:col-span-4", className)}
        >
            <div className="flex flex-col gap-2 h-full justify-center">
                <div
                    ref={scrollContainerRef}
                    className="flex items-end gap-1 overflow-x-auto pb-2 hide-scrollbar"
                >
                    {/* Left spacer for virtual scrolling */}
                    <div style={{ width: `${visibleRange.start * WEEK_WIDTH}px`, flexShrink: 0 }} />

                    {/* Visible weeks */}
                    {visibleWeeks.map((week, wIdx) => (
                        <div
                            key={visibleRange.start + wIdx}
                            className="flex flex-col gap-1"
                            style={{ width: `${WEEK_WIDTH}px`, flexShrink: 0 }}
                        >
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

                    {/* Right spacer for virtual scrolling */}
                    <div
                        style={{
                            width: `${(weeks.length - visibleRange.end) * WEEK_WIDTH}px`,
                            flexShrink: 0
                        }}
                    />
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
