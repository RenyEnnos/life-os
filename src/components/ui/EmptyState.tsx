import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: React.ReactNode;
    className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
    return (
        <Card className={cn("flex flex-col items-center justify-center p-8 text-center border-dashed border-2 bg-transparent", className)}>
            <div className="p-4 bg-surface rounded-full mb-4 border border-border">
                <Icon size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-mono font-bold text-foreground mb-2 uppercase tracking-wider">
                {title}
            </h3>
            <p className="text-sm font-mono text-muted-foreground max-w-sm mb-6">
                {description}
            </p>
            {action && (
                <div className="mt-2">
                    {action}
                </div>
            )}
        </Card>
    );
}
