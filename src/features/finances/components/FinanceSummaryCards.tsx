import { MagicCard } from '@/shared/ui/premium/MagicCard';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { clsx } from 'clsx';
import { NumberTicker } from '@/shared/ui/premium/NumberTicker';

interface FinanceSummaryCardsProps {
    summary: {
        income: number;
        expenses: number;
        balance: number;
    } | undefined;
}

export function FinanceSummaryCards({ summary }: FinanceSummaryCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MagicCard className="p-6 bg-[#111] overflow-hidden" gradientColor="#22c55e">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-500/10 rounded-full text-green-500">
                            <TrendingUp size={20} />
                        </div>
                        <span className="font-mono text-xs text-gray-500 font-bold tracking-wider">RECEITAS</span>
                    </div>
                    <div className="text-3xl font-bold font-mono text-white">
                        <span className="text-green-500">R$</span> <NumberTicker value={summary?.income || 0} />
                    </div>
                </div>
            </MagicCard>

            <MagicCard className="p-6 bg-[#111] overflow-hidden" gradientColor="#ef4444">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-500/10 rounded-full text-red-500">
                            <TrendingDown size={20} />
                        </div>
                        <span className="font-mono text-xs text-gray-500 font-bold tracking-wider">DESPESAS</span>
                    </div>
                    <div className="text-3xl font-bold font-mono text-white">
                        <span className="text-red-500">R$</span> <NumberTicker value={summary?.expenses || 0} />
                    </div>
                </div>
            </MagicCard>

            <MagicCard className="p-6 bg-[#111] overflow-hidden" gradientColor="#3b82f6">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/10 rounded-full text-blue-500">
                            <DollarSign size={20} />
                        </div>
                        <span className="font-mono text-xs text-gray-500 font-bold tracking-wider">SALDO</span>
                    </div>
                    <div className={clsx(
                        "text-3xl font-bold font-mono",
                        (summary?.balance || 0) >= 0 ? "text-blue-400" : "text-red-400"
                    )}>
                        <span>R$</span> <NumberTicker value={summary?.balance || 0} />
                    </div>
                </div>
            </MagicCard>
        </div>
    );
}
