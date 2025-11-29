import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface PageTitleProps extends HTMLAttributes<HTMLDivElement> {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
}

export function PageTitle({ title, subtitle, action, className, ...props }: PageTitleProps) {
    return (
        <div className={cn("flex items-center justify-between mb-6", className)} {...props}>
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary font-mono uppercase glow-text">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-gray-400 mt-1 font-mono text-sm">
                        {subtitle}
                    </p>
                )}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}
