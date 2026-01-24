import React from 'react';
import { cn } from '@/shared/lib/cn';
import { motion } from 'framer-motion';

interface WidgetShellProps {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    action?: React.ReactNode;
}

export function WidgetShell({ title, subtitle, icon, children, className, action }: WidgetShellProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
                "relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md shadow-lg flex flex-col",
                className
            )}
        >
            {/* Header */}
            <div className="flex items-start justify-between p-4 md:p-6 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    {icon && (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/5 text-zinc-300">
                            {icon}
                        </div>
                    )}
                    <div>
                        <h3 className="text-lg font-medium text-white tracking-tight leading-none">{title}</h3>
                        {subtitle && (
                            <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider font-medium">{subtitle}</p>
                        )}
                    </div>
                </div>
                {action && (
                    <div className="ml-4">
                        {action}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 p-5">
                {children}
            </div>
        </motion.div>
    );
}
