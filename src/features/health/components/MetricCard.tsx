import { Card } from '@/components/ui/Card';

interface MetricCardProps {
    title: string;
    value: number | string;
    unit: string;
    icon: React.ReactNode;
    date?: string;
}

export function MetricCard({ title, value, unit, icon, date }: MetricCardProps) {
    return (
        <Card className="p-4 border-border bg-card flex flex-col justify-between hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-xs text-muted-foreground font-bold tracking-wider">{title}</span>
                {icon}
            </div>
            <div>
                <div className="text-2xl font-bold font-mono text-foreground">
                    {value} <span className="text-sm text-muted-foreground font-normal">{unit}</span>
                </div>
                {date && (
                    <div className="text-[10px] text-muted-foreground font-mono mt-1">
                        {new Date(date).toLocaleDateString('pt-BR')}
                    </div>
                )}
            </div>
        </Card>
    );
}
