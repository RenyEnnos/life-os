import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/shared/lib/cn';

// --- CONTAINER DO GRID ---
export const BentoGrid = ({ className, children }: { className?: string; children: React.ReactNode }) => {
    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={{
                hidden: { opacity: 0 },
                show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                }
            }}
            className={cn(
                "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-[1600px] mx-auto auto-rows-[180px]",
                className
            )}
        >
            {children}
        </motion.div>
    );
};

// --- O CARD INDIVIDUAL (Spotlight + Hover) ---
interface BentoCardProps {
    children: React.ReactNode;
    className?: string; // Para controlar col-span e row-span (ex: col-span-2)
    title?: string;
    icon?: React.ElementType;
    headerAction?: React.ReactNode;
    noPadding?: boolean;
}

export const BentoCard = ({
    children,
    className,
    title,
    icon: Icon,
    headerAction,
    noPadding = false
}: BentoCardProps) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <motion.div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setOpacity(1)}
            onMouseLeave={() => setOpacity(0)}
            variants={{
                hidden: { y: 20, opacity: 0 },
                show: { y: 0, opacity: 1 }
            }}
            className={cn(
                "relative overflow-hidden rounded-[var(--bento-radius)] border border-border bg-surface",
                "flex flex-col transition-colors duration-300 hover:border-[var(--color-border-hover)] glass-panel",
                className
            )}
        >
            {/* Efeito Spotlight Sutil */}
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-10"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.06), transparent 40%)`,
                }}
            />

            {/* Header Padronizado */}
            {(title || Icon || headerAction) && (
                <div className="flex items-center justify-between p-5 pb-2 z-20">
                    <div className="flex items-center gap-2.5">
                        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                        {title && (
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                {title}
                            </span>
                        )}
                    </div>
                    {headerAction && <div>{headerAction}</div>}
                </div>
            )}

            {/* Conteúdo */}
            <div className={cn("relative z-20 h-full flex-1", noPadding ? "" : "p-5 pt-2")}>
                {children}
            </div>
        </motion.div>
    );
};
