import { useMemo, useState } from 'react';
import { useHabits } from '@/features/habits/hooks/useHabits';
import type { HabitLog } from '@/features/habits/types';
import { calculateStreak } from './logic/streak';
import { cn } from '@/shared/lib/cn';
import { CreateHabitDialog } from './components/CreateHabitDialog';
import { Confetti } from '@/shared/ui/premium/Confetti';

export default function HabitsPage() {
    const { habits, logs, createHabit, logHabit } = useHabits();
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const todayKey = new Date().toISOString().split('T')[0];
    const list = habits || [];

    const recentDays = useMemo(() => {
        const days: { label: string; completed: number; active: boolean }[] = [];
        const today = new Date();
        const maxWindow = 14;
        for (let i = maxWindow - 1; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const key = d.toISOString().split('T')[0];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const completed = logs?.filter((l: any) => l.value > 0 && (l.date || '').startsWith(key)).length || 0;
            days.push({ label: String(d.getDate()).padStart(2, '0'), completed, active: i === 0 });
        }
        const max = Math.max(...days.map((d) => d.completed), 1);
        return days.map((d) => ({ ...d, height: Math.max(10, (d.completed / max) * 100) }));
    }, [logs]);

    const handleToggle = (habitId: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const isCompleted = logs?.some((log: any) => log.habit_id === habitId && (log.date || '').startsWith(todayKey) && log.value > 0);
        if (!isCompleted) {
            const currentStreak = calculateStreak(logs as unknown as HabitLog[], habitId);
            const nextStreak = currentStreak + 1;
            if (nextStreak > 0 && nextStreak % 7 === 0) {
                Confetti({ particleCount: 120, spread: 60, origin: { x: 0.5, y: 0.7 } });
            }
        }
        if (!logHabit.isPending) {
            logHabit.mutate({ id: habitId, value: isCompleted ? 0 : 1, date: todayKey });
        }
    };

    return (
        <div className="relative h-full w-full overflow-hidden">
            <div className="fixed top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none z-0" />
            <div className="fixed bottom-[-10%] right-[0%] w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none z-0" />

            <div className="relative flex h-full w-full overflow-hidden z-10">
                {/* Sidebar removed to use AppLayout's global navigation */}
                
                <main className="flex-1 h-full overflow-y-auto relative p-4 lg:p-10 flex flex-col gap-8 custom-scrollbar">
                    <header className="w-full max-w-6xl mx-auto flex flex-col gap-2 animate-enter">
                        <div className="flex items-end justify-between px-2">
                            <div>
                                <h2 className="text-[10px] text-zinc-500 font-medium tracking-widest uppercase mb-1">Consistency & Progress</h2>
                                <h1 className="text-3xl font-light text-white tracking-tight">Habits & Rituals</h1>
                            </div>
                            <div className="hidden md:block text-right">
                                <span className="text-xs text-zinc-600 font-medium tracking-wide">{new Date().toLocaleDateString(undefined, { weekday: 'long', day: '2-digit', month: 'short' }).toUpperCase()}</span>
                            </div>
                        </div>
                    </header>

                    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 animate-enter animate-enter-delay-1">
                        <div className="lg:col-span-3 glass-card rounded-3xl bg-glass-surface backdrop-blur-xl border border-white/5 p-6 flex flex-col justify-between h-48 lg:h-56 overflow-hidden relative">
                            <div className="flex justify-between items-start z-10">
                                <div className="flex flex-col">
                                    <h3 className="text-lg font-light text-white tracking-tight">Momentum</h3>
                                    <p className="text-zinc-500 text-xs mt-1">Last 14 days activity</p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="flex items-center gap-1.5 text-[10px] text-zinc-400 uppercase tracking-wider bg-white/5 px-2 py-1 rounded-md border border-white/5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Active
                                    </span>
                                    <span className="flex items-center gap-1.5 text-[10px] text-zinc-400 uppercase tracking-wider bg-white/5 px-2 py-1 rounded-md border border-white/5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-700"></span> Rest
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2 sm:gap-3 items-end h-full mt-6 pb-2 w-full">
                                {recentDays.map((day, idx) => (
                                    <div key={idx} className={cn("flex-1 flex flex-col gap-2 items-center group", day.active && "text-white")}>                   
                                        <div
                                            className={cn(
                                                "w-full rounded transition-colors border",
                                                day.completed > 0 ? "bg-primary shadow-[0_0_15px_rgba(48,140,232,0.3)] border-primary/20" : "bg-zinc-800/50 hover:bg-zinc-700/50 border-white/5"
                                            )}
                                            style={{ height: `${day.height}%` }}
                                        ></div>
                                        <span className={cn("text-[9px] font-medium uppercase", day.active ? "text-white" : "text-zinc-600")}>{day.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:col-span-1 glass-card rounded-3xl bg-glass-surface backdrop-blur-xl border border-white/5 p-6 h-48 lg:h-56 flex flex-col items-center justify-center relative overflow-hidden">
                            <div className="absolute top-4 left-4 text-xs text-zinc-500 uppercase tracking-widest font-semibold">Today</div>
                            <div className="relative w-32 h-32 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
                                    <circle cx="64" cy="64" fill="transparent" r="56" stroke="rgba(255,255,255,0.05)" strokeWidth="8"></circle>
                                    <circle className="progress-ring-circle drop-shadow-[0_0_8px_rgba(48,140,232,0.5)]" cx="64" cy="64" fill="transparent" r="56" stroke="#308ce8" strokeDasharray="351.86" strokeDashoffset="52.78" strokeLinecap="round" strokeWidth="8"></circle>
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-3xl font-light text-white tracking-tighter">85<span className="text-sm text-zinc-500">%</span></span>
                                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">Done</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20 animate-enter animate-enter-delay-2">
                        {list.length === 0 && (
                            <div className="lg:col-span-3 h-32 rounded-2xl border border-dashed border-white/10 bg-transparent flex items-center justify-center text-zinc-500 text-sm">
                                Nenhum hábito cadastrado. Adicione um novo para começar.
                            </div>
                        )}
                        {list.slice(0, 5).map((habit) => {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const isCompleted = logs?.some((log: any) => log.habit_id === habit.id && (log.date || '').startsWith(todayKey) && log.value > 0);
                            const streak = calculateStreak(logs as unknown as HabitLog[], habit.id) || habit.streak || 0;
                            const label = habit.title || habit.name || 'Habit';
                            return (
                                <div
                                    key={habit.id}
                                    className={cn(
                                        "h-32 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 cursor-pointer group relative overflow-hidden active:scale-[0.98]",
                                        isCompleted ? "border border-primary/30 bg-primary/10" : "border border-white/5 bg-zinc-900/20 hover:bg-zinc-800/30 hover:border-white/10"
                                    )}
                                    onClick={() => handleToggle(habit.id)}
                                >
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 blur-[60px] rounded-full pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex items-start justify-between z-10">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("p-2 rounded-lg border", isCompleted ? "bg-primary/20 text-primary border-primary/20" : "bg-zinc-800 border-white/5 text-zinc-500 group-hover:text-zinc-300") }>
                                                <span className="material-symbols-outlined text-[20px]">{iconForHabit(label)}</span>
                                            </div>
                                            <h3 className={cn("font-normal tracking-tight", isCompleted ? "text-white" : "text-zinc-400 group-hover:text-zinc-200")}>{label}</h3>
                                        </div>
                                        <span className={cn("material-symbols-outlined text-[20px]", isCompleted ? "text-primary drop-shadow-[0_0_8px_rgba(48,140,232,0.8)]" : "text-zinc-700 group-hover:text-zinc-600")}>{isCompleted ? 'check_circle' : 'radio_button_unchecked'}</span>
                                    </div>
                                    <div className={cn("z-10 flex items-center gap-2", isCompleted ? "text-white" : "text-zinc-500 opacity-80 group-hover:opacity-100") }>
                                        <span className="text-xs font-medium">🔥 {streak} days</span>
                                        <span className={cn("text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded border", isCompleted ? "text-primary/80 border-primary/30 bg-primary/10" : "text-zinc-600 border-zinc-700/50 bg-zinc-800/50")}>Daily</span>
                                    </div>
                                </div>
                            );
                        })}

                        <div className={cn("h-32 rounded-2xl border border-dashed bg-transparent flex flex-col items-center justify-center gap-3 transition-all duration-300 cursor-pointer group active:scale-[0.98]",
                            createHabit.isPending ? "border-white/10 text-zinc-500 cursor-not-allowed" : "border-zinc-800 text-zinc-600 hover:border-zinc-600 hover:text-zinc-400 hover:bg-white/[0.02]"
                        )} onClick={() => { if (!createHabit.isPending) setIsCreateOpen(true) }}>
                            <div className="w-10 h-10 rounded-full border border-zinc-700/50 flex items-center justify-center group-hover:border-zinc-500 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">{createHabit.isPending ? 'hourglass_top' : 'add'}</span>
                            </div>
                            <span className="text-xs font-medium tracking-wide uppercase">New Habit</span>
                        </div>
                    </div>
                </main>
            </div>

            <CreateHabitDialog
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSubmit={createHabit.mutate}
            />
        </div>
    );
}

function iconForHabit(title: string) {
    const lower = title.toLowerCase();
    if (lower.includes('medit')) return 'self_improvement';
    if (lower.includes('workout') || lower.includes('gym') || lower.includes('run')) return 'fitness_center';
    if (lower.includes('water') || lower.includes('hydrate')) return 'water_drop';
    if (lower.includes('read')) return 'menu_book';
    if (lower.includes('code') || lower.includes('deep work')) return 'code_blocks';
    return 'check_circle';
}
