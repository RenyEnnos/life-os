import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useUserXP } from '@/features/gamification/hooks/useUserXP'; // Use o novo hook
import { calculateNextLevelXp } from '@/features/gamification/api/xpService';
import { cn } from '@/shared/lib/cn';

interface XPBarProps {
    className?: string;
    showLevel?: boolean;
}

export function XPBar({ className, showLevel = true }: XPBarProps) {
    // 1. Use o hook correto conectado à tabela user_xp
    const { userXP, isLoading } = useUserXP();

    if (isLoading || !userXP) return null;

    const currentLevel = userXP.level;
    const totalXp = userXP.current_xp;

    // Nível baseado em regra do backend (1000 XP por nível)
    const xpForCurrentLevel = (currentLevel - 1) * 1000;
    const xpForNextLevel = currentLevel * 1000;

    const xpGainedInLevel = totalXp - xpForCurrentLevel;
    const levelSize = xpForNextLevel - xpForCurrentLevel;

    // Porcentagem (0 a 100)
    const progress = Math.min(100, Math.max(0, (xpGainedInLevel / levelSize) * 100));

    return (
        <div className={cn("relative", className)}>
            {showLevel && (
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-yellow-500/10 rounded-lg">
                            <Trophy className="w-4 h-4 text-yellow-500" />
                        </div>
                        <span className="text-xs font-bold text-yellow-500 font-mono tracking-wider">
                            LVL {currentLevel}
                        </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">
                        {Math.floor(xpGainedInLevel)} / {levelSize} XP
                    </span>
                </div>
            )}

            <div className="h-2 w-full bg-secondary/20 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 relative"
                >
                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                </motion.div>
            </div>
        </div>
    );
}
