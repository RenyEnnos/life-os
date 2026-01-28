import { Play, Pause, FastForward, Activity } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { Button } from '@/shared/ui/Button';
import { cn } from '@/shared/lib/cn';
import { useFocusStore } from '@/features/focus/stores/useFocusStore';
import { useEffect } from 'react';

export const Zone1_Now = ({ className }: { className?: string }) => {
    const { isFocusing, toggleFocus } = useFocusStore();

    // Timer Logic driven by component (or global layout)
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isFocusing) {
            interval = setInterval(() => {
                useFocusStore.getState().tick();
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isFocusing]);

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return { h: hours, m: minutes, s: seconds };
    };

    const time = formatTime(useFocusStore().secondsRemaining);

    return (
        <BentoCard
            title="Focus"
            icon={<Activity size={16} className="text-primary" />}
            className={cn("col-span-1 md:col-span-2 relative overflow-hidden h-full min-h-[180px] bg-glass-surface/50 pt-[calc(1.5rem+env(safe-area-inset-top))]", className)}
        >
            <div className="flex flex-col h-full justify-between gap-6 relative z-10 w-full">
                <div className="space-y-1">
                    <h2 className="text-2xl md:text-3xl font-light text-white tracking-tight leading-tight">
                        {isFocusing ? "Deep Focusing..." : "Ready to Focus?"}
                    </h2>
                    <p className="text-primary/80 text-xs font-semibold tracking-widest uppercase">
                        {isFocusing ? "Current Mission" : "Start Session"}
                    </p>
                </div>

                <div className="flex items-end justify-between mt-auto w-full">
                    <div>
                        <div className="font-display font-light text-5xl md:text-6xl tracking-tighter tabular-nums text-white">
                            {String(time.h).padStart(2, '0')}:{String(time.m).padStart(2, '0')}
                            <span className="text-white/30 text-4xl">:{String(time.s).padStart(2, '0')}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-500 hover:text-white hover:bg-white/5 rounded-full" aria-label="Avançar">
                            <FastForward size={20} />
                        </Button>
                        <Button
                            variant="primary"
                            size="icon"
                            onClick={toggleFocus}
                            className={cn(
                                "h-14 w-14 rounded-full shadow-[0_0_20px_rgba(48,140,232,0.4)] flex items-center justify-center transition-all active:scale-95",
                                isFocusing ? "bg-red-500 hover:bg-red-600 text-white" : "bg-primary text-black hover:bg-primary/90"
                            )}
                            aria-label={isFocusing ? "Pausar foco" : "Iniciar foco"}
                        >
                            {isFocusing ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Background Decoration - Dynamic based on state */}
            <div
                className={cn(
                    "absolute -right-20 -bottom-20 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-20 transition-all duration-1000",
                    isFocusing ? "bg-red-500/40 opacity-30" : "opacity-20",
                )}
                style={!isFocusing ? { background: 'radial-gradient(circle, rgba(48, 140, 232, 0.4) 0%, transparent 70%)' } : undefined}
            />
        </BentoCard>
    );
};
