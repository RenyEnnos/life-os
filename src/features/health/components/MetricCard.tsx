import { NeonGradientCard } from '@/shared/ui/premium/NeonGradientCard';
import { NumberTicker } from '@/shared/ui/premium/NumberTicker';

interface MetricCardProps {
    title: string;
    value: number | string;
    unit: string;
    icon: React.ReactNode;
    date?: string;
}

export function MetricCard({ title, value, unit, icon, date }: MetricCardProps) {
    const isNumber = typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)) && value !== '');
    const numericValue = isNumber ? Number(value) : 0;

    return (
        <div className="h-full">
            <NeonGradientCard borderRadius={16} borderSize={2} className="h-full">
                <div className="flex flex-col justify-between h-full p-4 w-full">
                    <div className="flex justify-between items-start mb-2">
                        <span className="font-mono text-xs text-muted-foreground font-bold tracking-wider">{title}</span>
                        {icon}
                    </div>
                    <div>
                        <div className="text-2xl font-bold font-mono text-foreground flex items-baseline gap-1">
                            {isNumber ? (
                                <NumberTicker value={numericValue} />
                            ) : (
                                value
                            )}
                            <span className="text-sm text-muted-foreground font-normal">{unit}</span>
                        </div>
                        {date && (
                            <div className="text-[10px] text-muted-foreground font-mono mt-1">
                                {new Date(date).toLocaleDateString('pt-BR')}
                            </div>
                        )}
                    </div>
                </div>
            </NeonGradientCard>
        </div>
    );
}
