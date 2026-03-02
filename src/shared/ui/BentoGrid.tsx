import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/shared/lib/cn';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';

interface BentoGridProps {
    className?: string;
    children: ReactNode;
}

export const BentoGrid = ({ className, children }: BentoGridProps) => {
    const reducedMotion = useReducedMotion();

    return (
        <motion.div
            initial={reducedMotion ? false : "hidden"}
            animate="show"
            variants={
                reducedMotion
                    ? undefined
                    : {
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: { staggerChildren: 0.1 }
                        }
                    }
            }
            className={cn(
                "group/bento grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[1920px] mx-auto auto-rows-[160px] md:auto-rows-[180px]",
                className
            )}
        >
            {children}
        </motion.div>
    );
};
