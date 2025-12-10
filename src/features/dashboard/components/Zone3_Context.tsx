import { CloudRain, TrendingUp } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';

export const Zone3_Context = () => {
    return (
        <div className="grid grid-cols-2 gap-4 h-full">
            {/* Weather Node - Estilo Atmosférico */}
            <BentoCard className="col-span-1 !bg-blue-950/20 !border-blue-500/10 hover:!border-blue-500/20 transition-colors group">
                <div className="flex flex-col justify-between h-full gap-2">
                    <div className="flex items-center justify-between text-blue-400/80">
                        <CloudRain size={18} />
                        <span className="text-[10px] uppercase tracking-wider font-bold opacity-60">SÃO PAULO</span>
                    </div>
                    <div className="mt-auto">
                        <div className="text-2xl font-semibold text-blue-100 tabular-nums tracking-tight">18°</div>
                        <div className="text-xs text-blue-300/60 font-medium">Light Rain</div>
                    </div>
                </div>
            </BentoCard>

            {/* Finance Node - Estilo Financeiro */}
            <BentoCard className="col-span-1 !bg-emerald-950/20 !border-emerald-500/10 hover:!border-emerald-500/20 transition-colors group">
                <div className="flex flex-col justify-between h-full gap-2">
                    <div className="flex items-center justify-between text-emerald-400/80">
                        <TrendingUp size={18} />
                        <span className="text-[10px] uppercase tracking-wider font-bold opacity-60">MARKETS</span>
                    </div>
                    <div className="mt-auto">
                        <div className="text-2xl font-semibold text-emerald-100 tabular-nums font-mono tracking-tight">$94.2k</div>
                        <div className="text-xs text-emerald-300/60 font-medium flex items-center gap-1">
                            <span className="text-emerald-400">▲</span> 2.4% BTC
                        </div>
                    </div>
                </div>
            </BentoCard>
        </div>
    );
};
