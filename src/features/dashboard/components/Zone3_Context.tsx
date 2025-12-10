import { CloudRain, TrendingUp, Cpu } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';

export const Zone3_Context = () => {
    return (
        <div className="grid grid-cols-2 gap-4 h-full">
            {/* Weather Node */}
            <BentoCard className="col-span-1 !bg-blue-900/10 !border-blue-500/10">
                <div className="flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between text-blue-400">
                        <CloudRain size={18} />
                        <span className="text-xs uppercase tracking-wider opacity-70">S. Paulo</span>
                    </div>
                    <div>
                        <div className="text-2xl font-semibold text-blue-100 tabular-nums">18°</div>
                        <div className="text-xs text-blue-300/60">Rainy</div>
                    </div>
                </div>
            </BentoCard>

            {/* Finance Node */}
            <BentoCard className="col-span-1 !bg-emerald-900/10 !border-emerald-500/10">
                <div className="flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between text-emerald-400">
                        <TrendingUp size={18} />
                        <span className="text-xs uppercase tracking-wider opacity-70">BTC</span>
                    </div>
                    <div>
                        <div className="text-2xl font-semibold text-emerald-100 tabular-nums font-mono">$94k</div>
                        <div className="text-xs text-emerald-300/60">+2.4%</div>
                    </div>
                </div>
            </BentoCard>

            {/* System/Health Node (Opcional, expandindo a grid se necessário) */}
        </div>
    );
};
