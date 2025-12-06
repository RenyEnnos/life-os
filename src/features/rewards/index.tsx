import React, { useEffect, useState } from 'react'
import { useAuth } from '@/features/auth/contexts/AuthContext'
import { rewardsApi } from './api/rewards.api'
import { AchievementCard } from './components/AchievementCard'
import { Trophy, Star, TrendingUp } from 'lucide-react'
import { PageTitle } from '@/shared/ui/PageTitle'
import { Card } from '@/shared/ui/Card'
import { clsx } from 'clsx'

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
            } catch (error) {
                console.error('Failed to load rewards data:', error)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [user])

    if (loading) return <div className="p-8 text-center text-muted-foreground">Carregando recompensas...</div>

    const currentLevel = score?.level || 1
    const currentXp = score?.current_xp || 0
    const nextLevelXp = currentLevel * 1000
    const progress = (currentXp % 1000) / 1000 * 100

    return (
        <div className="space-y-8 pb-20">
            <PageTitle
                title="CONQUISTAS & NÍVEL"
                subtitle="Acompanhe seu progresso e desbloqueie recompensas."
                action={<Trophy className="text-yellow-500 w-8 h-8" />}
            />

            {/* Level Card */}
            <Card className="p-6 relative overflow-hidden bg-surface border-border">
                <div className="absolute top-0 right-0 p-32 bg-green-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full border-4 border-surface-alt flex items-center justify-center bg-background">
                            <div className="text-center">
                                <span className="block text-xs text-muted-foreground uppercase tracking-wider">Nível</span>
                                <span className="block text-4xl font-black text-foreground">{currentLevel}</span>
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
                                <h3 className="text-xl font-bold text-foreground">Progresso do Nível</h3>
                                <p className="text-muted-foreground text-sm">Continue completando tarefas para subir de nível.</p>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-bold text-green-500">{currentXp}</span>
                                <span className="text-muted-foreground text-sm"> / {nextLevelXp} XP</span>
                            </div>
                        </div>

                        <div className="h-4 bg-surface-alt rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-1000 ease-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 bg-surface/50 border-border">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/20 text-blue-500 rounded-lg">
                            <TrendingUp size={20} />
                        </div>
                        <span className="text-muted-foreground text-sm">Life Score</span>
                    </div>
                    <span className="text-2xl font-bold text-foreground">{score?.life_score || 0}</span>
                </Card>
                {/* Add more stats here later */}
            </div>

            {/* Achievements List */}
            <div>
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
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
                        <div className="col-span-2 text-center py-12 bg-surface/30 rounded-xl border border-border border-dashed">
                            <Trophy className="mx-auto text-muted-foreground mb-3" size={48} />
                            <p className="text-muted-foreground">Nenhuma conquista desbloqueada ainda.</p>
                            <p className="text-muted-foreground/80 text-sm mt-1">Complete tarefas e hábitos para começar!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

