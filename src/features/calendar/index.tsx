import { useEffect, useMemo, useState } from 'react';
import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    isSameMonth,
    startOfMonth,
    startOfWeek
} from 'date-fns';
import { NavLink } from 'react-router-dom';
import { primaryNav, secondaryNav } from '@/app/layout/navItems';
import { useTasks } from '@/features/tasks/hooks/useTasks';
import { apiFetch } from '@/shared/api/http';
import { Loader } from '@/shared/ui/Loader';
import { cn } from '@/shared/lib/cn';

type AgendaEvent = {
    id: string;
    title: string;
    datetime?: string | null;
    location?: string;
    tag?: string;
    icon?: string;
    color?: string;
    source: 'task' | 'google';
};

const profileAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuCVPqcPWDT3hPr01e2HDirC5oJIReGS_I9VQWtVcd9Jeg7-ZvWFgDQfCv6EutPiYTzuE-re3TH5gEjialXzk5Eb8SJ3m82eLKwBuKSLDpWKr4JkJ_yftg1ioQEeRmNNBPiKJhA7IAj11REAjyt_eN6G3ka3T_PoSQNNU9d7cQ6Af9A6u-pdRHLfzCaPzGvoxAzXj6ge63w7ZFJhPW4J6cxpsTQe-UV2JJuJ124QPZ8DgIYXHP4uJji-EBFIe1WQsTDEKAGbz-RlcuI";

const materialIconByPath: Record<string, string> = {
    '/': 'grid_view',
    '/tasks': 'check_circle',
    '/calendar': 'calendar_month',
    '/habits': 'timer',
    '/health': 'monitor_heart',
    '/finances': 'show_chart',
    '/projects': 'folder_open',
    '/journal': 'menu_book',
    '/rewards': 'emoji_events',
    '/university': 'school',
    '/settings': 'settings',
};

