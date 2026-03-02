import React from 'react';
import { WifiOff, RefreshCcw, Home } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { motion } from 'framer-motion';

export const OfflinePage = () => {
    const handleRetry = () => {
        window.location.reload();
    };

    const handleGoHome = () => {
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen bg-oled text-white font-display flex flex-col items-center justify-center p-6 text-center">
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 max-w-md w-full space-y-8"
            >
                <div className="size-24 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <WifiOff size={40} className="text-zinc-500 group-hover:text-primary transition-colors" />
                </div>

                <div className="space-y-3">
                    <h1 className="text-4xl font-black tracking-tighter uppercase">Você está offline</h1>
                    <p className="text-zinc-500 text-sm leading-relaxed max-w-[280px] mx-auto">
                        O Neural Nexus perdeu a conexão com os servidores. Algumas funcionalidades podem estar limitadas.
                    </p>
                </div>

                <div className="glass-panel p-6 rounded-3xl border-white/5 bg-white/[0.02] text-left">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Acesso Local Ativo</h3>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-3 text-xs text-zinc-300">
                            <div className="size-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                            Visualizar Tarefas e Hábitos
                        </li>
                        <li className="flex items-center gap-3 text-xs text-zinc-300">
                            <div className="size-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                            Ler entradas do Diário
                        </li>
                        <li className="flex items-center gap-3 text-xs text-zinc-500">
                            <div className="size-1.5 rounded-full bg-zinc-800" />
                            Sincronização Cloud (Pausada)
                        </li>
                    </ul>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                    <Button 
                        onClick={handleRetry}
                        className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-6 rounded-2xl gap-2 group"
                    >
                        <RefreshCcw size={18} className="group-active:rotate-180 transition-transform duration-500" />
                        TENTAR NOVAMENTE
                    </Button>
                    <Button 
                        variant="ghost"
                        onClick={handleGoHome}
                        className="w-full text-zinc-500 hover:text-white hover:bg-white/5 rounded-2xl gap-2"
                    >
                        <Home size={18} />
                        IR PARA O INÍCIO
                    </Button>
                </div>
            </motion.div>

            <div className="absolute bottom-8 text-[10px] font-mono text-zinc-700 uppercase tracking-widest">
                Life OS v0.1.0 • PWA Mode
            </div>
        </div>
    );
};
