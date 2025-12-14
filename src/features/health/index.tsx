import { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { primaryNav, secondaryNav } from '@/app/layout/navItems';
import { useHealth } from '@/features/health/hooks/useHealth';
import type { HealthMetric, MedicationReminder } from '@/shared/types';
import { Loader } from '@/shared/ui/Loader';
import { MetricModal } from './components/MetricModal';
import { MedicationModal } from './components/MedicationModal';
import { cn } from '@/shared/lib/cn';

const profileAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuCVPqcPWDT3hPr01e2HDirC5oJIReGS_I9VQWtVcd9Jeg7-ZvWFgDQfCv6EutPiYTzuE-re3TH5gEjialXzk5Eb8SJ3m82eLKwBuKSLDpWKr4JkJ_yftg1ioQEeRmNNBPiKJhA7IAj11REAjyt_eN6G3ka3T_PoSQNNU9d7cQ6Af9A6u-pdRHLfzCaPzGvoxAzXj6ge63w7ZFJhPW4J6cxpsTQe-UV2JJuJ124QPZ8DgIYXHP4uJji-EBFIe1WQsTDEKAGbz-RlcuI";

const materialIconByPath: Record<string, string> = {
    '/': 'grid_view',
    '/tasks': 'check_circle',
    '/calendar': 'calendar_month',
    '/habits': 'timer',
    '/health': 'monitor_heart',
    '/finances': 'show_chart',
    '/projects': 'folder_open',
    '/journal': 'menu_book',
    '/rewards': 'emoji_events',
    '/university': 'school',
    '/settings': 'settings',
};

 

const metricValue = (metrics: HealthMetric[] | undefined, metricType: string, fallback: number) => {
    const found = metrics?.find((m) => m.metric_type === metricType);
    return Number(found?.value ?? fallback);
};

export default function HealthPage() {
    const { metrics, medications, isLoading, createMetric, createMedication, deleteMedication } = useHealth();
    const [isMetricModalOpen, setIsMetricModalOpen] = useState(false);
    const [isMedicationModalOpen, setIsMedicationModalOpen] = useState(false);

    const readiness = metricValue(metrics, 'readiness', 92);
    const strain = metricValue(metrics, 'strain', 14.2);
    const hrv = metricValue(metrics, 'hrv', 105);
    const hydration = metricValue(metrics, 'hydration', 1.8);
    const restingHr = metricValue(metrics, 'resting_hr', 58);
    const sleepTotal = metricValue(metrics, 'sleep', 7.7);

    const medicationsList = useMemo<MedicationReminder[]>(() => {
        return medications || [];
    }, [medications]);

    return (
        <div className="dashboard-shell relative h-screen w-full overflow-hidden">
            <div className="fixed top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full bg-emerald-900/10 blur-[120px] pointer-events-none z-0" />
            <div className="fixed bottom-[-10%] right-[0%] w-[500px] h-[500px] rounded-full bg-[#308ce8]/5 blur-[100px] pointer-events-none z-0" />

            <div className="relative flex h-full w-full overflow-hidden z-10">


                <main className="flex-1 h-full overflow-y-auto relative p-4 lg:p-10 flex flex-col gap-10 custom-scrollbar">
                    {isLoading ? (
                        <div className="flex flex-1 items-center justify-center">
                            <Loader text="CARREGANDO DADOS DE SAÚDE..." />
                        </div>
                    ) : (
                        <>
                            <header className="w-full max-w-6xl mx-auto flex flex-col gap-6 animate-enter">
                                <div className="flex items-end justify-between px-2">
                                    <div>
                                        <h2 className="text-[10px] text-zinc-500 font-medium tracking-widest uppercase mb-1 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            Live Monitoring
                                        </h2>
                                        <h1 className="text-4xl font-light text-white tracking-tight">Bio-Dashboard</h1>
                                    </div>
                                    <div className="hidden md:block text-right">
                                        <span className="text-xs text-zinc-600 font-medium tracking-wide">TODAY&apos;S SCORE: {readiness}/100</span>
                                    </div>
                                </div>
                                <div className="relative group max-w-6xl mx-auto w-full">
                                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-zinc-600 group-focus-within:text-primary transition-colors">bolt</span>
                                    </div>
                                    <input
                                        className="w-full bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-2xl py-4 pl-14 pr-24 text-md font-light text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-white/10 focus:ring-0 focus:bg-zinc-900/60 transition-all shadow-lg hover:border-white/10"
                                        placeholder="Log workout, symptoms, or supplements..."
                                        type="text"
                                        onFocus={() => setIsMetricModalOpen(true)}
                                        readOnly
                                    />
                                    <div className="absolute inset-y-2 right-2 flex items-center">
                                        <button
                                            className="h-full aspect-square bg-white/5 hover:bg-primary hover:text-white hover:border-primary rounded-xl flex items-center justify-center text-zinc-400 transition-all border border-white/5"
                                            onClick={() => setIsMetricModalOpen(true)}
                                        >
                                            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>
                            </header>

                            <div className="flex-1 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
                                <div className="lg:col-span-2 flex flex-col gap-8">
                                    <div className="glass-card h-[340px] rounded-3xl bg-glass-surface backdrop-blur-xl border border-white/10 p-8 relative overflow-hidden flex flex-col items-center justify-center animate-enter animate-enter-delay-1">
                                        <div className="absolute top-6 left-8 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-emerald-500 text-sm">ring_volume</span>
                                            <h3 className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Recovery Ring</h3>
                                        </div>
                                        <div className="relative w-56 h-56 flex items-center justify-center animate-[breathe_4s_ease-in-out_infinite] mt-4">
                                            <svg className="absolute inset-0 w-full h-full transform -rotate-90 drop-shadow-2xl">
                                                <circle cx="50%" cy="50%" fill="transparent" r="45%" stroke="#1f2937" strokeWidth="2" />
                                                <circle
                                                    cx="50%"
                                                    cy="50%"
                                                    fill="transparent"
                                                    r="45%"
                                                    stroke="url(#gradient)"
                                                    strokeDasharray="283"
                                                    strokeDashoffset={Math.max(0, 283 - (283 * readiness) / 100)}
                                                    strokeLinecap="round"
                                                    strokeWidth="4"
                                                    className="filter drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                                />
                                                <defs>
                                                    <linearGradient id="gradient" x1="0%" x2="100%" y1="0%" y2="100%">
                                                        <stop offset="0%" stopColor="#34d399" />
                                                        <stop offset="100%" stopColor="#10b981" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                            <div className="flex flex-col items-center text-center z-10">
                                                <span className="text-7xl font-thin text-white tracking-tighter tabular-nums">
                                                    {readiness}<span className="text-2xl text-emerald-500/80 align-top">%</span>
                                                </span>
                                                <span className="text-emerald-400 text-sm font-medium tracking-wide mt-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                                                    Ready to Train
                                                </span>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-6 right-8 text-right">
                                            <p className="text-xs text-zinc-500">Strain</p>
                                            <p className="text-lg font-light text-zinc-300">{strain.toFixed(1)} <span className="text-xs text-zinc-600">/ 21.0</span></p>
                                        </div>
                                        <div className="absolute bottom-6 left-8 text-left">
                                            <p className="text-xs text-zinc-500">HRV</p>
                                            <p className="text-lg font-light text-zinc-300">{hrv} <span className="text-xs text-zinc-600">ms</span></p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-[240px]">
                                        <div className="glass-card rounded-3xl bg-glass-surface backdrop-blur-xl border border-white/10 p-6 flex flex-col justify-between animate-enter animate-enter-delay-2 group">
                                            <div className="flex justify-between items-start">
                                                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Sleep Arch.</span>
                                                <span className="material-symbols-outlined text-zinc-600 group-hover:text-[#308ce8] transition-colors text-lg">bedtime</span>
                                            </div>
                                            <div className="flex items-end gap-1.5 h-20 w-full mt-4">
                                                {sleepTotal > 0 ? (
                                                    Array.from({ length: 5 }).map((_, idx) => (
                                                        <div key={idx} className="w-full bg-zinc-800 rounded-sm h-full flex flex-col justify-end overflow-hidden">
                                                            <div className="w-full bg-[#308ce8]" style={{ height: `${Math.min(100, Math.max(10, sleepTotal * 10))}%` }} />
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500 border border-dashed border-white/5 rounded">
                                                        Sem dados suficientes
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mt-2">
                                                <span className="text-xl font-light text-white">{sleepTotal.toFixed(1)}h</span>
                                                <span className="text-xs text-zinc-500 ml-1">Total</span>
                                            </div>
                                        </div>

                                        <div className="glass-card rounded-3xl bg-glass-surface backdrop-blur-xl border border-white/10 p-6 flex flex-col justify-between animate-enter animate-enter-delay-2 group">
                                            <div className="flex justify-between items-start">
                                                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Heart Rate</span>
                                                <span className="flex h-2 w-2 relative mt-1">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                                </span>
                                            </div>
                                            <div className="h-16 w-full flex items-center justify-center relative overflow-hidden my-2">
                                                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                                                    <path
                                                        className="drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]"
                                                        d="M0 20 L10 20 L15 10 L20 30 L25 20 L35 20 L40 5 L45 35 L50 20 L60 20 L65 15 L70 25 L75 20 L100 20"
                                                        fill="none"
                                                        stroke="#10b981"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="1.5"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="mt-2">
                                                <span className="text-xl font-light text-white tabular-nums">{restingHr}</span>
                                                <span className="text-xs text-zinc-500 ml-1">BPM (Rest)</span>
                                            </div>
                                        </div>

                                        <div className="glass-card rounded-3xl bg-glass-surface backdrop-blur-xl border border-white/10 p-6 flex flex-col justify-between animate-enter animate-enter-delay-2 group">
                                            <div className="flex justify-between items-start">
                                                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Hydration</span>
                                                <span className="material-symbols-outlined text-zinc-600 group-hover:text-blue-400 transition-colors text-lg">water_drop</span>
                                            </div>
                                            <div className="flex-1 flex items-center gap-4 mt-2">
                                                <div className="h-20 w-8 bg-zinc-800/50 rounded-full relative overflow-hidden border border-white/5 mx-auto">
                                                    <div className="absolute bottom-0 left-0 right-0 bg-blue-500/80 w-full" style={{ height: `${Math.min(100, hydration * 40)}%` }} />
                                                    <div className="absolute bottom-2 left-1 w-1 h-1 bg-white/30 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                                                    <div className="absolute bottom-6 right-2 w-1.5 h-1.5 bg-white/20 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
                                                </div>
                                            </div>
                                            <div className="mt-2 text-center">
                                                <span className="text-xl font-light text-white">{hydration.toFixed(1)}</span>
                                                <span className="text-xs text-zinc-500 ml-1">Liters</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:col-span-1 glass-card rounded-3xl bg-glass-surface backdrop-blur-xl border border-white/10 p-6 lg:p-8 flex flex-col animate-enter animate-enter-delay-3 h-full">
                                    <div className="flex justify-between items-center mb-8">
                                        <div>
                                            <h3 className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Bio-Fuel</h3>
                                            <p className="text-[10px] text-zinc-600 mt-1">Medication &amp; Supplements</p>
                                        </div>
                                        <button
                                            className="text-zinc-500 hover:text-white transition-colors"
                                            onClick={() => setIsMedicationModalOpen(true)}
                                        >
                                            <span className="material-symbols-outlined text-[20px]">add</span>
                                        </button>
                                    </div>
                                    <div className="flex flex-col gap-4 overflow-y-auto pr-1 custom-scrollbar flex-1">
                                        {medicationsList.length === 0 && (
                                            <div className="w-full py-6 rounded-xl border border-dashed border-white/10 text-zinc-500 text-sm text-center">
                                                Nenhuma medicação cadastrada.
                                            </div>
                                        )}
                                        {medicationsList.map((med) => (
                                            <label key={med.id} className="group relative cursor-pointer">
                                                <input className="peer sr-only" type="checkbox" />
                                                <div className="flex items-center justify-between p-4 rounded-full border transition-all duration-300 border-zinc-700/70 bg-white/[0.02] peer-checked:bg-emerald-500/10 peer-checked:border-emerald-500/50 peer-checked:text-emerald-300">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-2 h-2 rounded-full bg-current" />
                                                        <span className="text-sm font-light tracking-wide">{med.name}</span>
                                                    </div>
                                                    {medications && (
                                                        <button
                                                            className="material-symbols-outlined text-[18px] opacity-0 peer-hover:opacity-70 peer-checked:opacity-100 transition-opacity text-zinc-500 hover:text-red-400"
                                                            type="button"
                                                            aria-label="Remover"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                if (!deleteMedication.isPending) deleteMedication.mutate(med.id);
                                                            }}
                                                        >
                                                            delete
                                                        </button>
                                                    )}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-white/5">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-zinc-500">Adherence</span>
                                            <span className="text-xs font-mono text-emerald-400">80%</span>
                                        </div>
                                        <div className="w-full bg-zinc-800 h-1.5 mt-2 rounded-full overflow-hidden">
                                            <div className="bg-emerald-500 h-full w-[80%] rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>

            {isMetricModalOpen && (
                <MetricModal onClose={() => setIsMetricModalOpen(false)} onSubmit={createMetric.mutate} />
            )}
            {isMedicationModalOpen && (
                <MedicationModal onClose={() => setIsMedicationModalOpen(false)} onSubmit={createMedication.mutate} />
            )}
        </div>
    );
}
