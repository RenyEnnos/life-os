import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface MoodIndicatorProps {
    score: number; // 0-10
    size?: 'small' | 'medium' | 'large';
    showLabel?: boolean;
}

/**
 * Mood Indicator
 * 
 * Circular indicator with color gradient based on mood score.
 * Red (low) -> Yellow (neutral) -> Green (high)
 */
export function MoodIndicator({ score, size = 'medium', showLabel = false }: MoodIndicatorProps) {
    // Clamp score to 0-10
    const clampedScore = Math.max(0, Math.min(10, score));

    // Calculate color based on score
    // 0 = red (0), 5 = yellow (60), 10 = green (120)
    const hue = clampedScore * 12;
    const color = `hsl(${hue}, 70%, 50%)`;
    const bgColor = `hsla(${hue}, 70%, 50%, 0.15)`;

    const sizeClasses = {
        small: 'w-6 h-6 text-xs',
        medium: 'w-10 h-10 text-sm',
        large: 'w-14 h-14 text-base',
    };

    const getMoodEmoji = () => {
        if (clampedScore >= 8) return '😊';
        if (clampedScore >= 6) return '🙂';
        if (clampedScore >= 4) return '😐';
        if (clampedScore >= 2) return '😔';
        return '😢';
    };

    return (
        <motion.div
            className={clsx(
                'mood-indicator flex items-center justify-center rounded-full font-mono font-semibold',
                sizeClasses[size]
            )}
            style={{
                backgroundColor: bgColor,
                color: color,
                border: `2px solid ${color}`,
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            title={`Mood: ${clampedScore}/10`}
        >
            {showLabel ? getMoodEmoji() : clampedScore}
        </motion.div>
    );
}

export default MoodIndicator;
