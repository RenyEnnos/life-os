import { cn } from '@/shared/lib/cn';
import { MagicCard } from '@/shared/ui/premium/MagicCard';
import { motion } from 'framer-motion';
import { Lock, Trophy, LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { AchievementWithStatus } from '../api/achievementService';

interface AchievementCardProps {
    achievement: AchievementWithStatus;
    className?: string;
}

// Helper to get icon by name
function getIconByName(name: string): LucideIcon {
    const icons = LucideIcons as unknown as Record<string, LucideIcon>;
    return icons[name] || Trophy;
}

export function AchievementCard({ achievement, className }: AchievementCardProps) {
    const IconComponent = getIconByName(achievement.icon);

    return (
        <MagicCard
            className={cn(
                "p-4 transition-all",
                !achievement.unlocked && "opacity-60 grayscale",
                className
            )}
            gradientColor={achievement.unlocked ? "#f59e0b" : "#6b7280"}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-start gap-3"
            >
                {/* Icon */}
                <div className={cn(
                    "p-3 rounded-xl relative",
                    achievement.unlocked ? "bg-amber-500/20" : "bg-gray-500/20"
                )}>
                    <IconComponent
                        size={24}
                        className={cn(
                            achievement.unlocked ? "text-amber-500" : "text-gray-500"
                        )}
                    />
                    {!achievement.unlocked && (
                        <Lock size={12} className="absolute -bottom-1 -right-1 text-gray-400" />
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <h3 className={cn(
                            "font-bold text-sm",
                            achievement.unlocked ? "text-amber-500" : "text-gray-400"
                        )}>
                            {achievement.name}
                        </h3>
                        <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full font-mono",
                            achievement.unlocked
                                ? "bg-amber-500/20 text-amber-400"
                                : "bg-gray-500/20 text-gray-500"
                        )}>
                            +{achievement.xp_reward} XP
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {achievement.description}
                    </p>
                    {achievement.unlocked && achievement.unlockedAt && (
                        <p className="text-[10px] text-muted-foreground mt-2 font-mono">
                            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </p>
                    )}
                </div>
            </motion.div>
        </MagicCard>
    );
}
