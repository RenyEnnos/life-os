import { CloudRain, TrendingUp } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';

export const Zone3_Context = () => {
    return (
        <div className="grid grid-cols-2 gap-4 h-full">
            {/* Weather Node */}
            <BentoCard className="col-span-1 !bg-glass-surface/30 hover:!bg-glass-surface/50 transition-colors group">
                <div className="flex flex-col justify-between h-full gap-2">
                    <div className="flex items-center justify-between text-zinc-500">
                        <CloudRain size={16} />
                        <span className="text-[10px] uppercase tracking-wider font-bold opacity-60">SP</span>
                    </div>
                    <div>
                        <div className="text-2xl font-light text-white tabular-nums tracking-tight">18°</div>
                        <div className="text-xs text-zinc-500 font-medium">Rain</div>
                    </div>
                </div>
            </BentoCard>

            {/* Finance Node */}
            <BentoCard className="col-span-1 !bg-glass-surface/30 hover:!bg-glass-surface/50 transition-colors group">
                <div className="flex flex-col justify-between h-full gap-2">
                    <div className="flex items-center justify-between text-zinc-500">
                        <TrendingUp size={16} />
                        <span className="text-[10px] uppercase tracking-wider font-bold opacity-60">MKT</span>
                    </div>
                    <div>
                        <div className="text-2xl font-light text-white tabular-nums font-mono tracking-tight">$94k</div>
                        <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                            +2.4%
                        </div>
                    </div>
                </div>
            </BentoCard>
        </div>
    );
};
