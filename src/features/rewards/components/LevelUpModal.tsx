import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Award, Zap, Star, X, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';

interface LevelUpModalProps {
    level: number;
    isOpen: boolean;
    onClose: () => void;
}

export function LevelUpModal({ level, isOpen, onClose }: LevelUpModalProps) {
    useEffect(() => {
        if (isOpen) {
            // Trigger confetti
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: any = setInterval(function() {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);

            return () => clearInterval(interval);
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                    />

                    <motion.div
                        initial={{ scale: 0.5, opacity: 0, y: 100 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.5, opacity: 0, y: 100 }}
                        transition={{ type: "spring", damping: 15, stiffness: 200 }}
                        className="relative z-10 w-full max-w-lg"
                    >
                        <Card className="bg-zinc-950 border-primary/30 shadow-[0_0_100px_rgba(48,140,232,0.2)] p-12 text-center overflow-hidden rounded-[3rem]">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
                            
                            <motion.div
                                initial={{ rotate: -180, scale: 0 }}
                                animate={{ rotate: 0, scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="size-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/20 relative"
                            >
                                <div className="absolute inset-0 bg-primary/5 rounded-full animate-ping" />
                                <Award className="text-primary" size={64} />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <h3 className="text-zinc-500 font-mono text-xs uppercase tracking-[0.5em] mb-2">Novo Marco Alcançado</h3>
                                <h2 className="text-5xl font-black text-white tracking-tighter mb-6">LEVEL UP!</h2>
                                
                                <div className="flex items-center justify-center gap-4 mb-8">
                                    <div className="text-3xl font-bold text-zinc-700">Lvl {level - 1}</div>
                                    <ChevronRight className="text-primary" size={24} />
                                    <div className="text-6xl font-black text-primary drop-shadow-[0_0_15px_rgba(48,140,232,0.5)]">
                                        {level}
                                    </div>
                                </div>

                                <p className="text-zinc-400 text-sm max-w-xs mx-auto mb-10 leading-relaxed">
                                    Sua produtividade atingiu novos patamares. O sistema agora está mais sintonizado com sua eficiência.
                                </p>

                                <Button 
                                    onClick={onClose}
                                    className="w-full bg-primary hover:bg-primary/90 text-black font-black py-6 rounded-2xl text-lg tracking-widest uppercase shadow-lg shadow-primary/20"
                                >
                                    Continuar Evoluindo
                                </Button>
                            </motion.div>

                            {/* Background Elements */}
                            <div className="absolute top-10 left-10 text-primary/10 -rotate-12">
                                <Zap size={48} />
                            </div>
                            <div className="absolute bottom-20 right-10 text-primary/10 rotate-12">
                                <Star size={48} />
                            </div>
                        </Card>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
