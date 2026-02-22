import { forwardRef } from 'react';
import { cn } from '@/shared/lib/cn';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';

interface ActivityCardProps extends HTMLMotionProps<'div'> {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: React.ReactNode;
    progress?: number; // 0 to 100
    trend?: 'up' | 'down' | 'neutral';
}

const ActivityCard = forwardRef<HTMLDivElement, ActivityCardProps>(
    ({ className, title, value, subtitle, icon, progress, ...props }, ref) => {
        const reducedMotion = useReducedMotion();

        return (
            <motion.div
                ref={ref}
                whileHover={reducedMotion ? undefined : { scale: 1.02 }}
                className={cn(
                    "glass-panel rounded-xl p-6 flex flex-col justify-between relative overflow-hidden",
                    className
                )}
                {...props}
            >
                <div className="flex justify-between items-start z-10">
                    <div>
                        <p className="text-sm text-gray-400 font-mono uppercase tracking-wider">{title}</p>
                        <h3 className="text-3xl font-bold text-white mt-1 glow-text">{value}</h3>
                        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
                    </div>
                    {icon && <div className="text-primary p-2 bg-primary/10 rounded-full">{icon}</div>}
                </div>

                {progress !== undefined && (
                    <div className="mt-4 z-10">
                        <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                                initial={reducedMotion ? { width: `${progress}%` } : { width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={reducedMotion ? { duration: 0 } : { duration: 1, ease: "easeOut" }}
                                className="h-full bg-primary"
                            />
                        </div>
                    </div>
                )}

                {/* Decorative background glow */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            </motion.div>
        );
    }
);
ActivityCard.displayName = "ActivityCard";

export { ActivityCard };
