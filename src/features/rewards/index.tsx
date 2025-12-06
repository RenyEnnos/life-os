import React, { useEffect, useState } from 'react'
import { useAuth } from '@/features/auth/contexts/AuthContext'
import { rewardsApi } from './api/rewards.api'
import { AchievementCard } from './components/AchievementCard'
import { Trophy, Star, TrendingUp } from 'lucide-react'

export default function RewardsPage() {
    const { user } = useAuth()
    const [score, setScore] = useState<any>(null)
    const [achievements, setAchievements] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) return

        const loadData = async () => {
            try {
                const [userScore, userAchievements] = await Promise.all([
                    rewardsApi.getUserScore(user.id),
                    rewardsApi.getUnlockedAchievements(user.id)
                ])
                setScore(userScore)
                setAchievements((userAchievements as any[]) || [])

                // In a real app, we'd fetch all achievements from the DB to show locked ones too.
                // For now, let's mock the "all achievements" list based on our migration data
                // or fetch if we had an endpoint. Let's assume we fetch unlocked and merge with a static list for now
                // to save an API call or we can add a method to service.
                // Let's just show unlocked for now + placeholders, or better:
                // We'll fetch all achievements from the service if we add a method, but let's stick to what we have.
                // We'll just display the unlocked ones and maybe a "Locked" count.
            } catch (error) {
                console.error('Failed to load rewards data:', error)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [user])

    if (loading) return <div className="p-8 text-center text-zinc-500">Carregando recompensas...</div>

    const currentLevel = score?.level || 1
    const currentXp = score?.current_xp || 0
    const nextLevelXp = currentLevel * 1000
    const progress = (currentXp % 1000) / 1000 * 100

    return (
        <div className="space-y-8 pb-20">
            <header>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Trophy className="text-yellow-500" />
                    Conquistas & Nível
                </h1>
                <p className="text-zinc-400 mt-2">Acompanhe seu progresso e desbloqueie recompensas.</p>
            </header>

            {/* Level Card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-green-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full border-4 border-zinc-800 flex items-center justify-center bg-zinc-950">
                            <div className="text-center">
                                <span className="block text-xs text-zinc-500 uppercase tracking-wider">Nível</span>
                                <span className="block text-4xl font-black text-white">{currentLevel}</span>
                            </div>
                        </div>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                            <Star size={12} fill="black" />
                            MASTER
                        </div>
                    </div>

                    <div className="flex-1 w-full">
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <h3 className="text-xl font-bold text-white">Progresso do Nível</h3>
                                <p className="text-zinc-400 text-sm">Continue completando tarefas para subir de nível.</p>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-bold text-green-500">{currentXp}</span>
                                <span className="text-zinc-600 text-sm"> / {nextLevelXp} XP</span>
                            </div>
                        </div>

                        <div className="h-4 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-1000 ease-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/20 text-blue-500 rounded-lg">
                            <TrendingUp size={20} />
                        </div>
                        <span className="text-zinc-400 text-sm">Life Score</span>
                    </div>
                    <span className="text-2xl font-bold text-white">{score?.life_score || 0}</span>
                </div>
                {/* Add more stats here later */}
            </div>

            {/* Achievements List */}
            <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Trophy size={20} className="text-purple-500" />
                    Suas Conquistas ({achievements.length})
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.length > 0 ? (
                        achievements.map((ua: any) => (
                            <AchievementCard
                                key={ua.id}
                                achievement={ua.achievement}
                                unlocked={true}
                            />
                        ))
                    ) : (
                        <div className="col-span-2 text-center py-12 bg-zinc-900/30 rounded-xl border border-zinc-800 border-dashed">
                            <Trophy className="mx-auto text-zinc-700 mb-3" size={48} />
                            <p className="text-zinc-500">Nenhuma conquista desbloqueada ainda.</p>
                            <p className="text-zinc-600 text-sm mt-1">Complete tarefas e hábitos para começar!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
