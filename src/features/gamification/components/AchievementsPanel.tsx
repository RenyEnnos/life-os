import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { getAchievementsWithStatus, type AchievementWithStatus } from '../api/achievementService';
import { AchievementCard } from './AchievementCard';
import { Loader2, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/shared/lib/cn';

interface AchievementsPanelProps {
    className?: string;
    filter?: 'all' | 'unlocked' | 'locked';
}

export function AchievementsPanel({ className, filter = 'all' }: AchievementsPanelProps) {
    const { user } = useAuth();
    const [achievements, setAchievements] = useState<AchievementWithStatus[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState(filter);

    useEffect(() => {
        if (!user?.id) return;

        const fetchAchievements = async () => {
            setIsLoading(true);
            try {
                const data = await getAchievementsWithStatus(user.id);
                setAchievements(data);
            } catch (err) {
                console.error('Failed to fetch achievements', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAchievements();
    }, [user?.id]);

    const filteredAchievements = achievements.filter(a => {
        if (activeFilter === 'unlocked') return a.unlocked;
        if (activeFilter === 'locked') return !a.unlocked;
        return true;
    });

    const unlockedCount = achievements.filter(a => a.unlocked).length;

    if (isLoading) {
        return (
            <div className={cn("flex items-center justify-center p-8", className)}>
                <Loader2 className="animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className={cn("space-y-4", className)}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Trophy className="text-amber-500" size={20} />
                    <span className="font-bold text-lg">Achievements</span>
                    <span className="text-xs text-muted-foreground font-mono">
                        {unlockedCount}/{achievements.length}
                    </span>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-1 bg-muted/20 p-1 rounded-lg">
                    {(['all', 'unlocked', 'locked'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={cn(
                                "text-xs px-3 py-1 rounded transition-all capitalize",
                                activeFilter === f
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Achievement Grid */}
            <motion.div
                className="grid gap-3 sm:grid-cols-2"
                initial="hidden"
                animate="show"
                variants={{
                    hidden: { opacity: 0 },
                    show: {
                        opacity: 1,
                        transition: { staggerChildren: 0.05 }
                    }
                }}
            >
                {filteredAchievements.map(achievement => (
                    <motion.div
                        key={achievement.id}
                        variants={{
                            hidden: { opacity: 0, y: 10 },
                            show: { opacity: 1, y: 0 }
                        }}
                    >
                        <AchievementCard achievement={achievement} />
                    </motion.div>
                ))}
            </motion.div>

            {filteredAchievements.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    No achievements found.
                </div>
            )}
        </div>
    );
}
