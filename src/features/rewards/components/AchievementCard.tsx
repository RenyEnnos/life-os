import React from 'react'
import { Trophy, Lock, Footprints, Flame, Book, Briefcase } from 'lucide-react'
import { MagicCard } from '@/shared/ui/premium/MagicCard'
import { ShineBorder } from '@/shared/ui/premium/ShineBorder'

type Achievement = {
    id: string
    code: string
    title: string
    description: string
    icon: string
    xp_reward: number
    unlocked_at?: string
}

interface AchievementCardProps {
    achievement: Achievement
    unlocked: boolean
    onClick?: () => void
}

const iconMap: Record<string, React.ElementType> = {
    footprints: Footprints,
    flame: Flame,
    book: Book,
    briefcase: Briefcase,
    default: Trophy
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, unlocked, onClick }) => {
    const Icon = iconMap[achievement.icon] || iconMap.default

    const CardContent = (
        <MagicCard
            className={`p-4 flex items-start gap-4 transition-all duration-300 cursor-pointer ${unlocked ? 'bg-zinc-900' : 'bg-zinc-900/50'}`}
            gradientColor={unlocked ? "#22c55e" : "#52525b"} // Green or Zinc
            onClick={onClick}
        >
            <div className={`p-3 rounded-lg ${unlocked ? 'bg-green-500/20 text-green-500' : 'bg-zinc-800 text-zinc-600'}`}>
                <Icon size={24} />
            </div>
            <div className="flex-1">
                <h3 className={`font-bold ${unlocked ? 'text-white' : 'text-zinc-500'}`}>{achievement.title}</h3>
                <p className="text-sm text-zinc-400 mt-1">{achievement.description}</p>
                <div className="mt-2 flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${unlocked ? 'bg-yellow-500/20 text-yellow-500' : 'bg-zinc-800 text-zinc-600'}`}>
                        +{achievement.xp_reward} XP
                    </span>
                    {unlocked && (
                        <span className="text-xs text-green-500 flex items-center gap-1">
                            <Trophy size={12} /> Desbloqueado
                        </span>
                    )}
                </div>
            </div>
            {!unlocked && (
                <div className="absolute top-4 right-4 text-zinc-700">
                    <Lock size={16} />
                </div>
            )}
        </MagicCard>
    )

    if (unlocked) {
        return (
            <ShineBorder
                className="rounded-xl overflow-hidden p-0 border-0"
                color={["#22c55e", "#eab308", "#22c55e"]} // Green, Yellow, Green
            >
                {CardContent}
            </ShineBorder>
        )
    }

    return (
        <div className="rounded-xl overflow-hidden border border-zinc-800">
            {CardContent}
        </div>
    )
}
