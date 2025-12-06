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
                <h1 className="text-3xl font-semibold tracking-tight text-foreground font-sans">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-mutedForeground mt-1 font-sans text-sm">
                        {subtitle}
                    </p>
                )}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}
