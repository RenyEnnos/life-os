import { memo, useEffect, useRef } from "react";
import { Habit } from "@/features/habits/types";
import { MagicCard } from "@/shared/ui/premium/MagicCard";
import { ShimmerButton } from "@/shared/ui/premium/ShimmerButton";
import { AnimatedCircularProgressBar } from "@/shared/ui/premium/AnimatedCircularProgressBar";
import * as LucideIcons from "lucide-react";
import { Check, Flame, Trophy, Edit2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/lib/cn";
import { Confetti } from "@/shared/ui/premium/Confetti";

interface HabitCardProps {
    habit: Habit;
    isCompleted: boolean;
    streak: number;
    onToggle: () => void;
    onEdit?: (habit: Habit) => void;
    onDelete?: (id: string) => void;
    currentValue?: number;
}

export const HabitCard = memo(({
    habit,
    isCompleted,
    streak,
    onToggle,
    onEdit,
    onDelete,
    currentValue = 0,
}: HabitCardProps) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const prevCompleted = useRef(isCompleted);

    useEffect(() => {
        prevCompleted.current = isCompleted;
    }, [isCompleted]);

    const IconComponent = habit.icon ? (LucideIcons as any)[habit.icon] : null;
    const progress = habit.type === 'quantified' 
        ? Math.min(100, (currentValue / (habit.target_value || 1)) * 100)
        : (isCompleted ? 100 : 0);

    return (
        <MagicCard
            className={cn(
                "relative flex w-full flex-col justify-between overflow-hidden p-6 transition-all duration-300",
                isCompleted ? "border-primary/50 bg-primary/5" : "border-white/10"
            )}
            gradientColor={habit.color || (isCompleted ? "#262626" : "#262626")}
        >
            <div className="absolute top-4 right-4 flex gap-2 z-10">
                {onEdit && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(habit); }}
                        className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                        title="Editar"
                    >
                        <Edit2 size={14} />
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(habit.id); }}
                        className="p-1.5 rounded-full bg-white/5 hover:bg-red-500/20 text-muted-foreground hover:text-red-500 transition-colors"
                        title="Excluir"
                    >
                        <Trash2 size={14} />
                    </button>
                )}
            </div>

            <div className="flex w-full items-start justify-between">
                <div className="flex flex-col space-y-2 pr-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2"
                    >
                        <h3 className="text-xl font-bold tracking-tight text-white">
                            {habit.name || habit.title}
                        </h3>
                        {streak > 0 && (
                            <div className="flex items-center gap-1 rounded-full bg-orange-500/10 px-2 py-0.5 text-xs font-medium text-orange-500">
                                <Flame className="h-3 w-3 fill-orange-500" />
                                <span>{streak}</span>
                            </div>
                        )}
                    </motion.div>

                    <p className="line-clamp-2 text-sm text-muted-foreground">
                        {habit.description || "Sem descrição"}
                    </p>
                    
                    {habit.type === 'quantified' && (
                        <div className="text-xs font-mono text-primary mt-1">
                            {currentValue} / {habit.target_value} {habit.unit}
                        </div>
                    )}
                </div>

                <div className="relative h-16 w-16 shrink-0">
                    <AnimatedCircularProgressBar
                        max={100}
                        value={progress}
                        gaugePrimaryColor={habit.color || "rgb(34 197 94)"}
                        gaugeSecondaryColor="rgba(255, 255, 255, 0.1)"
                        className="h-full w-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            {isCompleted ? (
                                <motion.div
                                    key="check"
                                    initial={{ scale: 0, rotate: -45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: 45 }}
                                >
                                    <Trophy className="h-6 w-6" style={{ color: habit.color || "rgb(34 197 94)" }} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="icon"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-muted-foreground"
                                >
                                    {IconComponent && <IconComponent size={24} style={{ color: habit.color }} />}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex w-full items-end justify-between">
                <div className="flex flex-col">
                    <span className="text-xs font-medium uppercase text-muted-foreground tracking-wider">
                        Status
                    </span>
                    <span className={cn(
                        "text-sm font-bold",
                        isCompleted ? "text-green-500" : "text-white/60"
                    )}
                    style={{ color: isCompleted ? (habit.color || undefined) : undefined }}
                    >
                        {isCompleted ? "CONCLUÍDO" : "PENDENTE"}
                    </span>
                </div>

                <ShimmerButton
                    ref={buttonRef}
                    className={cn(
                        "h-10 px-6 transition-all duration-300",
                        isCompleted
                            ? "bg-green-500/20 hover:bg-green-500/30"
                            : ""
                    )}
                    background={isCompleted ? (habit.color ? `${habit.color}33` : "rgba(34, 197, 94, 0.2)") : undefined}
                    shimmerColor={habit.color || (isCompleted ? "#22c55e" : "#ffffff")}
                    onClick={(e) => {
                        e.stopPropagation();
                        
                        if (!isCompleted) {
                            let x = e.clientX / window.innerWidth;
                            let y = e.clientY / window.innerHeight;
                            
                            if (e.clientX === 0 && e.clientY === 0 && buttonRef.current) {
                                const rect = buttonRef.current.getBoundingClientRect();
                                x = (rect.left + rect.width / 2) / window.innerWidth;
                                y = (rect.top + rect.height / 2) / window.innerHeight;
                            }

                            Confetti({
                                particleCount: 40,
                                spread: 70,
                                origin: { x, y },
                                colors: [habit.color || "#22c55e", "#ffffff", "#ffd700"],
                                ticks: 200,
                                gravity: 1.2,
                                decay: 0.94,
                                startVelocity: 30,
                            });
                        }
                        
                        onToggle();
                    }}
                >
                    <span className="flex items-center gap-2 text-sm font-semibold leading-none tracking-tight text-white">
                        {isCompleted ? (
                            <>
                                <Check className="h-4 w-4" /> REVERTER
                            </>
                        ) : (
                            habit.type === 'quantified' ? "+ REGISTRAR" : "COMPLETAR"
                        )}
                    </span>
                </ShimmerButton>
            </div>

            {/* Visual Feedback Flash */}
            <AnimatePresence>
                {isCompleted && (
                    <motion.div
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="pointer-events-none absolute inset-0"
                        style={{ backgroundColor: habit.color || "rgb(34 197 94)", opacity: 0.1 }}
                    />
                )}
            </AnimatePresence>
        </MagicCard>
    );
});
