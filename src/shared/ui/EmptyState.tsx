import { LucideIcon } from 'lucide-react';
import { Card } from '@/shared/ui/Card';
import { cn } from '@/shared/lib/cn';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: React.ReactNode;
    className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
    return (
        <Card className={cn("flex flex-col items-center justify-center p-8 text-center border border-border bg-surface", className)}>
            <div className="p-4 bg-surface rounded-full mb-4 border border-border">
                <Icon size={32} className="text-mutedForeground" />
            </div>
            <h3 className="text-lg font-sans font-semibold text-foreground mb-2 tracking-tight">
                {title}
            </h3>
            <p className="text-sm font-sans text-mutedForeground max-w-sm mb-6">
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
