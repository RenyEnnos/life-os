import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/cn';
import { motion } from 'framer-motion';

interface BentoGridProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
}

const BentoGrid = forwardRef<HTMLDivElement, BentoGridProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);
BentoGrid.displayName = "BentoGrid";

interface BentoItemProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    colSpan?: number;
}

const BentoItem = forwardRef<HTMLDivElement, BentoItemProps>(
    ({ className, colSpan = 1, children, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                whileHover={{ y: -5 }}
                className={cn(
                    "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col space-y-4 glass-panel",
                    colSpan === 2 ? "md:col-span-2" : "md:col-span-1",
                    colSpan === 3 ? "md:col-span-3" : "",
                    className
                )}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);
BentoItem.displayName = "BentoItem";

export { BentoGrid, BentoItem };
