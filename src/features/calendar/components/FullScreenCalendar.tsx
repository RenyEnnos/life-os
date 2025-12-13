"use client"

import * as React from "react"
import {
    add,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    getDay,
    isEqual,
    isSameDay,
    isSameMonth,
    isToday,
    parse,
    startOfToday,
    startOfWeek,
} from "date-fns"
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    PlusCircleIcon,
    SearchIcon,
} from "lucide-react"

import { cn } from "@/shared/lib/cn"
import { Button } from "@/shared/ui/Button"
import { Separator } from "@/shared/ui/Separator"
import { useMediaQuery } from "@/shared/hooks/use-media-query"

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

const colStartClasses = [
    "",
    "col-start-2",
    "col-start-3",
    "col-start-4",
    "col-start-5",
    "col-start-6",
    "col-start-7",
]

export function FullScreenCalendar({ data, onAddEvent, onEventClick, onSearch }: FullScreenCalendarProps & { onSearch?: (query: string) => void }) {
    const today = startOfToday()
    const [selectedDay, setSelectedDay] = React.useState(today)
    const [currentMonth, setCurrentMonth] = React.useState(format(today, "MMM-yyyy"))
    const [searchQuery, setSearchQuery] = React.useState("")
    const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date())
    const isDesktop = useMediaQuery("(min-width: 768px)")

    // Update internal search state and notify parent
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearch?.(query);
    }

    // Filter displayed events if local filtering is desired (optional, assuming parent might handle it too)
    // For now, we'll filter visually here or assume data is filtered. Let's filter visually.
    const filteredData = React.useMemo(() => {
        if (!searchQuery) return data;
        const lowerQuery = searchQuery.toLowerCase();
        return data.map(d => ({
            ...d,
            events: d.events.filter(e => e.name.toLowerCase().includes(lowerQuery))
        })).filter(d => d.events.length > 0);
        // Note: This logic only filters what is SHOWN. Calendar days remain.
    }, [data, searchQuery]);


    const days = React.useMemo(() => {
        const start = startOfWeek(firstDayCurrentMonth);
        const end = endOfWeek(endOfMonth(firstDayCurrentMonth));
        const intervalDays = eachDayOfInterval({ start, end });

        if (intervalDays.length < 42) {
            const lastDay = intervalDays[intervalDays.length - 1];
            const remaining = 42 - intervalDays.length;
            for (let i = 1; i <= remaining; i++) {
                intervalDays.push(add(lastDay, { days: i }));
            }
        }
        return intervalDays;
    }, [firstDayCurrentMonth]);

    function previousMonth() {
        const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
        setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"))
    }

    function nextMonth() {
        const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
        setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"))
    }

    function goToToday() {
        setCurrentMonth(format(today, "MMM-yyyy"))
        setSelectedDay(today)
    }

    return (
        <div className="flex flex-1 flex-col h-full bg-[#121212] border border-white/5 rounded-xl overflow-hidden shadow-2xl font-sans">
            {/* Calendar Header */}
            <div className="flex flex-col space-y-4 p-6 md:flex-row md:items-center md:justify-between md:space-y-0 lg:flex-none border-b border-white/5">
                <div className="flex flex-auto items-center gap-6">
                    {/* Date Navigation */}
                    <div className="flex items-center gap-4">
                        <div className="hidden w-16 h-16 flex-col items-center justify-center rounded-2xl bg-white/5 border border-white/5 md:flex shadow-inner">
                            <span className="text-[10px] bg-red-500/80 text-white w-full text-center py-0.5 rounded-t-sm uppercase font-bold tracking-wider">
                                {format(today, "MMM")}
                            </span>
                            <span className="text-2xl font-bold text-zinc-100 -mt-1">{format(today, "d")}</span>
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">
                                {format(firstDayCurrentMonth, "MMMM, yyyy")}
                            </h2>
                            <div className="flex items-center gap-2 mt-1">
                                <Button
                                    onClick={previousMonth}
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white"
                                >
                                    <ChevronLeftIcon size={16} />
                                </Button>
                                <Button
                                    onClick={nextMonth}
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white"
                                >
                                    <ChevronRightIcon size={16} />
                                </Button>
                                <Button
                                    onClick={goToToday}
                                    variant="link"
                                    className="text-xs text-zinc-500 hover:text-blue-400 h-auto p-0 ml-2"
                                >
                                    Voltar para Hoje
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 md:gap-6">
                    {/* Search Input */}
                    <div className="relative group hidden md:block">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar eventos..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="bg-black/20 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 w-64 placeholder:text-zinc-600 transition-all hover:bg-black/40"
                        />
                    </div>

                    <Separator orientation="vertical" className="hidden h-8 md:block bg-white/10" />

                    <Button className="hidden md:flex gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-lg shadow-blue-900/20 transition-transform active:scale-95" onClick={onAddEvent}>
                        <PlusCircleIcon size={18} />
                        <span className="font-medium">Novo Evento</span>
                    </Button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="lg:flex lg:flex-auto lg:flex-col overflow-hidden bg-[#121212]">
                {/* Week Days Header */}
                <div className="grid grid-cols-7 text-center py-4 border-b border-white/5">
                    {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(day => (
                        <div key={day} className="text-zinc-500 text-[11px] font-bold tracking-widest opacity-70">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Days */}
                <div className="flex text-xs leading-6 lg:flex-auto overflow-y-auto">
                    <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 h-full gap-px bg-white/5">
                        {/* Gap-px creates the borders if background is lighter, but here we want darker gaps? 
                           Actually for 'Clean UI' usually huge whitespace. Let's use generic gap-4 logic requested or just grid lines.
                           Refined plan: standard borders but subtle.
                        */}
                        {days.map((day, dayIdx) => (
                            <div
                                key={dayIdx}
                                onClick={() => setSelectedDay(day)}
                                className={cn(
                                    dayIdx === 0 && colStartClasses[getDay(day)],
                                    "relative flex flex-col bg-[#121212] p-2 transition-colors hover:bg-white/[0.02] min-h-[100px]",
                                    !isSameMonth(day, firstDayCurrentMonth) && "opacity-30 bg-black/40"
                                )}
                            >
                                <header className="flex items-center justify-between mb-2">
                                    <button
                                        type="button"
                                        className={cn(
                                            "flex h-8 w-8 items-center justify-center rounded-full text-sm transition-all",
                                            isSameDay(day, today)
                                                ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-500/30 ring-2 ring-blue-600/20"
                                                : "text-zinc-400 hover:bg-white/10",
                                            isEqual(day, selectedDay) && !isSameDay(day, today) && "bg-white/10 text-zinc-100"
                                        )}
                                    >
                                        <time dateTime={format(day, "yyyy-MM-dd")}>
                                            {format(day, "d")}
                                        </time>
                                    </button>
                                </header>

                                <div className="flex-1 space-y-1.5 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
                                    {filteredData // Use filteredData here
                                        .filter((d) => isSameDay(d.day, day))
                                        .flatMap(d => d.events) // Flatten to get events directly
                                        .map((event) => (
                                            <button
                                                key={event.id}
                                                onClick={(e) => { e.stopPropagation(); onEventClick?.(event); }}
                                                className={cn(
                                                    "w-full flex items-center gap-2 rounded px-2 py-1.5 text-xs text-left group transition-all hover:scale-[1.02]",
                                                    event.color === 'green' ? "bg-emerald-500/10 text-emerald-300 border-l-2 border-emerald-500" :
                                                        event.color === 'red' ? "bg-rose-500/10 text-rose-300 border-l-2 border-rose-500" :
                                                            "bg-blue-500/10 text-blue-300 border-l-2 border-blue-500"
                                                )}
                                            >
                                                <span className={cn("w-1.5 h-1.5 rounded-full",
                                                    event.color === 'green' ? "bg-emerald-500" :
                                                        event.color === 'red' ? "bg-rose-500" : "bg-blue-500"
                                                )} />
                                                <span className="font-medium truncate opacity-90 group-hover:opacity-100">{event.name}</span>
                                            </button>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mobile View */}
                    <div className="lg:hidden flex flex-col pb-20">
                        {/* Mobile List View per day could be better but sticking to grid for now as requested */}
                        <div className="grid grid-cols-7 auto-rows-fr gap-px bg-white/5">
                            {days.map((day, dayIdx) => (
                                <button
                                    key={dayIdx}
                                    onClick={() => setSelectedDay(day)}
                                    className={cn(
                                        "min-h-[80px] flex flex-col items-center bg-[#121212] py-2 relative border-b border-white/5",
                                        !isSameMonth(day, firstDayCurrentMonth) && "opacity-30"
                                    )}
                                >
                                    <span className={cn(
                                        "text-xs font-medium mb-1 h-6 w-6 flex items-center justify-center rounded-full",
                                        isSameDay(day, today) ? "bg-blue-600 text-white" : "text-zinc-400",
                                        isEqual(day, selectedDay) && !isSameDay(day, today) && "bg-white/10"
                                    )}>
                                        {format(day, "d")}
                                    </span>

                                    {/* Mobile Dots */}
                                    <div className="flex gap-0.5 mt-auto flex-wrap justify-center max-w-[90%]">
                                        {filteredData
                                            .filter(d => isSameDay(d.day, day))
                                            .flatMap(d => d.events)
                                            .slice(0, 4) // max dots
                                            .map(event => (
                                                <div
                                                    key={event.id}
                                                    className={cn("w-1 h-1 rounded-full",
                                                        event.color === 'green' ? "bg-emerald-500" :
                                                            event.color === 'red' ? "bg-rose-500" : "bg-blue-500"
                                                    )}
                                                />
                                            ))
                                        }
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile FAB */}
            <button
                onClick={onAddEvent}
                className="fixed bottom-6 right-6 md:hidden h-14 w-14 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-900/50 text-white z-50 active:scale-90 transition-transform"
                aria-label="Add Event"
            >
                <PlusCircleIcon size={28} />
            </button>
        </div>
    )
}
