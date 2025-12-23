import { useState, useEffect, useRef } from 'react';
import { Command } from 'cmdk';
import {
    Search, Calendar, CheckSquare, Sparkles,
    CloudRain, Bitcoin, Activity, Terminal
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '@/shared/api/http';
import './synapse.css';

/**
 * Synapse - The Neural Nexus
 * 
 * A premium command palette with Deep Glass aesthetics and contextual awareness.
 * Accessible from anywhere via Cmd+K (Mac) or Ctrl+K (Windows/Linux).
 */
export const Synapse = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);

    // Global keyboard shortcut (Cmd+K / Ctrl+K)
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
            // Close on Escape if open
            if (e.key === 'Escape' && open) {
                setOpen(false);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, [open]);

    // Force focus when opened
    useEffect(() => {
        if (open) {
            // Small timeout to Ensure element is mounted before focusing
            // ignoring strict mode double-mount issues
            const timer = setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [open]);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    // State for HUD Context
    const [context, setContext] = useState<{
        weather?: { temp?: number, condition?: string };
        market?: { price?: number, change?: number };
        focus?: { score?: number };
    } | null>(null);
    const [contextLoading, setContextLoading] = useState(false);
    const [contextError, setContextError] = useState<string | null>(null);

    // Fetch Context Data
    useEffect(() => {
        if (!open) return;
        setContextLoading(true);
        setContextError(null);
        type SynapseApiData = {
            weather?: { temp?: number; summary?: string; condition?: string | number }
            market?: { bitcoin?: { usd?: number; usd_24h_change?: number; change_24h?: number } }
            dev?: { focus?: number; total_hours?: string }
        }
        apiFetch<{ success: boolean; data?: SynapseApiData }>('/api/context/synapse-briefing')
            .then((payload) => {
                if (!payload?.success || !payload.data) {
                    throw new Error('Context offline');
                }
                const weather = payload.data?.weather || {};
                const marketRaw = payload.data?.market || {};
                const btc = marketRaw.bitcoin || marketRaw.crypto?.bitcoin || {};
                const price = typeof btc.usd === 'number' ? btc.usd : undefined;
                const change = typeof btc.usd_24h_change === 'number'
                    ? btc.usd_24h_change
                    : (typeof btc.change_24h === 'number' ? btc.change_24h : undefined);

                const dev = payload.data?.dev || {};
                const focusScore = (() => {
                    if (typeof dev.focus === 'number') return Math.round(dev.focus);
                    if (typeof dev.total_hours === 'string') {
                        const hours = parseFloat(dev.total_hours);
                        if (!Number.isNaN(hours)) return Math.min(100, Math.round(hours * 10));
                    }
                    return undefined;
                })();

                setContext({
                    weather: { temp: weather.temp, condition: weather.summary || weather.condition },
                    market: { price, change },
                    focus: { score: focusScore }
                });
            })
            .catch(err => {
                console.error('Synapse Context Error', err);
                setContext(null);
                setContextError('Context HUD offline');
            })
            .finally(() => setContextLoading(false));
    }, [open]);

    const tempLabel = context?.weather?.temp !== undefined
        ? `${Math.round(context.weather.temp)}°C ${context.weather?.condition || ''}`.trim()
        : '--';
    const focusLabel = context?.focus?.score !== undefined ? `${context.focus.score}%` : '--';
    const priceLabel = context?.market?.price !== undefined ? `$${context.market.price.toLocaleString()}` : '--';

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
                    {/* Backdrop Escuro */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                    />

                    {/* O Nexus Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                        className="w-full max-w-2xl relative z-10 overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0B]/90 shadow-2xl shadow-black/50 backdrop-blur-2xl ring-1 ring-white/5"
                    >

                        {/* 1. HUD - Context Awareness Header */}
                        <div className="flex items-center justify-between px-4 py-2 bg-white/[0.02] border-b border-white/5 text-[10px] uppercase tracking-widest text-zinc-500 font-medium select-none">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 text-blue-400/80">
                                    <CloudRain size={12} />
                                    <span>{contextLoading ? 'Loading...' : (contextError ? contextError : tempLabel)}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-emerald-400/80">
                                    <Activity size={12} />
                                    <span>Focus: {contextLoading ? '--' : focusLabel}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-zinc-400">
                                <Bitcoin size={12} className="text-amber-500/80" />
                                <span className="font-mono">{contextLoading ? '---' : priceLabel}</span>
                            </div>
                        </div>

                        <Command
                            className="bg-transparent"
                            loop
                            shouldFilter={true}
                        >
                            {/* 2. Input Principal - Estilo Spotlight */}
                            <div className="flex items-center border-b border-white/5 px-4">
                                <Search className="mr-3 h-5 w-5 text-zinc-500 shrink-0" />
                                <Command.Input
                                    ref={inputRef}
                                    autoFocus
                                    placeholder="What is your command?"
                                    className="flex h-14 w-full rounded-md bg-transparent py-3 text-lg outline-none placeholder:text-zinc-600 text-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Escape') setOpen(false);
                                    }}
                                />
                            </div>

                            {/* 3. Lista de Resultados */}
                            <Command.List className="max-h-[400px] overflow-y-auto p-2 scroll-py-2">
                                <Command.Empty className="py-6 text-center text-sm text-zinc-500">
                                    No results found in Nexus.
                                </Command.Empty>

                                <Command.Group heading="Navigation" className="text-xs font-medium text-zinc-500 px-2 pb-1.5 pt-2">
                                    <CommandItem value="dashboard" onSelect={() => runCommand(() => navigate('/'))} icon={Sparkles}>
                                        Dashboard
                                    </CommandItem>
                                    <CommandItem value="tasks" onSelect={() => runCommand(() => navigate('/tasks'))} icon={CheckSquare}>
                                        Tasks & Protocol
                                    </CommandItem>
                                    <CommandItem value="calendar" onSelect={() => runCommand(() => navigate('/calendar'))} icon={Calendar}>
                                        Temporal View
                                    </CommandItem>
                                </Command.Group>

                                <Command.Group heading="System" className="text-xs font-medium text-zinc-500 px-2 pb-1.5 pt-2">
                                    <CommandItem value="terminal" onSelect={() => runCommand(() => console.log('Terminal'))} icon={Terminal}>
                                        Open Dev Terminal
                                    </CommandItem>
                                </Command.Group>

                            </Command.List>

                            {/* 4. Footer com Legenda */}
                            <div className="flex items-center justify-end px-4 py-2 border-t border-white/5 bg-white/[0.01]">
                                <div className="flex items-center gap-2 text-[10px] text-zinc-600">
                                    <span className="bg-white/5 px-1.5 py-0.5 rounded border border-white/5">↵</span>
                                    <span>to select</span>
                                    <span className="bg-white/5 px-1.5 py-0.5 rounded border border-white/5 ml-2">esc</span>
                                    <span>to close</span>
                                </div>
                            </div>
                        </Command>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

// Componente auxiliar para itens da lista
const CommandItem = ({ children, icon: Icon, onSelect, value }: { children: React.ReactNode, icon: React.ComponentType<{ className?: string }>, onSelect: () => void, value?: string }) => {
    return (
        <Command.Item
            value={value}
            onSelect={onSelect}
            className="relative flex cursor-default select-none items-center rounded-lg px-3 py-2.5 text-sm text-zinc-400 outline-none hover:bg-white/5 hover:text-zinc-100 data-[selected=true]:bg-white/10 data-[selected=true]:text-zinc-50 transition-all duration-200 group"
        >
            <Icon className="mr-3 h-4 w-4 text-zinc-500 group-hover:text-zinc-300 group-data-[selected=true]:text-white transition-colors" />
            <span>{children}</span>
        </Command.Item>
    );
};

export default Synapse;
