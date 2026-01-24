import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy } from 'lucide-react';

interface LevelUpToastProps {
    level: number;
    prevLevel?: number;
}

export function LevelUpToast({ level, prevLevel }: LevelUpToastProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Only trigger if prevLevel exists and is different (and smaller) than current level
        if (prevLevel && level > prevLevel) {
            setIsVisible(true);
            triggerConfetti();

            // Auto hide after 5s
            const timer = setTimeout(() => setIsVisible(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [level, prevLevel]);

    const triggerConfetti = () => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }; // High zIndex

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: NodeJS.Timeout = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -50 }}
                    className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                // Use pointer-events-none on container, auto on content if interactive
                >
                    <div className="bg-black/90 border border-amber-500/50 p-8 rounded-3xl shadow-[0_0_100px_rgba(245,158,11,0.5)] flex flex-col items-center text-center gap-4 relative overflow-hidden backdrop-blur-xl pointer-events-auto">
                        {/* Radiant background */}
                        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent" />

                        <div className="w-24 h-24 bg-gradient-to-br from-amber-300 to-yellow-600 rounded-full flex items-center justify-center shadow-lg mb-2 animate-bounce">
                            <Trophy size={48} className="text-white drop-shadow-md" />
                        </div>

                        <div>
                            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 tracking-tight uppercase">
                                Level Up!
                            </h2>
                            <p className="text-zinc-400 mt-2 text-lg">
                                Você alcançou o Nível <span className="text-white font-bold text-2xl">{level}</span>
                            </p>
                        </div>

                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-2" />

                        <div className="text-sm text-zinc-500">Continue evoluindo seus hábitos.</div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
