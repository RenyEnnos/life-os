import { AnimatePresence, motion } from 'framer-motion';
import { useFocusStore } from '../stores/useFocusStore';
import { Minimize2, Pause, Play, CheckCircle2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '@/features/tasks/api/tasks.api';
import confetti from 'canvas-confetti';

// Format seconds to MM:SS
const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function FocusOverlay() {
    const { isFocusing, activeTask, timerState, secondsRemaining, stopFocus, pauseFocus, resumeFocus } = useFocusStore();
    const qc = useQueryClient();

    const completeTask = useMutation({
        mutationFn: (id: string) => tasksApi.update(id, { completed: true }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['tasks'] });
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            stopFocus();
        }
    });

    return (
        <AnimatePresence>
            {isFocusing && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-8 selection:bg-amber-500/30"
                >
                    {/* Background Ambient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />

                    <button
                        onClick={stopFocus}
                        className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors"
                        title="Sair do Foco (Esc)"
                    >
                        <Minimize2 size={24} />
                    </button>

                    <div className="flex flex-col items-center text-center max-w-2xl w-full gap-12">

                        {/* Task Title */}
                        <div className="space-y-4">
                            <span className="text-sm font-medium text-amber-500 uppercase tracking-widest">Deep Work</span>
                            <h1 className="text-4xl md:text-6xl font-light text-white leading-tight">
                                {activeTask?.title || 'Foco Livre'}
                            </h1>
                        </div>

                        {/* Timer */}
                        <div className="relative group cursor-default select-none">
                            <div className="text-[12rem] md:text-[16rem] font-bold text-white/90 tabular-nums leading-none tracking-tighter mix-blend-screen shadow-glow">
                                {formatTime(secondsRemaining)}
                            </div>
                            {/* Progress Ring visual could go here, but text is impactful enough */}
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-6">
                            {timerState === 'running' ? (
                                <button
                                    onClick={pauseFocus}
                                    className="p-6 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
                                >
                                    <Pause size={32} />
                                </button>
                            ) : (
                                <button
                                    onClick={resumeFocus}
                                    className="p-6 rounded-full bg-white text-black hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95"
                                >
                                    <Play size={32} fill="currentColor" />
                                </button>
                            )}

                            <button
                                onClick={() => activeTask && completeTask.mutate(activeTask.id)}
                                disabled={completeTask.isPending}
                                className="group flex items-center gap-3 px-8 py-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/30 transition-all hover:scale-105"
                            >
                                <CheckCircle2 size={32} />
                                <span className="text-xl font-medium">Concluir Tarefa</span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
