import { NeonGradientCard } from '@/shared/ui/premium/NeonGradientCard';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { clsx } from 'clsx';
import { NumberTicker } from '@/shared/ui/premium/NumberTicker';
import type { FinanceSummary } from '@/shared/types';

interface FinanceSummaryCardsProps {
    summary: FinanceSummary | undefined;
}

export function FinanceSummaryCards({ summary }: FinanceSummaryCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <NeonGradientCard
                className="items-center justify-center text-center"
                neonColors={{ firstColor: '#22c55e', secondColor: '#4ade80' }}
            >
                <div className="flex flex-col items-start gap-4 h-full justify-between relative z-10 w-full">
                    <div className="flex items-center gap-3 w-full">
                        <div className="p-2 bg-green-500/20 rounded-lg text-green-500 ring-1 ring-green-500/50">
                            <TrendingUp size={20} />
                        </div>
                        <span className="font-mono text-xs text-gray-400 font-bold tracking-widest uppercase">RECEITAS</span>
                    </div>
                    <div className="text-4xl font-bold font-mono text-white tracking-tighter">
                        <span className="text-green-500 text-2xl mr-1">R$</span>
                        <NumberTicker value={summary?.income || 0} />
                    </div>
                </div>
            </NeonGradientCard>

            <NeonGradientCard
                className="items-center justify-center text-center"
                neonColors={{ firstColor: '#ef4444', secondColor: '#f87171' }}
            >
                <div className="flex flex-col items-start gap-4 h-full justify-between relative z-10 w-full">
                    <div className="flex items-center gap-3 w-full">
                        <div className="p-2 bg-red-500/20 rounded-lg text-red-500 ring-1 ring-red-500/50">
                            <TrendingDown size={20} />
                        </div>
                        <span className="font-mono text-xs text-gray-400 font-bold tracking-widest uppercase">DESPESAS</span>
                    </div>
                    <div className="text-4xl font-bold font-mono text-white tracking-tighter">
                        <span className="text-red-500 text-2xl mr-1">R$</span>
                        <NumberTicker value={summary?.expenses || 0} />
                    </div>
                </div>
            </NeonGradientCard>

            <NeonGradientCard
                className="items-center justify-center text-center"
                neonColors={{ firstColor: '#3b82f6', secondColor: '#60a5fa' }}
            >
                <div className="flex flex-col items-start gap-4 h-full justify-between relative z-10 w-full">
                    <div className="flex items-center gap-3 w-full">
                        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-500 ring-1 ring-blue-500/50">
                            <DollarSign size={20} />
                        </div>
                        <span className="font-mono text-xs text-gray-400 font-bold tracking-widest uppercase">SALDO ATUAL</span>
                    </div>
                    <div className={clsx(
                        "text-4xl font-bold font-mono tracking-tighter",
                        (summary?.balance || 0) >= 0 ? "text-blue-400" : "text-red-400"
                    )}>
                        <span className="text-2xl mr-1">R$</span>
                        <NumberTicker value={summary?.balance || 0} />
                    </div>
                </div>
            </NeonGradientCard>
        </div>
    );
}
