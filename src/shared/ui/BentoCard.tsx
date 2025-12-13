import { ReactNode, useRef, useState, ElementType, isValidElement } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { cn } from '@/shared/lib/cn';

// --- CONTAINER DO GRID ---
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
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[1920px] mx-auto auto-rows-[180px]",
                className
            )}
        >
            {children}
        </motion.div>
    );
};

// --- O CARD INDIVIDUAL (Spotlight + Hover + Physics) ---
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

    // Otimização: MotionValues evitam re-renders do React a cada pixel de movimento
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    // Templates para o gradiente radial performático
    const spotlightStyle = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.06), transparent 40%)`;
    const borderStyle = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.15), transparent 40%)`;

    const finalAction = action || headerAction;

    return (
        <motion.div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setOpacity(1)}
            onMouseLeave={() => setOpacity(0)}
            onClick={onClick}
            // FÍSICA TÁTIL
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.99 }}
            className={cn(
                "group relative overflow-hidden rounded-xl glass-panel text-zinc-100 transition-all duration-300 @container",
                onClick && "cursor-pointer hover:shadow-md hover:shadow-black/20",
                className
            )}
        >
            {/* Camada 1: Spotlight Interno (Fundo) */}
            <motion.div
                className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
                style={{ opacity, background: spotlightStyle }}
            />

            {/* Camada 2: Borda Brilhante (Renderizada via Mask Composite) */}
            <motion.div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                    background: borderStyle,
                    maskImage: `linear-gradient(black, black), linear-gradient(black, black)`,
                    maskClip: "content-box, border-box",
                    maskComposite: "exclude",
                    WebkitMaskComposite: "xor",
                    padding: "1px" // Define a espessura da borda brilhante
                }}
            />

            {/* Camada 3: Conteúdo */}
            <div className={cn("relative h-full flex flex-col min-w-0", noPadding ? "" : "p-5 md:p-6")}>
                {(title || icon || finalAction) && (
                    <div className={`flex items-center justify-between mb-4 ${noPadding ? "p-5 md:p-6 pb-0" : ""}`}>
                        <div className="flex items-center gap-2.5">
                            {icon && (
                                isValidElement(icon) ? (
                                    // Se já for <Icon />, renderiza direto
                                    icon
                                ) : (typeof icon === 'function' || (typeof icon === 'object' && icon !== null)) ? (
                                    // Se for Componente (Func ou ForwardRef), instancia
                                    (() => { const Icon = icon as ElementType; return <Icon className="h-4 w-4 text-zinc-400" />; })()
                                ) : (
                                    // Se for string/number/null
                                    <span className="text-zinc-400">{icon}</span>
                                )
                            )}
                            {title && <h3 className="text-label text-zinc-400">{title}</h3>}
                        </div>
                        {finalAction && <div>{finalAction}</div>}
                    </div>
                )}
                <div className="flex-1 text-zinc-300">
                    {children}
                </div>
            </div>
        </motion.div>
    );
};