export default function CalendarPage() {
    const { tasks, isLoading: tasksLoading } = useTasks();
    const [googleEvents, setGoogleEvents] = useState<AgendaEvent[]>([]);
    const [loadingEvents, setLoadingEvents] = useState(false);
    const [viewDate, setViewDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        const fetchEvents = async () => {
            setLoadingEvents(true);
            try {
                const events = await apiFetch<any[]>('/api/calendar/events');
                const mapped: AgendaEvent[] = (events || []).map((evt) => {
                    const datetime = evt?.start?.dateTime || evt?.start?.date || null;
                    return {
                        id: evt.id || `${evt.summary}-${datetime}`,
                        title: evt.summary || 'Evento',
                        datetime,
                        location: evt?.location,
                        icon: evt?.conferenceData ? 'videocam' : 'event',
                        tag: 'Google',
                        color: 'purple',
                        source: 'google',
                    };
                });
                setGoogleEvents(mapped);
            } catch (error) {
                setGoogleEvents([]);
            } finally {
                setLoadingEvents(false);
            }
        };
        fetchEvents();
    }, []);

    const taskEvents: AgendaEvent[] = useMemo(() => {
        if (!tasks) return [];
        return tasks
            .filter((t) => t.due_date)
            .map((t) => ({
                id: t.id,
                title: t.title,
                datetime: t.due_date,
                tag: t.tags?.[0] || 'Task',
                color: t.completed ? 'green' : 'blue',
                icon: t.completed ? 'check_circle' : 'radio_button_unchecked',
                source: 'task' as const,
            }));
    }, [tasks]);

    const allEvents = useMemo(() => [...taskEvents, ...googleEvents], [taskEvents, googleEvents]);

    const monthDays = useMemo(() => {
        const start = startOfWeek(startOfMonth(viewDate), { weekStartsOn: 0 });
        const end = endOfWeek(endOfMonth(viewDate), { weekStartsOn: 0 });
        return eachDayOfInterval({ start, end });
    }, [viewDate]);

    const eventsByDay = useMemo(() => {
        const map = new Map<string, AgendaEvent[]>();
        allEvents.forEach((evt) => {
            if (!evt.datetime) return;
            const dayKey = format(new Date(evt.datetime), 'yyyy-MM-dd');
            const list = map.get(dayKey) || [];
            map.set(dayKey, [...list, evt]);
        });
        return map;
    }, [allEvents]);

    const scheduleForSelected = useMemo(() => {
        const key = format(selectedDate, 'yyyy-MM-dd');
        const events = eventsByDay.get(key) || [];
        return events
            .map((evt) => ({
                ...evt,
                time: evt.datetime ? format(new Date(evt.datetime), 'HH:mm') : '',
            }))
            .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    }, [eventsByDay, selectedDate]);

    const isLoading = tasksLoading || loadingEvents;

    const dotColor = (evt: AgendaEvent) => {
        if (evt.color === 'purple') return 'bg-purple-500';
        if (evt.color === 'green') return 'bg-green-500';
        if (evt.color === 'blue') return 'bg-blue-500';
        if (evt.color === 'red') return 'bg-red-500';
        return 'bg-primary';
    };

    return (
        <div className="dashboard-shell relative h-screen w-full overflow-hidden">
            <div className="fixed top-[-100px] left-[20%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none z-0" />
            <div className="fixed bottom-[-100px] right-[10%] w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none z-0" />

            <div className="relative flex h-full w-full overflow-hidden z-10">
                {/* Sidebar Navigation removed - using global AppLayout Sidebar */}
                <main className="flex-1 h-full overflow-hidden p-4 lg:p-10 relative flex flex-col w-full max-w-7xl mx-auto custom-scrollbar">
                    {isLoading ? (
                        <div className="flex flex-1 items-center justify-center">
                            <Loader text="CARREGANDO AGENDA..." />
                        </div>
                    ) : (
                        <>
                            <header className="flex justify-between items-end mb-8 pl-2 shrink-0">
                                <div>
                                    <h2 className="text-zinc-500 text-xs font-medium tracking-widest uppercase mb-1">Productivity</h2>
                                    <h1 className="text-4xl lg:text-5xl font-light text-white tracking-tight">Calendar</h1>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        className="px-5 py-2.5 rounded-lg border border-white/10 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                                        onClick={() => {
                                            const today = new Date();
                                            setViewDate(today);
                                            setSelectedDate(today);
                                        }}
                                    >
                                        Today
                                    </button>
                                    <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/40 border border-white/5 text-zinc-300 text-sm backdrop-blur-md">
                                        <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(48,140,232,0.6)]" />
                                        Sync Active
                                    </div>
                                </div>
                            </header>

                            <div className="flex flex-col lg:flex-row gap-8 h-full min-h-0">
                                {/* Month grid */}
                                <div className="flex-grow-[3] flex flex-col glass-card bg-zinc-900/40 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] rounded-3xl p-8 lg:p-10 min-h-0">
                                    <div className="flex items-center justify-between mb-10">
                                        <div className="flex items-baseline gap-4">
                                            <h2 className="text-3xl font-light text-white tracking-tight">{format(viewDate, 'LLLL')}</h2>
                                            <span className="text-3xl font-thin text-zinc-600">{format(viewDate, 'yyyy')}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                className="w-11 h-11 rounded-full flex items-center justify-center border border-white/5 text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
                                                onClick={() => setViewDate(addMonths(viewDate, -1))}
                                            >
                                                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                                            </button>
                                            <button
                                                className="w-11 h-11 rounded-full flex items-center justify-center border border-white/5 text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
                                                onClick={() => setViewDate(addMonths(viewDate, 1))}
                                            >
                                                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-7 mb-5">
                                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                                            <div key={d} className="text-center text-[11px] uppercase text-zinc-500 tracking-widest font-semibold">{d}</div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-7 grid-rows-6 gap-3 flex-1 min-h-0">
                                        {monthDays.map((day) => {
                                            const key = format(day, 'yyyy-MM-dd');
                                            const dayEvents = eventsByDay.get(key) || [];
                                            const isSelected = isSameDay(day, selectedDate);
                                            const isToday = isSameDay(day, new Date());
                                            return (
                                                <button
                                                    key={key}
                                                    type="button"
                                                    onClick={() => setSelectedDate(day)}
                                                    className={cn(
                                                        "day-cell rounded-2xl px-3 py-3 min-h-[72px] flex flex-col items-center justify-start cursor-pointer border border-transparent",
                                                        isSameMonth(day, viewDate) ? "text-zinc-300" : "text-zinc-600 opacity-60",
                                                        "hover:bg-white/5 hover:text-white",
                                                        isSelected && "bg-white/10 text-white border-white/10 shadow-lg scale-[1.01]",
                                                        isToday && !isSelected && "border-white/5"
                                                    )}
                                                >
                                                    <span className={cn("text-base font-semibold", isSelected && "font-bold")}>{format(day, 'd')}</span>
                                                    {dayEvents.length > 0 && (
                                                        <div className="flex gap-1 mt-auto mb-1">
                                                            {dayEvents.slice(0, 3).map((evt) => (
                                                                <div key={evt.id} className={cn("w-1 h-1 rounded-full", dotColor(evt))} />
                                                            ))}
                                                            {dayEvents.length > 3 && (
                                                                <div className="w-1 h-1 rounded-full bg-zinc-400" />
                                                            )}
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Agenda timeline */}
                                <div className="flex-grow-[2] min-w-[360px] glass-card bg-zinc-900/40 backdrop-blur-xl border border-white/10 shadow-lg rounded-3xl flex flex-col min-h-0 overflow-hidden">
                                    <div className="p-7 pb-4 border-b border-white/5 shrink-0">
                                        <h3 className="text-xl font-medium text-white tracking-tight">Schedule for {format(selectedDate, 'MMM dd')}</h3>
                                        <span className="text-[11px] text-zinc-500 uppercase tracking-widest mt-1 block">
                                            {format(selectedDate, 'EEEE')} • {scheduleForSelected.length} {scheduleForSelected.length === 1 ? 'Event' : 'Events'}
                                        </span>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-7 pt-3 custom-scrollbar relative">
                                        {scheduleForSelected.length === 0 && (
                                            <div className="h-full border border-dashed border-white/5 rounded-lg flex items-center justify-center text-sm text-zinc-500">
                                                No events
                                            </div>
                                        )}
                                        {scheduleForSelected.map((evt) => (
                                            <div key={evt.id} className="flex gap-4 min-h-[100px]">
                                                <div className="w-10 text-right shrink-0 pt-3">
                                                    <span className="text-xs font-mono text-zinc-500">{evt.time || '--:--'}</span>
                                                </div>
                                                <div className="flex-1 pb-4 pl-4 relative border-l border-white/5">
                                                    <div className={cn(
                                                        "event-card p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 shadow-lg cursor-pointer h-full flex flex-col justify-between",
                                                        evt.source === 'task' ? "border-l-2 border-l-primary" : "border-l-2 border-l-purple-500"
                                                    )}>
                                                        <div>
                                                            <div className="flex justify-between items-start mb-1">
                                                                <h4 className="text-sm font-medium text-white">{evt.title}</h4>
                                                                <span className="material-symbols-outlined text-zinc-500 text-[16px]">
                                                                    {evt.icon || (evt.source === 'task' ? 'check_circle' : 'event')}
                                                                </span>
                                                            </div>
                                                            {evt.location && <p className="text-xs text-zinc-400">{evt.location}</p>}
                                                            {evt.tag && <span className="text-[10px] text-zinc-500 mt-2 block">{evt.tag}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
