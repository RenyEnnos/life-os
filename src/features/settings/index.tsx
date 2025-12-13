import { useState } from 'react';
import { PageTitle } from '@/shared/ui/PageTitle';
import LineChart from '@/shared/ui/charts/LineChart';
import { usePerfStats } from '@/shared/hooks/usePerfStats';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useAI } from '@/features/ai-assistant/hooks/useAI';
import { apiFetch } from '@/shared/api/http';
import { useTheme } from '@/shared/hooks/useTheme';
import { BentoGrid, BentoCard } from '@/shared/ui/BentoCard';
import { ThemeToggler } from '@/shared/ui/premium/ThemeToggler';
import { AnimatedToggle } from '@/shared/ui/premium/AnimatedToggle';
import { ShimmerButton } from '@/shared/ui/premium/ShimmerButton';
import { cn } from '@/shared/lib/cn';
import { Moon, Sun, Monitor, Cpu, Activity, History, Trash2, Terminal } from 'lucide-react';

export default function SettingsPage() {
    const { user } = useAuth();
    const { logs, isLoadingLogs } = useAI();
    const [isLowIA, setIsLowIA] = useState((user?.user_metadata as Record<string, unknown>)?.low_ia_mode === true);
    const [isSaving, setIsSaving] = useState(false);
    const [endpointFilter, setEndpointFilter] = useState<'ALL' | string>('ALL');
    const [windowHrs, setWindowHrs] = useState(24);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const { stats, seriesByTime, loading, error, clearHistory } = usePerfStats(endpointFilter, windowHrs * 60 * 60 * 1000, autoRefresh, 5000);
    const { isDark } = useTheme();

    const toggleLowIA = async (checked: boolean) => {
        setIsSaving(true);
        const newValue = checked;
        setIsLowIA(newValue);

        try {
            await apiFetch('/auth/profile', {
                method: 'PUT',
                body: JSON.stringify({
                    preferences: {
                        ...(user?.user_metadata as Record<string, unknown>),
                        low_ia_mode: newValue
                    }
                })
            });
        } catch (error) {
            console.error('Failed to update preferences', error);
            setIsLowIA(!newValue); // Revert on error
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 p-4 md:p-8 max-w-[1600px] mx-auto">
            <PageTitle title="SYSTEM CONFIG" subtitle="Preferences & Diagnostics" />

            <BentoGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(180px,auto)]">
                {/* Theme Settings */}
                <BentoCard
                    className="md:col-span-1 bg-gradient-to-br from-indigo-500/5 to-purple-500/5"
                    title="Interface Theme"
                    icon={<Monitor className="w-4 h-4" />}
                >
                    <div className="flex flex-col items-center justify-center h-full gap-6 py-4">
                        <ThemeToggler />
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-sm font-medium text-zinc-200">
                                {isDark ? 'Dark Mode Active' : 'Light Mode Active'}
                            </span>
                            <span className="text-xs text-zinc-500">
                                Global system appearance
                            </span>
                        </div>
                    </div>
                </BentoCard>

                {/* AI Settings */}
                <BentoCard
                    className="md:col-span-1 bg-gradient-to-br from-blue-500/5 to-cyan-500/5"
                    title="Validating Intelligence"
                    icon={<Cpu className="w-4 h-4" />}
                >
                    <div className="flex flex-col items-center justify-center h-full gap-6 py-4">
                        <AnimatedToggle
                            checked={isLowIA}
                            onChange={toggleLowIA}
                            disabled={isSaving}
                        />
                        <div className="flex flex-col items-center gap-1 text-center">
                            <span className="text-sm font-medium text-zinc-200">
                                Low-IA Mode
                            </span>
                            <span className="text-xs text-zinc-500 px-4">
                                {isLowIA
                                    ? 'Automatic background triggers disabled to save tokens.'
                                    : 'Full AI capabilities enabled for all events.'}
                            </span>
                        </div>
                    </div>
                </BentoCard>

                {/* Performance Monitor */}
                <BentoCard
                    className="md:col-span-2 md:row-span-2 relative overflow-hidden"
                    title="System Telemetry"
                    icon={<Activity className="w-4 h-4" />}
                    headerAction={
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 bg-black/20 rounded-lg p-1 border border-white/5">
                                <select
                                    value={endpointFilter}
                                    onChange={(e) => setEndpointFilter(e.target.value)}
                                    className="bg-transparent border-none text-[10px] text-zinc-400 focus:ring-0 cursor-pointer outline-none"
                                >
                                    <option value="ALL">ALL ENDPOINTS</option>
                                    {(() => {
                                        const counts = new Map<string, number>()
                                        for (const s of (stats?.series || [])) {
                                            const ep = s.endpoint as string
                                            counts.set(ep, (counts.get(ep) || 0) + 1)
                                        }
                                        return Array.from(counts.entries())
                                            .sort((a, b) => b[1] - a[1])
                                            .map(([ep, count]) => (
                                                <option key={ep} value={ep}>{ep}</option>
                                            ))
                                    })()}
                                </select>
                                <div className="w-px h-3 bg-white/10" />
                                <AnimatedToggle
                                    checked={autoRefresh}
                                    onChange={setAutoRefresh}
                                    className="scale-50 origin-center"
                                />
                            </div>
                        </div>
                    }
                >
                    <div className="flex flex-col h-full space-y-4 pt-2">
                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 rounded-lg bg-black/20 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Throughput</div>
                                <div className="font-mono text-2xl text-emerald-400 font-bold tracking-tighter tabular-nums">
                                    {stats?.throughput ?? 0} <span className="text-[10px] text-emerald-500/50 font-normal">req/m</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-black/20 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Avg Latency</div>
                                <div className="font-mono text-2xl text-blue-400 font-bold tracking-tighter tabular-nums">
                                    {Math.round(stats?.avgMs ?? 0)}<span className="text-xs text-blue-500/50 font-normal ml-0.5">ms</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-black/20 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">P95 Latency</div>
                                <div className="font-mono text-2xl text-amber-400 font-bold tracking-tighter tabular-nums">
                                    {Math.round(stats?.p95 ?? 0)}<span className="text-xs text-amber-500/50 font-normal ml-0.5">ms</span>
                                </div>
                            </div>
                        </div>

                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1 min-h-0">
                            <div className="bg-black/10 rounded-lg p-3 border border-white/5 relative flex flex-col">
                                <div className="text-[10px] text-zinc-500 mb-2 font-mono">REQ/MIN</div>
                                <div className="flex-1 w-full h-full min-h-[100px]">
                                    <LineChart data={seriesByTime} xKey="time" yKey="throughput" color="#34d399" />
                                </div>
                            </div>
                            <div className="bg-black/10 rounded-lg p-3 border border-white/5 relative flex flex-col">
                                <div className="text-[10px] text-zinc-500 mb-2 font-mono">LATENCY (MS)</div>
                                <div className="flex-1 w-full h-full min-h-[100px]">
                                    <LineChart data={seriesByTime} xKey="time" yKey="p95" color="#fbbf24" />
                                </div>
                            </div>
                            <div className="bg-black/10 rounded-lg p-3 border border-white/5 relative flex flex-col">
                                <div className="text-[10px] text-zinc-500 mb-2 font-mono">ERRORS (%)</div>
                                <div className="flex-1 w-full h-full min-h-[100px]">
                                    <LineChart data={seriesByTime} xKey="time" yKey="errorsPct" color="#ef4444" />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-1 border-t border-white/5">
                            <button
                                onClick={clearHistory}
                                className="flex items-center gap-1.5 text-[10px] text-zinc-500 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-white/5"
                            >
                                <Trash2 className="w-3 h-3" />
                                CLEAR LOCAL HISTORY
                            </button>
                        </div>
                    </div>
                </BentoCard>

                {/* Logs Section */}
                <BentoCard
                    className="md:col-span-2 md:row-span-1" // Adjust span if needed, or keeping it separate
                    title="Execution Logs"
                    icon={<Terminal className="w-4 h-4" />}
                    headerAction={
                        <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-500 animate-pulse">
                            LIVE
                        </div>
                    }
                >
                    <div className="h-full overflow-hidden flex flex-col">
                        {isLoadingLogs ? (
                            <div className="flex-1 flex items-center justify-center text-zinc-600 animate-pulse text-xs font-mono">
                                <Terminal className="w-4 h-4 mr-2" />
                                TAILING SYSTEM LOGS...
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                <div className="space-y-1">
                                    {logs?.map((log) => (
                                        <div key={log.id} className="group grid grid-cols-[auto_1fr] gap-3 p-2 rounded hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-zinc-700">
                                            <div className="flex flex-col gap-1 min-w-[120px]">
                                                <span className="font-mono text-[10px] text-zinc-500">
                                                    {new Date(log.created_at).toLocaleTimeString()}
                                                </span>
                                                <span className={cn(
                                                    "text-[9px] font-bold px-1.5 py-0.5 rounded w-fit",
                                                    log.success ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                                                )}>
                                                    {log.success ? 'SUCCESS' : 'FAILURE'}
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-0.5 min-w-0">
                                                <span className="font-mono text-xs text-zinc-300 truncate">
                                                    {log.function_name}
                                                </span>
                                                <span className="text-[10px] text-zinc-500 truncate font-mono opacity-60 group-hover:opacity-100 transition-opacity">
                                                    {log.error_message || 'OK'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {(!logs || logs.length === 0) && (
                                        <div className="py-8 text-center text-zinc-600 text-xs font-mono">
                                            -- NO LOGS CAPTURED --
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </BentoCard>
            </BentoGrid>
        </div>
    );
}
