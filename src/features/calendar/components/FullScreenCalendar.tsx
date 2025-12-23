"use client"

import * as React from "react"
import {
    add,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    isSameMonth,
    isToday,
    parse,
    startOfToday,
    startOfWeek
} from "date-fns"
import { ptBR } from "date-fns/locale"
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    PlusCircleIcon,
    Calendar as CalendarIcon,
    Clock,
    MoreVertical
} from "lucide-react"

import { cn } from "@/shared/lib/cn"
import { Button } from "@/shared/ui/Button"

export interface Event {
    id: string | number
    name: string
    time: string
    datetime: string
    color?: string
}

export interface CalendarData {
    day: Date
    events: Event[]
}

interface FullScreenCalendarProps {
    data: CalendarData[]
    onAddEvent?: () => void
    onEventClick?: (event: Event) => void
}

export function FullScreenCalendar({ data, onAddEvent, onEventClick }: FullScreenCalendarProps) {
    const today = startOfToday()
    const [selectedDay, setSelectedDay] = React.useState(today)
    const [currentMonth, setCurrentMonth] = React.useState(format(today, "MMM-yyyy"))
    const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date())

    // Filter Data
    const filteredData = data;

    // Calendar Days Logic
    const days = React.useMemo(() => {
        const start = startOfWeek(firstDayCurrentMonth, { weekStartsOn: 0 }); // Sunday start
        const end = endOfWeek(endOfMonth(firstDayCurrentMonth), { weekStartsOn: 0 });
        const intervalDays = eachDayOfInterval({ start, end });

        // Ensure grid has enough rows (standard 6 rows = 42 days)
        if (intervalDays.length < 42) {
            const lastDay = intervalDays[intervalDays.length - 1];
            const remaining = 42 - intervalDays.length;
            for (let i = 1; i <= remaining; i++) {
                intervalDays.push(add(lastDay, { days: i }));
            }
        }
        return intervalDays;
    }, [firstDayCurrentMonth]);

    // Format helpers
    const formatDay = (day: Date) => format(day, "d");
    const formatMonthYear = (day: Date) => format(day, "MMMM yyyy", { locale: ptBR });

    // Navigation
    const previousMonth = () => setCurrentMonth(format(add(firstDayCurrentMonth, { months: -1 }), "MMM-yyyy"));
    const nextMonth = () => setCurrentMonth(format(add(firstDayCurrentMonth, { months: 1 }), "MMM-yyyy"));
    const goToToday = () => {
        const t = startOfToday();
        setCurrentMonth(format(t, "MMM-yyyy"));
        setSelectedDay(t);
    };

    // Get events for selected day
    const selectedDayEvents = React.useMemo(() => {
        return filteredData
            .filter(d => isSameDay(d.day, selectedDay))
            .flatMap(d => d.events)
            .sort((a, b) => a.time.localeCompare(b.time));
    }, [filteredData, selectedDay]);

    return (
        <div className="flex flex-col lg:flex-row h-full gap-6 p-1">
            {/* LEFT PANEL: MONTH GRID */}
            <div className="flex-1 flex flex-col glass-panel rounded-3xl overflow-hidden shadow-2xl animate-enter">
                {/* Header */}
                <div className="flexitems-center justify-between p-6 border-b border-white/5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                                <CalendarIcon size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight capitalize">
                                    {formatMonthYear(firstDayCurrentMonth)}
                                </h2>
                                <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest">
                                    Calendar Overview
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex items-center bg-black/20 rounded-lg border border-white/5 p-1 mr-2">
                                <Button onClick={previousMonth} variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 text-zinc-400">
                                    <ChevronLeftIcon size={18} />
                                </Button>
                                <Button onClick={goToToday} variant="ghost" className="h-8 px-3 text-xs font-mono text-zinc-300 hover:text-white hover:bg-white/10">
                                    HOJE
                                </Button>
                                <Button onClick={nextMonth} variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 text-zinc-400">
                                    <ChevronRightIcon size={18} />
                                </Button>
                            </div>
                            <Button onClick={onAddEvent} className="bg-primary hover:bg-primary/90 text-white rounded-lg px-4 h-10 shadow-[0_0_15px_rgba(48,140,232,0.3)]">
                                <PlusCircleIcon size={18} className="mr-2" />
                                Novo
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Grid Header */}
                <div className="grid grid-cols-7 border-b border-white/5 bg-black/20">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                        <div key={day} className="py-3 text-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-7 grid-rows-6 min-h-[600px] h-full">
                        {days.map((day) => {
                            const isSelected = isSameDay(day, selectedDay);
                            const isCurrentMonth = isSameMonth(day, firstDayCurrentMonth);
                            const dayEvents = filteredData.filter(d => isSameDay(d.day, day)).flatMap(d => d.events);
                            const isTodayDate = isToday(day);

                            return (
                                <div
                                    key={day.toString()}
                                    onClick={() => setSelectedDay(day)}
                                    className={cn(
                                        "relative border-b border-r border-white/[0.03] p-2 transition-all duration-200 cursor-pointer group hover:bg-white/[0.02]",
                                        !isCurrentMonth && "bg-black/40 opacity-50 contrast-75",
                                        isSelected && "bg-primary/5 shadow-[inset_0_0_20px_rgba(48,140,232,0.05)]"
                                    )}
                                >
                                    <div className="flex justify-between items-start">
                                        <span className={cn(
                                            "w-7 h-7 flex items-center justify-center rounded-lg text-sm font-medium transition-colors",
                                            isTodayDate ? "bg-primary text-white shadow-lg shadow-primary/30" :
                                                isSelected ? "text-primary bg-primary/10" : "text-zinc-400 group-hover:text-zinc-200"
                                        )}>
                                            {formatDay(day)}
                                        </span>
                                        {dayEvents.length > 0 && (
                                            <span className="flex h-5 items-center justify-center rounded-full bg-white/5 px-1.5 text-[10px] font-medium text-zinc-400 ring-1 ring-inset ring-white/10">
                                                {dayEvents.length}
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-2 space-y-1">
                                        {dayEvents.slice(0, 3).map(event => (
                                            <div
                                                key={event.id}
                                                className={cn(
                                                    "w-full truncate rounded px-1.5 py-0.5 text-[10px] font-medium border-l-2 opacity-80 group-hover:opacity-100 transition-opacity",
                                                    event.color === 'green' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500" :
                                                        event.color === 'red' ? "bg-rose-500/10 text-rose-400 border-rose-500" :
                                                            "bg-blue-500/10 text-blue-400 border-blue-500"
                                                )}
                                            >
                                                {event.name}
                                            </div>
                                        ))}
                                        {dayEvents.length > 3 && (
                                            <div className="text-[9px] text-zinc-600 pl-1 font-mono">
                                                + {dayEvents.length - 3} mais...
                                            </div>
                                        )}
                                    </div>

                                    {isSelected && (
                                        <div className="absolute inset-0 border-2 border-primary/30 pointer-events-none" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: DAILY AGENDA */}
            <div className="w-full lg:w-[320px] xl:w-[380px] shrink-0 glass-panel rounded-3xl flex flex-col animate-enter [animation-delay:100ms] overflow-hidden">
                <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-bold text-white">Agenda</h3>
                        <span className="text-xs font-mono text-zinc-500 bg-black/40 px-2 py-1 rounded">
                            {format(selectedDay, "yyyy-MM-dd")}
                        </span>
                    </div>
                    <p className="text-sm text-zinc-400 capitalize">
                        {format(selectedDay, "EEEE", { locale: ptBR })}
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {selectedDayEvents.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-4 min-h-[200px]">
                            <Clock size={48} className="opacity-20" />
                            <p className="text-sm font-medium">Nenhum evento para este dia</p>
                            <Button variant="outline" onClick={onAddEvent} className="text-xs h-8">
                                Adicionar Evento
                            </Button>
                        </div>
                    ) : (
                        selectedDayEvents.map((event) => (
                            <div
                                key={event.id}
                                onClick={(e) => { e.stopPropagation(); onEventClick?.(event); }}
                                className="group relative flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer overflow-hidden"
                            >
                                <div className={cn(
                                    "absolute left-0 top-0 bottom-0 w-1 transition-colors",
                                    event.color === 'green' ? "bg-emerald-500" :
                                        event.color === 'red' ? "bg-rose-500" :
                                            "bg-blue-500"
                                )} />

                                <div className="flex flex-col gap-1 w-full">
                                    <div className="flex items-start justify-between">
                                        <h4 className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors line-clamp-2">
                                            {event.name}
                                        </h4>
                                        <button className="text-zinc-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreVertical size={14} />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                                        <Clock size={12} />
                                        <span className="font-mono">{event.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Quick Add at Bottom of Sidebar */}
                <div className="p-4 border-t border-white/5 bg-black/20">
                    <Button
                        onClick={onAddEvent}
                        variant="ghost"
                        className="w-full justify-start text-zinc-400 hover:text-white hover:bg-white/5"
                    >
                        <PlusCircleIcon size={16} className="mr-2" />
                        Adicionar tarefa rápida
                    </Button>
                </div>
            </div>
        </div>
    )
}
