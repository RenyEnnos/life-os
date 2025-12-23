import { Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUserXP } from '@/features/gamification/hooks/useUserXP';
import { getArchetype } from '@/features/gamification/logic/archetypes';
import type { XPAttributes } from '@/features/gamification/api/types';
import { cn } from '@/shared/lib/cn';

/**
 * StatusCard - Compact Level + XP widget for Dashboard
 * Displays a large level number with XP progress
 */
export function StatusCard({ className }: { className?: string }) {
    const { userXP, isLoading } = useUserXP();

    if (isLoading) {
        return (
            <div className={cn("animate-pulse bg-muted/20 rounded-xl h-full", className)} />
        );
    }

    if (!userXP) {
        return (
            <div className={cn("flex items-center justify-center h-full text-muted-foreground text-sm", className)}>
                <span>No XP Data</span>
            </div>
        );
    }

    const currentLevel = userXP.level;
    const totalXp = userXP.current_xp;

    // XP math aligned with backend (1000 XP per level)
    const xpForCurrentLevel = (currentLevel - 1) * 1000;
    const xpForNextLevel = currentLevel * 1000;
    const xpGainedInLevel = totalXp - xpForCurrentLevel;
    const levelSize = xpForNextLevel - xpForCurrentLevel;
    const progress = Math.min(100, Math.max(0, (xpGainedInLevel / levelSize) * 100));

    // Get archetype for theming
    const attributes = userXP.attributes as XPAttributes | null;
    const archetype = getArchetype(attributes);

    return (
        <div className={cn("flex flex-col items-center justify-center h-full gap-2", className)}>
            {/* Level Display */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="relative"
            >
                {/* Glow ring */}
                <div
                    className="absolute inset-0 rounded-full blur-lg opacity-30"
                    style={{ backgroundColor: archetype.strokeColor }}
                />

                <div className={cn(
                    "relative flex items-center justify-center",
                    "w-16 h-16 rounded-full border-2",
                    "bg-black/50"
                )}
                    style={{ borderColor: archetype.strokeColor }}
                >
                    <Trophy
                        className="absolute -top-1 -right-1 w-4 h-4"
                        style={{ color: archetype.strokeColor }}
                    />
                    <span
                        className="text-2xl font-bold"
                        style={{ color: archetype.strokeColor }}
                    >
                        {currentLevel}
                    </span>
                </div>
            </motion.div>

            {/* XP Text */}
            <div className="text-center">
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                    Nível
                </div>
                <div className="text-xs text-muted-foreground font-mono mt-1">
                    {Math.floor(xpGainedInLevel)} / {levelSize} XP
                </div>
            </div>

            {/* Mini Progress Bar */}
            <div className="w-full max-w-[80px] h-1.5 bg-muted/20 rounded-full overflow-hidden">
                <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: archetype.strokeColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />
            </div>
        </div>
    );
}
