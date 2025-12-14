import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { clsx } from 'clsx';
import { NumberTicker } from '@/shared/ui/premium/NumberTicker';
import type { FinanceSummary } from '@/shared/types';
import { BentoCard } from '@/shared/ui/BentoCard';

interface FinanceSummaryCardsProps {
    summary: FinanceSummary | undefined;
}

export function FinanceSummaryCards({ summary }: FinanceSummaryCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BentoCard
                title="RECEITAS"
                icon={TrendingUp}
                className="h-[140px]"
            >
                <div className="flex flex-col items-center justify-center h-full pb-4">
                    <div className="text-4xl font-bold font-mono text-white tracking-tighter tabular-nums">
                        <span className="text-green-500 text-2xl mr-1">R$</span>
                        <NumberTicker value={summary?.income || 0} />
                    </div>
                </div>
            </BentoCard>

            <BentoCard
                title="DESPESAS"
                icon={TrendingDown}
                className="h-[140px]"
            >
                <div className="flex flex-col items-center justify-center h-full pb-4">
                    <div className="text-4xl font-bold font-mono text-white tracking-tighter tabular-nums">
                        <span className="text-red-500 text-2xl mr-1">R$</span>
                        <NumberTicker value={summary?.expenses || 0} />
                    </div>
                </div>
            </BentoCard>

            <BentoCard
                title="SALDO ATUAL"
                icon={DollarSign}
                className="h-[140px]"
            >
                <div className="flex flex-col items-center justify-center h-full pb-4">
                    <div className={clsx(
                        "text-4xl font-bold font-mono tracking-tighter tabular-nums",
                        (summary?.balance || 0) >= 0 ? "text-blue-400" : "text-red-400"
                    )}>
                        <span className="text-2xl mr-1">R$</span>
                        <NumberTicker value={summary?.balance || 0} />
                    </div>
                </div>
            </BentoCard>
        </div>
    );
}
