import { useUserXP } from '../hooks/useUserXP';
import { getArchetype, getDominantAttribute } from '../logic/archetypes';
import type { XPAttributes } from '../api/types';
import { cn } from '@/shared/lib/cn';
import { MagicCard } from '@/shared/ui/premium/MagicCard';
import { motion } from 'framer-motion';

interface ArchetypeCardProps {
    className?: string;
    variant?: 'default' | 'compact';
}

export function ArchetypeCard({ className, variant = 'default' }: ArchetypeCardProps) {
    const { userXP, isLoading } = useUserXP();
    const isCompact = variant === 'compact';

    if (isLoading) {
        return (
            <div className={cn("animate-pulse bg-muted/20 rounded-xl", isCompact ? "h-full" : "h-32", className)} />
        );
    }

    if (!userXP) return null;

    const attributes = (userXP as any)?.attributes as XPAttributes | null;
    const archetype = getArchetype(attributes);
    const dominant = getDominantAttribute(attributes);
    const Icon = archetype.icon;

    // Calculate progress for the dominant attribute (relative to total XP)
    const totalAttrXP = attributes
        ? Object.values(attributes).reduce((a, b) => a + b, 0)
        : 0;
    const dominantPercent = dominant && totalAttrXP > 0
        ? Math.round((dominant.value / totalAttrXP) * 100)
        : 0;

    // Compact variant - minimal vertical layout
    if (isCompact) {
        return (
            <MagicCard
                className={cn("p-3 h-full", className)}
                gradientColor={archetype.strokeColor}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center h-full gap-2 text-center"
                >
                    {/* Icon */}
                    <div className={cn(
                        "p-2 rounded-lg",
                        archetype.bgColor
                    )}>
                        <Icon className={cn("w-5 h-5", archetype.color)} />
                    </div>

                    {/* Name */}
                    <h3 className={cn("font-bold text-sm", archetype.color)}>
                        {archetype.name}
                    </h3>

                    {/* Mini Progress Bar */}
                    {dominant && (
                        <div className="w-full max-w-[80px]">
                            <div className="h-1 bg-muted/20 rounded-full overflow-hidden">
                                <motion.div
                                    className={cn("h-full rounded-full", archetype.color.replace('text-', 'bg-'))}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${dominantPercent}%` }}
                                    transition={{ duration: 0.6, ease: 'easeOut' }}
                                />
                            </div>
                            <span className="text-[10px] text-muted-foreground capitalize mt-1 block">
                                {dominant.attribute}
                            </span>
                        </div>
                    )}
                </motion.div>
            </MagicCard>
        );
    }

    // Default variant - horizontal layout with description
    return (
        <MagicCard
            className={cn("p-4", className)}
            gradientColor={archetype.strokeColor}
        >
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-start gap-4"
            >
                {/* Icon */}
                <div className={cn(
                    "p-3 rounded-xl",
                    archetype.bgColor
                )}>
                    <Icon className={cn("w-6 h-6", archetype.color)} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h3 className={cn("font-bold text-lg", archetype.color)}>
                        {archetype.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {archetype.description}
                    </p>

                    {/* Dominant Attribute Progress */}
                    {dominant && (
                        <div className="mt-3">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span className="capitalize">{dominant.attribute}</span>
                                <span>{dominantPercent}%</span>
                            </div>
                            <div className="h-1.5 bg-muted/20 rounded-full overflow-hidden">
                                <motion.div
                                    className={cn("h-full rounded-full", archetype.color.replace('text-', 'bg-'))}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${dominantPercent}%` }}
                                    transition={{ duration: 0.6, ease: 'easeOut' }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </MagicCard>
    );
}
