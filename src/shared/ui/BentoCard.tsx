import { ReactNode, useRef, useState, ElementType, isValidElement, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/shared/lib/cn';

// --- GRID CONTAINER ---
export const BentoGrid = ({ className, children }: { className?: string; children: ReactNode }) => {
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
                "group/bento grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[1920px] mx-auto auto-rows-[160px] md:auto-rows-[180px]",
                className
            )}
        >
            {children}
        </motion.div>
    );
};

// --- SINGLE CARD (Spotlight + Hover + Physics) ---
interface BentoCardProps {
    children: ReactNode;
    className?: string;
    title?: string;
    icon?: ReactNode | ElementType;
    action?: ReactNode;
    headerAction?: ReactNode; // Backward compatibility
    onClick?: () => void;
    noPadding?: boolean;
}

export const BentoCard = ({
    children,
    className,
    title,
    icon,
    action,
    headerAction,
    onClick,
    noPadding = false
}: BentoCardProps) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [enableSpotlight, setEnableSpotlight] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const media = window.matchMedia('(hover: hover) and (pointer: fine)');
        const update = () => setEnableSpotlight(media.matches);
        update();
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, []);

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!enableSpotlight || e.pointerType === 'touch' || !divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        divRef.current.style.setProperty('--mouse-x', `${x}px`);
        divRef.current.style.setProperty('--mouse-y', `${y}px`);
        setIsHovering(true);
    };

    const handlePointerLeave = () => {
        setIsHovering(false);
    };

    const finalAction = action || headerAction;

    return (
        <motion.div
            ref={divRef}
            onPointerMove={handlePointerMove}
            onPointerEnter={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            onClick={onClick}
            // FÍSICA TÁTIL: Subtle breathe effect
            whileHover={{ scale: 1.01, transition: { duration: 0.3, ease: "easeOut" } }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "group relative overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/30 backdrop-blur-xl flex flex-col transition-all duration-300 hover:border-white/10 hover:bg-zinc-900/40 shadow-2xl shadow-black/80",
                onClick && "cursor-pointer",
                className
            )}
        >
            

            {/* Layer 3: Content */}
            <div className={cn("relative z-10 h-full flex flex-col min-w-0 w-full", noPadding ? "" : "p-5 md:p-6")}>
                {(title || icon || finalAction) && (
                    <div className={cn("flex items-center justify-between mb-4", noPadding && "p-5 md:p-6 pb-0")}>
                        <div className="flex items-center gap-3">
                            {icon && (
                                <div className="text-zinc-400 group-hover/bento-card:text-zinc-200 transition-colors">
                                    {isValidElement(icon) ? icon : (
                                        (() => { const Icon = icon as ElementType; return <Icon className="h-4 w-4" />; })()
                                    )}
                                </div>
                            )}
                            {title && <h3 className="text-[10px] uppercase font-medium tracking-widest text-zinc-500 transition-colors">{title}</h3>}
                        </div>
                        {finalAction && <div>{finalAction}</div>}
                    </div>
                )}
                <div className="flex-1 text-zinc-300 w-full">
                    {children}
                </div>
            </div>
        </motion.div>
    );
};
