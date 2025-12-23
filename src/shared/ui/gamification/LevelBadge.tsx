import { useUserXP } from '@/features/gamification/hooks/useUserXP';
import { getArchetype } from '@/features/gamification/logic/archetypes';
import type { XPAttributes } from '@/features/gamification/api/types';
import { cn } from '@/shared/lib/cn';
import { Loader2 } from 'lucide-react';

interface LevelBadgeProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export function LevelBadge({ className, size = 'md' }: LevelBadgeProps) {
    const { userXP, isLoading } = useUserXP();

    if (isLoading) return <Loader2 className="animate-spin text-muted-foreground w-4 h-4" />;
    if (!userXP) return null;

    const currentLevel = userXP.level;
    const currentTotalXp = userXP.current_xp;

    // Calculate Progress (1000 XP per level)
    const prevLevelXp = (currentLevel - 1) * 1000;
    const nextLevelXp = currentLevel * 1000;
    const xpInLevel = currentTotalXp - prevLevelXp;
    const xpNeededForLevel = nextLevelXp - prevLevelXp;
    const progressPercent = Math.min(100, Math.max(0, (xpInLevel / xpNeededForLevel) * 100));

    // Get archetype for color
    const attributes = userXP.attributes as unknown as XPAttributes | null;
    const archetype = getArchetype(attributes);

    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base',
    };

    const strokeWidth = size === 'sm' ? 2 : 3;
    const radius = 16;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

    return (
        <div
            className={cn("relative flex items-center justify-center", sizeClasses[size], className)}
            title={`${archetype.name} • Level ${currentLevel} • ${Math.round(progressPercent)}% to next`}
        >
            {/* Background Circle */}
            <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle
                    cx="18"
                    cy="18"
                    r={radius}
                    fill="none"
                    className="stroke-muted/20"
                    strokeWidth={strokeWidth}
                />
                {/* Progress Circle */}
                <circle
                    cx="18"
                    cy="18"
                    r={radius}
                    fill="none"
                    stroke={archetype.strokeColor}
                    className="transition-all duration-500 ease-out"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                />
            </svg>

            {/* Level Number */}
            <span className={cn("font-bold relative z-10", archetype.color)}>
                {currentLevel}
            </span>
        </div>
    );
}
