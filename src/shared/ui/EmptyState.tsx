import { LucideIcon } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel: string;
    onAction: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
    return (
        <Card className="flex flex-col items-center justify-center p-8 text-center bg-zinc-900/20 border-dashed border-zinc-800">
            <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-zinc-500" />
            </div>
            <h3 className="text-lg font-bold text-zinc-300 mb-2 font-mono">{title}</h3>
            <p className="text-sm text-zinc-500 mb-6 max-w-xs">{description}</p>
            <Button onClick={onAction} variant="outline" className="font-mono text-xs">
                {actionLabel}
            </Button>
        </Card>
    );
}
