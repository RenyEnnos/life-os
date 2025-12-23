import { BentoCard } from '@/shared/ui/BentoCard';
import { NumberTicker } from '@/shared/ui/premium/NumberTicker';

interface MetricCardProps {
    title: string;
    value: number | string;
    unit: string;
    icon: React.ReactNode;
    date?: string;
    className?: string;
}

export function MetricCard({ title, value, unit, icon, date, className }: MetricCardProps) {
    const isNumber = typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)) && value !== '');
    const numericValue = isNumber ? Number(value) : 0;

    return (
        <BentoCard
            title={title}
            icon={icon}
            className={className}
        >
            <div className="flex flex-col justify-end h-full pb-2">
                <div className="text-3xl font-bold font-mono text-white flex items-baseline gap-1 tracking-tighter">
                    {isNumber ? (
                        <NumberTicker value={numericValue} />
                    ) : (
                        value
                    )}
                    <span className="text-sm text-zinc-500 font-normal ml-1">{unit}</span>
                </div>
                {date && (
                    <div className="text-[10px] text-zinc-600 font-mono mt-1">
                        {new Date(date).toLocaleDateString('pt-BR')}
                    </div>
                )}
            </div>
        </BentoCard>
    );
}
