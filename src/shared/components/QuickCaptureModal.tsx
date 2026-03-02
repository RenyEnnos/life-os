import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Loader, Zap, Target, DollarSign, ArrowRight } from 'lucide-react';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { aiApi } from '@/features/ai-assistant/api/ai.api';
import { useTasks } from '@/features/tasks/hooks/useTasks';
import { useFinances } from '@/features/finances/hooks/useFinances';
import { useToast } from '@/shared/ui/useToast';
import { cn } from '@/shared/lib/cn';

interface QuickCaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function QuickCaptureModal({ isOpen, onClose }: QuickCaptureModalProps) {
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const { createTask } = useTasks();
    const { createTransaction } = useFinances();
    const { showToast } = useToast();

    // Reset input when opening
    useEffect(() => {
        if (isOpen) setInput('');
    }, [isOpen]);

    const handleCapture = async () => {
        if (!input.trim()) return;

        setIsThinking(true);
        try {
            const result = await aiApi.parseEntity(input);
            
            if (result.type === 'task') {
                await createTask.mutateAsync(result.data);
                showToast('Tarefa capturada via IA!', 'success');
            } else if (result.type === 'transaction') {
                await createTransaction.mutateAsync(result.data);
                showToast('Transação financeira registrada!', 'success');
            } else if (result.type === 'habit') {
                // Future habit creation logic here
                showToast('Hábito identificado! (Funcionalidade em breve)', 'info');
            } else {
                // Fallback to task
                await createTask.mutateAsync({ title: input });
                showToast('Capturado como tarefa.', 'success');
            }

            onClose();
        } catch (error) {
            console.error('AI Capture Error:', error);
            showToast('Erro ao processar captura inteligente.', 'error');
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="relative w-full max-w-2xl"
                    >
                        <Card className="bg-zinc-950/80 border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.15)] overflow-hidden rounded-3xl">
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-purple-400">
                                        <Sparkles size={18} className="animate-pulse" />
                                        <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">Captura Inteligente</span>
                                    </div>
                                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="relative">
                                    <input
                                        autoFocus
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleCapture()}
                                        placeholder="O que você quer registrar? (Ex: 'Gastei 30 reais com café' ou 'Ligar para o médico amanhã')"
                                        className="w-full bg-transparent border-none text-xl text-white placeholder-zinc-700 py-4 focus:ring-0 outline-none"
                                        disabled={isThinking}
                                    />
                                    {isThinking && (
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2">
                                            <Loader className="animate-spin text-purple-500" size={24} />
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-zinc-500">
                                        <Target size={12} /> TAREFAS
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-zinc-500">
                                        <DollarSign size={12} /> FINANÇAS
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-zinc-500">
                                        <Zap size={12} /> HÁBITOS
                                    </div>
                                    <div className="ml-auto text-[10px] font-mono text-zinc-600">
                                        Pressione <kbd className="text-zinc-400 bg-white/5 px-1 rounded">ENTER</kbd> para enviar
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
