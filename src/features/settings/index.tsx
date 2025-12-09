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
        <div className="space-y-6 p-4 md:p-8">
            <PageTitle title="CONFIGURAÇÕES" subtitle="Parâmetros do sistema e logs de execução." />

            <BentoGrid className="max-w-full">
                {/* Theme Settings */}
                {/* Theme Settings */}
                <BentoCard
                    className="md:col-span-1"
                    title="Aparência"
                >
                    <div className="flex flex-col items-center justify-center h-full min-h-[6rem] gap-4">
                        <ThemeToggler />
                        <span className="text-sm font-medium text-muted-foreground">
                            {isDark ? 'Modo Escuro' : 'Modo Claro'}
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-2">Personalize o tema da sua interface.</p>
                </BentoCard>

                {/* AI Settings */}
                {/* AI Settings */}
                <BentoCard
                    className="md:col-span-1"
                    title="Inteligência Artificial"
                >
                    <div className="flex flex-col items-center justify-center h-full min-h-[6rem] gap-4">
                        <AnimatedToggle
                            checked={isLowIA}
                            onChange={toggleLowIA}
                            disabled={isSaving}
                        />
                        <div className="text-center">
                            <span className="text-sm font-medium text-muted-foreground block">
                                Modo Low-IA
                            </span>
                            <span className="text-xs text-muted-foreground/60">
                                {isLowIA ? 'Gatilhos automáticos desativados' : 'Otimização padrão'}
                            </span>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-2">Gerencie o comportamento da IA.</p>
                </BentoCard>

                {/* Performance Monitor - Full Width or Large Span */}
                {/* Performance Monitor - Full Width or Large Span */}
                <BentoCard
                    className="md:col-span-2 md:row-span-2"
                >
                    <div className="flex flex-col h-full space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-neutral-600 dark:text-neutral-200">
                                Monitoramento de Desempenho
                            </h3>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <select
                                        value={endpointFilter}
                                        onChange={(e) => setEndpointFilter(e.target.value)}
                                        className="bg-surface border border-border rounded px-2 py-1 text-xs"
                                    >
                                        <option value="ALL">ALL</option>
                                        {(() => {
                                            const counts = new Map<string, number>()
                                            for (const s of (stats?.series || [])) {
                                                const ep = s.endpoint as string
                                                counts.set(ep, (counts.get(ep) || 0) + 1)
                                            }
                                            return Array.from(counts.entries())
                                                .sort((a, b) => b[1] - a[1])
                                                .map(([ep, count]) => (
                                                    <option key={ep} value={ep}>{`${ep} (${count})`}</option>
                                                ))
                                        })()}
                                    </select>
                                    <select
                                        value={windowHrs}
                                        onChange={(e) => setWindowHrs(Number(e.target.value))}
                                        className="bg-surface border border-border rounded px-2 py-1 text-xs"
                                    >
                                        <option value={1}>1h</option>
                                        <option value={6}>6h</option>
                                        <option value={24}>24h</option>
                                    </select>
                                </div>
                                <AnimatedToggle
                                    checked={autoRefresh}
                                    onChange={setAutoRefresh}
                                    className="scale-75 origin-right"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                            <div className="min-h-[150px] bg-surface/50 rounded-lg p-2 border border-border/50">
                                <div className="mb-2 text-xs text-muted-foreground">Throughput/min</div>
                                <LineChart data={seriesByTime} xKey="time" yKey="throughput" color="#0df20d" />
                            </div>
                            <div className="min-h-[150px] bg-surface/50 rounded-lg p-2 border border-border/50">
                                <div className="mb-2 text-xs text-muted-foreground">Latência p95 (ms)</div>
                                <LineChart data={seriesByTime} xKey="time" yKey="p95" color="#f2b90d" />
                            </div>
                            <div className="min-h-[150px] bg-surface/50 rounded-lg p-2 border border-border/50">
                                <div className="mb-2 text-xs text-muted-foreground">Taxa de erros (%)</div>
                                <LineChart data={seriesByTime} xKey="time" yKey="errorsPct" color="#f20d0d" />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <div className="p-3 bg-surface/30 rounded border border-border/30 text-center">
                                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Throughput</div>
                                <div className="font-mono text-primary text-xl font-bold">{stats?.throughput ?? 0}</div>
                            </div>
                            <div className="p-3 bg-surface/30 rounded border border-border/30 text-center">
                                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Latência Média</div>
                                <div className="font-mono text-primary text-xl font-bold">{stats?.avgMs ?? 0}<span className="text-xs font-normal text-muted-foreground ml-1">ms</span></div>
                            </div>
                            <div className="p-3 bg-surface/30 rounded border border-border/30 text-center">
                                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">P95</div>
                                <div className="font-mono text-primary text-xl font-bold">{stats?.p95 ?? 0}<span className="text-xs font-normal text-muted-foreground ml-1">ms</span></div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <ShimmerButton
                                className="h-8 text-xs px-4"
                                background="rgba(0,0,0,0.2)"
                                shimmerColor="#ffffff"
                                onClick={clearHistory}
                            >
                                Limpar Histórico
                            </ShimmerButton>
                        </div>
                    </div>
                </BentoCard>

                {/* Logs Section */}
                {/* Logs Section */}
                <BentoCard
                    className="md:col-span-3"
                >
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-neutral-600 dark:text-neutral-200">
                                Logs de Execução (Dev Mode)
                            </h3>
                            <div className="px-2 py-1 bg-primary/10 text-primary text-xs rounded border border-primary/20">
                                LIVE RECENT
                            </div>
                        </div>

                        {isLoadingLogs ? (
                            <div className="text-center py-8 text-muted-foreground animate-pulse">Carregando logs do sistema...</div>
                        ) : (
                            <div className="rounded-lg border border-border bg-surface/50 overflow-hidden">
                                <div className="overflow-x-auto max-h-[300px]">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-muted-foreground uppercase bg-surface/80 sticky top-0 backdrop-blur-sm z-10">
                                            <tr>
                                                <th className="px-4 py-3">DATA/HORA</th>
                                                <th className="px-4 py-3">FUNÇÃO</th>
                                                <th className="px-4 py-3">STATUS</th>
                                                <th className="px-4 py-3">MENSAGEM</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/50">
                                            {logs?.map((log) => (
                                                <tr key={log.id} className="hover:bg-primary/5 transition-colors">
                                                    <td className="px-4 py-2 font-mono text-xs opacity-70">
                                                        {new Date(log.created_at).toLocaleString()}
                                                    </td>
                                                    <td className="px-4 py-2 font-medium text-primary/90">
                                                        {log.function_name}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${log.success
                                                            ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                            : 'bg-red-500/10 text-red-500 border-red-500/20'
                                                            }`}>
                                                            {log.success ? 'SUCESSO' : 'FALHA'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2 text-muted-foreground truncate max-w-md text-xs">
                                                        {log.error_message || <span className="text-green-500/50 italic">Execução finalizada sem erros</span>}
                                                    </td>
                                                </tr>
                                            ))}
                                            {(!logs || logs.length === 0) && (
                                                <tr>
                                                    <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">i</div>
                                                            <p>Nenhum log registrado recentemente.</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </BentoCard>
            </BentoGrid>
        </div>
    );
}
