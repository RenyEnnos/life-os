import { Play, Pause, FastForward, Activity } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { Button } from '@/shared/ui/Button';
import { cn } from '@/shared/lib/cn';

export const Zone1_Now = ({ className }: { className?: string }) => {
    const isFocusing = false; // Mock

    return (
        <BentoCard
            title="Focus"
            icon={<Activity size={16} className="text-primary" />}
            className={cn("col-span-1 md:col-span-2 relative overflow-hidden h-full min-h-[180px] bg-glass-surface/50", className)}
        >
            <div className="flex flex-col h-full justify-between gap-6 relative z-10 w-full">
                <div className="space-y-1">
                    <h2 className="text-2xl md:text-3xl font-light text-white tracking-tight leading-tight">
                        Deep Glass Refactor
                    </h2>
                    <p className="text-primary/80 text-xs font-semibold tracking-widest uppercase">
                        Current Mission
                    </p>
                </div>

                <div className="flex items-end justify-between mt-auto w-full">
                    <div>
                        <div className="font-display font-light text-5xl md:text-6xl tracking-tighter tabular-nums text-white">
                            00:24<span className="text-white/30 text-4xl">:12</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-500 hover:text-white hover:bg-white/5 rounded-full">
                            <FastForward size={20} />
                        </Button>
                        <Button
                            variant="primary"
                            size="icon"
                            className="h-14 w-14 rounded-full bg-primary text-black hover:bg-primary/90 shadow-[0_0_20px_rgba(48,140,232,0.4)] flex items-center justify-center transition-transform active:scale-95"
                        >
                            {isFocusing ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Background Decoration */}
            <div
                className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-20"
                style={{ background: 'radial-gradient(circle, rgba(48, 140, 232, 0.4) 0%, transparent 70%)' }}
            />
        </BentoCard>
    );
};
