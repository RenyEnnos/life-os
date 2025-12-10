import { Play, Pause, FastForward, Activity } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { Button } from '@/shared/ui/Button';
import { cn } from '@/shared/lib/cn';

export const Zone1_Now = ({ className }: { className?: string }) => {
    // Mock state - será conectado ao store global posteriormente
    const isFocusing = false;

    return (
        <BentoCard
            title="Current Focus"
            icon={<Activity size={16} className="text-emerald-500" />}
            className={cn("col-span-1 md:col-span-2 relative overflow-hidden h-full min-h-[180px]", className)}
        >
            <div className="flex flex-col h-full justify-between gap-4 relative z-10">
                <div>
                    <h2 className="text-2xl md:text-3xl font-semibold text-zinc-100 tracking-tight leading-tight">
                        Refactor Dashboard UI
                    </h2>
                    <p className="text-zinc-500 text-sm mt-1 font-medium tracking-wide">LIFE OS / FRONTEND ENGINEERING</p>
                </div>

                <div className="flex items-end justify-between mt-auto">
                    <div className="font-mono text-4xl md:text-5xl tracking-tighter tabular-nums text-zinc-100 opacity-90">
                        00:24:12
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 text-zinc-400 hover:text-zinc-100 hover:bg-white/10">
                            <FastForward size={20} />
                        </Button>
                        <Button
                            className="rounded-full w-12 h-12 bg-zinc-100 text-zinc-950 hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center justify-center"
                        >
                            {isFocusing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
        </BentoCard>
    );
};
