import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { Meteors } from './premium/Meteors';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    /** Custom action element (takes precedence over actionLabel/onAction) */
    action?: ReactNode;
    /** Label for default button action */
    actionLabel?: string;
    /** Callback for default button action */
    onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, action, actionLabel, onAction }: EmptyStateProps) {
    return (
        <Card className="relative flex flex-col items-center justify-center p-8 text-center bg-zinc-900/20 border-dashed border-zinc-800 overflow-hidden">
            <Meteors number={20} />
            <div className="relative z-10 w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-zinc-500" />
            </div>
            <h3 className="relative z-10 text-lg font-bold text-zinc-300 mb-2 font-mono">{title}</h3>
            <p className="relative z-10 text-sm text-zinc-500 mb-6 max-w-xs">{description}</p>
            <div className="relative z-10">
                {action ? action : (
                    actionLabel && onAction && (
                        <Button onClick={onAction} variant="outline" className="font-mono text-xs">
                            {actionLabel}
                        </Button>
                    )
                )}
            </div>
        </Card>
    );
}

