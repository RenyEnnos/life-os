import {  _useRef } from 'react';
import { motion, useSpring,  _useTransform,  _useMotionValue } from 'framer-motion';
import {  _cn } from '@/shared/lib/ _cn';
import { Sparkles,  _Trophy, Zap } from 'lucide-react';
import { LifeScore } from '@/shared/types';

interface XpHeroProps {
    lifeScore: LifeScore | null;
    isLoading?: boolean;
}

export function XpHero({ lifeScore, isLoading }: XpHeroProps) {
    // Determine Level and XP
    // Note: If lifeScore is null, default to Lv 1, 0 XP
    const level = lifeScore?.level || 1;
    const currentXp = lifeScore?.current_xp || 0;
    const nextLevelXp = lifeScore?.next_level_xp || 100;
    const progress = Math.min((currentXp / nextLevelXp) * 100, 100);

    // Animation for progress bar
    const progressSpring = useSpring(0, { stiffness: 50, damping: 15 });

    // Update spring when progress changes
    if (!isLoading) {
        progressSpring.set(progress);
    }

    return (
        <div className="relative w-full rounded-3xl bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-white/10 p-6 overflow-hidden shadow-xl group">

            {/* Background Texture/Effects */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/30 rounded-full blur-3xl group-hover:bg-purple-500/40 transition-colors duration-700" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-600/30 rounded-full blur-3xl group-hover:bg-indigo-500/40 transition-colors duration-700" />

            <div className="relative flex items-center gap-6">

                {/* Level Badge */}
                <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-amber-300 to-yellow-600 shadow-lg flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300 relative z-10 border-2 border-white/20">
                        <div className="absolute inset-0 bg-white/20 rounded-2xl backdrop-blur-sm" />
                        <span className="relative z-20 text-3xl md:text-4xl font-black text-white drop-shadow-md">{level}</span>
                    </div>
                    {/* Glow behind badge */}
                    <div className="absolute inset-0 bg-amber-500 blur-xl opacity-40 animate-pulse" />

                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black/80 px-2.5 py-0.5 rounded-full border border-white/10 whitespace-nowrap z-20">
                        <span className="text-[10px] font-bold text-amber-500 tracking-wider uppercase">Level</span>
                    </div>
                </div>

                {/* Info & Progress */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                                {isLoading ? <div className="h-6 w-32 bg-white/10 rounded animate-pulse" /> : "Arquiteto da Vida"}
                                <Sparkles size={16} className="text-amber-300 animate-pulse" />
                            </h3>
                            <p className="text-xs text-indigo-200/80">Continue evoluindo seus atributos.</p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-light text-white tabular-nums tracking-tighter">
                                {isLoading ? "..." : currentXp}
                                <span className="text-sm text-indigo-300/60 font-normal mx-1">/</span>
                                <span className="text-base text-indigo-300/60 font-normal">{nextLevelXp} XP</span>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="h-4 w-full bg-black/40 rounded-full p-0.5 border border-white/5 relative overflow-hidden">
                        {/* Fill */}
                        <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                            style={{ width: isLoading ? '0%' : `${progress}%` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        >
                            {/* Shimmer Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                        </motion.div>
                    </div>

                    <div className="flex justify-between mt-1.5 opacity-60">
                        <span className="text-[10px] text-white/50 flex items-center gap-1">
                            <Zap size={10} /> Próxima recompensa em {nextLevelXp - currentXp} XP
                        </span>
                        <span className="text-[10px] text-white/50">{progress.toFixed(0)}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
