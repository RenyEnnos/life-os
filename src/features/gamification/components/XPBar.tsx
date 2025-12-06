import { motion } from 'framer-motion';
import { Trophy, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { rewardsApi } from '@/features/rewards/api/rewards.api';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { cn } from '@/shared/lib/cn';

interface XPBarProps {
    className?: string;
    showLevel?: boolean;
}

export function XPBar({ className, showLevel = true }: XPBarProps) {
    const { user } = useAuth();

    const { data: score } = useQuery({
        queryKey: ['userScore', user?.id],
        queryFn: () => rewardsApi.getUserScore(user!.id),
        enabled: !!user,
        staleTime: 1000 * 60 * 5 // 5 minutes
    });

    if (!score) return null;

    const currentLevel = score.level || 1;
    const currentXP = score.current_xp || 0;
    const nextLevelXP = currentLevel * 1000;
    const progress = Math.min((currentXP % 1000) / 1000 * 100, 100);

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
                        {Math.floor(currentXP)} / {nextLevelXP} XP
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
