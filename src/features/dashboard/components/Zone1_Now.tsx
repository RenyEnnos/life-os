import { Play, Pause, FastForward, Activity } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { Button } from '@/shared/ui/Button';
import { cn } from '@/shared/lib/cn';

export const Zone1_Now = ({ className }: { className?: string }) => {
    // Mock data - conectar com useSanctuaryStore posteriormente
    const isFocusing = false;

    return (
        <BentoCard
            title="Current Focus"
            icon={<Activity size={16} className="text-emerald-500" />}
            className={cn("col-span-1 md:col-span-2 relative overflow-hidden", className)}
        >
            <div className="flex flex-col h-full justify-between gap-4">
                <div>
                    <h2 className="text-3xl md:text-4xl font-semibold text-zinc-100 tracking-tight leading-tight">
                        Refactor Dashboard UI
                    </h2>
                    <p className="text-zinc-500 text-sm mt-1">Life OS / Frontend Engineering</p>
                </div>

                <div className="flex items-end justify-between">
                    <div className="font-mono text-4xl md:text-5xl tracking-tighter tabular-nums text-zinc-100 opacity-90">
                        00:24:12
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 hover:bg-white/10">
                            <FastForward size={18} />
                        </Button>
                        <Button
                            className="rounded-full px-6 bg-zinc-100 text-zinc-900 hover:bg-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        >
                            {isFocusing ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
                        </Button>
                    </div>
                </div>
            </div>
        </BentoCard>
    );
};
