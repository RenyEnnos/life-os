import { Card } from '@/components/ui/Card';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { clsx } from 'clsx';

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
            <Card className="p-6 border-border bg-card">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-500/10 rounded-full text-green-500">
                        <TrendingUp size={20} />
                    </div>
                    <span className="font-mono text-sm text-muted-foreground font-bold tracking-wider">RECEITAS</span>
                </div>
                <div className="text-2xl font-bold font-mono text-foreground">
                    R$ {summary?.income?.toFixed(2) || '0.00'}
                </div>
            </Card>

            <Card className="p-6 border-border bg-card">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-red-500/10 rounded-full text-red-500">
                        <TrendingDown size={20} />
                    </div>
                    <span className="font-mono text-sm text-muted-foreground font-bold tracking-wider">DESPESAS</span>
                </div>
                <div className="text-2xl font-bold font-mono text-foreground">
                    R$ {summary?.expenses?.toFixed(2) || '0.00'}
                </div>
            </Card>

            <Card className="p-6 border-border bg-card">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                        <DollarSign size={20} />
                    </div>
                    <span className="font-mono text-sm text-muted-foreground font-bold tracking-wider">SALDO</span>
                </div>
                <div className={clsx(
                    "text-2xl font-bold font-mono",
                    (summary?.balance || 0) >= 0 ? "text-primary" : "text-destructive"
                )}>
                    R$ {summary?.balance?.toFixed(2) || '0.00'}
                </div>
            </Card>
        </div>
    );
}
