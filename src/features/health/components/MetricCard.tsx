import { BentoCard } from '@/shared/ui/BentoCard';
import { NumberTicker } from '@/shared/ui/premium/NumberTicker';
import { LucideIcon } from 'lucide-react';

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

    // Extract LucideIcon if it's passed as a ReactNode, otherwise we might need a wrapper or adjustment.
    // BentoCard expects an Icon component (LucideIcon), not a node.
    // However, existing usage passes <Scale />, <Activity /> etc (Elements).
    // So we might need to adjust BentoCard usage or MetricCard usage.

    // Strategy: Since BentoCard takes `icon: LucideIcon`, but here we receive `icon: React.ReactNode`, 
    // we can either:
    // 1. Change MetricCard to accept LucideIcon type instead of ReactNode.
    // 2. Or, if BentoCard strictly requires a component, we might have a mismatch.

    // Let's check BentoCard definition again via memory or view_file if unsure.
    // I recall BentoCard takes `icon: LucideIcon`.

    // Existing MetricCard usage in index.tsx: icon={<Scale ... />}
    // This implies refactoring index.tsx to pass the Icon component itself, not the element.

    // I will rewrite this file to accept `icon: LucideIcon` and update index.tsx subsequently.
    // But wait, allow me to check BentoCard definition to be 100% sure.

    return (
        <BentoCard
            title={title}
            icon={icon as any} // Temporary cast until we fix the prop type in usage
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
