import React from "react";
import { Habit } from "@/features/habits/types";
import { MagicCard } from "@/shared/ui/premium/MagicCard";
import { ShimmerButton } from "@/shared/ui/premium/ShimmerButton";
import { AnimatedCircularProgressBar } from "@/shared/ui/premium/AnimatedCircularProgressBar";
import { Check, Flame, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/lib/cn";

interface HabitCardProps {
    habit: Habit;
    isCompleted: boolean;
    streak: number;
    onToggle: () => void;
}

export const HabitCard = ({
    habit,
    isCompleted,
    streak,
    onToggle,
}: HabitCardProps) => {
    return (
        <MagicCard
            className={cn(
                "relative flex w-full flex-col justify-between overflow-hidden p-6 transition-all duration-300",
                isCompleted ? "border-primary/50 bg-primary/5" : "border-white/10"
            )}
            gradientColor={isCompleted ? "#262626" : "#262626"}
        >
            <div className="flex w-full items-start justify-between">
                <div className="flex flex-col space-y-2">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2"
                    >
                        <h3 className="text-xl font-bold tracking-tight text-white">
                            {habit.title}
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
                </div>

                <div className="relative h-16 w-16 shrink-0">
                    <AnimatedCircularProgressBar
                        max={100}
                        min={0}
                        value={isCompleted ? 100 : 0}
                        gaugePrimaryColor="rgb(34 197 94)" // green-500
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
                                    <Trophy className="h-6 w-6 text-green-500 fill-green-500/20" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="circle"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                >
                                    {/* Optional icon or empty center */}
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
                    )}>
                        {isCompleted ? "CONCLUÍDO" : "PENDENTE"}
                    </span>
                </div>

                <ShimmerButton
                    className={cn(
                        "h-10 px-6 transition-all duration-300",
                        isCompleted
                            ? "bg-green-500/20 hover:bg-green-500/30"
                            : ""
                    )}
                    background={isCompleted ? "rgba(34, 197, 94, 0.2)" : undefined}
                    shimmerColor={isCompleted ? "#22c55e" : "#ffffff"}
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggle();
                    }}
                >
                    <span className="flex items-center gap-2 text-sm font-semibold leading-none tracking-tight text-white">
                        {isCompleted ? (
                            <>
                                <Check className="h-4 w-4" /> REVERTER
                            </>
                        ) : (
                            "COMPLETAR"
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
                        className="pointer-events-none absolute inset-0 bg-green-500/20"
                    />
                )}
            </AnimatePresence>
        </MagicCard>
    );
};
