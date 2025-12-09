import React from 'react';
import { cn } from '@/shared/lib/cn';

interface AnimatedToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
}

export function AnimatedToggle({ checked, onChange, className, label, ...props }: AnimatedToggleProps) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={cn(
                "group relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                checked ? "bg-primary" : "bg-muted",
                className
            )}
            {...props}
        >
            <span className="sr-only">{label || 'Toggle'}</span>
            <span
                className={cn(
                    "pointer-events-none block h-6 w-6 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out",
                    checked ? "translate-x-5" : "translate-x-0"
                )}
            />
        </button>
    );
}
