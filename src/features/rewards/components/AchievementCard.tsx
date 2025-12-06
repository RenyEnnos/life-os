import React from 'react'
import { Trophy, Lock, Footprints, Flame, Book, Briefcase } from 'lucide-react'

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
}

const iconMap: Record<string, React.ElementType> = {
    footprints: Footprints,
    flame: Flame,
    book: Book,
    briefcase: Briefcase,
    default: Trophy
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, unlocked }) => {
    const Icon = iconMap[achievement.icon] || iconMap.default

    return (
        <div className={`relative p-4 rounded-xl border ${unlocked ? 'bg-zinc-900 border-green-500/50' : 'bg-zinc-900/50 border-zinc-800'} transition-all duration-300`}>
            <div className="flex items-start gap-4">
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
            </div>
        </div>
    )
}
