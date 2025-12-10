import React from 'react';
import { useUserXP } from '@/features/gamification/hooks/useUserXP';
import { calculateNextLevelXp } from '@/features/gamification/api/xpService';
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
    const currentTotalXp = userXP.total_xp;

    // Calculate Progress
    // Previous level threshold
    const prevLevelXp = calculateNextLevelXp(currentLevel - 1); // This logic might need check: Level 1 starts at 0.
    // Next level threshold
    const nextLevelXp = calculateNextLevelXp(currentLevel);

    // XP gained in THIS level
    const xpInLevel = currentTotalXp - (currentLevel === 1 ? 0 : calculateNextLevelXp(currentLevel - 1));
    const xpNeededForLevel = nextLevelXp - (currentLevel === 1 ? 0 : calculateNextLevelXp(currentLevel - 1));

    const progressPercent = Math.min(100, Math.max(0, (xpInLevel / xpNeededForLevel) * 100));

    // Determine dominant attribute color
    const attributes = userXP.attributes as any;
    let dominantAttr = 'output';
    let maxVal = 0;
    if (attributes) {
        if ((attributes.body || 0) > maxVal) { maxVal = attributes.body; dominantAttr = 'body'; }
        if ((attributes.mind || 0) > maxVal) { maxVal = attributes.mind; dominantAttr = 'mind'; }
        if ((attributes.spirit || 0) > maxVal) { maxVal = attributes.spirit; dominantAttr = 'spirit'; }
        if ((attributes.output || 0) > maxVal) { maxVal = attributes.output; dominantAttr = 'output'; }
    }

    const colors: Record<string, string> = {
        body: 'text-red-500', // Health
        mind: 'text-blue-500', // Study
        spirit: 'text-purple-500', // Journal
        output: 'text-emerald-500', // Work
    };

    const strokeColor = colors[dominantAttr] || 'text-primary';

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
        <div className={cn("relative flex items-center justify-center", sizeClasses[size], className)} title={`Level ${currentLevel} • ${Math.round(progressPercent)}% to next level`}>
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
                    className={cn("transition-all duration-500 ease-out", strokeColor)}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                />
            </svg>

            {/* Level Number */}
            <span className={cn("font-bold relative z-10", strokeColor)}>
                {currentLevel}
            </span>
        </div>
    );
}
