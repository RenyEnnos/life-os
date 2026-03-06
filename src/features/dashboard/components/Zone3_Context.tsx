import { CloudRain, TrendingUp, Cloud, CloudSun, Sun, CloudLightning, CloudSnow, AlertCircle, Bitcoin } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { useSynapseContext } from '../hooks/useSynapseContext';
import { cn } from '@/shared/lib/cn';

export const Zone3_Context = () => {
    const { context, isLoading, error } = useSynapseContext();
    const { weather, market } = context || {};

    const formatPrice = (price?: number) => {
        if (!price) return '---';
        if (price >= 1000) return `$${(price / 1000).toFixed(1)}k`;
        return `$${price.toFixed(0)}`;
    };

    const formatPercent = (percent?: number) => {
        if (percent === undefined) return '';
        const sign = percent >= 0 ? '+' : '';
        return `${sign}${percent.toFixed(1)}%`;
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 gap-4 h-full">
                {[1, 2].map((i) => (
                    <BentoCard key={i} className="col-span-1 !bg-glass-surface/20 animate-pulse">
                        <div className="flex flex-col justify-between h-full gap-2">
                            <div className="flex items-center justify-between opacity-20">
                                <div className="w-4 h-4 bg-white rounded-full" />
                                <div className="w-6 h-2 bg-white rounded" />
                            </div>
                            <div className="space-y-2 opacity-20">
                                <div className="w-12 h-6 bg-white rounded" />
                                <div className="w-16 h-3 bg-white rounded" />
                            </div>
                        </div>
                    </BentoCard>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="grid grid-cols-2 gap-4 h-full opacity-50">
                <BentoCard className="col-span-2 !bg-glass-surface/20 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-zinc-500">
                        <AlertCircle size={20} />
                        <span className="text-[10px] uppercase font-mono">Synapse Offline</span>
                    </div>
                </BentoCard>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-4 h-full">
            {/* Weather Node */}
            <BentoCard className="col-span-1 !bg-glass-surface/30 hover:!bg-glass-surface/50 transition-colors group">
                <div className="flex flex-col justify-between h-full gap-2">
                    <div className="flex items-center justify-between text-zinc-500">
                        <Cloud size={16} />
                        <span className="text-[10px] uppercase tracking-wider font-bold opacity-60">
                            {weather?.location || 'SP'}
                        </span>
                    </div>
                    <div>
                        <div className="text-2xl font-light text-white tabular-nums tracking-tight">
                            {weather?.temp !== undefined ? `${Math.round(weather.temp)}°` : '--°'}
                        </div>
                        <div className="text-[10px] text-zinc-500 font-medium truncate uppercase tracking-tighter">
                            {weather?.summary || 'N/A'}
                        </div>
                    </div>
                </div>
            </BentoCard>

            {/* Market Node (BTC focus) */}
            <BentoCard className="col-span-1 !bg-glass-surface/30 hover:!bg-glass-surface/50 transition-colors group">
                <div className="flex flex-col justify-between h-full gap-2">
                    <div className="flex items-center justify-between text-zinc-500">
                        <Bitcoin size={16} className="group-hover:text-amber-400 transition-colors" />
                        <span className="text-[10px] uppercase tracking-wider font-bold opacity-60">BTC</span>
                    </div>
                    <div>
                        <div className="text-2xl font-light text-white tabular-nums font-mono tracking-tight">
                            {formatPrice(market?.bitcoin?.usd)}
                        </div>
                        <div className={cn(
                            "text-[10px] font-medium flex items-center gap-1 uppercase tracking-tighter",
                            (market?.bitcoin?.usd_24h_change || 0) >= 0 ? "text-emerald-400" : "text-rose-400"
                        )}>
                            <TrendingUp size={10} className={cn((market?.bitcoin?.usd_24h_change || 0) < 0 && "rotate-180")} />
                            {formatPercent(market?.bitcoin?.usd_24h_change)}
                        </div>
                    </div>
                </div>
            </BentoCard>
        </div>
    );
};
